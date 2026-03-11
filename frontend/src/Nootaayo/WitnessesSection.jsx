// src/components/WitnessesSection.jsx
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import ConfirmDialog from "../components/ui/ConfirmDialog";

import {
  addWitness,
  deleteWitnessAt,
  updateWitnessAt,
} from "../api/agreementWitnesses.api";

/* =========================
   COMPONENT
========================= */
const WitnessesSection = ({ agreement, fetchData }) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedWitness, setSelectedWitness] = useState("");

  // ✅ delete confirm states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const witnesses = useMemo(() => agreement?.witnesses || [], [agreement]);

  const openEditModal = (index, value) => {
    setSelectedIndex(index);
    setSelectedWitness(value || "");
    setOpenEdit(true);
  };

  const closeEditModal = () => {
    setSelectedIndex(null);
    setSelectedWitness("");
    setOpenEdit(false);
  };

  const openDeleteDialog = (index) => {
    setDeleteIndex(index);
    setDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    if (deleteLoading) return;
    setDeleteIndex(null);
    setDeleteOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!agreement?._id) return toast.error("Agreement ID ma jiro");
      if (deleteIndex === null || deleteIndex === undefined) {
        return toast.error("Witness index ma jiro");
      }

      const current = agreement?.witnesses || [];

      setDeleteLoading(true);
      await deleteWitnessAt(agreement._id, current, deleteIndex);

      toast.success("Marqaati waa la tirtiray ✅");
      closeDeleteDialog();
      fetchData?.();
    } catch (e) {
      toast.error(
        e?.response?.data?.message || e?.message || "Delete failed"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-xl">Marqaatiyaasha</h3>
          <p className="text-sm text-gray-500">{witnesses.length} marqaati</p>
        </div>

        <Button onClick={() => setOpenAdd(true)}>+ Ku dar Marqaati</Button>
      </div>

      {witnesses.length > 0 ? (
        <div className="grid gap-3">
          {witnesses.map((witness, i) => (
            <WitnessCard
              key={`${witness}-${i}`}
              witness={witness}
              index={i}
              onEdit={() => openEditModal(i, witness)}
              onDelete={() => openDeleteDialog(i)}
            />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center text-gray-500 italic">
          Wali marqaati lama gelin
        </div>
      )}

      <AddWitnessModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        agreement={agreement}
        onSaved={fetchData}
      />

      <EditWitnessModal
        open={openEdit}
        onClose={closeEditModal}
        agreement={agreement}
        witnessIndex={selectedIndex}
        witnessValue={selectedWitness}
        onChangeValue={setSelectedWitness}
        onSaved={() => {
          closeEditModal();
          fetchData?.();
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Tirtir Marqaati"
        message={
          deleteIndex !== null
            ? `Ma hubtaa inaad tirtirayso marqaatigan: "${witnesses[deleteIndex] || ""}" ?`
            : "Ma hubtaa inaad tirtirayso marqaatigan?"
        }
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteDialog}
        loading={deleteLoading}
      />
    </div>
  );
};

/* =========================
   CARD
========================= */
const WitnessCard = ({ witness, index, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
      <div className="flex items-center gap-3">
        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
          {index + 1}
        </span>
        <span className="font-medium text-gray-800">{witness}</span>
      </div>

      <div className="flex gap-3">
        <Button onClick={onEdit}>Edit</Button>
        <Button onClick={onDelete}>Tirtir</Button>
      </div>
    </div>
  );
};

/* =========================
   ADD MODAL
========================= */
const AddWitnessModal = ({ open, onClose, agreement, onSaved }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setLoading(false);
    }
  }, [open]);

  const handleSave = async () => {
    try {
      if (!agreement?._id) return toast.error("Agreement ID ma jiro");
      if (!name.trim()) return toast.error("Magaca marqaatiga qor");

      const current = agreement?.witnesses || [];

      setLoading(true);
      await addWitness(agreement._id, current, name.trim());

      toast.success("Marqaati waa la daray ✅");
      setName("");
      onSaved?.();
      onClose?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ku dar Marqaati"
      closeOnBackdrop={!loading}
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-3 items-center gap-3">
          <label className="text-sm text-gray-700">Magaca</label>
          <div className="col-span-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Geli magaca marqaatiga"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) {
                  handleSave();
                }
              }}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <Button
            onClick={() => {
              setName("");
              onClose?.();
            }}
            disabled={loading}
          >
            Xir
          </Button>
          <Button onClick={handleSave} disabled={loading || !name.trim()}>
            {loading ? "Keydinaya..." : "Keydi"}
          </Button>

        </div>
      </div>
    </Modal>
  );
};

/* =========================
   EDIT MODAL
========================= */
const EditWitnessModal = ({
  open,
  onClose,
  agreement,
  witnessIndex,
  witnessValue,
  onChangeValue,
  onSaved,
}) => {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      if (!agreement?._id) return toast.error("Agreement ID ma jiro");
      if (witnessIndex === null || witnessIndex === undefined) {
        return toast.error("Witness index ma jiro");
      }
      if (!witnessValue.trim()) return toast.error("Magaca marqaatiga qor");

      const current = agreement?.witnesses || [];

      setLoading(true);
      await updateWitnessAt(
        agreement._id,
        current,
        witnessIndex,
        witnessValue.trim()
      );

      toast.success("Marqaati waa la update gareeyay ✅");
      onSaved?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Marqaati"
      closeOnBackdrop={!loading}
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-3 items-center gap-3">
          <label className="text-sm text-gray-700">Magaca</label>
          <div className="col-span-2">
            <Input
              value={witnessValue}
              onChange={(e) => onChangeValue(e.target.value)}
              placeholder="Wax ka beddel marqaatiga"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && witnessValue.trim()) {
                  handleUpdate();
                }
              }}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <Button onClick={onClose} disabled={loading}>
            Xir
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={loading || !witnessValue.trim()}
          >
            {loading ? "Saving..." : "Save"}
          </Button>

        </div>
      </div>    
    </Modal>
  );
};

export default WitnessesSection;
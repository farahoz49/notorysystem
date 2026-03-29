// src/components/PersonsSection.jsx
import React, { useState } from "react";
import { createPerson, updatePerson } from "../api/persons.api";
import {
  addPersonToAgreement,
  removePersonFromAgreement,
} from "../api/agreementPeople.api";
import toast from "react-hot-toast";
import PersonCard from "./PersonCard";
import PersonModal from "./PersonModal";
import Button from "../components/ui/Button";

const PersonsSection = ({
  title,
  side,
  role,
  buttonText,
  agreement,
  allPersons,
  setAllPersons,
  setActiveModal, // (unused here, but kept)
  fetchData,
  showDocumentOptions = false,
  agentDocuments,
  onRemoveDocument,
  onOpenLinkModal,
}) => {
  const [newPerson, setNewPerson] = useState({
    fullName: "",
    motherName: "",
    birthPlace: "",
    birthYear: "",
    address: "",
    nationality: "",
    phone: "",
    gender: "Male",
    documentType: "Passport",
    documentNumber: "",
  });

  const [localActiveModal, setLocalActiveModal] = useState(null);

  const resetNewPerson = () =>
    setNewPerson({
      fullName: "",
      motherName: "",
      birthPlace: "",
      birthYear: "",
      address: "",
      nationality: "",
      phone: "",
      gender: "Male",
      documentType: "",
      documentNumber: "",
    });

  // ================= PERSON OPERATIONS =================
const handlePerson = async (operation, personId = null, data = null) => {
  try {
    if (!agreement?._id) {
      toast.error("Agreement ID ma jiro");
      return;
    }

    // ---------- ADD ----------
    if (operation === "add") {
      // haddii existing person la doortay
      if (data?._id) {
        await addPersonToAgreement({
          agreementId: agreement._id,
          side,
          role,
          personId: data._id,
          agreementSnapshot: agreement,
        });

        toast.success("Existing person added to agreement");
        setLocalActiveModal(null);
        resetNewPerson();
        fetchData();

        if (role === "agents" && onOpenLinkModal) {
          try {
            onOpenLinkModal(data, "Wakaalad", side);
          } catch (err) {
            console.error("open link modal error:", err);
          }
        }
        return;
      }

      // FormData ama object caadi ah labadaba support garee
      const phone = String(
        data instanceof FormData ? data.get("phone") : data?.phone || ""
      ).trim();

      const docNo = String(
        data instanceof FormData ? data.get("documentNumber") : data?.documentNumber || ""
      ).trim();

      const phoneExists =
        !!phone &&
        allPersons.some((p) => String(p?.phone || "").trim() === phone);

      if (phoneExists) {
        toast.error("Number kan hore ugu jira System ka");
        return;
      }

      const docExists =
        !!docNo &&
        allPersons.some(
          (p) => String(p?.documentNumber || "").trim() === docNo
        );

      if (docExists) {
        toast.error("Document number-kan hore ayaa loo diiwaan geliyey.");
        return;
      }

      const created = await createPerson(data);

      setAllPersons((prev) => [...prev, created]);

      await addPersonToAgreement({
        agreementId: agreement._id,
        side,
        role,
        personId: created._id,
        agreementSnapshot: agreement,
      });

      toast.success("New person created and added to agreement");

      setLocalActiveModal(null);
      resetNewPerson();
      fetchData();

      if (role === "agents" && onOpenLinkModal) {
        try {
          onOpenLinkModal(created, "Wakaalad", side);
        } catch (err) {
          console.error("open link modal error:", err);
        }
      }

      return;
    }

    // ---------- UPDATE ----------
    if (operation === "update") {
      const id = personId || data?._id;
      if (!id) {
        toast.error("Person ID ma jiro");
        return;
      }

      const updated = await updatePerson(id, data);

      setAllPersons((prev) => prev.map((p) => (p._id === id ? updated : p)));
      toast.success("Person updated");

      setLocalActiveModal(null);
      fetchData();
      return;
    }

    // ---------- DELETE ----------
    if (operation === "delete") {
      if (!personId) {
        toast.error("Person ID ma jiro");
        return;
      }

      await removePersonFromAgreement({
        agreementId: agreement._id,
        side,
        role,
        personId,
        agreementSnapshot: agreement,
      });

      toast.success("Person removed from agreement");
      fetchData();
      return;
    }
  } catch (error) {
    const msg =
      error?.response?.data?.message || error?.message || "Operation failed";

    console.error("handlePerson error:", error);
    toast.error(msg);

    // fetchData() haka saarin? Maya:
    // error marka jiro ma rabno modal-ka inuu xirmo ama form-ku reset noqdo
  }
};

  const persons = agreement?.[side]?.[role] || [];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl">{title}</h3>
        <Button
          onClick={() => setLocalActiveModal({ type: "addPerson" })}
        >
          {buttonText}
        </Button>
      </div>

      {persons.length > 0 ? (
        persons.map((person, i) => {
          if (!person || !person._id) {
            console.error("Person object is invalid:", person);
            return null;
          }

          return (
            <PersonCard
              key={person._id}
              person={person}
              index={i}
              side={side}
              role={role}
              showDocumentOptions={showDocumentOptions}
              agentDocument={agentDocuments?.[person._id]}
              onEdit={() => setLocalActiveModal({ type: "updatePerson", person })}
              onDelete={() => {
                if (window.confirm(`Delete ${person.fullName}?`)) {
                  handlePerson("delete", person._id);
                }
              }}
              onRemoveDocument={(docType) =>
                onRemoveDocument && onRemoveDocument(person, docType)
              }
              onLinkDocument={(docType) =>
                onOpenLinkModal && onOpenLinkModal(person, docType, side)
              }
            />
          );
        })
      ) : (
        <p className="">
          No {String(title || "").toLowerCase()} added
        </p>
      )}

      {/* Person Modals */}
      {localActiveModal?.type === "addPerson" && (
        <PersonModal
          mode="add"
          personData={newPerson}
          setPersonData={setNewPerson}
          allPersons={allPersons}
          onSubmit={(data) => handlePerson("add", null, data)}
          onClose={() => setLocalActiveModal(null)}
        />
      )}

      {localActiveModal?.type === "updatePerson" && (
        <PersonModal
          mode="update"
          personData={localActiveModal.person}
          setPersonData={(data) =>
            setLocalActiveModal({ ...localActiveModal, person: data })
          }
          allPersons={allPersons}
          onSubmit={(data) =>
            handlePerson("update", localActiveModal.person._id, data)
          }
          onClose={() => setLocalActiveModal(null)}
        />
      )}
    </div>
  );
};

export default PersonsSection;
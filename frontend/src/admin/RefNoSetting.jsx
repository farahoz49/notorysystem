// src/pages/RefNoSetting.jsx
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";

import {
  getRefNoSettings,
  updateRefNoStartNumber,
} from "../api/refnosetting.api";

const RefNoSetting = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "ADMIN";

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [startNumber, setStartNumber] = useState("");
  const [currentStart, setCurrentStart] = useState(null);
  const [nextRefNo, setNextRefNo] = useState("");

  const canSave = useMemo(() => {
    if (!isAdmin) return false;
    const n = Number(startNumber);
    return Number.isInteger(n) && n >= 1 && !loading;
  }, [isAdmin, startNumber, loading]);

  const load = async () => {
    try {
      setFetching(true);
      const data = await getRefNoSettings();
      setCurrentStart(data?.startNumber ?? 1);
      setNextRefNo(data?.refNo || "");
      setStartNumber(String(data?.startNumber ?? 1));
    } catch (err) {
      // haddii admin uusan ahayn ama error kale
      // ha buuqin (silent)
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (open && isAdmin) load();
    if (open && !isAdmin) {
      // open wuu furmay, laakiin admin ma aha
      // xog lama soo qaadayo
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isAdmin]);

  const handleSave = async (e) => {
    e?.preventDefault?.();

    if (!isAdmin) return toast.error("Admin kaliya ayaa wax ka beddeli kara.");

    const number = Number(startNumber);
    if (!Number.isInteger(number) || number < 1) {
      return toast.error("Start Number waa inuu noqdaa integer >= 1");
    }

    try {
      setLoading(true);
      const data = await updateRefNoStartNumber(number);

      setCurrentStart(data?.startNumber ?? number);
      setNextRefNo(data?.refNo || "");
      toast.success("RefNo Start Number waa la cusbooneysiiyay");

      // ✅ Reception tixraac cusub ha muujiyo (without refresh)
      if (data?.refNo) {
        window.dispatchEvent(
          new CustomEvent("refno-updated", { detail: data.refNo })
        );
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs text-gray-500">
        {isAdmin ? "Admin Mode" : "Read Only"}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
          Close
        </Button>
        <Button onClick={handleSave} disabled={!canSave}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Trigger */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border rounded-2xl shadow-sm p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">RefNo Settings</h2>
            <p className="text-sm text-gray-500 mt-1">
              Maamul start number + preview refNo (Admin only edit).
            </p>
          </div>

          <Button onClick={() => setOpen(true)}>
            Open Settings
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={open}
        title="RefNo Settings"
        onClose={() => setOpen(false)}
        size="lg"
        footer={footer}
        loading={fetching}
        closeOnBackdrop={!loading}
      >
        {/* Content */}
        <div className="space-y-5">
          {/* Notice */}
          {!isAdmin && (
            <div className="p-3 rounded-xl border bg-red-50 text-red-700 text-sm">
              Kaliya <b>ADMIN</b> ayaa wax ka beddeli kara. Adiga waa <b>Read Only</b>.
            </div>
          )}

          {/* Table */}
          <div className="rounded-2xl border overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b">
              <div className="text-sm font-semibold text-gray-800">Overview</div>
              <div className="text-xs text-gray-500">
                Current & next refNo preview
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white">
                  <tr className="text-left text-gray-500 border-b">
                    <th className="px-4 py-3 font-medium">Item</th>
                    <th className="px-4 py-3 font-medium">Value</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      Current Start Number
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-lg border px-2 py-1 font-semibold">
                        {currentStart ?? "--"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                        live
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      Next RefNo (Preview)
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold break-all">
                        {nextRefNo || "--"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                        preview
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="rounded-2xl border p-4 bg-white">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-800">
                Start Number 
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={startNumber}
                    onChange={(e) => setStartNumber(e.target.value)}
                    disabled={!isAdmin || loading}
                    placeholder="Tusaale: 5067"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Tusaale: haddii aad geliso <b>5067</b>, preview-ga refNo wuu is beddeli doonaa
                    
                  </p>
                </div>

             
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default RefNoSetting;
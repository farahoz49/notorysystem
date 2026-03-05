// src/pages/Settings.jsx
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";

import { getSettings, updateSettings } from "../api/setting.api";

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "ADMIN";

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [data, setData] = useState(null);

  // form fields (editable)
  const [officeName, setOfficeName] = useState("");
  const [Drname, setDrName] = useState("");
  const [officePhone, setOfficePhone] = useState("");
  const [officeEmail, setOfficeEmail] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");

  const [currency, setCurrency] = useState("USD");
  const [officeFeeDefault, setOfficeFeeDefault] = useState("0");
  const [serviceFeeDefault, setServiceFeeDefault] = useState("0");

  const [allowUserSeeOfficeFee, setAllowUserSeeOfficeFee] = useState(false);

  // preview read-only
  const [refNoPreview, setRefNoPreview] = useState("");
  const [receiptPreview, setReceiptPreview] = useState("");

  const canSave = useMemo(() => {
    if (!isAdmin) return false;
    if (loading) return false;

    const offFee = Number(officeFeeDefault);
    const srvFee = Number(serviceFeeDefault);

    if (!Number.isFinite(offFee) || offFee < 0) return false;
    if (!Number.isFinite(srvFee) || srvFee < 0) return false;

    return true;
  }, [isAdmin, loading, officeFeeDefault, serviceFeeDefault]);

  const buildPreview = (prefix, nextNumber, padding = 5) => {
    const n = Number(nextNumber ?? 1);
    const p = Number(padding ?? 5);
    const num = String(Number.isFinite(n) ? n : 1).padStart(
      Number.isFinite(p) ? p : 5,
      "0"
    );
    return `${prefix || ""}${prefix ? "-" : ""}${num}`;
  };

  const fillForm = (s) => {
    setData(s);

    setOfficeName(s?.office?.name ?? "");
    setDrName(s?.office?.DrName ?? "");
    setOfficePhone(s?.office?.phone1 ?? "");
    setOfficeEmail(s?.office?.email ?? "");
    setOfficeAddress(s?.office?.city ?? "");

    setCurrency(s?.fees?.currency ?? "USD");
    setOfficeFeeDefault(String(s?.fees?.officeFeeDefault ?? 0));
    setServiceFeeDefault(String(s?.fees?.serviceFeeDefault ?? 0));

    setAllowUserSeeOfficeFee(!!s?.security?.allowUserSeeOfficeFee);

    setRefNoPreview(
      buildPreview(s?.refNo?.prefix ?? "REF", s?.refNo?.nextNumber ?? 1, s?.refNo?.numberPadding ?? 5)
    );
    setReceiptPreview(
      buildPreview(
        s?.receipt?.prefix ?? "RCPT",
        s?.receipt?.nextNumber ?? 1,
        s?.receipt?.numberPadding ?? 5
      )
    );
  };

  const load = async () => {
    try {
      setFetching(true);
      const s = await getSettings();
      fillForm(s);
    } catch (err) {
      // silent haddii user caadi ah ama error
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSave = async (e) => {
    e?.preventDefault?.();

    if (!isAdmin) return toast.error("Admin kaliya ayaa wax ka beddeli kara.");

    const offFee = Number(officeFeeDefault);
    const srvFee = Number(serviceFeeDefault);

    if (!Number.isFinite(offFee) || offFee < 0) {
      return toast.error("Office Fee waa inuu noqdaa number >= 0");
    }
    if (!Number.isFinite(srvFee) || srvFee < 0) {
      return toast.error("Service Fee waa inuu noqdaa number >= 0");
    }

    const payload = {
      office: {
        ...(data?.office || {}),
        name: officeName,
        DrName: Drname,
        phone1: officePhone,
        email: officeEmail,
        city: officeAddress,
      },
      fees: {
        ...(data?.fees || {}),
        currency,
        officeFeeDefault: offFee,
        serviceFeeDefault: srvFee,
      },
      security: {
        ...(data?.security || {}),
        allowUserSeeOfficeFee,
      },
    };

    try {
      setLoading(true);
      const updated = await updateSettings(payload);
      fillForm(updated);
      toast.success("Settings waa la cusbooneysiiyay ✅");

      // Optional events: haddii pages kale u baahan yihiin refresh
      window.dispatchEvent(new CustomEvent("settings-updated", { detail: updated }));
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border rounded-2xl shadow-sm p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">System Settings</h2>
            <p className="text-sm text-gray-500 mt-1">
              Office info + fees + security + previews (Admin only edit).
            </p>
          </div>

          <Button onClick={() => setOpen(true)}>Open Settings</Button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={open}
        title="System Settings"
        onClose={() => setOpen(false)}
        size="xl"
        footer={footer}
        loading={fetching}
        closeOnBackdrop={!loading}
      >
        <div className="space-y-6">
          {/* Notice */}
          {!isAdmin && (
            <div className="p-3 rounded-xl border bg-red-50 text-red-700 text-sm">
              Kaliya <b>ADMIN</b> ayaa wax ka beddeli kara. Adiga waa <b>Read Only</b>.
            </div>
          )}

          {/* Overview Table */}
          <div className="rounded-2xl border overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b">
              <div className="text-sm font-semibold text-gray-800">Overview</div>
              <div className="text-xs text-gray-500">
                RefNo & Receipt preview (read-only)
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
                      Next RefNo (Preview)
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold break-all">
                        {refNoPreview || "--"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                        preview
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      Next Receipt No (Preview)
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold break-all">
                        {receiptPreview || "--"}
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

          {/* OFFICE FORM */}
          <form onSubmit={handleSave} className="rounded-2xl border p-4 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Office Info</h3>
              <span className="text-xs text-gray-500">Brand / Contact</span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-800">Office Name</label>
                <Input
                  value={officeName}
                  onChange={(e) => setOfficeName(e.target.value)}
                  disabled={!isAdmin || loading}
                  placeholder="Tusaale: Express Notory"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800">Dr Name</label>
                <Input
                  value={Drname}
                  onChange={(e) => setDrName(e.target.value)}
                  disabled={!isAdmin || loading}
                  placeholder="Tusaale: Express Notory"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800">Phone</label>
                <Input
                  value={officePhone}
                  onChange={(e) => setOfficePhone(e.target.value)}
                  disabled={!isAdmin || loading}
                  placeholder="Tusaale: +252 61xxxxxxx"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800">Email</label>
                <Input
                  value={officeEmail}
                  onChange={(e) => setOfficeEmail(e.target.value)}
                  disabled={!isAdmin || loading}
                  placeholder="Tusaale: info@office.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800">Address</label>
                <Input
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  disabled={!isAdmin || loading}
                  placeholder="Tusaale: KM4, Hodan"
                />
              </div>
            </div>
          </form>

          {/* FEES FORM */}
          <div className="rounded-2xl border p-4 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Fees</h3>
              <span className="text-xs text-gray-500">Defaults</span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-800">Currency</label>
                <Input
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  disabled={!isAdmin || loading}
                  placeholder="USD"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800">Office Fee (Default)</label>
                <Input
                  type="number"
                  value={officeFeeDefault}
                  onChange={(e) => setOfficeFeeDefault(e.target.value)}
                  disabled={!isAdmin || loading}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800">Service Fee (Default)</label>
                <Input
                  type="number"
                  value={serviceFeeDefault}
                  onChange={(e) => setServiceFeeDefault(e.target.value)}
                  disabled={!isAdmin || loading}
                  placeholder="0"
                />
              </div>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Fees-kan waa defaults. Agreement-ka waxaad ka beddeli kartaa haddii aad rabto.
            </p>
          </div>
          {/* branding FORM */}
          <div className="rounded-2xl border p-4 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">branding</h3>
              <span className="text-xs text-gray-500">Defaults</span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-gray-800">headerlogo</label>
                <Input
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  disabled={!isAdmin || loading}
                  placeholder="USD"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800">footerLogo</label>
                <Input
                  type="number"
                  value={officeFeeDefault}
                  onChange={(e) => setOfficeFeeDefault(e.target.value)}
                  disabled={!isAdmin || loading}
                  placeholder="0"
                />
              </div>

              
            </div>

            <p className="mt-2 text-xs text-gray-500">
              brand-kan waa defaults. Agreement-ka waxaad ka beddeli kartaa haddii aad rabto.
            </p>
          </div>

          {/* SECURITY */}
          {/* <div className="rounded-2xl border p-4 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Security</h3>
              <span className="text-xs text-gray-500">Visibility rules</span>
            </div>

            <div className="mt-4 flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4"
                checked={allowUserSeeOfficeFee}
                onChange={(e) => setAllowUserSeeOfficeFee(e.target.checked)}
                disabled={!isAdmin || loading}
              />
              <div>
                <div className="text-sm font-medium text-gray-800">
                  Allow USER to see Office Fee
                </div>
                <div className="text-xs text-gray-500">
                  Haddii OFF, users waxay arki doonaan Office Fee = 0 (ama qarin).
                </div>
              </div>
            </div>
          </div> */}

          {/* Note */}
          <div className="text-xs text-gray-500">
            Tip: haddii pages kale ay u baahan yihiin refresh, waxaad dhageysan kartaa event-ka{" "}
            <b>settings-updated</b>.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
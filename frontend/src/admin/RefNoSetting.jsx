// // src/pages/RefNoSetting.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";

// import Button from "../components/ui/Button";
// import Input from "../components/ui/Input";
// import Modal from "../components/ui/Modal";

// import {
//   getRefNoSettings,
//   updateRefNoStartNumber,
// } from "../api/refnosetting.api";

// const RefNoSetting = () => {
//   const { user } = useSelector((state) => state.auth);
//   const isAdmin = user?.role === "ADMIN";

//   const [open, setOpen] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(false);

//   const [startNumber, setStartNumber] = useState("");
//   const [currentStart, setCurrentStart] = useState(null);
//   const [nextRefNo, setNextRefNo] = useState("");

//   const canSave = useMemo(() => {
//     if (!isAdmin) return false;
//     const n = Number(startNumber);
//     return Number.isInteger(n) && n >= 1 && !loading;
//   }, [isAdmin, startNumber, loading]);

//   const load = async () => {
//     try {
//       setFetching(true);
//       const data = await getRefNoSettings();
//       setCurrentStart(data?.startNumber ?? 1);
//       setNextRefNo(data?.refNo || "");
//       setStartNumber(String(data?.startNumber ?? 1));
//     } catch (err) {
//       // haddii admin uusan ahayn ama error kale
//       // ha buuqin (silent)
//     } finally {
//       setFetching(false);
//     }
//   };

//   useEffect(() => {
//     if (open && isAdmin) load();
//     if (open && !isAdmin) {
//       // open wuu furmay, laakiin admin ma aha
//       // xog lama soo qaadayo
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open, isAdmin]);

//   const handleSave = async (e) => {
//     e?.preventDefault?.();

//     if (!isAdmin) return toast.error("Admin kaliya ayaa wax ka beddeli kara.");

//     const number = Number(startNumber);
//     if (!Number.isInteger(number) || number < 1) {
//       return toast.error("Start Number waa inuu noqdaa integer >= 1");
//     }

//     try {
//       setLoading(true);
//       const data = await updateRefNoStartNumber(number);

//       setCurrentStart(data?.startNumber ?? number);
//       setNextRefNo(data?.refNo || "");
//       toast.success("RefNo Start Number waa la cusbooneysiiyay");

//       // ✅ Reception tixraac cusub ha muujiyo (without refresh)
//       if (data?.refNo) {
//         window.dispatchEvent(
//           new CustomEvent("refno-updated", { detail: data.refNo })
//         );
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const footer = (
//     <div className="flex items-center justify-between gap-3">
//       <div className="text-xs text-gray-500">
//         {isAdmin ? "Admin Mode" : "Read Only"}
//       </div>

//       <div className="flex items-center gap-2">
//         <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
//           Close
//         </Button>
//         <Button onClick={handleSave} disabled={!canSave}>
//           {loading ? "Saving..." : "Save"}
//         </Button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-6">
//       {/* Trigger */}
//       <div className="max-w-8xl mx-auto">
//         <div className="bg-white border rounded-2xl shadow-sm p-6 flex items-center justify-between">
//           <div>
//             <h2 className="text-xl font-semibold">RefNo Settings</h2>
//             <p className="text-sm text-gray-500 mt-1">
//               Maamul start number + preview refNo (Admin only edit).
//             </p>
//           </div>

//           <Button onClick={() => setOpen(true)}>
//             Open Settings
//           </Button>
//         </div>
//       </div>

//       {/* Modal */}
//       <Modal
//         open={open}
//         title="RefNo Settings"
//         onClose={() => setOpen(false)}
//         size="lg"
//         footer={footer}
//         loading={fetching}
//         closeOnBackdrop={!loading}
//       >
//         {/* Content */}
//         <div className="space-y-5">
//           {/* Notice */}
//           {!isAdmin && (
//             <div className="p-3 rounded-xl border bg-red-50 text-red-700 text-sm">
//               Kaliya <b>ADMIN</b> ayaa wax ka beddeli kara. Adiga waa <b>Read Only</b>.
//             </div>
//           )}

//           {/* Table */}
//           <div className="rounded-2xl border overflow-hidden">
//             <div className="px-4 py-3 bg-gray-50 border-b">
//               <div className="text-sm font-semibold text-gray-800">Overview</div>
//               <div className="text-xs text-gray-500">
//                 Current & next refNo preview
//               </div>
//             </div>

//             <div className="w-full overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-white">
//                   <tr className="text-left text-gray-500 border-b">
//                     <th className="px-4 py-3 font-medium">Item</th>
//                     <th className="px-4 py-3 font-medium">Value</th>
//                     <th className="px-4 py-3 font-medium">Status</th>
//                   </tr>
//                 </thead>

//                 <tbody className="bg-white">
//                   <tr className="border-b">
//                     <td className="px-4 py-3 font-medium text-gray-800">
//                       Current Start Number
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className="inline-flex items-center rounded-lg border px-2 py-1 font-semibold">
//                         {currentStart ?? "--"}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
//                         live
//                       </span>
//                     </td>
//                   </tr>

//                   <tr>
//                     <td className="px-4 py-3 font-medium text-gray-800">
//                       Next RefNo (Preview)
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="font-semibold break-all">
//                         {nextRefNo || "--"}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
//                         preview
//                       </span>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSave} className="rounded-2xl border p-4 bg-white">
//             <div className="flex flex-col gap-2">
//               <label className="text-sm font-medium text-gray-800">
//                 Start Number 
//               </label>

//               <div className="flex flex-col sm:flex-row gap-3">
//                 <div className="flex-1">
//                   <Input
//                     type="number"
//                     value={startNumber}
//                     onChange={(e) => setStartNumber(e.target.value)}
//                     disabled={!isAdmin || loading}
//                     placeholder="Tusaale: 5067"
//                   />
//                   <p className="mt-2 text-xs text-gray-500">
//                     Tusaale: haddii aad geliso <b>5067</b>, preview-ga refNo wuu is beddeli doonaa
                    
//                   </p>
//                 </div>

             
//               </div>
//             </div>
//           </form>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default RefNoSetting;

// src/pages/Settings.jsx
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";

import { getSettings, updateSettings } from "../api/setting.api";
import {
  getRefNoSettings,
  updateRefNoStartNumber,
} from "../api/refnosetting.api";

const Settings = () => {
  const { user } = useSelector((state) => state.auth);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const canManageRefNo =
    user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  // =========================
  // Modal states
  // =========================
  const [openSystemModal, setOpenSystemModal] = useState(false);
  const [openRefNoModal, setOpenRefNoModal] = useState(false);

  // =========================
  // System Settings state
  // =========================
  const [systemLoading, setSystemLoading] = useState(false);
  const [systemFetching, setSystemFetching] = useState(false);

  const [data, setData] = useState(null);

  const [officeName, setOfficeName] = useState("");
  const [drName, setDrName] = useState("");
  const [officePhone, setOfficePhone] = useState("");
  const [officeEmail, setOfficeEmail] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");

  const [currency, setCurrency] = useState("USD");
  const [officeFeeDefault, setOfficeFeeDefault] = useState("0");
  const [serviceFeeDefault, setServiceFeeDefault] = useState("0");

  const [allowUserSeeOfficeFee, setAllowUserSeeOfficeFee] = useState(false);

  const [refNoPreview, setRefNoPreview] = useState("");
  const [receiptPreview, setReceiptPreview] = useState("");

  // branding
  const [headerLogo, setHeaderLogo] = useState("");
  const [footerLogo, setFooterLogo] = useState("");

  // =========================
  // RefNo state
  // =========================
  const [refLoading, setRefLoading] = useState(false);
  const [refFetching, setRefFetching] = useState(false);

  const [startNumber, setStartNumber] = useState("");
  const [currentStart, setCurrentStart] = useState(null);
  const [nextRefNo, setNextRefNo] = useState("");

  // =========================
  // Helpers
  // =========================
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

    setHeaderLogo(s?.branding?.headerLogo ?? "");
    setFooterLogo(s?.branding?.footerLogo ?? "");

    setRefNoPreview(
      buildPreview(
        s?.refNo?.prefix ?? "REF",
        s?.refNo?.nextNumber ?? 1,
        s?.refNo?.numberPadding ?? 5
      )
    );

    setReceiptPreview(
      buildPreview(
        s?.receipt?.prefix ?? "RCPT",
        s?.receipt?.nextNumber ?? 1,
        s?.receipt?.numberPadding ?? 5
      )
    );
  };

  // =========================
  // Permissions
  // =========================
  const canSaveSystem = useMemo(() => {
    if (!isSuperAdmin) return false;
    if (systemLoading) return false;

    const offFee = Number(officeFeeDefault);
    const srvFee = Number(serviceFeeDefault);

    if (!Number.isFinite(offFee) || offFee < 0) return false;
    if (!Number.isFinite(srvFee) || srvFee < 0) return false;

    return true;
  }, [isSuperAdmin, systemLoading, officeFeeDefault, serviceFeeDefault]);

  const canSaveRefNo = useMemo(() => {
    if (!canManageRefNo) return false;
    if (refLoading) return false;

    const n = Number(startNumber);
    return Number.isInteger(n) && n >= 1;
  }, [canManageRefNo, startNumber, refLoading]);

  // =========================
  // Loaders
  // =========================
  const loadSystemSettings = async () => {
    try {
      setSystemFetching(true);
      const s = await getSettings();
      fillForm(s);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load settings");
    } finally {
      setSystemFetching(false);
    }
  };

  const loadRefNoSettings = async () => {
    try {
      setRefFetching(true);
      const data = await getRefNoSettings();
      setCurrentStart(data?.startNumber ?? 1);
      setNextRefNo(data?.refNo || "");
      setStartNumber(String(data?.startNumber ?? 1));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load RefNo settings");
    } finally {
      setRefFetching(false);
    }
  };

  useEffect(() => {
    if (openSystemModal && isSuperAdmin) {
      loadSystemSettings();
    }
  }, [openSystemModal, isSuperAdmin]);

  useEffect(() => {
    if (openRefNoModal && canManageRefNo) {
      loadRefNoSettings();
    }
  }, [openRefNoModal, canManageRefNo]);

  // =========================
  // Save handlers
  // =========================
  const handleSaveSystem = async (e) => {
    e?.preventDefault?.();

    if (!isSuperAdmin) {
      return toast.error("SUPER_ADMIN kaliya ayaa wax ka beddeli kara.");
    }

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
        DrName: drName,
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
      branding: {
        ...(data?.branding || {}),
        headerLogo,
        footerLogo,
      },
    };

    try {
      setSystemLoading(true);
      const updated = await updateSettings(payload);
      fillForm(updated);

      toast.success("System Settings waa la cusbooneysiiyay ✅");

      window.dispatchEvent(
        new CustomEvent("settings-updated", { detail: updated })
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSystemLoading(false);
    }
  };

  const handleSaveRefNo = async (e) => {
    e?.preventDefault?.();

    if (!canManageRefNo) {
      return toast.error("ADMIN kaliya ayaa wax ka beddeli kara.");
    }

    const number = Number(startNumber);

    if (!Number.isInteger(number) || number < 1) {
      return toast.error("Start Number waa inuu noqdaa integer >= 1");
    }

    try {
      setRefLoading(true);

      const data = await updateRefNoStartNumber(number);

      setCurrentStart(data?.startNumber ?? number);
      setNextRefNo(data?.refNo || "");

      toast.success("RefNo Start Number waa la cusbooneysiiyay");

      if (data?.refNo) {
        window.dispatchEvent(
          new CustomEvent("refno-updated", { detail: data.refNo })
        );
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setRefLoading(false);
    }
  };

  // =========================
  // Footers
  // =========================
  const systemFooter = (
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs text-gray-500">
        {isSuperAdmin ? "SUPER_ADMIN Mode" : "Read Only"}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={() => setOpenSystemModal(false)}
          disabled={systemLoading}
        >
          Close
        </Button>
        <Button onClick={handleSaveSystem} disabled={!canSaveSystem}>
          {systemLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );

  const refFooter = (
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs text-gray-500">
        {canManageRefNo ? "Editable Mode" : "Read Only"}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={() => setOpenRefNoModal(false)}
          disabled={refLoading}
        >
          Close
        </Button>
        <Button onClick={handleSaveRefNo} disabled={!canSaveRefNo}>
          {refLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* =========================
            CARD 1: System Settings
            SUPER_ADMIN ONLY
        ========================= */}
        {isSuperAdmin && (
          <div className="bg-white border rounded-2xl shadow-sm p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">System Settings</h2>
              <p className="text-sm text-gray-500 mt-1">
                Office info + fees + branding + security.
              </p>
            </div>

            <Button onClick={() => setOpenSystemModal(true)}>
              Open Settings
            </Button>
          </div>
        )}

        {/* =========================
            CARD 2: RefNo Settings
            ADMIN + SUPER_ADMIN
        ========================= */}
        {canManageRefNo && (
          <div className="bg-white border rounded-2xl shadow-sm p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">RefNo Settings</h2>
              <p className="text-sm text-gray-500 mt-1">
                Maamul start number + preview refNo.
              </p>
            </div>

            <Button onClick={() => setOpenRefNoModal(true)}>
              Open Settings
            </Button>
          </div>
        )}
      </div>

      {/* =========================
          SYSTEM SETTINGS MODAL
          SUPER_ADMIN ONLY
      ========================= */}
      <Modal
        open={openSystemModal}
        title="System Settings"
        onClose={() => setOpenSystemModal(false)}
        size="xl"
        footer={systemFooter}
        loading={systemFetching}
        closeOnBackdrop={!systemLoading}
      >
        <div className="space-y-6">
          {!isSuperAdmin && (
            <div className="p-3 rounded-xl border bg-red-50 text-red-700 text-sm">
              Kaliya <b>SUPER_ADMIN</b> ayaa wax ka beddeli kara.
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

          {/* Office Info */}
          <form onSubmit={handleSaveSystem} className="rounded-2xl border p-4 bg-white">
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
                  disabled={!isSuperAdmin || systemLoading}
                  placeholder="Tusaale: Express Notory"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800">Dr Name</label>
                <Input
                  value={drName}
                  onChange={(e) => setDrName(e.target.value)}
                  disabled={!isSuperAdmin || systemLoading}
                  placeholder="Tusaale: Dr Name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800">Phone</label>
                <Input
                  value={officePhone}
                  onChange={(e) => setOfficePhone(e.target.value)}
                  disabled={!isSuperAdmin || systemLoading}
                  placeholder="Tusaale: +252 61xxxxxxx"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800">Email</label>
                <Input
                  value={officeEmail}
                  onChange={(e) => setOfficeEmail(e.target.value)}
                  disabled={!isSuperAdmin || systemLoading}
                  placeholder="Tusaale: info@office.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800">Address</label>
                <Input
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  disabled={!isSuperAdmin || systemLoading}
                  placeholder="Tusaale: KM4, Hodan"
                />
              </div>
            </div>
          </form>

          {/* Fees */}
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
                  disabled={!isSuperAdmin || systemLoading}
                  placeholder="USD"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800">
                  Office Fee (Default)
                </label>
                <Input
                  type="number"
                  value={officeFeeDefault}
                  onChange={(e) => setOfficeFeeDefault(e.target.value)}
                  disabled={!isSuperAdmin || systemLoading}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800">
                  Service Fee (Default)
                </label>
                <Input
                  type="number"
                  value={serviceFeeDefault}
                  onChange={(e) => setServiceFeeDefault(e.target.value)}
                  disabled={!isSuperAdmin || systemLoading}
                  placeholder="0"
                />
              </div>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Fees-kan waa defaults. Agreement-ka waxaad ka beddeli kartaa haddii aad rabto.
            </p>
          </div>

          {/* Branding */}
          <div className="rounded-2xl border p-4 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Branding</h3>
              <span className="text-xs text-gray-500">Logos</span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-gray-800">Header Logo</label>
                <Input
                  value={headerLogo}
                  onChange={(e) => setHeaderLogo(e.target.value)}
                  disabled={!isSuperAdmin || systemLoading}
                  placeholder="header logo url ama path"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800">Footer Logo</label>
                <Input
                  value={footerLogo}
                  onChange={(e) => setFooterLogo(e.target.value)}
                  disabled={!isSuperAdmin || systemLoading}
                  placeholder="footer logo url ama path"
                />
              </div>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Branding-kan waa defaults system-ka oo dhan.
            </p>
          </div>

          {/* Security */}
          <div className="rounded-2xl border p-4 bg-white">
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
                disabled={!isSuperAdmin || systemLoading}
              />
              <div>
                <div className="text-sm font-medium text-gray-800">
                  Allow USER to see Office Fee
                </div>
                <div className="text-xs text-gray-500">
                  Haddii OFF, users waxay arki doonaan Office Fee = 0 ama qarsoon.
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Tip: pages kale waxay dhageysan karaan event-ka <b>settings-updated</b>.
          </div>
        </div>
      </Modal>

      {/* =========================
          REFNO SETTINGS MODAL
          ADMIN + SUPER_ADMIN
      ========================= */}
      <Modal
        open={openRefNoModal}
        title="RefNo Settings"
        onClose={() => setOpenRefNoModal(false)}
        size="lg"
        footer={refFooter}
        loading={refFetching}
        closeOnBackdrop={!refLoading}
      >
        <div className="space-y-5">
          {!canManageRefNo && (
            <div className="p-3 rounded-xl border bg-red-50 text-red-700 text-sm">
              Kaliya <b>ADMIN</b> ama <b>SUPER_ADMIN</b> ayaa wax ka beddeli kara.
            </div>
          )}

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

          <form onSubmit={handleSaveRefNo} className="rounded-2xl border p-4 bg-white">
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
                    disabled={!canManageRefNo || refLoading}
                    placeholder="Tusaale: 5067"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Tusaale: haddii aad geliso <b>5067</b>, refNo cusub halkaas ayuu ka bilaabanayaa.
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

export default Settings;
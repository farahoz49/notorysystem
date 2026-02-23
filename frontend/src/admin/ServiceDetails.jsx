import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import numberToSomaliWords, { formatCurrency } from "../components/numberToSomaliWords";
import { createService, deleteService, updateService } from "../api/services.api";
import { linkServiceToAgreement, unlinkServiceFromAgreement } from "../api/LinkService.api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const ServiceDetails = ({ agreement, serviceData, setServiceData, fetchData }) => {
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [tempService, setTempService] = useState(serviceData || {});

  // ✅ keep tempService updated when you open/edit different agreement/service
  useEffect(() => {
    setTempService(serviceData || {});
  }, [serviceData]);

  // ✅ nested helpers (for kuYaallo.gobol etc.)
  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, key) => (acc ? acc[key] : ""), obj);

  const setNestedValue = (obj, path, value) => {
    const keys = path.split(".");
    const copy = { ...obj };
    let cur = copy;

    for (let i = 0; i < keys.length - 1; i++) {
      cur[keys[i]] = cur[keys[i]] ? { ...cur[keys[i]] } : {};
      cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = value;
    return copy;
  };

  // ================= SERVICE OPERATIONS =================
  const handleService = async (operation, data = null) => {
    try {
      if (!agreement?._id || !agreement?.serviceType) return;

      const payload = data || tempService;

      if (operation === "add") {
        const created = await createService(agreement.serviceType, payload);
        await linkServiceToAgreement(agreement._id, created._id);
        toast.success(`${agreement.serviceType} added`);
      }

      if (operation === "update") {
        if (!serviceData?._id) {
          toast.error("Service ID ma jiro");
          return;
        }

        await updateService(agreement.serviceType, serviceData._id, payload);
        toast.success(`${agreement.serviceType} updated`);
      }

      if (operation === "delete") {
        if (!serviceData?._id) {
          toast.error("Service ID ma jiro");
          return;
        }

        await deleteService(agreement.serviceType, serviceData._id);
        await unlinkServiceFromAgreement(agreement._id);

        toast.success(`${agreement.serviceType} deleted`);
        setServiceData(null);
      }

      setShowServiceModal(false);
      fetchData();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        `Error ${operation}ing service`;

      toast.error(msg);
      console.error(error);
    }
  };

  const getServiceFields = () => {
    switch (agreement?.serviceType) {
      case "Mooto":
        return [
          { key: "type", label: "Nooca", type: "text" },
          { key: "chassisNo", label: "Chassis No", type: "text" },
          { key: "modelYear", label: "Model Year", type: "number" },
          { key: "color", label: "Midab", type: "text" },
          { key: "cylinder", label: "Cylinder", type: "number" },
          { key: "plateNo", label: "Plate No", type: "text" },
          { key: "plateIssueDate", label: "Plate Issue Date", type: "date" },
          { key: "ownershipType", label: "Ownership Type", type: "select", options: ["Buug", "Kaarka"] },
          { key: "ownershipBookNo", label: "Ownership Book No", type: "text" },
          { key: "ownershipIssueDate", label: "Ownership Issue Date", type: "date" },
        ];

      case "baabuur":
        return [
          { key: "type", label: "Nooca", type: "text" },
          { key: "chassisNo", label: "Chassis No", type: "text" },
          { key: "modelYear", label: "Model Year", type: "number" },
          { key: "color", label: "Midab", type: "text" },
          { key: "cylinder", label: "Cylinder", type: "number" },
          { key: "plateNo", label: "Plate No", type: "text" },
          { key: "plateIssueDate", label: "Plate Issue Date", type: "date" },
          { key: "ownershipType", label: "Ownership Type", type: "select", options: ["Buug", "Kaarka"] },
          { key: "ownershipBookNo", label: "Ownership Book No", type: "text" },
          { key: "ownershipIssueDate", label: "Ownership Issue Date", type: "date" },
        ];

      case "DhulBanaan": {
        const base = [
          { key: "cabirka", label: "Cabirka", type: "select", options: ["Boos", "Nus Boos", "Boosas"] },
          { key: "tiradaBoosaska", label: "Tirada Boosaska", type: "number", showIf: (s) => s?.cabirka === "Boosas" },

          { key: "cabirFaahfaahin", label: "Cabir Faahfaahin (tus: 20x20m)", type: "text" },
          { key: "lottoLambar", label: "Lotto Lambar", type: "text" },

          { key: "kuYaallo.gobol", label: "Gobol", type: "text" },
          { key: "kuYaallo.degmo", label: "Degmo", type: "text" },

          { key: "soohdinta.koonfur", label: "Soohdin Koonfur", type: "text" },
          { key: "soohdinta.waqooyi", label: "Soohdin Waqooyi", type: "text" },
          { key: "soohdinta.galbeed", label: "Soohdin Galbeed", type: "text" },
          { key: "soohdinta.bari", label: "Soohdin Bari", type: "text" },

          { key: "ahna", label: "Ahna", type: "text" },
          { key: "kaKooban", label: "Ka Kooban", type: "text" },
          { key: "kuMilkiyay", label: "Ku Milkiyay", type: "select", options: ["Aato", "Sabarloog", "Maxkamad"] },
          { key: "taariikh", label: "Taariikh", type: "date" },
        ];

        const aato = [
          { key: "aato.cadeynLambar", label: "Caddeyn Lambar", type: "text", showIf: (s) => s?.kuMilkiyay === "Aato" },
          { key: "aato.kasooBaxday", label: "Ka Soo Baxday", type: "text", showIf: (s) => s?.kuMilkiyay === "Aato" },
          { key: "aato.kuSaxiixan", label: "Ku Saxiixan", type: "text", showIf: (s) => s?.kuMilkiyay === "Aato" },
        ];

        const sabarloog = [
          { key: "sabarloog.sabarloogNo", label: "Sabarloog No.", type: "text", showIf: (s) => s?.kuMilkiyay === "Sabarloog" },
          { key: "sabarloog.bollettarioNo1", label: "Bollettario No. 1", type: "text", showIf: (s) => s?.kuMilkiyay === "Sabarloog" },
          { key: "sabarloog.bollettarioNo2", label: "Bollettario No. 2", type: "text", showIf: (s) => s?.kuMilkiyay === "Sabarloog" },
          { key: "sabarloog.rasiidNambar", label: "Rasiid Nambar", type: "text", showIf: (s) => s?.kuMilkiyay === "Sabarloog" },
          { key: "sabarloog.rasiidTaariikh", label: "Rasiid Taariikh", type: "date", showIf: (s) => s?.kuMilkiyay === "Sabarloog" },
          { key: "sabarloog.dHooseEe", label: "D. Hoose ee", type: "text", showIf: (s) => s?.kuMilkiyay === "Sabarloog" },
        ];

        const maxkamad = [
          { key: "maxkamad.warqadLam", label: "Warqad Lam.", type: "text", showIf: (s) => s?.kuMilkiyay === "Maxkamad" },
          { key: "maxkamad.maxkamada", label: "Maxkamada", type: "text", showIf: (s) => s?.kuMilkiyay === "Maxkamad" },
          { key: "maxkamad.garsooraha", label: "Garsooraha", type: "text", showIf: (s) => s?.kuMilkiyay === "Maxkamad" },
          { key: "maxkamad.kuSaxiixan", label: "Ku saxiixan", type: "text", showIf: (s) => s?.kuMilkiyay === "Maxkamad" },
        ];

        return [...base, ...aato, ...sabarloog, ...maxkamad];
      }

      case "Wakaalad_Gaar_ah": {
        const base = [
          { key: "Nooca", label: "Nooca", type: "select", options: ["Dhul Banaan", "Guri Dhisan"] },
          { key: "cabirka", label: "Cabirka", type: "select", options: ["Boos", "Nus Boos", "Boosas"] },
          { key: "tiradaBoosaska", label: "Tirada Boosaska", type: "number", showIf: (s) => s?.cabirka === "Boosas" },

          { key: "cabirFaahfaahin", label: "Cabir Faahfaahin (tus: 20x20m)", type: "text" },
          { key: "lottoLambar", label: "Lotto Lambar", type: "text" },

          { key: "kuYaallo.gobol", label: "Gobol", type: "text" },
          { key: "kuYaallo.degmo", label: "Degmo", type: "text" },

          { key: "soohdinta.koonfur", label: "Soohdin Koonfur", type: "text" },
          { key: "soohdinta.waqooyi", label: "Soohdin Waqooyi", type: "text" },
          { key: "soohdinta.galbeed", label: "Soohdin Galbeed", type: "text" },
          { key: "soohdinta.bari", label: "Soohdin Bari", type: "text" },

          { key: "ahna", label: "Ahna", type: "text" },
          { key: "kaKooban", label: "Ka Kooban", type: "text" },
          { key: "kuMilkiyay", label: "Ku Milkiyay", type: "select", options: ["Aato", "Sabarloog", "Maxkamad"] },
          { key: "taariikh", label: "Taariikh", type: "date" },
        ];

        const aato = [
          { key: "aato.cadeynLambar", label: "Caddeyn Lambar", type: "text", showIf: (s) => s?.kuMilkiyay === "Aato" },
          { key: "aato.kasooBaxday", label: "Ka Soo Baxday", type: "text", showIf: (s) => s?.kuMilkiyay === "Aato" },
          { key: "aato.kuSaxiixan", label: "Ku Saxiixan", type: "text", showIf: (s) => s?.kuMilkiyay === "Aato" },
        ];

        const sabarloog = [
          { key: "sabarloog.sabarloogNo", label: "Sabarloog No.", type: "text", showIf: (s) => s?.kuMilkiyay === "Sabarloog" },
          { key: "sabarloog.bollettarioNo1", label: "Bollettario No. 1", type: "text", showIf: (s) => s?.kuMilkiyay === "Sabarloog" },
          { key: "sabarloog.bollettarioNo2", label: "Bollettario No. 2", type: "text", showIf: (s) => s?.kuMilkiyay === "Sabarloog" },
          { key: "sabarloog.rasiidNambar", label: "Rasiid Nambar", type: "text", showIf: (s) => s?.kuMilkiyay === "Sabarloog" },
          { key: "sabarloog.rasiidTaariikh", label: "Rasiid Taariikh", type: "date", showIf: (s) => s?.kuMilkiyay === "Sabarloog" },
          { key: "sabarloog.dHooseEe", label: "D. Hoose ee", type: "text", showIf: (s) => s?.kuMilkiyay === "Sabarloog" },
        ];

        const maxkamad = [
          { key: "maxkamad.warqadLam", label: "Warqad Lam.", type: "text", showIf: (s) => s?.kuMilkiyay === "Maxkamad" },
          { key: "maxkamad.maxkamada", label: "Maxkamada", type: "text", showIf: (s) => s?.kuMilkiyay === "Maxkamad" },
          { key: "maxkamad.garsooraha", label: "Garsooraha", type: "text", showIf: (s) => s?.kuMilkiyay === "Maxkamad" },
          { key: "maxkamad.kuSaxiixan", label: "Ku saxiixan", type: "text", showIf: (s) => s?.kuMilkiyay === "Maxkamad" },
        ];

        return [...base, ...aato, ...sabarloog, ...maxkamad];
      }

      case "Saami": {
        const toNum = (v) => Number(String(v ?? "").replace(/,/g, "")) || 0;

        return [
          { key: "companyName", label: "Company Name", type: "select", options: ["Hormuud Telecom Somalia Inc (HorTel)", "Beco"] },
          { key: "accountNumber", label: "Account Number", type: "text" },
          { key: "amount", label: "Una dhiganta ", type: "number" },
          { key: "qoralAmount", label: "Qoral ahaan", type: "text", readOnly: true, getValue: (s) => numberToSomaliWords(toNum(s?.amount)) },
          { key: "unaDhiganta", label: "Tirada Samiga", type: "text", readOnly: true, getValue: (s) => formatCurrency(toNum(s?.amount) / 10) },
          { key: "qoralUnaDhiganta", label: "Una dhiganta (Qoral ahaan)", type: "text", readOnly: true, getValue: (s) => numberToSomaliWords(toNum(s?.amount) * 10) },
          { key: "SaamiDate", label: "Saami Date", type: "date" },
        ];
      }
      case "Wakaalad_Saami":
        return [
          { key: "accountHormuud", label: "Account Hormuud", type: "number" },
          { key: "accountSalaam", label: "Account Salaam", type: "number" },
          { key: "Date", label: "Taariikh", type: "date" },
        ];

      default:
        return [];
    }
  };

  const hiddenTypes = ["Wakaalad Guud", "Wakaalad kale" , "Caddeyn" , "Heshiis Dhex Maray Laba Daraf" , "Daaminul maal" ];

  if (hiddenTypes.includes(agreement?.serviceType)) {
    return null;
  }
  const renderServiceDetails = () => {
    const service = serviceData || {};

    switch (agreement?.serviceType) {
      case "Mooto":
      case "baabuur":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div><span className="font-semibold text-black">Nooca:</span> {service.type || "N/A"}</div>
            <div><span className="font-semibold text-black">Chassis No:</span> {service.chassisNo || "N/A"}</div>
            <div><span className="font-semibold text-black">Model:</span> {service.modelYear || "N/A"}</div>
            <div><span className="font-semibold text-black">Midab:</span> {service.color || "N/A"}</div>
            <div><span className="font-semibold text-black">Cylinder:</span> {service.cylinder || "N/A"}</div>
            <div><span className="font-semibold text-black">Taargo:</span> {service.plateNo || "N/A"}</div>
            <div><span className="font-semibold text-black">Plate Issue Date:</span> {service.plateIssueDate?.split("T")[0] || "N/A"}</div>
            <div><span className="font-semibold text-black">Ownership Type:</span> {service.ownershipType || "N/A"}</div>
            <div><span className="font-semibold text-black">Ownership Book No:</span> {service.ownershipBookNo || "N/A"}</div>
            <div><span className="font-semibold text-black">Ownership Issue Date:</span> {service.ownershipIssueDate?.split("T")[0] || "N/A"}</div>
          </div>
        );

      case "DhulBanaan":
      case "Wakaalad_Gaar_ah":
        // (waxaan kaa tagay sida aad u qortay — details-kaaga waa badan, OK)
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div><span className="font-semibold text-black">Cabirka:</span> {service.cabirka || "N/A"}</div>
            {"Nooca" in service && <div><span className="font-semibold text-black">Nooca:</span> {service.Nooca || "N/A"}</div>}
            {service.cabirka === "Boosas" && (
              <div><span className="font-semibold text-black">Tirada Boosaska:</span> {service.tiradaBoosaska ?? "N/A"}</div>
            )}
            <div><span className="font-semibold text-black">Ku Milkiyay:</span> {service.kuMilkiyay || "N/A"}</div>
            <div><span className="font-semibold text-black">Taariikh:</span> {service.taariikh?.split("T")[0] || "N/A"}</div>

            {/* Extra blocks 그대로 */}
            {service.kuMilkiyay === "Aato" && (
              <>
                <div><span className="font-semibold text-black">Cadeyn Lambar:</span> {service.aato?.cadeynLambar || "N/A"}</div>
                <div><span className="font-semibold text-black">Ka soo baxday:</span> {service.aato?.kasooBaxday || "N/A"}</div>
                <div><span className="font-semibold text-black">Ku saxiixan:</span> {service.aato?.kuSaxiixan || "N/A"}</div>
              </>
            )}

            {service.kuMilkiyay === "Sabarloog" && (
              <>
                <div><span className="font-semibold text-black">Sabarloog No:</span> {service.sabarloog?.sabarloogNo || "N/A"}</div>
                <div><span className="font-semibold text-black">Bollettario 1:</span> {service.sabarloog?.bollettarioNo1 || "N/A"}</div>
                <div><span className="font-semibold text-black">Bollettario 2:</span> {service.sabarloog?.bollettarioNo2 || "N/A"}</div>
                <div><span className="font-semibold text-black">Rasiid Nambar:</span> {service.sabarloog?.rasiidNambar || "N/A"}</div>
                <div><span className="font-semibold text-black">Rasiid Taariikh:</span> {service.sabarloog?.rasiidTaariikh?.split("T")[0] || "N/A"}</div>
                <div><span className="font-semibold text-black">D. Hoose ee:</span> {service.sabarloog?.dHooseEe || "N/A"}</div>
              </>
            )}

            {service.kuMilkiyay === "Maxkamad" && (
              <>
                <div><span className="font-semibold text-black">Warqad Lam:</span> {service.maxkamad?.warqadLam || "N/A"}</div>
                <div><span className="font-semibold text-black">Maxkamada:</span> {service.maxkamad?.maxkamada || "N/A"}</div>
                <div><span className="font-semibold text-black">Garsooraha:</span> {service.maxkamad?.garsooraha || "N/A"}</div>
                <div><span className="font-semibold text-black">Ku saxiixan:</span> {service.maxkamad?.kuSaxiixan || "N/A"}</div>
              </>
            )}
          </div>
        );

      case "Saami": {
        const amount = Number(service.amount || 0);
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div><span className="font-semibold text-black">Shirkadda:</span> {service.companyName || "N/A"}</div>

            <div><span className="font-semibold text-black">Una dhiganta</span> {formatCurrency(amount) || "N/A"}</div>
            <div><span className="font-semibold text-black">Tirada Saamiga::</span> {formatCurrency(amount / 10) || "N/A"}</div>

            <div><span className="font-semibold text-black">Account:</span> {service.accountNumber || "N/A"}</div>
            <div><span className="font-semibold text-black">Date:</span> {service.SaamiDate?.split("T")[0] || "N/A"}</div>
          </div>
        );
      }
      case "Wakaalad_Saami":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-semibold text-black">Account Hormuud:</span>{" "}
              {service.accountHormuud || "N/A"}
            </div>

            <div>
              <span className="font-semibold text-black">Account Salaam:</span>{" "}
              {service.accountSalaam || "N/A"}
            </div>

            <div>
              <span className="font-semibold text-black">Taariikh:</span>{" "}
              {service.Date?.split("T")[0] || "N/A"}
            </div>
          </div>
        );

      default:
        return <p className="text-gray-500">No service details available</p>;
    }
  };

  const selectClass =
    "w-full px-4 py-2.5 rounded-xl border border-black/20 bg-white text-black shadow-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-black focus:border-black";

  return (
    <div className="space-y-6">
      {/* Card */}
      <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="font-bold text-2xl text-black">{agreement?.serviceType} Details</h2>
            <p className="text-gray-600 text-sm">
              Service information for agreement <span className="font-semibold text-black">{agreement?.refNo}</span>
            </p>
          </div>

          <div className="flex gap-3">
            {serviceData && (
              <Button
                variant="danger"
                onClick={() => {
                  if (window.confirm(`Delete this ${agreement.serviceType}?`)) handleService("delete");
                }}
              >
                Delete
              </Button>
            )}

            <Button
              onClick={() => {
                setTempService(serviceData || {});
                setShowServiceModal(true);
              }}
            >
              {serviceData ? "badal" : "Ku dar"} {agreement?.serviceType}
            </Button>
          </div>
        </div>

        <div className="mt-6">
          {serviceData ? (
            <div className="bg-black/5 border border-black/10 p-6 rounded-2xl">
              {renderServiceDetails()}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-1">No service linked to this agreement</p>
              <p className="text-gray-500 text-sm">
                Click "<span className="font-semibold text-black">Add {agreement?.serviceType}</span>" to link a service
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-black/10 shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-black/10">
              <h3 className="font-bold text-lg text-black">
                {serviceData ? "Edit" : "Add"} {agreement?.serviceType}
              </h3>

              <button
                onClick={() => setShowServiceModal(false)}
                className="h-9 w-9 rounded-xl border border-black/20 hover:bg-black hover:text-white transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getServiceFields()
                  .filter((f) => !f.showIf || f.showIf(tempService))
                  .map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {field.label}
                      </label>

                      {field.type === "select" ? (
                        <select
                          value={getNestedValue(tempService, field.key) || ""}
                          onChange={(e) =>
                            setTempService(setNestedValue(tempService, field.key, e.target.value))
                          }
                          className={selectClass}
                        >
                          <option value="">Select</option>
                          {field.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          type={field.type}
                          value={
                            field.getValue
                              ? field.getValue(tempService)
                              : getNestedValue(tempService, field.key) || ""
                          }
                          readOnly={field.readOnly || false}
                          onChange={(e) => {
                            if (field.readOnly) return;
                            setTempService(setNestedValue(tempService, field.key, e.target.value));
                          }}
                          className={field.readOnly ? "bg-black/5 cursor-not-allowed" : ""}
                        />
                      )}
                    </div>
                  ))}
              </div>

              <div className="flex gap-3 justify-end mt-8">
                <Button variant="outline" onClick={() => setShowServiceModal(false)}>
                  Cancel
                </Button>

                <Button onClick={() => handleService(serviceData ? "update" : "add")}>
                  {serviceData ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;

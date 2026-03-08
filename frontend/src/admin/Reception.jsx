import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import numberToSomaliWords from "../helpers/NumberToSomali";

import {
  getPersons,
  createPerson,
  getNextRefNo,
  createAgreement
} from "../api/reception.api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
const Reception = () => {
  const [persons, setPersons] = useState([]);
  const [refNo, setRefNo] = useState("");
  const navigate = useNavigate();
  const serviceTypeOptions = {
    Wareejin: [
      { value: "Saami", label: "Saami" },
      { value: "DhulBanaan", label: "Dhul Banaan" }, // label space leh ✅
      { value: "baabuur", label: "Baabuur" },
      { value: "Mooto", label: "Mooto" },


    ],
    Wakaalad: [
      { value: "Wakaalad Guud", label: "Wakaalad Guud" },
      { value: "Wakaalad_Gaar_ah", label: "Wakaalad Gaar ah" },
      { value: "Wakaalad_Saami", label: "Wakaalad Saami" }, // ✅ NEW
      { value: "Wakaalad kale", label: "Wakaalad kale" }, // ✅ NEW wakaalad kale
    ],
    Damaanad: [
      { value: "Daaminulmaal", label: "Daaminul maal" },
      { value: "Shaqaaleysiin", label: "Shaqaaleysiin" },
      { value: "Sponsorship", label: "Sponsorship Later" },
    ],
    Caddeyn: [
      { value: "Caddeyn", label: "Caddeyn" },
      { value: "XayiraadSaami", label: "Xayiraad Saami" },
    ],
    Heshiisyo: [
      { value: "Heshiis Dhex Maray Laba Daraf", label: "Heshiis Dhex Maray Laba Daraf" },
      { value: "asasidshirkad", label: "Aas’aasid Shirkad" },
    ],
    Kireeyn: [
      { value: "Kireeyn", label: "Heshiis Kiro" },
      
    ],
  };

  const [form, setForm] = useState({
    agreementDate: new Date().toISOString().split("T")[0],
    service: "Wareejin",
    serviceType: "Saami",
    agreementType: "Beec",
    officeFee: "",
    sellingPrice: "",
    dhinac1: { sellers: [], agents: [], guarantors: [] },
    dhinac2: { buyers: [], agents: [], guarantors: [] },
  });

  const [searchInputs, setSearchInputs] = useState({
    dhinac1: { sellers: "", agents: "", guarantors: "" },
    dhinac2: { buyers: "", agents: "", guarantors: "" }
  });

  const [newPersonModal, setNewPersonModal] = useState({
    show: false,
    side: "",
    role: "",
    fullName: "",
    phone: "",
    forSide: "", // dhinac1 or dhinac2
    forRole: "" // sellers, buyers, agents, guarantors
  });
//   useEffect(() => {
//   const onRefNoUpdated = (e) => {
//     const newRef = e?.detail;
//     if (newRef) setRefNo(newRef);
//   };

//   window.addEventListener("refno-updated", onRefNoUpdated);
//   return () => window.removeEventListener("refno-updated", onRefNoUpdated);
// }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const [personsData, refData ] = await Promise.all([
          getPersons(),
          getNextRefNo(),
          
        ]);
        setPersons(personsData || []);
        setRefNo(refData?.refNo || "");
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load data");
      }
    };

    init();
  }, []);

  const fetchPersons = async () => {
    const data = await getPersons();
    setPersons(data || []);
  };

  useEffect(() => {
    if (form.agreementType !== "BEEC") {
      setForm(prev => ({ ...prev, sellingPrice: "" }));
    }
  }, [form.agreementType]);

  useEffect(() => {
    const first = serviceTypeOptions[form.service]?.[0];
    setForm((prev) => ({
      ...prev,
      serviceType: first?.value || "",
    }));
  }, [form.service]);


  useEffect(() => {
    if (form.service !== "Wareejin") {
      setForm(prev => ({
        ...prev,
        agreementType: "",
        sellingPrice: "",
      }));
    } else {
      setForm(prev => ({
        ...prev,
        agreementType: "Beec",
      }));
    }
  }, [form.service]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSearchChange = (side, role, value) => {
    setSearchInputs(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        [role]: value
      }
    }));
  };

  const handleSelect = (side, role, personId) => {
    if (!personId) return;

    setForm(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        [role]: [...new Set([...prev[side][role], personId])],
      },
    }));

    // Clear search input
    handleSearchChange(side, role, "");
  };

  const handleRemove = (side, role, id) => {
    setForm(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        [role]: prev[side][role].filter(p => p !== id),
      },
    }));
  };

  const openNewPersonModal = (side, role) => {
    setNewPersonModal({
      show: true,
      side: side,
      role: role,
      fullName: searchInputs[side][role],
      phone: "",
      forSide: side,
      forRole: role
    });
  };

  const closeNewPersonModal = () => {
    setNewPersonModal({
      show: false,
      side: "",
      role: "",
      fullName: "",
      phone: "",
      forSide: "",
      forRole: ""
    });
  };

  const createNewPerson = async () => {
    if (!newPersonModal.fullName.trim()) {
      toast.error("Magaca Waa Qasab");
      return;
    }

    try {
      const person = await createPerson({
        fullName: newPersonModal.fullName,
        phone: newPersonModal.phone,
      });

      toast.success("Person created successfully");

      handleSelect(newPersonModal.forSide, newPersonModal.forRole, person._id);

      await fetchPersons();
      closeNewPersonModal();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error creating person");
    }
  };

  const filteredPersons = (side, role) => {
    const searchTerm = searchInputs[side][role].toLowerCase();
    if (!searchTerm) return persons;

    return persons.filter(person =>
      person.fullName.toLowerCase().includes(searchTerm) ||
      person.phone?.toLowerCase().includes(searchTerm)
    );
  };
  const serviceConfig = {
    Wareejin: {
      side1Title: "Dhinaca 1aad (Iska Iibiye)",
      side2Title: "Dhinaca 2aad (Iibsade)",
      dhinac1Roles: {
        sellers: "Iska Iibiye",
        agents: "Wakiil",
        guarantors: "Damiin"
      },
      dhinac2Roles: {
        buyers: "Iibsade",
        agents: "Wakiil",
        guarantors: "Damiin"
      }
    },
   

    Wakaalad: {
      side1Title: "Dhinaca 1aad (Wakaalad Bixiye)",
      side2Title: "Dhinaca 2aad (La-wakiishe)",
      dhinac1Roles: {
        sellers: "Wakaalad Bixiye",
        agents: "Wakiil",
        guarantors: "Damiin"
      },
      dhinac2Roles: {
        buyers: "La-wakiishe",
        agents: "Wakiil",
        guarantors: "Damiin"
      }
    },

    Damaanad: {
      side1Title: "Dhinaca 1aad (Damiinu-l-Maal)",
      side2Title: "Dhinaca 2aad (La Damiinte)",
      dhinac1Roles: {
        sellers: "Damiinu-l-Maal",
        agents: "Wakiil",
        guarantors: "Damiin"
      },
      dhinac2Roles: {
        buyers: "La Damiinte",
        agents: "Wakiil",
        guarantors: "Damiin"
      }
    },
    Caddeyn: {
      side1Title: "Dhinaca 1aad (Caddeeye)",
      side2Title: "Dhinaca 2aad (Loo Caddeeye)",
      dhinac1Roles: {
        sellers: "Caddeeye",
        agents: "Wakiil",
        guarantors: "Damiin"
      },
      dhinac2Roles: {
        buyers: "Loo Caddeeye",
        agents: "Wakiil",
        guarantors: "Damiin"
      }
    },
    Heshiisyo: {
      side1Title: "Dhinaca 1aad (Dhinaca 1aad)",
      side2Title: "Dhinaca 2aad (Dhinaca 2aad)",
      dhinac1Roles: {
        sellers: "Dhinaca 1aad",
        agents: "Wakiil",
        guarantors: "Damiin"
      },
      dhinac2Roles: {
        buyers: "Dhinaca 2aad",
        agents: "Wakiil",
        guarantors: "Damiin"
      }
    },
     Kireeyn: {
      side1Title: "Dhinaca 1aad ( Kireeyaha)",
      side2Title: "Dhinaca 2aad (Kireestaha)",
      dhinac1Roles: {
        sellers: "Kireeyaha",
        agents: "Wakiil",
        guarantors: "Damiin"
      },
      dhinac2Roles: {
        buyers: "Kireestaha",
        agents: "Wakiil",
        guarantors: "Damiin"
      }
    },
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...form };

    if (payload.service !== "Wareejin") {
      delete payload.agreementType;
      delete payload.sellingPrice;
    }

    try {
      const agreement = await createAgreement(payload);
      toast.success("Agreement saved");
      navigate(`/agreement/${agreement._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error saving agreement");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">Agreement Registration</h2>

        </div>
      </div>

      {/* New Person Modal */}
      {newPersonModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-xl w-96">
            <h3 className="text-lg font-bold mb-4">Create New Person</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  type="text"
                  value={newPersonModal.fullName}
                  onChange={(e) => setNewPersonModal(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full border rounded p-2"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <Input
                  type="text"
                  value={newPersonModal.phone}
                  onChange={(e) => setNewPersonModal(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full border rounded p-2"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="Button"
                onClick={closeNewPersonModal}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="Button"
                onClick={createNewPerson}

              >
                Diwaan Gali
              </Button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* ===== TOP INFO ===== */}
        <div className="flex gap-6">
          <div className="flex-1 bg-white p-4 rounded shadow space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Taariikh</label>
              <Input
                type="date"
                value={form.agreementDate}
                name="agreementDate"
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-black/20 bg-white text-black
transition-all duration-200 outline-none
focus:ring-2 focus:ring-black focus:border-black shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tixraac</label>
              <Input
                type="text"
                value={refNo}
                readOnly

              />
            </div>
          
            <div>
              <label className="block text-sm font-medium mb-1">Dooro Adeega</label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-black/20 bg-white text-black
transition-all duration-200 outline-none
focus:ring-2 focus:ring-black focus:border-black shadow-sm"
              >
                <option value="Wareejin">Wareejin</option>
                <option value="Wakaalad">Wakaalad</option>
                <option value="Damaanad">Damaanad</option>
                <option value="Caddeyn">Caddeyn</option>
                <option value="Heshiisyo">Heshiisyo / Xeerar</option>
                <option value="Kireeyn">Kireeyn</option>

              </select>
            </div>
          </div>

          <div className="flex-1 bg-white p-4 rounded shadow space-y-4">


            <div>
              <label className="block text-sm font-medium mb-1">Dooro nooca Adeega</label>
              <select
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-black/20 bg-white text-black
transition-all duration-200 outline-none
focus:ring-2 focus:ring-black focus:border-black shadow-sm"
                required
              >
                {serviceTypeOptions[form.service]?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ujeeddo</label>
              <Input
                type="text"
                value={`Hashiis ${form.serviceType}`}
                readOnly
              />
            </div>
            {form.service === "Wareejin" && (
              <div>
                <label className="block text-sm font-medium mb-1">Heshiiska</label>
                <select
                  name="agreementType"
                  value={form.agreementType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/20 bg-white text-black
transition-all duration-200 outline-none
focus:ring-2 focus:ring-black focus:border-black shadow-sm"
                  required
                >
                  <option value="Beec">Beec</option>
                  <option value="Hibo">Hibo</option>
                  <option value="Waqaf">Waqaf</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex-1 bg-white p-4 rounded shadow space-y-4">


            {form.service === "Wareejin" && form.agreementType === "Beec" && (
              <div>
                <label className="block text-sm font-medium mb-1">Qiimaha</label>
                <Input
                  type="number"
                  name="sellingPrice"
                  value={form.sellingPrice}
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/20 bg-white text-black
transition-all duration-200 outline-none
focus:ring-2 focus:ring-black focus:border-black shadow-sm"
                />
                <label className="block text-sm font-medium mb-1">Qoral Ahaan</label>
                <input
                  type="text"
                  name="qoral"
                  value={
                    form.sellingPrice
                      ? `${numberToSomaliWords(form.sellingPrice)} Doolarka Mareykanka ah`
                      : ""
                  }
                  readOnly
                  className="w-full px-4 py-2.5 rounded-xl border border-black/20 bg-white text-black
transition-all duration-200 outline-none
focus:ring-2 focus:ring-black focus:border-black shadow-sm"
                />

              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Khidmada</label>
              <Input
                type="number"
                name="officeFee"
                value={form.officeFee}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-black/20 bg-white text-black
transition-all duration-200 outline-none
focus:ring-2 focus:ring-black focus:border-black shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* ===== SIDES ===== */}
        <div className="flex gap-6">
          {/* DHINAC 1 */}
          <div className="flex-1 bg-white p-5 rounded-2xl border border-black/10 shadow-sm">
            <h3 className="font-semibold mb-3">Darafka 1aad </h3>

            {["sellers", "agents", "guarantors"].map(role => (
              <div key={role} className="mb-4">

                <label className="block text-sm font-medium mb-1">
                  {/* {serviceConfig[form.service].dhinac1Roles[role]} */}
                </label>

                {/* Search Input */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={searchInputs.dhinac1[role]}
                    onChange={(e) => handleSearchChange("dhinac1", role, e.target.value)}
                    className="px-4 py-2.5 rounded-xl border bg-white text-black 
        transition-all duration-300 outline-none
        focus:ring-2 focus:ring-black focus:border-black w-full
        shadow-sm"
                    placeholder={`${serviceConfig[form.service].dhinac1Roles[role]} `}

                  />
                  <Button
                    type="Button"
                    onClick={() => openNewPersonModal("dhinac1", role)}

                  >
                    New
                  </Button>
                </div>

                {/* Search Results */}
                {searchInputs.dhinac1[role] && (
                  <div className="border border-black/10 rounded-xl max-h-40 overflow-y-auto mb-2 bg-white shadow-sm">
                    {filteredPersons("dhinac1", role).map(person => (
                      <div
                        key={person._id}
                        className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                        onClick={() => handleSelect("dhinac1", role, person._id)}
                      >
                        <div className="font-medium">{person.fullName}</div>
                        <div className="text-sm text-gray-600">{person.phone}</div>
                      </div>
                    ))}
                    {filteredPersons("dhinac1", role).length === 0 && (
                      <div className="p-3 text-center text-gray-500">
                        No persons found
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Persons */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.dhinac1[role].map(id => {
                    const person = persons.find(p => p._id === id);
                    return (
                      <span
                        key={id}
                        className="bg-black/5 border border-black/10 px-3 py-1.5 rounded-xl text-sm flex items-center gap-2"
                      >
                        <span>{person?.fullName}</span>
                        <Button
                          type="Button"
                          onClick={() => handleRemove("dhinac1", role, id)}

                        >
                          ✕
                        </Button>
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* DHINAC 2 */}
          <div className="flex-1 bg-white p-5 rounded-2xl border border-black/10 shadow-sm">
            <h3 className="font-semibold mb-3">Darafka 2aad </h3>

            {["buyers", "agents", "guarantors"].map(role => (
              <div key={role} className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  {/* {serviceConfig[form.service].dhinac2Roles[role]} */}
                </label>

                {/* Search Input */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={searchInputs.dhinac2[role]}
                    onChange={(e) => handleSearchChange("dhinac2", role, e.target.value)}
                    className="px-4 py-2.5 rounded-xl border bg-white text-black 
        transition-all duration-300 outline-none
        focus:ring-2 focus:ring-black focus:border-black w-full
        shadow-sm"                    placeholder={`${serviceConfig[form.service].dhinac2Roles[role]}`}

                  />
                  <Button
                    type="Button"
                    onClick={() => openNewPersonModal("dhinac2", role)}

                  >
                    New
                  </Button>
                </div>

                {/* Search Results */}
                {searchInputs.dhinac2[role] && (
                  <div className="border border-black/10 rounded-xl max-h-40 overflow-y-auto mb-2 bg-white shadow-sm">
                    {filteredPersons("dhinac2", role).map(person => (
                      <div
                        key={person._id}
                        className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                        onClick={() => handleSelect("dhinac2", role, person._id)}
                      >
                        <div className="font-medium">{person.fullName}</div>
                        <div className="text-sm text-gray-600">{person.phone}</div>
                      </div>
                    ))}
                    {filteredPersons("dhinac2", role).length === 0 && (
                      <div className="p-3 text-center text-gray-500">
                        No persons found
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Persons */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.dhinac2[role].map(id => {
                    const person = persons.find(p => p._id === id);
                    return (
                      <span
                        key={id}
                        className="bg-black/5 border border-black/10 px-3 py-1.5 rounded-xl text-sm flex items-center gap-2"
                      >
                        <span>{person?.fullName}</span>
                        <Button
                          type="Button"
                          onClick={() => handleRemove("dhinac2", role, id)}

                        >
                          ✕
                        </Button>
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SAVE ===== */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-14 py-3 rounded-xl bg-black text-white hover:bg-gray-800 active:scale-95 transition"
          >
            Keydi
          </Button>

        </div>

      </form>
    </div>
  );
};

export default Reception;
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

import PersonsSection from "./PersonsSection";
import WitnessesSection from "./WitnessesSection";
import DocumentModals from "./DocumentModals";

import { getPersons } from "../api/persons.api";
import {
  getWakaalads,
  createWakaalad,
  updateWakaalad,
  deleteWakaalad,
} from "../api/wakaalads.api";
import {
  getTasdiiqs,
  createTasdiiq,
  updateTasdiiq,
  deleteTasdiiq,
} from "../api/tasdiiqs.api";

import { linkAgentDocument, unlinkAgentDocument } from "../api/agreementAgentDocs.api";
import ImagesSection from "./ImagesSection";

const PersonsWitnesses = ({ agreement, fetchData }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [allPersons, setAllPersons] = useState([]);
  const [wakaalads, setWakaalads] = useState([]);
  const [tasdiiqs, setTasdiiqs] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState("Wakaalad");

  const [newWakaalad, setNewWakaalad] = useState({
    wakaladType: "Wakaalad Guud",
    refNo: "",
    date: "",
    kasooBaxday: "",
    xafiisKuYaal: "",
    saxiix1: "",
    saxiix2: "",
  });

  const [newTasdiiq, setNewTasdiiq] = useState({
    refNo: "",
    date: "",
    kasooBaxday: "",
  });

  // ✅ FETCH ALL (API layer)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [persons, waka, tas] = await Promise.all([
          getPersons(),
          getWakaalads(),
          getTasdiiqs(),
        ]);
        setAllPersons(persons || []);
        setWakaalads(waka || []);
        setTasdiiqs(tas || []);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to fetch data");
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  // ✅ LINK doc to agent (API layer)
  const handleAddAgentDocument = async (agent, docType, docId, side = "dhinac1") => {
    try {
      const agentId = agent?._id || agent;

      await linkAgentDocument({
        agreementId: agreement._id,
        agreementSnapshot: agreement,
        side,
        agentId,
        docType,
        docId,
      });

      toast.success(`${docType} linked to agent`);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to link document");
      console.error(err);
      throw err;
    }
  };

  // ✅ UNLINK doc from agent (API layer)
  const handleRemoveAgentDocument = async (agent, docType, side = "dhinac1") => {
    try {
      const agentId = agent?._id || agent;

      await unlinkAgentDocument({
        agreementId: agreement._id,
        agreementSnapshot: agreement,
        side,
        agentId,
        docType,
      });

      toast.success(`${docType} removed from agent`);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove document");
      console.error(err);
      throw err;
    }
  };

  // ✅ CREATE/UPDATE/DELETE docs (API layer)
  const handleCreateWakaalad = async () => {
    const created = await createWakaalad(newWakaalad);
    setWakaalads((p) => [...p, created]);
    toast.success("Wakaalad created");
    setNewWakaalad({
      wakaladType: "Wakaalad Guud",
      refNo: "",
      date: "",
      kasooBaxday: "",
      xafiisKuYaal: "",
      saxiix1: "",
      saxiix2: "",
    });
    return created;
  };

  const handleCreateTasdiiq = async () => {
    const created = await createTasdiiq(newTasdiiq);
    setTasdiiqs((p) => [...p, created]);
    toast.success("Tasdiiq created");
    setNewTasdiiq({ refNo: "", date: "", kasooBaxday: "" });
    return created;
  };

  const handleUpdateWakaalad = async (id, payload) => {
    const updated = await updateWakaalad(id, payload);
    setWakaalads((p) => p.map((d) => (d._id === id ? updated : d)));
    toast.success("Wakaalad updated");
    return updated;
  };

  const handleDeleteWakaalad = async (id) => {
    await deleteWakaalad(id);
    setWakaalads((p) => p.filter((d) => d._id !== id));
    toast.success("Wakaalad deleted");
  };

  const handleUpdateTasdiiq = async (id, payload) => {
    const updated = await updateTasdiiq(id, payload);
    setTasdiiqs((p) => p.map((d) => (d._id === id ? updated : d)));
    toast.success("Tasdiiq updated");
    return updated;
  };

  const handleDeleteTasdiiq = async (id) => {
    await deleteTasdiiq(id);
    setTasdiiqs((p) => p.filter((d) => d._id !== id));
    toast.success("Tasdiiq deleted");
  };
 const serviceConfig = {
  "Wakaalad Guud": {
    sellerBtnText: "Wakaalad Bixiye",
    buyerBtnText: "La Wakiishe",
  },
  "Wakaalad_Gaar_ah": {
    sellerBtnText: "Wakaalad Bixiye",
    buyerBtnText: "La Wakiishe",
  },
  "Wakaalad_Saami": {
    sellerBtnText: "Wakaalad Bixiye",
    buyerBtnText: "La Wakiishe",
  },
  "Wakaalad kale": {
    sellerBtnText: "Wakaalad Bixiye",
    buyerBtnText: "La Wakiishe",
  },
  "Caddeyn": {
    sellerBtnText: "Caddeeye",
    buyerBtnText: "Loo Caddeeye",
  },
  "XayiraadSaami": {
    sellerBtnText: "Caddeeye",
    buyerBtnText: "Loo Caddeeye",
  },
  "Damaanad": {
    sellerBtnText: "Damiinte",
    buyerBtnText: "La Damiinte",
  },
  "Sponsorship": {
    sellerBtnText: "Damiinu-l-Maal",
    buyerBtnText: "La Damiinte",
  },
  "damiinmobile": {
    sellerBtnText: "Damiinu-l-Maal",
    buyerBtnText: "La Damiinte",
  },
  "Shaqaaleysiin": {
    sellerBtnText: "Damiinte",
    buyerBtnText: "La Damiinte",
  },
  "Kireeyn": {
    sellerBtnText: "Kireeyaha",
    buyerBtnText: "Kirestaha",
  },
  "Heshiis Dhex Maray Laba Daraf": {
    sellerBtnText: "Dhinac",
    buyerBtnText: "Dhinac",
  }
};

  const {
  sellerBtnText = "Iska iibiye",
  buyerBtnText = "Iibsade",
  sellerTitle = "Dhinaca 1aad",
  buyerTitle = "Dhinaca 2aad"
} = serviceConfig[agreement?.serviceType] || {};
  return (
    <div className="space-y-8">
      <PersonsSection
        title={sellerTitle}
        side="dhinac1"
        role="sellers"
        buttonText={sellerBtnText}
        agreement={agreement}
        allPersons={allPersons}
        setAllPersons={setAllPersons}
        setActiveModal={setActiveModal}
        fetchData={fetchData}
      />

      <PersonsSection
        title="Wakiilka 1aad"
        side="dhinac1"
        role="agents"
        buttonText="Wakiilka 1aad"
        agreement={agreement}
        allPersons={allPersons}
        setAllPersons={setAllPersons}
        setActiveModal={setActiveModal}
        fetchData={fetchData}
        showDocumentOptions={true}
        agentDocuments={agreement.dhinac1?.agentDocuments}
        onRemoveDocument={(agent, docType) => handleRemoveAgentDocument(agent, docType, "dhinac1")}
        onOpenLinkModal={(agent, docType, side) => {
          setSelectedDocType(docType);
          setActiveModal({ type: "linkDocument", agent, side: side || "dhinac1" });
        }}
      />

      <PersonsSection
        title={buyerTitle}
        side="dhinac2"
        role="buyers"
        buttonText={buyerBtnText}
        agreement={agreement}
        allPersons={allPersons}
        setAllPersons={setAllPersons}
        setActiveModal={setActiveModal}
        fetchData={fetchData}
      />

      <PersonsSection
        title="Wakiilka 2aad"
        side="dhinac2"
        role="agents"
        buttonText="Wakiilka 2aad"
        agreement={agreement}
        allPersons={allPersons}
        setAllPersons={setAllPersons}
        setActiveModal={setActiveModal}
        fetchData={fetchData}
        showDocumentOptions={true}
        agentDocuments={agreement.dhinac2?.agentDocuments}
        onRemoveDocument={(agent, docType) => handleRemoveAgentDocument(agent, docType, "dhinac2")}
        onOpenLinkModal={(agent, docType, side) => {
          setSelectedDocType(docType);
          setActiveModal({ type: "linkDocument", agent, side: side || "dhinac2" });
        }}
      />
      <ImagesSection agreement={agreement} fetchData={fetchData} />
      <WitnessesSection agreement={agreement} fetchData={fetchData} />

      <DocumentModals
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        selectedDocType={selectedDocType}
        setSelectedDocType={setSelectedDocType}
        newWakaalad={newWakaalad}
        setNewWakaalad={setNewWakaalad}
        newTasdiiq={newTasdiiq}
        setNewTasdiiq={setNewTasdiiq}
        wakaalads={wakaalads}
        tasdiiqs={tasdiiqs}
        onCreateWakaalad={handleCreateWakaalad}
        onCreateTasdiiq={handleCreateTasdiiq}
        onUpdateWakaalad={handleUpdateWakaalad}
        onDeleteWakaalad={handleDeleteWakaalad}
        onUpdateTasdiiq={handleUpdateTasdiiq}
        onDeleteTasdiiq={handleDeleteTasdiiq}
        onLinkDocument={handleAddAgentDocument}
      />
    </div>
  );
};

export default PersonsWitnesses;
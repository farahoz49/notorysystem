import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";

const DocumentModals = ({
  activeModal,
  setActiveModal,
  selectedDocType,
  setSelectedDocType,

  newWakaalad,
  setNewWakaalad,
  newTasdiiq,
  setNewTasdiiq,

  wakaalads,
  tasdiiqs,

  onCreateWakaalad,
  onCreateTasdiiq,
  onUpdateWakaalad,
  onDeleteWakaalad,
  onUpdateTasdiiq,
  onDeleteTasdiiq,

  onLinkDocument,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [createTasdiiqWithWakaalad, setCreateTasdiiqWithWakaalad] = useState(false);

  const [searchRef, setSearchRef] = useState("");
  const [filterWakaaladType, setFilterWakaaladType] = useState("all");

  // reset filters when modal opens
  useEffect(() => {
    if (activeModal && ["linkDocument", "createDocument"].includes(activeModal.type)) {
      setSearchRef("");
      setFilterWakaaladType("all");
    }
  }, [activeModal, selectedDocType]);

  // load docs from props (NO API call here)
  useEffect(() => {
    if (activeModal?.type === "linkDocument" || activeModal?.type === "createDocument") {
      setLoading(true);
      try {
        setDocuments(selectedDocType === "Wakaalad" ? (wakaalads || []) : (tasdiiqs || []));
      } finally {
        setLoading(false);
      }
    }
  }, [activeModal, selectedDocType, wakaalads, tasdiiqs]);

  const startEditDocument = (doc) => {
    setEditingDoc(doc);
    setSelectedDocType(doc.wakaladType ? "Wakaalad" : "Tasdiiq");
    setShowCreateForm(true);
  };

  const handleCreateDocument = async () => {
    if (!onCreateWakaalad || !onCreateTasdiiq) {
      toast.error("Create handlers ma jiraan (onCreate...)");
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedDocType === "Wakaalad") {
        const createdWakaalad = await onCreateWakaalad();

        let createdTasdiiq = null;
        if (createTasdiiqWithWakaalad) {
          createdTasdiiq = await onCreateTasdiiq();
        }

        // link after create (if modal opened for agent)
        if (activeModal?.agent && createdWakaalad?._id) {
          const agent = activeModal.agent;
          const side = activeModal.side || "dhinac1";

          await onLinkDocument?.(agent, "Wakaalad", createdWakaalad._id, side);

          if (createdTasdiiq?._id) {
            await onLinkDocument?.(agent, "Tasdiiq", createdTasdiiq._id, side);
          }
        }
      } else {
        const createdTasdiiq = await onCreateTasdiiq();

        if (activeModal?.agent && createdTasdiiq?._id) {
          const agent = activeModal.agent;
          const side = activeModal.side || "dhinac1";
          await onLinkDocument?.(agent, "Tasdiiq", createdTasdiiq._id, side);
        }
      }

      setActiveModal(null);
      setShowCreateForm(false);
      setEditingDoc(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create document");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingDoc) return;

    setIsSubmitting(true);
    try {
      if (selectedDocType === "Wakaalad") {
        if (!onUpdateWakaalad) throw new Error("onUpdateWakaalad missing");

        const payload = {
          wakaladType: editingDoc.wakaladType,
          refNo: editingDoc.refNo,
          date: editingDoc.date,
          kasooBaxday: editingDoc.kasooBaxday,
          xafiisKuYaal: editingDoc.xafiisKuYaal,
          saxiix1: editingDoc.saxiix1,
          ahna0: editingDoc.ahna0,
          saxiix2: editingDoc.saxiix2,
          ahna1: editingDoc.ahna1,
        };

        const updated = await onUpdateWakaalad(editingDoc._id, payload);
        setDocuments((prev) => prev.map((d) => (d._id === editingDoc._id ? updated : d)));

        toast.success("Wakaalad updated");
      } else {
        if (!onUpdateTasdiiq) throw new Error("onUpdateTasdiiq missing");

        const payload = {
          refNo: editingDoc.refNo,
          date: editingDoc.date,
          kasooBaxday: editingDoc.kasooBaxday,
        };

        const updated = await onUpdateTasdiiq(editingDoc._id, payload);
        setDocuments((prev) => prev.map((d) => (d._id === editingDoc._id ? updated : d)));

        toast.success("Tasdiiq updated");
      }

      setEditingDoc(null);
      setShowCreateForm(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to save changes");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDoc = async (doc) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    setIsSubmitting(true);
    try {
      if (selectedDocType === "Wakaalad") {
        if (!onDeleteWakaalad) throw new Error("onDeleteWakaalad missing");
        await onDeleteWakaalad(doc._id);
        setDocuments((prev) => prev.filter((d) => d._id !== doc._id));
        toast.success("Wakaalad deleted");
      } else {
        if (!onDeleteTasdiiq) throw new Error("onDeleteTasdiiq missing");
        await onDeleteTasdiiq(doc._id);
        setDocuments((prev) => prev.filter((d) => d._id !== doc._id));
        toast.success("Tasdiiq deleted");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to delete document");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkDocument = (docId) => {
    const agent = activeModal?.agent;
    const side = activeModal?.side || "dhinac1";
    onLinkDocument?.(agent, selectedDocType, docId, side);
    setActiveModal(null);
  };

  const filteredDocuments = useMemo(() => {
    return (documents || []).filter((doc) => {
      const refOk =
        !searchRef ||
        (doc.refNo || "").toLowerCase().includes(searchRef.trim().toLowerCase());

      const typeOk =
        selectedDocType !== "Wakaalad" ||
        filterWakaaladType === "all" ||
        (doc.wakaladType || "") === filterWakaaladType;

      return refOk && typeOk;
    });
  }, [documents, searchRef, selectedDocType, filterWakaaladType]);

  if (!activeModal || !["linkDocument", "createDocument"].includes(activeModal.type)) {
    return null;
  }
  if (activeModal.type === 'createDocument' || showCreateForm) {
    return (
      <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl">{editingDoc ? `Edit ${selectedDocType}` : `Create New ${selectedDocType}`}</h3>
            <Button
              onClick={() => {
                if (showCreateForm && activeModal.agent) {
                  setShowCreateForm(false);
                } else {
                  setActiveModal(null);
                }
              }}
              variant="outline"
              disabled={isSubmitting}
            >
              ✕
            </Button>
          </div>

          <div className="mb-6">
            <h4 className="font-medium mb-3">Select Document Type:</h4>
            <div className="flex gap-4">
              <Button
                onClick={() => setSelectedDocType("Wakaalad")}
                // className={`px-4 py-2 rounded-lg ${selectedDocType === "Wakaalad" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                variant="outline"
                disabled={isSubmitting}
              >
                Wakaalad
              </Button>
              <Button
                onClick={() => setSelectedDocType("Tasdiiq")}
                //className={`px-4 py-2 rounded-lg ${selectedDocType === "Tasdiiq" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                disabled={isSubmitting}
              >
                Tasdiiq
              </Button>
            </div>
          </div>

          {selectedDocType === "Wakaalad" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  id="createTasdiiqWithWakaalad"
                  type="checkbox"
                  checked={createTasdiiqWithWakaalad}
                  onChange={(e) => setCreateTasdiiqWithWakaalad(e.target.checked)}
                  disabled={isSubmitting}
                />
                <label htmlFor="createTasdiiqWithWakaalad" className="text-sm">Also create a Tasdiiq (optional)</label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nooca Wakaaladda</label>
                <select
                  value={editingDoc ? editingDoc.wakaladType : newWakaalad.wakaladType}
                  onChange={(e) => {
                    if (editingDoc) setEditingDoc({ ...editingDoc, wakaladType: e.target.value });
                    else setNewWakaalad({ ...newWakaalad, wakaladType: e.target.value });
                  }}
                  className="w-full border border-gray-300 p-3 rounded"
                  disabled={isSubmitting}
                >
                  <option value="Wakaalad Guud">Wakaalad Guud</option>
                  <option value="Wakaalad Gaar">Wakaalad Gaar</option>
                  <option value="Qayim">Qayim</option>
                  <option value="DhaxalKoob">DhaxalKoob</option>
                </select>
              </div>
              {createTasdiiqWithWakaalad && (
                <div className="border p-3 rounded bg-gray-50">
                  <h5 className="font-medium mb-2">Tasdiiq (optional)</h5>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={newTasdiiq.refNo}
                      onChange={(e) => setNewTasdiiq({ ...newTasdiiq, refNo: e.target.value })}
                      className="border border-gray-300 p-2 rounded"
                      placeholder="Tixraac"
                      disabled={isSubmitting}
                    />
                    <input
                      type="date"
                      value={newTasdiiq.date}
                      onChange={(e) => setNewTasdiiq({ ...newTasdiiq, date: e.target.value })}
                      className="border border-gray-300 p-2 rounded"
                      disabled={isSubmitting}
                    />
                    <input
                      type="text"
                      value={newTasdiiq.kasooBaxday}
                      onChange={(e) => setNewTasdiiq({ ...newTasdiiq, kasooBaxday: e.target.value })}
                      className="border border-gray-300 p-2 rounded"
                      placeholder="Kasoo Baxday"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Lambarka Tixraac</label>
                <input
                  type="text"
                  value={editingDoc ? editingDoc.refNo : newWakaalad.refNo}
                  onChange={(e) => editingDoc ? setEditingDoc({ ...editingDoc, refNo: e.target.value }) : setNewWakaalad({ ...newWakaalad, refNo: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded"
                  placeholder="Geli lambarka tixraac"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Taariikhda</label>
                <input
                  type="date"
                  value={editingDoc ? editingDoc.date?.slice(0, 10) : newWakaalad.date}
                  onChange={(e) => editingDoc ? setEditingDoc({ ...editingDoc, date: e.target.value }) : setNewWakaalad({ ...newWakaalad, date: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Kasoo Baxday</label>
                <input
                  type="text"
                  value={editingDoc ? editingDoc.kasooBaxday : newWakaalad.kasooBaxday}
                  onChange={(e) => editingDoc ? setEditingDoc({ ...editingDoc, kasooBaxday: e.target.value }) : setNewWakaalad({ ...newWakaalad, kasooBaxday: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded"
                  placeholder="Halka kasoo baxday"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Xafiis Kuyaal</label>
                <input
                  type="text"
                  value={editingDoc ? editingDoc.xafiisKuYaal : newWakaalad.xafiisKuYaal}
                  onChange={(e) => editingDoc ? setEditingDoc({ ...editingDoc, xafiisKuYaal: e.target.value }) : setNewWakaalad({ ...newWakaalad, xafiisKuYaal: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded"
                  placeholder="Xafiiska ku yaal"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Saxiixa 1aad</label>
                <input
                  type="text"
                  value={editingDoc ? editingDoc.saxiix1 : newWakaalad.saxiix1}
                  onChange={(e) => editingDoc ? setEditingDoc({ ...editingDoc, saxiix1: e.target.value }) : setNewWakaalad({ ...newWakaalad, saxiix1: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded"
                  placeholder="Saxiixa koowaad"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ahna</label>
                <input
                  type="text"
                  value={editingDoc ? editingDoc.ahna0 : newWakaalad.ahna0}
                  onChange={(e) => editingDoc ? setEditingDoc({ ...editingDoc, ahna0: e.target.value }) : setNewWakaalad({ ...newWakaalad, ahna0: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded"
                  placeholder="Saxiixa koowaad"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Saxiixa 2aad</label>
                <input
                  type="text"
                  value={editingDoc ? editingDoc.saxiix2 : newWakaalad.saxiix2}
                  onChange={(e) => editingDoc ? setEditingDoc({ ...editingDoc, saxiix2: e.target.value }) : setNewWakaalad({ ...newWakaalad, saxiix2: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded"
                  placeholder="Saxiixa labaad"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ahna</label>
                <input
                  type="text"
                  value={editingDoc ? editingDoc.ahna1 : newWakaalad.ahna1}
                  onChange={(e) => editingDoc ? setEditingDoc({ ...editingDoc, ahna1: e.target.value }) : setNewWakaalad({ ...newWakaalad, ahna1: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded"
                  placeholder="Saxiixa labaad"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Lambarka Tixraac</label>
                <input
                  type="text"
                  value={editingDoc ? editingDoc.refNo : newTasdiiq.refNo}
                  onChange={(e) => editingDoc ? setEditingDoc({ ...editingDoc, refNo: e.target.value }) : setNewTasdiiq({ ...newTasdiiq, refNo: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded"
                  placeholder="Geli lambarka tixraac"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Taariikhda</label>
                <input
                  type="date"
                  value={editingDoc ? editingDoc.date?.slice(0, 10) : newTasdiiq.date}
                  onChange={(e) => editingDoc ? setEditingDoc({ ...editingDoc, date: e.target.value }) : setNewTasdiiq({ ...newTasdiiq, date: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded"
                  disabled={isSubmitting}
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium mb-1">Kasoo Baxday</label>
                <input
                  type="text"
                  value={editingDoc ? editingDoc.kasooBaxday : newTasdiiq.kasooBaxday}
                  onChange={(e) => editingDoc ? setEditingDoc({ ...editingDoc, kasooBaxday: e.target.value }) : setNewTasdiiq({ ...newTasdiiq, kasooBaxday: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded"
                  placeholder="Halka kasoo baxday"
                  disabled={isSubmitting}
                />
              </div> */}
            </div>
          )}

          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={() => {
                if (editingDoc) {
                  setEditingDoc(null);
                  setShowCreateForm(false);
                } else if (showCreateForm && activeModal.agent) {
                  setShowCreateForm(false);
                } else {
                  setActiveModal(null);
                }
              }}

              disabled={isSubmitting}
            >
              Cancel
            </button>
            {editingDoc ? (
              <Button
                onClick={handleSaveEdit}
                disabled={isSubmitting}

              >
                {isSubmitting ? "Saving..." : `Save ${selectedDocType}`}
              </Button>
            ) : (
              <Button
                onClick={handleCreateDocument}
                disabled={
                  isSubmitting || (
                    selectedDocType === "Wakaalad" && (
                      !newWakaalad.refNo || !newWakaalad.date || !newWakaalad.kasooBaxday ||
                      (createTasdiiqWithWakaalad && (!newTasdiiq.refNo || !newTasdiiq.date || !newTasdiiq.kasooBaxday))
                    )
                  ) || (
                    selectedDocType === "Tasdiiq" && (!newTasdiiq.refNo || !newTasdiiq.date || !newTasdiiq.kasooBaxday)
                  )
                }

              >
                {isSubmitting ? "Creating..." : `Create ${selectedDocType}`}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Link Document Modal
  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl">Link Document to Agent</h3>
          <Button
            onClick={() => setActiveModal(null)}
            variant="outline"
          >
            ✕
          </Button>
        </div>

        <div className="mb-6">

          <div className="flex justify-between items-center">
            <h4 className="font-medium mb-3">Select Document Type:</h4>
            <Button
              onClick={() => setShowCreateForm(true)}

            >
              + Create New {selectedDocType}
            </Button>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => setSelectedDocType("Wakaalad")}
              // className={`px-4 py-2 rounded-lg ${selectedDocType === "Wakaalad" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              variant="outline"
            >
              Wakaalad
            </Button>
            <Button
              onClick={() => setSelectedDocType("Tasdiiq")}
            // className={`px-4 py-2 rounded-lg ${selectedDocType === "Tasdiiq" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Tasdiiq
            </Button>
          </div>
        </div>


        {loading ? (
          <div className="text-center py-8">Loading documents...</div>
        ) : (
          <>
            {/* SEARCH + FILTER BAR */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                placeholder="Search by Ref No..."
                className="border border-gray-300 p-2 rounded w-full"
              />

              {selectedDocType === "Wakaalad" && (
                <select
                  value={filterWakaaladType}
                  onChange={(e) => setFilterWakaaladType(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full"
                >
                  <option value="all">All Wakaalad Types</option>
                  <option value="Wakaalad Guud">Wakaalad Guud</option>
                  <option value="Wakaalad Gaar">Wakaalad Gaar</option>
                  <option value="Qayim">Qayim</option>
                  <option value="DhaxalKoob">DhaxalKoob</option>
                </select>
              )}

              <button
                onClick={() => {
                  setSearchRef("");
                  setFilterWakaaladType("all");
                }}
                className="bg-gray-200 hover:bg-gray-300 rounded px-4 py-2"
              >
                Clear
              </button>
            </div>

            {/* RESULTS */}
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div key={doc._id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-bold">
                        {selectedDocType === "Wakaalad"
                          ? `Wakaalad ${doc.refNo}`
                          : `Tasdiiq ${doc.refNo}`}
                      </h5>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(doc.date).toLocaleDateString()}
                      </p>
                      {doc.wakaladType && (
                        <p className="text-sm text-gray-600">Type: {doc.wakaladType}</p>
                      )}
                      <p className="text-sm text-gray-600">Issued by: {doc.kasooBaxday}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleLinkDocument(doc._id)}

                      >
                        Link
                      </Button>
                      <Button
                        onClick={() => startEditDocument(doc)}
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteDoc(doc)}
                        className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredDocuments.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 italic mb-4">
                    No results found for your search/filter
                  </p>
                  <Button
                    onClick={() => setShowCreateForm(true)}

                  >
                    Create New {selectedDocType}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentModals;
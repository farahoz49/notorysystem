import React, { useState, useEffect } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const PersonModal = ({
  mode,
  personData,
  setPersonData,
  allPersons,
  onSubmit,
  onClose
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedExistingPerson, setSelectedExistingPerson] = useState(null);
  const [isExistingMode, setIsExistingMode] = useState(mode === "add" ? "cusub" : "update");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery.trim() && isExistingMode === "keydsan") {
      const results = allPersons.filter(person =>
        person.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.phone?.includes(searchQuery) ||
        (person.documentNumber && person.documentNumber.includes(searchQuery))
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, isExistingMode, allPersons]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (isExistingMode === "keydsan" && selectedExistingPerson) {
        // Send existing person data to parent
        await onSubmit(selectedExistingPerson);
      } else {
        // Send new person data to parent
        await onSubmit(personData);
      }
    } catch (error) {
      console.error("Error submitting person:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectExistingPerson = (person) => {
    setSelectedExistingPerson(person);
    setSearchQuery(person.fullName);
    setSearchResults([]);
  };

  const handleModeChange = (mode) => {
    setIsExistingMode(mode);
    setSelectedExistingPerson(null);
    setSearchQuery("");
    setSearchResults([]);
    
    if (mode === "cusub") {
      setPersonData({
        fullName: "",
        motherName: "",
        birthPlace: "",
        birthYear: "",
        address: "",
        nationality: "",
        phone: "",
        gender: "Male",
        documentType: "Passport",
        documentNumber: ""
      });
    }
  };

  // sanitizers to avoid rendering event objects accidentally
  const isEventObject = (v) => v && typeof v === 'object' && ('nativeEvent' in v || '_reactName' in v || ('target' in v && v.target && typeof v.target !== 'object'));
  const sanitize = (v) => (isEventObject(v) ? '' : v);
  const safePersonData = {
    ...personData,
    fullName: sanitize(personData?.fullName),
    motherName: sanitize(personData?.motherName),
    birthPlace: sanitize(personData?.birthPlace),
    birthYear: sanitize(personData?.birthYear),
    address: sanitize(personData?.address),
    nationality: sanitize(personData?.nationality),
    phone: sanitize(personData?.phone),
    gender: sanitize(personData?.gender),
    documentType: sanitize(personData?.documentType),
    documentNumber: sanitize(personData?.documentNumber),
  };
  const safeSelected = selectedExistingPerson ? {
    ...selectedExistingPerson,
    fullName: sanitize(selectedExistingPerson.fullName),
    phone: sanitize(selectedExistingPerson.phone),
    motherName: sanitize(selectedExistingPerson.motherName),
    gender: sanitize(selectedExistingPerson.gender),
    documentType: sanitize(selectedExistingPerson.documentType),
    documentNumber: sanitize(selectedExistingPerson.documentNumber),
  } : null;

  // debug: surface any event-like values that would break rendering
  useEffect(() => {
    const check = (obj, name) => {
      if (!obj || typeof obj !== 'object') return [];
      return Object.keys(obj).filter(k => isEventObject(obj[k])).map(k => `${name}.${k}`);
    };
    const issues = [];
    issues.push(...check(personData, 'personData'));
    issues.push(...check(selectedExistingPerson || {}, 'selectedExistingPerson'));
    if (issues.length) {
      console.error('PersonModal: found event-like fields before render:', issues, { personData, selectedExistingPerson });
    }
  }, [personData, selectedExistingPerson]);

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-[600px] rounded-lg overflow-y-auto max-h-[90vh] p-6 grid grid-cols-2 gap-4">
        <div className="col-span-2 flex justify-between items-center border-b pb-4 mb-4">
          <h3 className="font-bold text-lg">
            {mode === "add" ? "Add Person" : "Update Person"}
          </h3>
          <Button 
            onClick={onClose} 
            className="text-xl hover:text-gray-600"
            disabled={isSubmitting}
          >
            ✕
          </Button>
        </div>

        {mode === "add" && (
          <div className="col-span-2 flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => handleModeChange("cusub")}
              className={`flex-1 py-3 rounded-lg transition ${isExistingMode === "cusub" ? "bg-black text-white" : "bg-gray-200"}`}
            >
              Person Cusub
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("keydsan")}
              className={`flex-1 py-3 rounded-lg transition ${isExistingMode === "keydsan" ? "bg-black text-white" : "bg-gray-200"}`}
            >
              Person Keydsan
            </button>
          </div>
        )}

        {isExistingMode === "keydsan" && mode === "add" && (
          <div className="col-span-2 space-y-4">
            <label className="block text-sm font-medium mb-1">Raadi Person</label>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Geli magaca ama telefoonka"
              className="border border-gray-300 p-3 rounded w-full"
              disabled={isSubmitting}
            />
            
            {searchQuery.trim() && searchResults.length === 0 && (
              <p className="text-gray-500 text-sm">Lama helin person-ka.</p>
            )}
            
            {searchResults.length > 0 && (
              <div className="border border-gray-300 rounded bg-white max-h-40 overflow-y-auto">
                    {searchResults.map((person) => (
                  <div
                    key={person._id}
                    className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectExistingPerson(person)}
                  >
                    <div className="font-medium">{person.fullName}</div>
                    <div className="text-sm text-gray-600">
                      {person.phone && `Tel: ${person.phone}`}
                      {person.documentNumber && ` | ID: ${person.documentNumber}`}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {safeSelected && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-bold text-blue-700 mb-2">Person La Doortay:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Magaca:</span> {safeSelected.fullName}</div>
                  <div><span className="font-medium">Telefoon:</span> {safeSelected.phone || "N/A"}</div>
                  <div><span className="font-medium">Hooyada:</span> {safeSelected.motherName || "N/A"}</div>
                  <div><span className="font-medium">Jinsiga:</span> {safeSelected.gender || "N/A"}</div>
                  <div><span className="font-medium">Nooca Warqadda:</span> {safeSelected.documentType || "N/A"}</div>
                  <div><span className="font-medium">Nambarka:</span> {safeSelected.documentNumber || "N/A"}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {(isExistingMode === "cusub" || mode === "update") && (
          <>
  {/* Magaca */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Magaca <span className="text-red-600">*</span>
      <span className="text-xs text-gray-500 ml-2">loo baahan yahay</span>
    </label>
    <Input
      value={safePersonData.fullName}
      onChange={(e) => setPersonData({ ...personData, fullName: e.target.value })}
      placeholder="Magaca oo buuxa"
      className="border border-gray-300 p-3 rounded w-full"
      disabled={isSubmitting}
      required
    />
  </div>

  {/* Telefoon */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Telefoon <span className="text-red-600">*</span>
      <span className="text-xs text-gray-500 ml-2">loo baahan yahay</span>
    </label>
    <Input
      value={personData.phone}
      onChange={(e) => setPersonData({ ...personData, phone: e.target.value })}
      placeholder="Telefoon"
      className="border border-gray-300 p-3 rounded w-full"
      disabled={isSubmitting}
      required
    />
  </div>

  {/* Hooyada */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Hooyada
      <span className="text-xs text-gray-500 ml-2">laga tegi karo</span>
    </label>
    <Input
      value={personData.motherName}
      onChange={(e) => setPersonData({ ...personData, motherName: e.target.value })}
      placeholder="Magaca Hooyada"
      className="border border-gray-300 p-3 rounded w-full"
      disabled={isSubmitting}
    />
  </div>

  {/* Ku dhashay/tay magaalada */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Ku Dhashay/tay magaalada
      <span className="text-xs text-gray-500 ml-2">laga tegi karo</span>
    </label>
    <Input
      value={personData.birthPlace}
      onChange={(e) => setPersonData({ ...personData, birthPlace: e.target.value })}
      placeholder="Tusaale: Muqdisho"
      className="border border-gray-300 p-3 rounded w-full"
      disabled={isSubmitting}
    />
  </div>

  {/* Sanadka */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Sanadka
      <span className="text-xs text-gray-500 ml-2">laga tegi karo</span>
    </label>
    <Input
      value={personData.birthYear}
      onChange={(e) => setPersonData({ ...personData, birthYear: e.target.value })}
      placeholder="Tusaale: 2001"
      className="border border-gray-300 p-3 rounded w-full"
      disabled={isSubmitting}
    />
  </div>

  {/* Jinsi */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Jinsi
      <span className="text-xs text-gray-500 ml-2">Lab / Dhedig</span>
    </label>
    <select
      value={personData.gender}
      onChange={(e) => setPersonData({ ...personData, gender: e.target.value })}
      className="border border-gray-300 p-3 rounded w-full"
      disabled={isSubmitting}
    >
      <option value="">-- dooro --</option>
      <option value="Male">Lab</option>
      <option value="Female">Dhedig</option>
    </select>
  </div>

  {/* Dagan hadda / Degmada */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Dagan Hadda (Degmada)
      <span className="text-xs text-gray-500 ml-2">laga tegi karo</span>
    </label>
    <Input
      value={personData.address}
      onChange={(e) => setPersonData({ ...personData, address: e.target.value })}
      placeholder="Tusaale: Hodan"
      className="border border-gray-300 p-3 rounded w-full"
      disabled={isSubmitting}
    />
  </div>

  {/* Jinsiyada */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Jinsiyada
    </label>
    <Input
      value={personData.nationality}
      onChange={(e) => setPersonData({ ...personData, nationality: e.target.value })}
      placeholder="-- dooro / qor --"
      className="border border-gray-300 p-3 rounded w-full"
      disabled={isSubmitting}
    />
  </div>

  {/* Aqoonsi */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Aqoonsi
    </label>
    <select
      value={personData.documentType}
      onChange={(e) => setPersonData({ ...personData, documentType: e.target.value })}
      className="border border-gray-300 p-3 rounded w-full"
      disabled={isSubmitting}
    >
      <option value="">-- dooro --</option>
      <option value="Passport">Passport</option>
      <option value="ID Card">ID Card</option>
      <option value="Kaarka Aqoonsiga (NIRA)">Kaarka Aqoonsiga (NIRA)</option>
      <option value="Sugnan">Sugnan</option>
    </select>
  </div>

  {/* Lambarka Aqoonsiga */}
  <div className="col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Lambarka Aqoonsiga
      <span className="text-xs text-gray-500 ml-2">laga tegi karo</span>
    </label>
    <Input
      value={safePersonData.documentNumber}
      onChange={(e) => setPersonData({ ...personData, documentNumber: e.target.value })}
      placeholder="Document Number"
      className="border border-gray-300 p-3 rounded w-full"
      disabled={isSubmitting}
    />
  </div>
</>
        )}

        <div className="col-span-2 flex gap-3 justify-end mt-4">
          <Button
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (isExistingMode === "keydsan" && !selectedExistingPerson) || (isExistingMode === "cusub" && !personData.fullName.trim())}
          >
            {isSubmitting ? (mode === "add" ? "Adding..." : "Updating...") : (mode === "add" ? "Add Person" : "Update Person")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonModal;
import React from "react";
import { formatDate } from "../components/numberToSomaliWords";
import Button from "../components/ui/Button";

const PersonCard = ({
  person,
  index,
  side,
  role,
  showDocumentOptions = false,
  agentDocument,
  onEdit,
  onDelete,
  onRemoveDocument,
  onLinkDocument,
  onViewDetails,
  showViewButton = false,
}) => {
  // Support older shape { docType, docRef } and new shape { wakaalad, tasdiiq }
  const wakaaladRef = agentDocument?.wakaalad || (agentDocument?.docType === "Wakaalad" && agentDocument?.docRef);
  const tasdiiqRef = agentDocument?.tasdiiq || (agentDocument?.docType === "Tasdiiq" && agentDocument?.docRef);


  return (
    <div className="border rounded-lg p-4 mb-4 bg-gray-300 shadow-sm hover:shadow-md transition ">
      <div className="flex justify-between items-start mb-3">
        <div>
       
          {showDocumentOptions && (
            <div className="flex items-center gap-3 mt-1">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Wakiil ka {index + 1}aad
              </span>
              {wakaaladRef && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Has Wakaalad</span>}
              {tasdiiqRef && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Has Tasdiiq</span>}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          
          <Button
            onClick={onEdit} 
            title="Edit Person"
          >
            Edit
          </Button>
         <Button
          onClick={onDelete}
          className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition"
          title="Delete Person"
        >
          Delete
        </Button>

        </div>
      </div>

   <div className="overflow-x-auto">
  <table className="min-w-full border border-gray-300 text-sm">
    <thead className="bg-gray-100 text-left">
      <tr>
        <th className="border px-3 py-2">Magaca</th>
        <th className="border px-3 py-2">Hooyada</th>
  
        <th className="border px-3 py-2">Aqoonsi</th>
        
      </tr>
    </thead>

    <tbody>
      <tr className="hover:bg-gray-50">
        <td className="border px-3 py-2">{person.fullName || "N/A"}</td>
        <td className="border px-3 py-2">{person.motherName || "N/A"}</td>
        <td className="border px-3 py-2">{person.documentType || "N/A"}</td>
        
      </tr>
    </tbody>
  </table>
</div>

      {showDocumentOptions && (
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-bold text-gray-700">Linked Document</h5>
            <div className="flex gap-2">
              {!wakaaladRef && !tasdiiqRef ? (
                <>
                  <Button
                    onClick={() => onLinkDocument && onLinkDocument('Wakaalad')} 
                    title="Link Wakaalad to Agent"
                  >
                    Ku dar wakaalad
                  </Button>
                  <Button 
                    onClick={() => onLinkDocument && onLinkDocument('Tasdiiq')} 
                    title="Link Tasdiiq to Agent"
                  >
                    Ku dar tasdiiq
                  </Button>
                </>
              ) : (
                <>
                  {wakaaladRef && (
                    <button 
                      onClick={() => { 
                        if (window.confirm('Remove Wakaalad from agent?')) onRemoveDocument && onRemoveDocument('Wakaalad'); 
                      }} 
                      className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition"
                    >
                      Remove Wakaalad
                    </button>
                  )}
                  {tasdiiqRef && (
                    <button 
                      onClick={() => { 
                        if (window.confirm('Remove Tasdiiq from agent?')) onRemoveDocument && onRemoveDocument('Tasdiiq'); 
                      }} 
                      className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition"
                    >
                      Remove Tasdiiq
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {wakaaladRef && (
              <div className="bg-gray-50 p-3 rounded border">
                <div className="flex justify-between items-start">
                  <div>
                    <h6 className="font-bold text-green-700">Wakaalad</h6>
                    <div className="text-xs text-gray-500 mt-1">
                     { wakaaladRef?.wakaladType}-{ wakaaladRef?.refNo} - {formatDate( wakaaladRef?.date)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onLinkDocument && onLinkDocument('Wakaalad')} 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Change Wakaalad
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tasdiiqRef && (
              <div className="bg-gray-50 p-3 rounded border">
                <div className="flex justify-between items-start">
                  <div>
                    <h6 className="font-bold text-yellow-700">Tasdiiq</h6>
                    <p className="text-sm text-gray-600">Linked to this agent</p>
                    <div className="text-xs text-gray-500 mt-1">
                     Tasdiiq NUmber {tasdiiqRef?.refNo} - {formatDate( tasdiiqRef?.date)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onLinkDocument && onLinkDocument('Tasdiiq')} 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Change Tasdiiq
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PersonCard);
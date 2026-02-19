import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { addWitness, deleteWitnessAt, updateWitnessAt } from "../api/agreementWitnesses.api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const WitnessesSection = ({ agreement, fetchData }) => {
  const [newWitness, setNewWitness] = useState("");
  const [editWitnessIndex, setEditWitnessIndex] = useState(null);
  const [editWitnessValue, setEditWitnessValue] = useState("");
  
  const witnessInputRef = useRef(null);
  const editWitnessInputRef = useRef(null);

  useEffect(() => {
    if (editWitnessIndex !== null && editWitnessInputRef.current) {
      editWitnessInputRef.current.focus();
    }
  }, [editWitnessIndex]);

const handleWitness = async (operation, index = null) => {
  try {
    const current = agreement?.witnesses || [];

    if (!agreement?._id) {
      toast.error("Agreement ID ma jiro");
      return;
    }

    if (operation === "add") {
      await addWitness(agreement._id, current, newWitness);
      toast.success("Witness added");
      setNewWitness("");
    }

    if (operation === "update") {
      await updateWitnessAt(agreement._id, current, index, editWitnessValue);
      toast.success("Witness updated");
      setEditWitnessIndex(null);
      setEditWitnessValue("");
    }

    if (operation === "delete") {
      await deleteWitnessAt(agreement._id, current, index);
      toast.success("Witness deleted");
    }

    fetchData();
  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      `Error ${operation}ing witness`;

    toast.error(msg);
    console.error(error);
    fetchData();
  }
};

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="font-bold text-xl mb-6">Marqaatiyaasha</h3>
      <div className="mb-6">
        <div className="flex gap-3">
          <input
            ref={witnessInputRef}
            value={newWitness}
            onChange={(e) => setNewWitness(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Marqaati"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newWitness.trim()) {
                handleWitness("add");
              }
            }}
          />
          <Button 
            onClick={() => handleWitness("add")}
            disabled={!newWitness.trim()}
          >
            Ku dar Marqaati
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        {agreement.witnesses?.map((witness, i) => (
          <div key={i} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
            {editWitnessIndex === i ? (
              <div className="flex gap-3 flex-1">
                <Input
                  ref={editWitnessInputRef}
                  value={editWitnessValue}
                  onChange={(e) => setEditWitnessValue(e.target.value)}
                  className="border border-gray-300 p-2 rounded flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Edit witness"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && editWitnessValue.trim()) {
                      handleWitness("update", i);
                    }
                  }}
                />
                <Button 
                  onClick={() => handleWitness("update", i)}
                  disabled={!editWitnessValue.trim()}
                >
                  Save
                </Button>
                <Button 
                  onClick={() => {
                    setEditWitnessIndex(null);
                    setEditWitnessValue("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {i + 1}
                  </span>
                  <span className="font-medium">{witness}</span>
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => {
                      setEditWitnessIndex(i);
                      setEditWitnessValue(witness);
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    onClick={() => handleWitness("delete", i)} 
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
        
        {(!agreement.witnesses || agreement.witnesses.length === 0) && (
          <p className="text-gray-500 italic text-center py-8">No witnesses added</p>
        )}
      </div>
    </div>
  );
};

export default WitnessesSection;
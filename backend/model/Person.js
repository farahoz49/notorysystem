// models/Person.js
import mongoose from 'mongoose';
const personSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  motherName: { type: String,  },
  birthPlace: { type: String,  },
  birthYear: { type: Number,  },
  address: { type: String,  },
  nationality: { type: String, default: 'Somali' },
  phone: { type: String,  unique: true, },
  gender : {type : String , enum :["Male","Female"] , default : "Male"},
  documentType: {   
    type: String, 
    enum:  ["Passport", "ID Card", "Kaarka Aqoonsiga (NIRA)", "Sugnan", "Laysin"], 
    default : "Kaarka Aqoonsiga (NIRA)"
    
  },
  documentNumber: { type: String,  },
  
  createdAt: { type: Date, default: Date.now }
});
const Person = mongoose.model('Person', personSchema);
export default Person;
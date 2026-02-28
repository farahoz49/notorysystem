import Person from "../model/Person.js";
import { uploadBufferToCloudinary } from "../utils/uploadBufferToCloudinary.js";
// CREATE person
export const createPerson = async (req, res) => {
  try {
    const { phone } = req.body;

    // 1) phone check
    const phoneExist = await Person.findOne({ phone });
    if (phoneExist) {
      return res.status(400).json({ message: "Number kan hore ugu jira System ka" });
    }

    // 2) prepare data
    const payload = { ...req.body };

    // 3) if file uploaded -> cloudinary
    if (req.file) {
      const up = await uploadBufferToCloudinary(
        req.file.buffer,
        "persons/documents" // folder
      );

      payload.documentFile = {
        url: up.secure_url,
        mimeType: req.file.mimetype,
        originalName: req.file.originalname,
        size: req.file.size,
      };
    }

    // 4) create
    const person = await Person.create(payload);
    return res.status(201).json(person);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET all persons
export const getPersons = async (req, res) => {
  try {
    const persons = await Person.find().sort({ createdAt: -1 });
    res.json(persons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single person
export const getPersonById = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }
    res.json(person);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE person
export const deletePerson = async (req, res) => {
  try {
    await Person.findByIdAndDelete(req.params.id);
    res.json({ message: "Person deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updatePerson = async (req, res) => {
  try {
    const personId = req.params.id;

    // phone unique check (haddii phone la beddelayo)
    if (req.body.phone) {
      const exists = await Person.findOne({
        phone: req.body.phone,
        _id: { $ne: personId },
      });
      if (exists) {
        return res.status(400).json({ message: "Number kan hore ugu jira System ka" });
      }
    }

    const payload = { ...req.body };

    // ✅ haddii file cusub la keenay
    if (req.file) {
      const up = await uploadBufferToCloudinary(req.file.buffer, "persons/documents");
      payload.documentFile = {
        url: up.secure_url,
        mimeType: req.file.mimetype,
        originalName: req.file.originalname,
        size: req.file.size,
      };
    }

    const person = await Person.findByIdAndUpdate(personId, payload, { new: true });

    if (!person) return res.status(404).json({ message: "Person not found" });

    return res.json(person);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// ✅ SEARCH PERSONS
export const searchsuggestion = async (req, res) => {
  try {
    const { q } = req.query;
    const persons = await Person.find({
      $or: [
        { fullName: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);
    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
import Agreement from "../model/Agreement.js";
import mongoose from "mongoose";
import Wakaalad from "../model/Wakaalad.js";
import Tasdiiq from "../model/Tasdiiq.js";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";

/* ===============================
   HELPER: GENERATE REF NO
   Format: 001/BQL/2026
================================ */
// const generateRefNo = async () => {
//   const year = new Date().getFullYear();

//   const lastAgreement = await Agreement.findOne({
//     refNo: new RegExp(`/${year}$`),
//   }).sort({ createdAt: -1 });

//   let nextNumber = 1;
//   if (lastAgreement) {
//     const lastNum = parseInt(lastAgreement.refNo.split("/")[0]);
//     nextNumber = lastNum + 1;
//   }

//   return `${String(nextNumber).padStart(3, "0")}/BQL/${year}`;
  
// };

const generateRefNo = async () => {
  const year = new Date().getFullYear();

  const docs = await Agreement.find(
    { refNo: { $regex: `/BQL/${year}$` } },
    { refNo: 1, _id: 0 }
  );

  const nums = docs
    .map((d) => parseInt(String(d.refNo).split("/")[0], 10))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);

  const set = new Set(nums);

  // ✅ Find smallest missing positive number
  let nextNumber = 1;
  while (set.has(nextNumber)) nextNumber++;

  return `${String(nextNumber).padStart(3, "0")}/BQL/${year}`;
};
/* ===============================
   GET AGREEMENT BY ID - SIMPLIFY POPULATE
================================ */
export const getAgreementById = async (req, res) => {
  try {
    const agreement = await Agreement.findById(req.params.id)
      .populate("dhinac1.sellers")
      .populate("dhinac1.agents")
      .populate("dhinac2.buyers")
      .populate("dhinac2.agents")
      .populate("dhinac2.guarantors")
      .populate("serviceRef")   // <-- Halkan ku dar

      .populate("createdBy", "username");

    // Populate per-agent documents (agentDocuments map)
    if (agreement) {
      const populateAgentDocs = async (side) => {
        const map = agreement[side]?.agentDocuments;
        if (!map) return;
        // convert Map to plain object
        const entries = map instanceof Map ? Object.fromEntries(map) : map;
        for (const [agentId, docs] of Object.entries(entries)) {
          if (docs?.wakaalad) {
            try {
              const waka = await Wakaalad.findById(docs.wakaalad);
              entries[agentId].wakaalad = waka || docs.wakaalad;
            } catch (e) {
              console.error('Failed to populate wakaalad for agent', agentId, e);
            }
          }
          if (docs?.tasdiiq) {
            try {
              const tas = await Tasdiiq.findById(docs.tasdiiq);
              entries[agentId].tasdiiq = tas || docs.tasdiiq;
            } catch (e) {
              console.error('Failed to populate tasdiiq for agent', agentId, e);
            }
          }
        }
        agreement[side].agentDocuments = entries;
      };

      await populateAgentDocs('dhinac1');
      await populateAgentDocs('dhinac2');
    }

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    res.json(agreement);
  } catch (error) {
    console.error("Error getting agreement:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET ALL AGREEMENTS - SIMPLIFY POPULATE
================================ */
export const getAgreements = async (req, res) => {
  try {
    const agreements = await Agreement.find()
      .populate("dhinac1.sellers")
      .populate("dhinac1.agents")
      .populate("dhinac2.buyers")
      .populate("dhinac2.agents")
      .populate("dhinac2.guarantors")


      .populate("serviceRef")   // <-- Halkan ku dar

      .populate("createdBy", "username");

    // Populate per-agent documents for each agreement
    for (let agreement of agreements) {
      const populateAgentDocs = async (side) => {
        const map = agreement[side]?.agentDocuments;
        if (!map) return;
        const entries = map instanceof Map ? Object.fromEntries(map) : map;
        for (const [agentId, docs] of Object.entries(entries)) {
          if (docs?.wakaalad) {
            try {
              const waka = await Wakaalad.findById(docs.wakaalad);
              entries[agentId].wakaalad = waka || docs.wakaalad;
            } catch (e) {
              console.error('Failed to populate wakaalad for agent', agentId, e);
            }
          }
          if (docs?.tasdiiq) {
            try {
              const tas = await Tasdiiq.findById(docs.tasdiiq);
              entries[agentId].tasdiiq = tas || docs.tasdiiq;
            } catch (e) {
              console.error('Failed to populate tasdiiq for agent', agentId, e);
            }
          }
        }
        agreement[side].agentDocuments = entries;
      };

      await populateAgentDocs('dhinac1');
      await populateAgentDocs('dhinac2');
    }

    res.json(agreements);
  } catch (error) {
    console.error("Error getting agreements:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   UPDATE AGREEMENT - SIMPLIFY POPULATE
================================ */
export const updateAgreement = async (req, res) => {
  try {
    const agreement = await Agreement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("dhinac1.sellers")
      .populate("dhinac1.agents")
      .populate("dhinac2.buyers")
      .populate("dhinac2.agents")
      .populate("dhinac2.guarantors")
      .populate("serviceRef")

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    // Populate per-agent documents (agentDocuments map)
    if (agreement) {
      const populateAgentDocs = async (side) => {
        const map = agreement[side]?.agentDocuments;
        if (!map) return;
        const entries = map instanceof Map ? Object.fromEntries(map) : map;
        for (const [agentId, docs] of Object.entries(entries)) {
          if (docs?.wakaalad) {
            try {
              const waka = await Wakaalad.findById(docs.wakaalad);
              entries[agentId].wakaalad = waka || docs.wakaalad;
            } catch (e) {
              console.error('Failed to populate wakaalad for agent', agentId, e);
            }
          }
          if (docs?.tasdiiq) {
            try {
              const tas = await Tasdiiq.findById(docs.tasdiiq);
              entries[agentId].tasdiiq = tas || docs.tasdiiq;
            } catch (e) {
              console.error('Failed to populate tasdiiq for agent', agentId, e);
            }
          }
        }
        agreement[side].agentDocuments = entries;
      };

      await populateAgentDocs('dhinac1');
      await populateAgentDocs('dhinac2');
    }

    res.json(agreement);
  } catch (error) {
    console.error("Error updating agreement:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   CREATE AGREEMENT
================================ */
export const createAgreement = async (req, res) => {
  try {
    const refNo = await generateRefNo();

    const agreement = await Agreement.create({
      ...req.body,
      refNo,
      createdBy: req.user._id,
    });

    // Populate after creation
    const populatedAgreement = await Agreement.findById(agreement._id)
      .populate("dhinac1.sellers")
      .populate("dhinac1.agents")
      .populate("dhinac2.buyers")
      .populate("dhinac2.agents")
      .populate("dhinac2.guarantors")
      .populate("serviceRef")
      .populate("createdBy", "username");

    // populate any agentDocuments on the created agreement
    if (populatedAgreement) {
      const populateAgentDocs = async (side) => {
        const map = populatedAgreement[side]?.agentDocuments;
        if (!map) return;
        const entries = map instanceof Map ? Object.fromEntries(map) : map;
        for (const [agentId, docs] of Object.entries(entries)) {
          if (docs?.wakaalad) {
            try {
              const waka = await Wakaalad.findById(docs.wakaalad);
              entries[agentId].wakaalad = waka || docs.wakaalad;
            } catch (e) {
              console.error('Failed to populate wakaalad for agent', agentId, e);
            }
          }
          if (docs?.tasdiiq) {
            try {
              const tas = await Tasdiiq.findById(docs.tasdiiq);
              entries[agentId].tasdiiq = tas || docs.tasdiiq;
            } catch (e) {
              console.error('Failed to populate tasdiiq for agent', agentId, e);
            }
          }
        }
        populatedAgreement[side].agentDocuments = entries;
      };

      await populateAgentDocs('dhinac1');
      await populateAgentDocs('dhinac2');
    }

    res.status(201).json(populatedAgreement);
  } catch (error) {
    console.error("Error creating agreement:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Duplicate refNo" });
    }
    res.status(500).json({ message: error.message });
  }
};
export const addImagesToAgreementCloudinary = async (req, res) => {
  try {
    const { agreementId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const uploads = await Promise.all(
      req.files.map((f) =>
        uploadBufferToCloudinary(f.buffer, `agreements/${agreementId}`)
      )
    );

    const urls = uploads.map((u) => u.secure_url);

    return res.json({ urls }); // ✅ kaliya urls
  } catch (error) {
    console.error("upload cloudinary error:", error);
    return res.status(500).json({ message: error.message });
  }
};
export const addImageMetaToAgreement = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { url, description = "" } = req.body;

    if (!url) return res.status(400).json({ message: "url is required" });

    const agreement = await Agreement.findByIdAndUpdate(
      agreementId,
      { $push: { images: { url, description } } },
      { new: true }
    );

    if (!agreement) return res.status(404).json({ message: "Agreement not found" });

    return res.json({ message: "Image saved", agreement });
  } catch (error) {
    console.error("addImageMetaToAgreement error:", error);
    return res.status(500).json({ message: error.message });
  }
};
export const removeAgreementImage = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) return res.status(400).json({ message: "imageUrl is required" });

    const agreement = await Agreement.findByIdAndUpdate(
      agreementId,
      { $pull: { images: imageUrl } },
      { new: true }
    );

    if (!agreement) return res.status(404).json({ message: "Agreement not found" });

    return res.json({ message: "Image removed", agreement });
  } catch (error) {
    console.error("removeAgreementImage error:", error);
    return res.status(500).json({ message: error.message });
  }
};
export const deleteAgreementImage = async (req, res) => {
  try {
    const { agreementId, imageId } = req.params;

    const agreement = await Agreement.findByIdAndUpdate(
      agreementId,
      { $pull: { images: { _id: imageId } } },
      { new: true }
    );

    if (!agreement) return res.status(404).json({ message: "Agreement not found" });

    return res.json({ message: "Image deleted", agreement });
  } catch (error) {
    console.error("deleteAgreementImage error:", error);
    return res.status(500).json({ message: error.message });
  }
};


/* =====================================================
   ADD PERSON (SELLER / BUYER / AGENT / GUARANTOR)
===================================================== */
export const addPersonToAgreement = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { side, role, personId } = req.body;

    console.log("Adding person:", { agreementId, side, role, personId });

    if (!["dhinac1", "dhinac2"].includes(side)) {
      return res.status(400).json({ message: "Invalid side" });
    }

    // Validate personId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(personId)) {
      return res.status(400).json({ message: "Invalid person ID" });
    }

    const allowedRoles =
      side === "dhinac1"
        ? ["sellers", "agents"]
        : ["buyers", "agents", "guarantors"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const agreement = await Agreement.findByIdAndUpdate(
      agreementId,
      { $addToSet: { [`${side}.${role}`]: personId } },
      { new: true }
    )
      .populate("dhinac1.sellers")
      .populate("dhinac1.agents")
      .populate("dhinac2.buyers")
      .populate("dhinac2.agents")
      .populate("dhinac2.guarantors");

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    // Populate any per-agent agentDocuments map entries
    const populateAgentDocs = async (side) => {
      const map = agreement[side]?.agentDocuments;
      if (!map) return;
      const entries = map instanceof Map ? Object.fromEntries(map) : map;
      for (const [agentId, docs] of Object.entries(entries)) {
        if (docs?.wakaalad) {
          try {
            const waka = await Wakaalad.findById(docs.wakaalad);
            entries[agentId].wakaalad = waka || docs.wakaalad;
          } catch (e) {
            console.error('Failed to populate wakaalad for agent', agentId, e);
          }
        }
        if (docs?.tasdiiq) {
          try {
            const tas = await Tasdiiq.findById(docs.tasdiiq);
            entries[agentId].tasdiiq = tas || docs.tasdiiq;
          } catch (e) {
            console.error('Failed to populate tasdiiq for agent', agentId, e);
          }
        }
      }
      agreement[side].agentDocuments = entries;
    };

    await populateAgentDocs('dhinac1');
    await populateAgentDocs('dhinac2');

    res.json(agreement);
  } catch (error) {
    console.error("Error adding person:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   REMOVE PERSON
===================================================== */
export const removePersonFromAgreement = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { side, role, personId } = req.body;

    console.log("Removing person:", { agreementId, side, role, personId });

    if (!mongoose.Types.ObjectId.isValid(personId)) {
      return res.status(400).json({ message: "Invalid person ID" });
    }

    const agreement = await Agreement.findByIdAndUpdate(
      agreementId,
      { $pull: { [`${side}.${role}`]: personId } },
      { new: true }
    )
      .populate("dhinac1.sellers")
      .populate("dhinac1.agents")
      .populate("dhinac2.buyers")
      .populate("dhinac2.agents")
      .populate("dhinac2.guarantors");

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    // Handle agentDocument populate separately
    if (agreement.dhinac1?.agentDocument?.docRef) {
      const docType = agreement.dhinac1.agentDocument.docType;

      if (docType === "Wakaalad") {
        await agreement.populate({
          path: "dhinac1.agentDocument.docRef",
          model: "Wakaalad"
        });
      } else if (docType === "Tasdiiq") {
        await agreement.populate({
          path: "dhinac1.agentDocument.docRef",
          model: "Tasdiiq"
        });
      }
    }

    res.json(agreement);
  } catch (error) {
    console.error("Error removing person:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   SET AGENT DOCUMENT (Wakaalad / Tasdiiq)
===================================================== */
export const setAgentDocument = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { docType, docRef } = req.body;

    console.log("Setting agent document:", { agreementId, docType, docRef });

    if (!["Wakaalad", "Tasdiiq"].includes(docType)) {
      return res.status(400).json({ message: "Invalid docType" });
    }

    if (!mongoose.Types.ObjectId.isValid(docRef)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }

    const agreement = await Agreement.findByIdAndUpdate(
      agreementId,
      { "dhinac1.agentDocument": { docType, docRef } },
      { new: true }
    )
      .populate("dhinac1.sellers")
      .populate("dhinac1.agents")
      .populate("dhinac2.buyers")
      .populate("dhinac2.agents")
      .populate("dhinac2.guarantors");

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    // Populate the document based on its type
    if (docType === "Wakaalad") {
      await agreement.populate({
        path: "dhinac1.agentDocument.docRef",
        model: "Wakaalad"
      });
    } else if (docType === "Tasdiiq") {
      await agreement.populate({
        path: "dhinac1.agentDocument.docRef",
        model: "Tasdiiq"
      });
    }

    res.json(agreement);
  } catch (error) {
    console.error("Error setting agent document:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   DELETE AGREEMENT
================================ */
export const deleteAgreement = async (req, res) => {
  try {
    const agreement = await Agreement.findByIdAndDelete(req.params.id);

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    res.json({ message: "Agreement deleted successfully" });
  } catch (error) {
    console.error("Error deleting agreement:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET NEXT REF NO
================================ */
export const getNextRefNo = async (req, res) => {
  try {
    const refNo = await generateRefNo();
    res.json({ refNo });
  } catch (error) {
    console.error("Error getting next ref no:", error);
    res.status(500).json({ message: error.message });
  }
};
// GET /api/agreements/missing-refnos?year=2026
export const getMissingRefNos = async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();

    const docs = await Agreement.find(
      { refNo: { $regex: `/BQL/${year}$` } },
      { refNo: 1, _id: 0 }
    );

    const nums = docs
      .map((d) => parseInt(String(d.refNo).split("/")[0], 10))
      .filter((n) => Number.isFinite(n))
      .sort((a, b) => a - b);

    const max = nums[nums.length - 1] || 0;

    const set = new Set(nums);
    const missing = [];
    for (let i = 1; i <= max; i++) {
      if (!set.has(i)) missing.push(i);
    }

    // format: ["001","008","018"]
    const formatted = missing.map((n) => String(n).padStart(3, "0"));

    return res.json({
      year,
      max,
      total: nums.length,
      missing: formatted,
    });
  } catch (error) {
    console.error("getMissingRefNos error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAgreementsReport = async (req, res) => {
  try {
    const isAdmin = req.user?.role === "ADMIN";

    const {
      from,          // YYYY-MM-DD (required)
      to,            // YYYY-MM-DD (required)
      service = "all",     // all | Wareejin | Wakaalad | Caddeyn | Damaanad | Heshiisyo
      createdBy = "all",   // admin only: all | userId
    } = req.query;

    // ✅ Haddii date la waayo, ha soo celin wax (si frontend table empty u ahaato)
    if (!from || !to) {
      return res.json({ rows: [], totals: { officeFee: 0 } });
    }

    const start = new Date(from);
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);

    const filter = {
      agreementDate: { $gte: start, $lte: end },
    };

    // ✅ Service filter
    if (service && service !== "all") {
      filter.service = service;
    }

    // ✅ createdBy rules
    if (!isAdmin) {
      filter.createdBy = req.user._id; // user -> own only
    } else {
      // admin
      if (createdBy && createdBy !== "all") {
        filter.createdBy = createdBy;
      }
      // haddii createdBy=all => waxba ha qaban (all users)
    }

    const agreements = await Agreement.find(filter)
      .populate("dhinac1.sellers", "fullName")
      .populate("dhinac2.buyers", "fullName")
      .populate("createdBy", "username")
      .sort({ agreementDate: 1 });

    const rows = agreements.map((a) => {
      const daraf1 =
        (a?.dhinac1?.sellers || []).map((p) => p.fullName).filter(Boolean).join(", ") || "N/A";
      const daraf2 =
        (a?.dhinac2?.buyers || []).map((p) => p.fullName).filter(Boolean).join(", ") || "N/A";

      return {
        _id: a._id,
        refNo: a.refNo,
        service: a.service,
        officeFee: Number(a.officeFee || 0),
        daraf1,
        daraf2,
        taariikh: a.agreementDate,
        createdBy: a?.createdBy?.username || "",
      };
    });

    const totals = rows.reduce(
      (acc, r) => {
        acc.officeFee += r.officeFee;
        return acc;
      },
      { officeFee: 0 }
    );

    return res.json({ rows, totals });
  } catch (error) {
    console.error("getAgreementsReport error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAgreementsCurrentMonth = async (req, res) => {
  try {
    const tz = "Africa/Mogadishu"; // ✅ +03
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const agreements = await Agreement.find({
      $expr: {
        $eq: [
          {
            $dateToString: {
              format: "%Y-%m",
              date: "$agreementDate",
              timezone: tz,
            },
          },
          ym,
        ],
      },
    })
      .sort({ agreementDate: -1 })
      .populate("dhinac1.sellers")
      .populate("dhinac1.agents")
      .populate("dhinac2.buyers")
      .populate("dhinac2.agents")
      .populate("dhinac2.guarantors")
      .populate("serviceRef")
      .populate("createdBy", "username");

    res.json(agreements);
  } catch (error) {
    console.error("Error getting current month agreements:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardCurrentMonth = async (req, res) => {
  try {
    const tz = "Africa/Mogadishu";
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const agreements = await Agreement.find({
      $expr: {
        $eq: [
          {
            $dateToString: {
              format: "%Y-%m",
              date: "$agreementDate",
              timezone: tz,
            },
          },
          ym,
        ],
      },
    })
      .sort({ agreementDate: -1 })
      .select("refNo service officeFee agreementDate createdBy")
      .populate("createdBy", "username");

    const totalFee = agreements.reduce((s, a) => s + Number(a.officeFee || 0), 0);

    const services = ["Wareejin", "Wakaalad", "Damaanad", "Caddeyn", "Heshiisyo", "Rahan"];
    const serviceData = services.map((name) => ({
      name,
      value: agreements.filter((a) => a.service === name).length,
    }));

    res.json({
      month: ym,
      totals: { totalFee, totalAgreements: agreements.length },
      serviceData,
      latest: agreements.slice(0, 5),
    });
  } catch (error) {
    console.error("Error dashboard current month:", error);
    res.status(500).json({ message: error.message });
  }
};
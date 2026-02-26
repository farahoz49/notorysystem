import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
} from "docx";

import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import {
  uploadAgreementImages,
  saveAgreementImageMeta,
  deleteAgreementImage,
} from "../api/agreements.api";

// ✅ docx supports only: png | jpeg | gif | bmp
const getImageTypeFromUrl = (url = "") => {
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".png")) return "png";
  if (clean.endsWith(".jpg")) return "jpeg";   // ✅ changed
  if (clean.endsWith(".jpeg")) return "jpeg";
  if (clean.endsWith(".gif")) return "gif";
  if (clean.endsWith(".bmp")) return "bmp";
  return "png";
};

const blobToUint8Array = async (blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
};

const urlToUint8ArrayAndType = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Image fetch failed");
  const blob = await res.blob();

  // ✅ normalize types for docx
  let type = "png";
  if (blob.type?.includes("png")) type = "png";
  else if (blob.type?.includes("jpeg") || blob.type?.includes("jpg")) type = "jpeg"; // ✅ changed
  else if (blob.type?.includes("gif")) type = "gif";
  else if (blob.type?.includes("bmp")) type = "bmp";
  else type = getImageTypeFromUrl(url);

  return { data: await blobToUint8Array(blob), type };
};

const hiddenBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

const ImagesSection = ({ agreement, fetchData }) => {
  const [open, setOpen] = useState(false);

  // ✅ expects images = [{ _id, url, description }]
  const images = useMemo(() => agreement?.images || [], [agreement]);

  const downloadWordImages = async () => {
    try {
      if (!images.length) return toast.error("Sawir ma jiro");

      const rows = [];

      for (let i = 0; i < images.length; i += 2) {
        const L = images[i];
        const R = images[i + 1];

        const left = L?.url ? await urlToUint8ArrayAndType(L.url) : null;
        const right = R?.url ? await urlToUint8ArrayAndType(R.url) : null;

        const leftCell = new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          borders: hiddenBorders,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: (L?.description || `SAWIR ${i + 1}`).toUpperCase(),
                  bold: true,
                  size: 22,
                  font: "Times New Roman",
                }),
              ],
            }),
            left
              ? new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new ImageRun({
                      data: left.data,
                      type: left.type, // ✅ auto type
                      transformation: { width: 240, height: 240 },
                    }),
                  ],
                })
              : new Paragraph(""),
          ],
        });

        const rightCell = new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          borders: hiddenBorders,
          children: R
            ? [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: (R?.description || `SAWIR ${i + 2}`).toUpperCase(),
                      bold: true,
                      size: 22,
                      font: "Times New Roman",
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new ImageRun({
                      data: right.data,
                      type: right.type, // ✅ auto type
                      transformation: { width: 240, height: 240 },
                    }),
                  ],
                }),
              ]
            : [new Paragraph("")],
        });

        rows.push(new TableRow({ children: [leftCell, rightCell] }));
      }

      const doc = new Document({
        sections: [
          {
            children: [
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows,
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${agreement?.refNo || "agreement"}-sawiro.docx`);
      toast.success("Word waa la soo dejiyey ✅");
    } catch (e) {
      toast.error(e?.message || "Word export failed");
      console.error(e);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-xl">Sawirada</h3>
          <p className="text-sm text-gray-500">
            {images.length} sawir(yo) ayaa jira
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={downloadWordImages} disabled={!images.length}>
            Download Word
          </Button>
          <Button onClick={() => setOpen(true)}>+ ku dar</Button>
        </div>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-5 gap-4">
          {images.map((img, i) => (
            <ImageCard
              key={img?._id || img?.url || i}
              img={img}
              index={i}
              agreementId={agreement?._id}
              onRefresh={fetchData}
            />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center text-gray-500 italic">
          Wali sawir lama gelin
        </div>
      )}

      <AddImageModal
        open={open}
        onClose={() => setOpen(false)}
        agreementId={agreement?._id}
        onSaved={fetchData}
      />
    </div>
  );
};
const ImageCard = ({ img, index, agreementId, onRefresh }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      if (!agreementId) return toast.error("Agreement ID ma jiro");
      if (!img?._id) return toast.error("imageId ma jiro");

      setLoading(true);
      await deleteAgreementImage(agreementId, img._id);
      toast.success("Sawirka waa la tirtiray ✅");
      onRefresh?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group">
      <a href={img?.url} target="_blank" rel="noreferrer">
        <img
          src={img?.url}
          alt={`img-${index}`}
          className="w-full h-72 object-contain  rounded-lg"
        />
      </a>

      {/* Delete button hover */}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition"
      >
        {loading ? "..." : "Tirtir"}
      </button>
    </div>
  );
};

const AddImageModal = ({ open, onClose, agreementId, onSaved }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const clear = () => {
    setFile(null);
    setDescription("");
  };

  const handleSave = async () => {
    try {
      if (!agreementId) return toast.error("Agreement ID ma jiro");
      if (!file) return toast.error("Sawir dooro");
      if (!description.trim()) return toast.error("Faahfaahin qor");

      if (!file.type?.startsWith("image/")) {
        return toast.error("Fadlan kaliya image dooro");
      }

      setLoading(true);

      // ✅ Upload endpoint returns { urls: [] }
      const up = await uploadAgreementImages(agreementId, [file]);
      const url = up?.urls?.[0];
      if (!url) throw new Error("Upload url lama helin");

      // ✅ Save meta endpoint
      await saveAgreementImageMeta(agreementId, { url, description });

      toast.success("Waa la keydiyay ✅");
      clear();
      onSaved?.();
      onClose?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Save failed");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <Modal open={open} onClose={onClose} title="Xogta Shaqada" closeOnBackdrop={!loading}>
      <div className="grid gap-4">
        <div className="grid grid-cols-3 items-center gap-3">
          <label className="text-sm text-gray-700">Sawirka</label>
          <div className="col-span-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 items-start gap-3">
          <label className="text-sm text-gray-700 mt-2">Faahfaahin</label>
          <div className="col-span-2">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[110px] border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-black"
              placeholder="Ku qor faahfaahin..."
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Keydinaya..." : "Keydi"}
          </Button>
          <Button
            onClick={() => {
              clear();
              onClose?.();
            }}
            disabled={loading}
          >
            Xir
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ImagesSection;
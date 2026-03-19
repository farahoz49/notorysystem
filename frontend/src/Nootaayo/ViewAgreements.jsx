import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import { getAgreements, searchAgreements } from "../api/reception.api";
import { deleteAgreement } from "../api/agreements.api";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { formatDatewithname  } from "../helpers/formatDate";

const selectClass =
  "px-4 py-2.5 rounded-xl border border-black/20 bg-white text-black shadow-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-black focus:border-black";

const LIMIT_OPTIONS = [5, 10, 15, 25, 50, 100];

const ViewAgreements = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "ADMIN";

  const [agreements, setAgreements] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
    range: "all",
  });

  // filters
  const [searchBy, setSearchBy] = useState("refNo");
  const [searchInput, setSearchInput] = useState("");
  const [searchText, setSearchText] = useState(""); // actual applied search
  const [range, setRange] = useState("today"); // today|week|month|all
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

const fetchData = async () => {
  try {
    setLoading(true);

    const hasSearch = searchText.trim().length > 0;

    const res = hasSearch
      ? await searchAgreements({
          range: "all",          // ✅ SEARCH ignores Goorta
          page,
          limit,
          searchBy,
          searchText,
        })
      : await getAgreements({
          range,                 // ✅ list only uses Goorta
          page,
          limit,
        });

    setAgreements(res?.data || []);
    setMeta(res?.meta || {});
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to fetch agreements");
  } finally {
    setLoading(false);
  }
};

  // refetch on changes
 useEffect(() => {
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [page, limit, searchBy, searchText, range]);
  // Search button / enter
  const handleSearch = () => {
    setSearchText(searchInput.trim());
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchText("");
    setPage(1);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Ma hubtaa inaad delete gareynayso heshiiskan?")) return;
    try {
      await deleteAgreement(id);
      toast.success("Agreement deleted");
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete agreement");
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-5 mb-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black">Agreements</h2>
          </div>

          <div className="text-sm text-gray-700">
            {loading ? (
              <span>Loading...</span>
            ) : (
              <>
                <span className="font-semibold text-black">{meta?.total || 0}</span>{" "}
                diiwaan ayaa la helay.
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-5 mb-5">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Search By</label>
            <select
              value={searchBy}
              onChange={(e) => {
                setSearchBy(e.target.value);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="refNo">Ref No</option>
              <option value="ujeedo">Ujeeddo</option>
              <option value="seller">Darafka Kowaad (Seller)</option>
              <option value="buyer">Darafka Labaad (Buyer)</option>
            </select>
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Search</label>
            <Input
              type="text"
              placeholder="Qor wax aad raadinayso..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSearch} className="px-7">
              Search
            </Button>
            <Button onClick={clearSearch} variant="secondary" className="px-7">
              Clear
            </Button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Goorta</label>
            <select
              value={range}
              onChange={(e) => {
                setRange(e.target.value);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="all">Dhammaan</option>
              <option value="today">Maanta</option>
              <option value="week">Isbuucan</option>
              <option value="month">Bishan</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Bogiba</label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className={selectClass}
            >
              {LIMIT_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* show active search */}
        {searchText && (
          <div className="mt-3 text-sm text-gray-700">
            Search: <span className="font-semibold text-black">{searchText}</span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3 text-left whitespace-nowrap">Ref No</th>
                <th className="p-3 text-left whitespace-nowrap">Ujeeddo</th>
                <th className="p-3 text-left whitespace-nowrap">Darafka Kowaad</th>
                <th className="p-3 text-left whitespace-nowrap">Darafka Labaad</th>
                <th className="p-3 text-left whitespace-nowrap">Taarikh</th>
                {isAdmin && <th className="p-3 text-left whitespace-nowrap">Actions</th>}
              </tr>
            </thead>

            <tbody>
              {agreements.map((a) => (
                <tr key={a._id} className="border-t border-black/10 hover:bg-black/5">
                  <td className="p-3">
                    <Link
                      to={`/agreement/${a._id}`}
                      className="font-semibold text-black underline underline-offset-4 hover:opacity-80"
                    >
                      {a.refNo}
                    </Link>
                  </td>

                  <td className="p-3">
                    <span className="font-medium text-black">
                      {a.agreementType} {a.serviceType}
                    </span>
                  </td>

                  <td className="p-3 text-gray-700">
                    {a.dhinac1?.sellers?.map((s) => s.fullName).join(", ") || ""}
                  </td>

                  <td className="p-3 text-gray-700">
                    {a.dhinac2?.buyers?.map((b) => b.fullName).join(", ") || ""}
                  </td>

                  <td className="p-3 text-gray-700">{formatDatewithname(a.agreementDate)}</td>

                  {isAdmin && (
                    <td className="p-3">
                      <Button
                        variant="danger"
                        className="px-4 py-2 rounded-xl"
                        onClick={() => handleDelete(a._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  )}
                </tr>
              ))}

              {!loading && agreements.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="text-center p-6 text-gray-500">
                    lama helin wax xog ah
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between p-4 border-t border-black/10">
          <span className="text-sm text-gray-700">
            Page <span className="font-semibold text-black">{meta?.page || 1}</span> of{" "}
            <span className="font-semibold text-black">{meta?.totalPages || 1}</span>
          </span>

          <div className="flex gap-2">
            <button
              disabled={!meta?.hasPrev || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl border border-black/20 bg-white text-black hover:bg-black hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <button
              disabled={!meta?.hasNext || loading}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-xl border border-black/20 bg-white text-black hover:bg-black hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAgreements;
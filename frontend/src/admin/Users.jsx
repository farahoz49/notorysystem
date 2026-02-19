// src/pages/Users.jsx
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  getUsers,
  registerUser,
  updateUserById,
  deleteUserById,
  approveUserById,
  deactivateUserById,
} from "../api/Users.api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // query states
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  // selected (bulk)
  const [selectedIds, setSelectedIds] = useState([]);

  // simple modal-ish form states
  const [mode, setMode] = useState(null); // null | "add" | "edit"
  const [selectedUser, setSelectedUser] = useState(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    role: "USER",
    status: "active",
    password: "",
    confirmPassword: "",
  });

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.status === "active").length,
      inactive: users.filter((u) => u.status === "inactive").length,
      admin: users.filter((u) => u.role === "ADMIN").length,
      user: users.filter((u) => u.role === "USER").length,
    };
  }, [users]);

  const fetchUsers = async (page = pagination.page) => {
    try {
      setLoading(true);
      const params = { page, limit: pagination.limit, search, sort, order };
      const data = await getUsers(params);

      setUsers(data?.data || []);
      if (data?.pagination) setPagination(data.pagination);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sort, order]);

  // helpers
  const resetForm = () =>
    setForm({
      username: "",
      email: "",
      phone: "",
      role: "USER",
      status: "active",
      password: "",
      confirmPassword: "",
    });

  const openAdd = () => {
    resetForm();
    setSelectedUser(null);
    setMode("add");
  };

  const openEdit = (u) => {
    setSelectedUser(u);
    setForm({
      username: u.username || "",
      email: u.email || "",
      phone: u.phone || "",
      role: u.role || "USER",
      status: u.status || "active",
      password: "",
      confirmPassword: "",
    });
    setMode("edit");
  };

  const validateAdd = () => {
    if (!form.username.trim()) return "Username is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.phone.trim()) return "Phone is required";
    if (!form.password) return "Password is required";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return null;
  };

  const validateEdit = () => {
    if (!form.username.trim()) return "Username is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.phone.trim()) return "Phone is required";
    return null;
  };

  // actions
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "add") {
        const err = validateAdd();
        if (err) return toast.error(err);

        const payload = {
          username: form.username,
          email: form.email,
          phone: form.phone,
          role: form.role,
          status: "active",
          password: form.password,
        };

        const res = await registerUser(payload);
        toast.success(res?.message || "User created");
        setMode(null);
        resetForm();
        fetchUsers(1);
      }

      if (mode === "edit" && selectedUser?._id) {
        const err = validateEdit();
        if (err) return toast.error(err);

        const payload = {
          username: form.username,
          email: form.email,
          phone: form.phone,
          role: form.role,
          status: form.status,
        };

        const res = await updateUserById(selectedUser._id, payload);
        toast.success(res?.message || "User updated");
        setMode(null);
        setSelectedUser(null);
        fetchUsers(pagination.page);
      }
    } catch (e2) {
      toast.error(e2?.response?.data?.message || "Request failed");
    }
  };

  const onDelete = async (u) => {
    if (!window.confirm(`Delete ${u.username}?`)) return;
    try {
      const res = await deleteUserById(u._id);
      toast.success(res?.message || "User deleted");
      fetchUsers(pagination.page);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  const onBulkDelete = async () => {
    if (selectedIds.length === 0) return toast.error("Select users first");
    if (!window.confirm(`Delete ${selectedIds.length} users?`)) return;

    try {
      await Promise.all(selectedIds.map((id) => deleteUserById(id)));
      toast.success("Deleted successfully");
      setSelectedIds([]);
      fetchUsers(pagination.page);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Bulk delete failed");
    }
  };

  const onApprove = async (id) => {
    try {
      const res = await approveUserById(id);
      toast.success(res?.message || "Activated");
      fetchUsers(pagination.page);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Activate failed");
    }
  };

  const onDeactivate = async (id) => {
    try {
      const res = await deactivateUserById(id);
      toast.success(res?.message || "Deactivated");
      fetchUsers(pagination.page);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Deactivate failed");
    }
  };

  const toggleOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === users.length) setSelectedIds([]);
    else setSelectedIds(users.map((u) => u._id));
  };

  const changePage = (p) => {
    if (p < 1 || p > pagination.pages) return;
    setPagination((prev) => ({ ...prev, page: p }));
    fetchUsers(p);
  };

  return (
    <div className="p-6">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <div>
        
        </div>
        <div className="flex gap-2">
      
          <Button
            onClick={openAdd}
          >
            + Add User
          </Button>
        </div>
      </div>

  

      {/* table */}
      <div className="border rounded overflow-x-auto bg-white">
        

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : users.length === 0 ? (
          <div className="p-3 text-center text-gray-500">No users found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm">
               
                <th className="p-2">#</th>
                <th className="p-2">Username</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Role</th>
                <th className="p-2">Status</th>
                <th className="p-2 ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u ,index) => (
                <tr key={u._id} className="border-t text-sm">
             
                  <td className="p-2 font-medium">{index+1}</td>
                  <td className="p-2 font-medium">{u.username}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.phone}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">{u.status}</td>
                  <td className="p-2 flex flex-wrap gap-3">
                    <Button
                      onClick={() => openEdit(u)}
                  
                    >
                      Edit
                    </Button>

                    {u.status === "inactive" ? (
                      <Button
                        onClick={() => onApprove(u._id)}
                            className="px-3 py-1 rounded bg-green-600 text-white"
                      >
                        Activate
                      </Button>
                    ) : (
                      <Button
                        onClick={() => onDeactivate(u._id)}
                            className="px-3 py-1 rounded bg-yellow-500 text-black"
                      >
                        inactive
                      </Button>
                    )}

                   <Button
  onClick={() => u.role !== "ADMIN" && onDelete(u)}
  disabled={u.role === "ADMIN"}
  className={`px-3 py-1 rounded bg-black ${
    u.role === "ADMIN"
      ? "bg-black cursor-not-allowed text-white"
      : "bg-red-600 text-white"
  }`}
>
  Delete
</Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* pagination */}
        {pagination.pages > 1 && (
          <div className="p-3 border-t flex items-center justify-between text-sm">
            <div>
              Page {pagination.page} / {pagination.pages} • Total {pagination.total}
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => changePage(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 border rounded"
                onClick={() => changePage(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* modal (simple) */}
      {mode && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">
                {mode === "add" ? "Add User" : "Edit User"}
              </h3>
              <Button
                onClick={() => {
                  setMode(null);
                  setSelectedUser(null);
                }}
                className="text-xl"
              >
                ✕
              </Button>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <Input
                className="border rounded px-3 py-2 w-full"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              />
              <Input
                className="border rounded px-3 py-2 w-full"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
              <Input
                className="border rounded px-3 py-2 w-full"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              />

              <div className="flex gap-3">
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                >
                  <option value="USER">user</option>
                  <option value="ADMIN">admin</option>
                </select>

                {mode === "edit" && (
                  <select
                    className="border rounded px-3 py-2 w-full"
                    value={form.status}
                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                )}
              </div>

              {mode === "add" && (
                <>
                  <Input
                    className="border rounded px-3 py-2 w-full"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  />
                  <Input
                    className="border rounded px-3 py-2 w-full"
                    type="password"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, confirmPassword: e.target.value }))
                    }
                  />
                </>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <Button
                  type="button"
                  onClick={() => {
                    setMode(null);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                
                >
                  {mode === "add" ? "Create" : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;




import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { Shield, User, Trash2, Pencil } from "lucide-react";
import { userUpdateSchema } from "../../validation/userSchema";

export default function Users() {

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [editingUserId, setEditingUserId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [error, setError] = useState("");

  const [deleteUserId, setDeleteUserId] = useState(null);

  // ✅ NEW — delete error state
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser?.role === "ROLE_ADMIN") {
      loadUsers();
    }
  }, [currentUser]);

  const loadCurrentUser = async () => {
    try {
      const res = await api.get("/api/users/me");
      setCurrentUser(res.data);
    } catch (err) {
      console.error("Failed to load current user", err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data);
    } catch (e) {
      console.error("Failed to load users", e);
    }
  };

  const startEdit = (user) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditRole(user.role);
    setError("");
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setError("");
  };

  const saveEdit = async (id) => {

    const validation = userUpdateSchema.safeParse({
      name: editName,
      role: editRole
    });

    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    try {

      await api.put(`/api/admin/users/${id}`, {
        name: editName.trim(),
        role: editRole
      });

      setEditingUserId(null);
      setError("");
      loadUsers();

    } catch (e) {
      console.error("Update failed", e);
      setError("Update failed. Please try again.");
    }
  };

  const confirmDelete = (id) => {
    setDeleteUserId(id);
    setDeleteError(""); // ✅ reset error when opening modal
  };

  const cancelDelete = () => {
    setDeleteUserId(null);
    setDeleteError(""); // ✅ reset on cancel
  };

  const deleteUser = async () => {
    try {
      await api.delete(`/api/admin/users/${deleteUserId}`);
      setDeleteUserId(null);
      setDeleteError("");
      loadUsers();
    } catch (e) {
      console.error("Delete failed", e);

      // ✅ extract backend message
      const message =
        e?.response?.data?.message ||
        "Failed to delete user";

      setDeleteError(message);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-white text-center mt-20">
        Loading users...
      </div>
    );
  }

  if (currentUser.role !== "ROLE_ADMIN") {
    return (
      <div className="text-white text-center mt-20">
        <Shield className="mx-auto mb-4 text-red-400" size={40} />
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p className="text-slate-400 text-sm mt-2">
          Only administrators can view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="text-white space-y-8">

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          User Management
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage platform users and roles
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-sm">

          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="text-left p-4">User</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Created</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-t border-slate-800 hover:bg-slate-800/50 transition"
              >

                <td className="p-4 flex items-center gap-3">
                  <div className="bg-slate-800 p-2 rounded-lg">
                    <User size={16} />
                  </div>

                  {editingUserId === u.id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-sm"
                    />
                  ) : (
                    <span className="font-medium">{u.name}</span>
                  )}
                </td>

                <td className="p-4 text-slate-400">
                  {u.email}
                </td>

                <td className="p-4">
                  {editingUserId === u.id ? (
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-sm"
                    >
                      <option value="ROLE_DEVELOPER">DEVELOPER</option>
                      <option value="ROLE_ADMIN">ADMIN</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${u.role === "ROLE_ADMIN"
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }
                      `}>
                      {u.role.replace("ROLE_", "")}
                    </span>
                  )}
                </td>

                <td className="p-4 text-slate-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4 flex gap-3">

                  {editingUserId === u.id ? (
                    <>
                      <button onClick={() => saveEdit(u.id)} className="text-green-400 hover:text-green-300">
                        Save
                      </button>
                      <button onClick={cancelEdit} className="text-slate-400 hover:text-white">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(u)} className="text-blue-400 hover:text-blue-300">
                        <Pencil size={16} />
                      </button>

                      {u.id !== currentUser.id && (
                        <button
                          onClick={() => confirmDelete(u.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </>
                  )}

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {deleteUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">

          <div className="bg-slate-900 border border-slate-700 rounded-xl w-[400px] p-6 shadow-2xl">

            <h2 className="text-lg font-semibold text-white mb-2">
              Delete User
            </h2>

            <p className="text-sm text-slate-400 mb-4">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>

            {/* ✅ NEW — show delete error */}
            {deleteError && (
              <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded">
                {deleteError}
              </div>
            )}

            <div className="flex justify-end gap-3">

              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={deleteUser}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete User
              </button>

            </div>

          </div>
   
        </div>
      )}

    </div>
  );
}         
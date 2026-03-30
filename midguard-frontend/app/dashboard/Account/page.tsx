"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  ShoppingBag,
  MapPin,
  CreditCard,
  LogOut
} from "lucide-react";

const BASE_URL = "https://midguard-backend-production.up.railway.app/";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [showPicMenu, setShowPicMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchUser(token);
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${BASE_URL}auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error("Fetch user failed", err);
      router.push("/login");
    }
  };

  const calculateCompletion = (user: any) => {
    const fields = [
      "fullName",
      "email",
      "phoneNumber",
      "dateOfBirth",
      "gender",
      "profession",
      "bio",
      "profilePicture",
    ];

    const filled = fields.filter((f) => user[f]).length;
    return Math.floor((filled / fields.length) * 100);
  };

  const completion = user ? calculateCompletion(user) : 0;

  const updateField = async (field: string, value: any) => {
    try {
      const res = await fetch(`${BASE_URL}auth/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleUploadPic = async (e: any) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("context_type", "user");
      formData.append("context_id", user.publicId);
      formData.append("purpose", "profile_picture");

      const res = await fetch(`${BASE_URL}assets/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        updateField("profilePicture", data.asset.file_url);
        setShowPicMenu(false);
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const removePic = () => {
    updateField("profilePicture", null);
    setShowPicMenu(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${BASE_URL}auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("token");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (!user) return null;

  return (
    <div className="
      min-h-screen w-full
      px-3 sm:px-4 md:px-6
      py-4 sm:py-6
      bg-[color:var(--background)]
      text-[color:var(--foreground)]
      transition-all duration-300
    ">

      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6">
        Welcome back,{" "}
        <span className="text-purple-500">{user.fullName}</span>!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* PROFILE CARD */}
        <div className="
          md:col-span-2
          bg-[color:var(--foreground)/0.05]
          border border-[color:var(--foreground)/0.12]
          rounded-2xl
          p-4 sm:p-5 md:p-6
        ">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 relative">

            <div className="relative flex-shrink-0">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-500 flex items-center justify-center text-xl font-bold text-white">
                  {user.fullName?.[0]}
                </div>
              )}

              <button
                onClick={() => setShowPicMenu(!showPicMenu)}
                className="absolute bottom-0 right-0 bg-purple-500 p-1 rounded-full text-xs text-white shadow"
              >
                📷
              </button>

              {showPicMenu && (
                <div className="
                  absolute top-20 left-0
                  w-44 sm:w-48
                  bg-[color:var(--background)]
                  border border-[color:var(--foreground)/0.15]
                  p-3 rounded-lg z-50 shadow-lg
                ">
                  <input type="file" onChange={handleUploadPic} className="text-sm w-full" />
                  <button
                    onClick={removePic}
                    className="block mt-2 text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold truncate">{user.fullName}</h2>
              <p className="text-xs sm:text-sm text-[color:var(--foreground)/0.6]">
                {completion}% Complete
              </p>
            </div>

          </div>

          {/* PROGRESS */}
          <div className="h-2 bg-[color:var(--foreground)/0.1] rounded-full mb-6">
            <div
              className="h-2 bg-green-400 rounded-full transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>

          {/* DETAILS */}
          <div className="space-y-4">
            <EditableRow label="Full Name" field="fullName" value={user.fullName} onSave={updateField} />
            <EditableRow label="Email" field="email" value={user.email} onSave={updateField} />
            <EditableRow label="Phone Number" field="phoneNumber" value={user.phoneNumber} onSave={updateField} />
            <EditableRow label="Date of Birth" field="dateOfBirth" value={user.dateOfBirth} onSave={updateField} />
            <EditableRow label="Gender" field="gender" value={user.gender} onSave={updateField} />
            <EditableRow label="Profession" field="profession" value={user.profession} onSave={updateField} />
            <EditableRow label="Bio" field="bio" value={user.bio} onSave={updateField} />
          </div>
        </div>

        {/* ACTION CARD */}
        <div className="
          bg-[color:var(--foreground)/0.05]
          border border-[color:var(--foreground)/0.12]
          rounded-2xl
          p-4 sm:p-5 md:p-6
          space-y-3
        ">

          <ActionItem label="My Orders" icon={<ShoppingBag size={18} />} onClick={() => router.push("/dashboard/myorders")} />
          <ActionItem label="Saved Addresses" icon={<MapPin size={18} />} onClick={() => router.push("/dashboard/address")} />
          <ActionItem label="Payment Methods" icon={<CreditCard size={18} />} onClick={() => router.push("/dashboard/payments")} />

          <div className="pt-4">
            <button
              onClick={handleLogout}
              className="
                w-full flex items-center justify-center gap-2
                bg-red-500/10 border border-red-500 text-red-500
                py-2.5 rounded-lg
                hover:bg-red-500 hover:text-white
                transition-all duration-200 font-medium
              "
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function EditableRow({ label, field, value, onSave }: any) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value || "");

  useEffect(() => {
    setVal(value || "");
  }, [value]);

  const handleSave = () => {
    onSave(field, val);
    setEditing(false);
  };

  return (
    <div className="
      flex flex-col sm:flex-row sm:items-center justify-between gap-2
      border-b border-[color:var(--foreground)/0.1]
      pb-3
    ">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[color:var(--foreground)/0.6]">{label}</p>

        {editing ? (
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="
              mt-1 p-2 w-full rounded
              bg-[color:var(--foreground)/0.08]
              outline-none text-sm
            "
          />
        ) : (
          <p className="font-medium truncate">{value || "-"}</p>
        )}
      </div>

      {editing ? (
        <button onClick={handleSave} className="text-green-500 text-sm">
          Save
        </button>
      ) : (
        <button onClick={() => setEditing(true)} className="text-purple-500">
          <Pencil size={16} />
        </button>
      )}
    </div>
  );
}

function ActionItem({ label, icon, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="
        flex items-center justify-between cursor-pointer
        hover:bg-[color:var(--foreground)/0.06]
        px-3 py-2.5 rounded-lg
        transition-all duration-200
      "
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-[color:var(--foreground)/0.6]">{icon}</div>
        <span className="truncate">{label}</span>
      </div>

      <span className="text-[color:var(--foreground)/0.4]">{">"}</span>
    </div>
  );
}

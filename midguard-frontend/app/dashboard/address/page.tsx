"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function AddressPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const res = await api.getAddresses();
      setAddresses(res.addresses || []);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  const handleDelete = async (id: string) => {
    await api.deleteAddress(id);
    loadAddresses();
  };

  const handleDefault = async (id: string) => {
    await api.setDefaultAddress(id);
    loadAddresses();
  };

  return (
    <div
      className="
        min-h-screen w-full
        px-3 sm:px-4 md:px-6
        py-4 sm:py-6
        bg-[color:var(--background)]
        text-[color:var(--foreground)]
        transition-all duration-300
      "
    >
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-6">
        Saved Addresses
      </h1>

      {/* GRID */}
      <div className="
        grid grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        gap-4 sm:gap-6
      ">

        {/* ADD NEW CARD */}
        <div
          className="
            border border-dashed border-[color:var(--foreground)/0.3]
            rounded-2xl
            flex items-center justify-center
            h-[140px] sm:h-[160px]
            cursor-pointer
            hover:border-cyan-500
            hover:bg-[color:var(--foreground)/0.04]
            transition-all duration-200
          "
          onClick={() => router.push("/dashboard/Createaddress")}
        >
          <span className="text-[color:var(--foreground)/0.6] text-sm sm:text-base">
            + Add Address
          </span>
        </div>

        {/* ADDRESS LIST */}
        {addresses.map((addr) => (
          <div
            key={addr.address_uid}
            className={`
              p-4 sm:p-5
              rounded-2xl
              border
              transition-all duration-200
              ${
                addr.is_default
                  ? "border-cyan-500 bg-[color:var(--foreground)/0.05]"
                  : "border-[color:var(--foreground)/0.12] bg-[color:var(--foreground)/0.03]"
              }
            `}
          >
            {/* HEADER */}
            <div className="flex justify-between items-start gap-2">
              <h2 className="font-semibold text-sm sm:text-base truncate">
                {addr.full_name}
              </h2>

              {addr.is_default && (
                <span className="text-xs text-cyan-500 whitespace-nowrap">
                  Default
                </span>
              )}
            </div>

            {/* ADDRESS */}
            <p className="text-sm mt-2 text-[color:var(--foreground)/0.7]">
              {addr.address_line1}, {addr.address_line2}
            </p>

            <p className="text-sm text-[color:var(--foreground)/0.7]">
              {addr.city}, {addr.state} - {addr.postal_code}
            </p>

            <p className="text-sm mt-1">{addr.country}</p>

            <p className="text-xs text-[color:var(--foreground)/0.5] mt-1">
              Phone: {addr.phone_number}
            </p>

            {/* ACTIONS */}
            <div className="
              flex flex-col sm:flex-row
              justify-between gap-2
              mt-4 text-sm
            ">

              <button
                onClick={() => handleDefault(addr.address_uid)}
                className="
                  text-cyan-500 hover:underline
                "
              >
                Set default
              </button>

              <button
                onClick={() => handleDelete(addr.address_uid)}
                className="
                  text-red-500 hover:underline
                "
              >
                Remove
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

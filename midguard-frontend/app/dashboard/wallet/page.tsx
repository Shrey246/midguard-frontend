"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function WalletPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    fetchLedger();
    fetchWallet();

    const id = localStorage.getItem("userId");
    setUserId(id);
  }, []);

  const fetchWallet = async () => {
    try {
      const data = await api.getWallet();
      setWallet(data.data);
    } catch (err) {
      console.error("Failed to fetch wallet", err);
    }
  };

  const fetchLedger = async () => {
    try {
      const data = await api.getLedger();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error("Failed to fetch ledger", err);
    }
  };

  return (
    <div className="
      min-h-screen w-full
      px-3 sm:px-4 md:px-6
      py-4 sm:py-6
      bg-[color:var(--background)]
      text-[color:var(--foreground)]
      transition-all duration-300
    ">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
          Wallet Ledger
        </h1>

        <div className="
          flex flex-col sm:flex-row
          justify-between sm:items-center
          gap-4
        ">

          {/* USER ID */}
          <p className="text-xs sm:text-sm text-[color:var(--foreground)/0.6]">
            User ID: {userId || "N/A"}
          </p>

          {/* BALANCES */}
          <div className="
            flex flex-col sm:flex-row
            sm:items-center gap-4 sm:gap-8
          ">

            {/* AVAILABLE */}
            <div className="text-left sm:text-right">
              <p className="text-xs text-[color:var(--foreground)/0.6]">
                Available Balance
              </p>
              <p className="text-xl sm:text-2xl font-bold text-green-400">
                ₹{wallet?.available_balance ?? 0}
              </p>
            </div>

            {/* LOCKED */}
            <div className="text-left sm:text-right">
              <p className="text-xs text-[color:var(--foreground)/0.6]">
                Locked Balance
              </p>
              <p className="text-lg sm:text-xl font-semibold text-yellow-400">
                ₹{wallet?.locked_balance ?? 0}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="
        overflow-x-auto
        rounded-2xl
        border border-[color:var(--foreground)/0.12]
        bg-[color:var(--foreground)/0.03]
      ">
        <table className="w-full text-xs sm:text-sm text-left">

          <thead className="
            bg-[color:var(--foreground)/0.05]
            text-[color:var(--foreground)/0.6]
            uppercase text-[10px] sm:text-xs
          ">
            <tr>
              <th className="px-3 sm:px-4 py-3">#</th>
              <th className="px-3 sm:px-4 py-3">Txn ID</th>
              <th className="px-3 sm:px-4 py-3">Date</th>
              <th className="px-3 sm:px-4 py-3">Type</th>
              <th className="px-3 sm:px-4 py-3">Reference</th>
              <th className="px-3 sm:px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-[color:var(--foreground)/0.5]"
                >
                  No transactions yet
                </td>
              </tr>
            ) : (
              transactions.map((tx, index) => {
                const isCredit =
                  ["credit", "refund", "unlock"].includes(tx.transaction_type);

                const isDebit =
                  ["debit", "lock", "escrow_in"].includes(tx.transaction_type);

                return (
                  <tr
                    key={tx.transaction_uid}
                    className="
                      border-t border-[color:var(--foreground)/0.1]
                      hover:bg-[color:var(--foreground)/0.05]
                      transition
                    "
                  >
                    <td className="px-3 sm:px-4 py-3">{index + 1}</td>

                    <td className="px-3 sm:px-4 py-3 font-mono text-[10px] sm:text-xs break-all">
                      {tx.transaction_uid}
                    </td>

                    <td className="px-3 sm:px-4 py-3 text-[color:var(--foreground)/0.6]">
                      {new Date(tx.created_at).toLocaleString()}
                    </td>

                    <td className="px-3 sm:px-4 py-3 capitalize">
                      {tx.transaction_type}
                    </td>

                    <td className="px-3 sm:px-4 py-3 capitalize">
                      {tx.reference_type}
                    </td>

                    <td
                      className={`px-3 sm:px-4 py-3 text-right font-semibold ${
                        isCredit
                          ? "text-green-400"
                          : isDebit
                          ? "text-red-400"
                          : "text-[color:var(--foreground)/0.6]"
                      }`}
                    >
                      {isCredit ? "+" : "-"} ₹{tx.amount}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}

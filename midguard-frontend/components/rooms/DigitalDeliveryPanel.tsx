"use client";

import { useState } from "react";

type Props = {
  licenseKey?: string;
  downloadUrl?: string;
  accessUrl?: string;
  instructions?: string;
};

export default function DigitalDeliveryPanel({
  licenseKey,
  downloadUrl,
  accessUrl,
  instructions,
}: Props) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!licenseKey) return;

    await navigator.clipboard.writeText(licenseKey);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="
      bg-green-500/10
      border border-green-500/30
      backdrop-blur-xl
      p-4 sm:p-5 md:p-6
      rounded-2xl
      shadow-sm
      space-y-5
    ">

      {/* SUCCESS */}
      <h2 className="text-green-500 font-semibold text-base sm:text-lg">
        ✔ Payment Successful
      </h2>

      {/* LICENSE KEY */}
      {licenseKey && (
        <div>
          <p className="text-xs sm:text-sm text-[color:var(--foreground)/0.6] mb-1">
            License Key
          </p>

          <div className="
            flex flex-col sm:flex-row
            sm:items-center
            gap-3
          ">

            <div className="
              px-4 py-2 rounded-lg font-mono text-sm
              bg-[color:var(--foreground)/0.08]
              border border-[color:var(--foreground)/0.15]
              break-all
            ">
              {revealed ? licenseKey : "••••-••••-••••"}
            </div>

            <div className="flex gap-2">
              {!revealed && (
                <button
                  onClick={() => setRevealed(true)}
                  className="
                    text-xs sm:text-sm
                    bg-[color:var(--foreground)/0.08]
                    hover:bg-[color:var(--foreground)/0.15]
                    px-3 py-1.5 rounded-lg
                    transition
                  "
                >
                  Reveal
                </button>
              )}

              <button
                onClick={handleCopy}
                className="
                  text-xs sm:text-sm
                  bg-[color:var(--foreground)/0.08]
                  hover:bg-[color:var(--foreground)/0.15]
                  px-3 py-1.5 rounded-lg
                  transition
                "
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOWNLOAD */}
      {downloadUrl && (
        <a
          href={downloadUrl}
          target="_blank"
          className="
            inline-block
            bg-blue-500 hover:bg-blue-600
            text-white
            px-5 py-2 rounded-xl
            text-sm sm:text-base
            transition
          "
        >
          Download File
        </a>
      )}

      {/* ACCESS LINK */}
      {accessUrl && (
        <a
          href={accessUrl}
          target="_blank"
          className="
            block
            text-blue-500 hover:underline
            text-sm
          "
        >
          Access Product
        </a>
      )}

      {/* INSTRUCTIONS */}
      {instructions && (
        <p className="
          text-sm
          text-[color:var(--foreground)/0.7]
          leading-relaxed
        ">
          {instructions}
        </p>
      )}
    </div>
  );
}

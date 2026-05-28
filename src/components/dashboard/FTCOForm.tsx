"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateFTCO } from "@/lib/actions/provider";
import type { Provider } from "@/lib/supabase/types";

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#111827] outline-none focus:border-[#1B4FD8] transition-colors";

const FTCO_TYPES = [
  "Free Estimate",
  "Free Consultation",
  "Discount",
  "Free First Service",
  "Other",
];

export function FTCOForm({ provider: p }: { provider: Provider }) {
  const router = useRouter();
  const [active,  setActive]  = useState(p.ftco_active);
  const [saving,  setSaving]  = useState(false);
  const [status,  setStatus]  = useState<"idle" | "ok" | "error">("idle");
  const [errMsg,  setErrMsg]  = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");

    const fd = new FormData(e.currentTarget);
    fd.set("ftco_active", active.toString());
    const result = await updateFTCO(fd);

    setSaving(false);
    if (result.ok) {
      setStatus("ok");
      router.refresh();
    } else {
      setStatus("error");
      setErrMsg(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Toggle */}
      <div className="flex items-center justify-between p-5 bg-[#F8F9FA] rounded-2xl">
        <div>
          <p className="font-semibold text-[#111827]">First-Time Customer Offer</p>
          <p className="text-sm text-gray-500 mt-0.5">
            Show a special offer on your public profile.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActive(!active)}
          className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none ${
            active ? "bg-[#1B4FD8]" : "bg-gray-200"
          }`}
          aria-label="Toggle FTCO"
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              active ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Fields — only when active */}
      {active && (
        <div className="space-y-5">
          {/* Type + Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Offer Type
              </label>
              <select
                name="ftco_type"
                defaultValue={p.ftco_type ?? ""}
                className={`${inputCls} bg-white cursor-pointer`}
              >
                <option value="">Select type…</option>
                {FTCO_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Value{" "}
                <span className="text-gray-400 font-normal">(e.g. 10%, $25, Free)</span>
              </label>
              <input
                name="ftco_value"
                defaultValue={p.ftco_value ?? ""}
                className={inputCls}
                placeholder="e.g. 15% off"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              Offer Description
            </label>
            <textarea
              name="ftco_description"
              defaultValue={p.ftco_description ?? ""}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="e.g. 15% off your first service call. Mention LynkServ when booking."
            />
          </div>

          {/* Expiry */}
          <div className="max-w-xs">
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              Expiry Date{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              name="ftco_expiry"
              type="date"
              defaultValue={p.ftco_expiry ?? ""}
              min={new Date().toISOString().split("T")[0]}
              className={inputCls}
            />
          </div>
        </div>
      )}

      {/* Preview */}
      {active && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-semibold mb-0.5">Preview — how it appears on your profile</p>
          <p className="text-xs text-amber-700">
            An amber &ldquo;First-Time Offer&rdquo; badge will appear on your search card
            and profile page.
          </p>
        </div>
      )}

      {/* Feedback */}
      {status === "ok" && (
        <p className="text-sm text-green-700 bg-green-50 px-4 py-2.5 rounded-xl">
          ✓ Offer {active ? "saved and active" : "disabled"}.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{errMsg}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="bg-[#1B4FD8] text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2"
      >
        {saving ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Saving…
          </>
        ) : (
          "Save Offer"
        )}
      </button>
    </form>
  );
}

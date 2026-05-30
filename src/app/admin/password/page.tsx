"use client";

import { useState } from "react";
import { changeAdminPassword } from "@/lib/actions/admin";

const inputCls =
  "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-[#111827] outline-none focus:border-[#1B4FD8] transition-colors bg-white";

export default function ChangePasswordPage() {
  const [current,  setCurrent]  = useState("");
  const [next,     setNext]     = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [saving,   setSaving]   = useState(false);
  const [status,   setStatus]   = useState<"idle" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");

    if (next.length < 8) {
      setStatus("error");
      setErrorMsg("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setStatus("error");
      setErrorMsg("New passwords do not match.");
      return;
    }

    setSaving(true);
    const result = await changeAdminPassword({ currentPassword: current, newPassword: next });
    setSaving(false);

    if (result.ok) {
      setStatus("ok");
      setCurrent("");
      setNext("");
      setConfirm("");
    } else {
      setStatus("error");
      setErrorMsg(result.error);
    }
  }

  return (
    <main className="p-6 md:p-8 max-w-md">
      <h1 className="text-2xl font-bold text-[#111827] mb-1">Change Password</h1>
      <p className="text-sm text-gray-500 mb-8">Update your admin account password.</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Current password
            </label>
            <input
              type="password"
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className={inputCls}
              autoComplete="current-password"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              New password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className={inputCls}
              autoComplete="new-password"
            />
            <p className="text-xs text-gray-400 mt-1">Minimum 8 characters.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Confirm new password
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputCls}
              autoComplete="new-password"
            />
          </div>

          {status === "ok" && (
            <p className="text-sm text-green-700 bg-green-50 px-4 py-2.5 rounded-xl">
              ✓ Password updated successfully.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#1B4FD8] text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Updating…
              </>
            ) : (
              "Update password"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

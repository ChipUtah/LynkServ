import Link from "next/link";

interface Props {
  businessName: string;
  email: string;
  foundingMember: boolean;
}

export function SuccessScreen({ businessName, email, foundingMember }: Props) {
  return (
    <div className="text-center py-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-[#111827] mb-2">
        You&apos;re in the queue!
      </h2>
      <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
        <strong>{businessName}</strong> has been submitted for review. We&apos;ll
        have it live within 24 hours.
      </p>

      {foundingMember && (
        <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl px-5 py-4 mb-6 max-w-sm mx-auto">
          <p className="text-sm font-bold text-[#111827] mb-1">
            🎯 You&apos;re a Founding Member!
          </p>
          <p className="text-xs text-gray-600">
            50% off your first 3 months will be applied automatically when your
            trial ends.
          </p>
        </div>
      )}

      <div className="bg-[#F8F9FA] rounded-xl px-5 py-4 mb-8 max-w-sm mx-auto text-left space-y-3">
        <p className="text-sm font-semibold text-[#111827]">What happens next</p>
        <div className="flex gap-3">
          <span className="w-5 h-5 rounded-full bg-[#1B4FD8] text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">1</span>
          <p className="text-sm text-gray-600">
            Check <span className="font-medium text-[#111827]">{email}</span> to
            confirm your account.
          </p>
        </div>
        <div className="flex gap-3">
          <span className="w-5 h-5 rounded-full bg-[#1B4FD8] text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">2</span>
          <p className="text-sm text-gray-600">
            We review your listing — usually within 24 hours.
          </p>
        </div>
        <div className="flex gap-3">
          <span className="w-5 h-5 rounded-full bg-[#1B4FD8] text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">3</span>
          <p className="text-sm text-gray-600">
            Once approved, your listing goes live and Utah homeowners can find
            you.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="text-sm font-semibold text-gray-500 hover:text-[#111827] transition-colors px-4 py-2"
        >
          ← Back to home
        </Link>
        <Link
          href="/search"
          className="text-sm font-semibold bg-[#1B4FD8] text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Browse the directory
        </Link>
      </div>
    </div>
  );
}

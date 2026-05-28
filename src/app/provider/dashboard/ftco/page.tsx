import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FTCOForm } from "@/components/dashboard/FTCOForm";
import type { Provider } from "@/lib/supabase/types";

export default async function FTCOPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/provider/login");

  const { data } = await supabase
    .from("providers")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) redirect("/provider/signup");

  return (
    <main className="p-6 md:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">First-Time Customer Offer</h1>
        <p className="text-sm text-gray-500 mt-1">
          Give new customers a reason to choose you. Shown on your profile and search card.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <FTCOForm provider={data as Provider} />
      </div>
    </main>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-2xl px-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          SkinTwin
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Your personal skincare product tracker. Remember what works for your skin,
          avoid repeating mistakes, and build your skincare knowledge over time.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}

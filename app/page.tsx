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
    <div className="min-h-screen bg-white">
      {/* Simple Navigation */}
      <nav className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-purple-400">
                <span className="text-lg font-semibold text-purple-500">ST</span>
              </div>
              <span className="text-xl font-medium text-gray-900">SkinTwin</span>
            </div>
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-purple-500"
            >
              login / register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-5xl font-normal tracking-tight text-gray-900">
          track your skincare journey
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-gray-600">
          Remember what works for your skin, avoid repeating mistakes,
          <br />
          and build your skincare knowledge over time.
        </p>
        <div className="mt-12">
          <Link
            href="/login"
            className="inline-block rounded-md bg-purple-500 px-8 py-3 text-sm font-medium text-white hover:bg-purple-600 transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}

import { CreateProfileForm } from "@/components/auth/CreateProfileForm";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CreatePage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check for existing portfolio
  const { data: existingPortfolio, error } = await supabase
    .from("portfolios")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  // Log for debugging (remove in production)
  if (error) {
    console.error("Error fetching portfolio:", error);
  }


  return (
    <main className="min-h-[calc(100vh-4rem)] px-6 py-16">
      <CreateProfileForm portfolio={existingPortfolio} />
    </main>
  );
}

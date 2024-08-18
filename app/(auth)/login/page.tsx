"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const signInWithProvider = async (provider: "google") => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_ROOT_URL}/auth/callback`,
      },
    });

    console.log(`${process.env.NEXT_PUBLIC_ROOT_URL}/auth/callback`);

    if (error) {
      setIsLoading(false);
      router.push(`/login?message=Could not authenticate with ${provider}`);
      return;
    }

    setIsLoading(false);
    // The user will be redirected to the provider for authentication
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Button onClick={() => signInWithProvider("google")}>
        Login with Google
      </Button>
    </div>
  );
}

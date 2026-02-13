"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";

function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get("redirectTo") ?? "/airline";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGuestSignIn = async () => {
    setIsSubmitting(true);
    try {
      const { data, error } = await signIn.anonymous();
      if (!error) {
        router.push(redirectTo);
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 shadow-sm space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-2xl tracking-tight">Sign in</h1>
        <p className="text-sm text-black/60">
          Front-of-house experience for travellers. Authentication is mocked for
          this demo.
        </p>
      </div>

      <div className="space-y-4 opacity-60">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            disabled
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            disabled
            placeholder="Password"
          />
        </div>
        <Button className="w-full" disabled>
          Sign in
        </Button>
        <Button variant="outline" className="w-full" disabled>
          Sign in with Google
        </Button>
      </div>

      <div className="space-y-3 border-t border-dashed border-black/10 pt-4">
        <p className="text-xs text-black/70">
          This is a demo application, sign in as a guest to get mock credentials
          in order to see the checkout flow.
        </p>
        <Button
          className="w-full"
          onClick={handleGuestSignIn}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing you in..." : "Sign in as guest"}
        </Button>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#eee] flex items-center justify-center px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}

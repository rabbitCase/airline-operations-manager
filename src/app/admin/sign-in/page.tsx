"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { revokeOtherSessions, signIn } from "@/lib/auth-client";

export default function AdminSignInPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    const result = await signIn.email({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      callbackURL: "/admin/portal",
    });

    if (result.data && !result.error) {
      await revokeOtherSessions();
    }
    setIsSubmitting(false);

    if (!result.error) {
      router.push("/admin/portal");
    }
  };

  return (
    <div className="min-h-screen bg-[#eee] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 shadow-sm space-y-6">
        <p className="text-md text-black/70">
          If you are a guest, visit the GitHub{" "}
          <Link
            href="https://github.com/rabbitCase/airline-operations-manager/blob/main/README.md"
            target="_blank"
            className="font-bold text-blue-400 underline"
          >
            README
          </Link>{" "}
          to see the admin portal in action .
        </p>
        <div className="space-y-2">
          <h1 className="font-display text-2xl tracking-tight">
            Admin sign in
          </h1>
          <p className="text-sm text-black/60">
            Restricted portal for managing flights, pricing, delays, gates, and
            seat maps.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}

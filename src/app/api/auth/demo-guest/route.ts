import { auth } from "@/lib/auth";

export async function POST() {
  const email = "john.doe.demo@demo-ams.local";
  const password = process.env.DEMO_PASSWORD!;
  console.log(password);
  const signInResponse = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    asResponse: true,
  });

  return signInResponse;
}

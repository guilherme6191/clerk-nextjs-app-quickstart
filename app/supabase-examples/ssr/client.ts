import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export function createServerSupabaseClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, {
    async accessToken() {
      // Get the auth instance
      const authInstance = await auth();
      // Try to get the token, return null if it fails
      try {
        const token = await authInstance.getToken({
          template: "supabase",
        });

        return token;
      } catch (error) {
        console.error("Failed to get token:", error);
        return null;
      }
    },
  });
}

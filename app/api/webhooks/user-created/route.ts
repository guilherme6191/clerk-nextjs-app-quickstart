// app/api/webhooks/user-created/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/app/supabase-examples/ssr/client";

// Initialize Supabase client
const supabase = createServerSupabaseClient();

export async function GET(req: Request) {
  return NextResponse.json({ message: "Hello, world!" });
}

export async function POST(req: Request) {
  try {
    // Parse the webhook payload
    const payload = await req.json();
    console.log("api/webhooks/user-created/post: payload", payload);

    // Check if it's a user.created event
    if (payload.type === "user.created") {
      // Extract the user data
      const { id: userId, email_addresses } = payload.data;
      const email = email_addresses?.[0]?.email_address;

      if (!email) {
        return NextResponse.json(
          { error: "No email address found" },
          { status: 400 }
        );
      }

      // Insert the user into your Supabase table
      const { data, error } = await supabase.from("users").insert([
        {
          userId: userId,
          email: email,
        },
      ]);

      if (error) {
        console.error("Error saving user to Supabase:", error);
        return NextResponse.json(
          { error: "Failed to save user to Supabase" },
          { status: 500 }
        );
      }

      console.log("User saved to Supabase:", data);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

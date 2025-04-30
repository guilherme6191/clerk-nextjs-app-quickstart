import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CustomFlowsIndex() {
  return (
    <div className="mx-auto flex min-h-screen w-full flex-col justify-center px-4 py-12 sm:w-[350px] sm:px-0">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Clerk Auth</h1>
          <p className="text-sm text-muted-foreground text-gray-500">
            Custom authentication flows with Email OTP and OAuth
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/custom-flows/sign-in">Sign In</Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/custom-flows/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

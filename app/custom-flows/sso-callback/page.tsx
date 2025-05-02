import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  console.log("SSOCallbackPage");
  debugger;
  return (
    <div className="mx-auto flex min-h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
        <p className="text-sm text-muted-foreground text-gray-500">
          Completing authentication...
        </p>
        <AuthenticateWithRedirectCallback />
      </div>
    </div>
  );
}

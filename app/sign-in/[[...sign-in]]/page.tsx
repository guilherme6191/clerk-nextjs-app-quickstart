import { SignIn } from "@clerk/nextjs";

export default function Page() {
  console.log("sign-in page");
  return <SignIn />;
}

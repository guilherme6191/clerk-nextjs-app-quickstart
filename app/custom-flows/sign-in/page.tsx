"use client";

import { useState } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  PhoneCodeFactor,
  EmailCodeFactor,
  SignInFirstFactor,
  ClerkAPIError,
} from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserLockedErrorMeta {
  lockout_expires_in_seconds?: number;
}

const isPhoneCodeFactor = (factor: SignInFirstFactor) => {
  return factor.strategy === "phone_code";
};

const isEmailCodeFactor = (factor: SignInFirstFactor) => {
  return factor.strategy === "email_code";
};

export default function CustomSignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  console.log("🚀 ~ CustomSignInPage ~ signIn:", signIn);

  const auth = useAuth();
  console.log("🚀 ~ CustomSignInPage ~ auth:", auth);

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<ClerkAPIError[]>([]);
  const [verificationStrategy, setVerificationStrategy] = useState<
    "phone_code" | "email_code" | null
  >(null);
  const router = useRouter();

  const handleOAuthSignIn = async (strategy: "oauth_google") => {
    console.log("strategy", JSON.stringify(strategy, null, 2));
    if (!isLoaded || !signIn) return;

    try {
      setError("");
      setErrors([]);
      debugger;
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/custom-flows/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      console.error(err);
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors);

        setError(
          err.errors[0]?.longMessage || "An error occurred during OAuth sign-in"
        );
      } else {
        setError("An error occurred during OAuth sign-in");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors([]);

    if (!isLoaded || !signIn) return;

    try {
      const isEmail = emailOrPhone.includes("@");
      const identifier = emailOrPhone;

      const { supportedFirstFactors } = await signIn.create({
        identifier,
      });

      if (isEmail) {
        const emailCodeFactor = supportedFirstFactors?.find(isEmailCodeFactor);

        if (emailCodeFactor) {
          await signIn.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId: emailCodeFactor.emailAddressId,
          });

          setVerificationStrategy("email_code");
          setVerifying(true);
        } else {
          setError("Email verification is not available for this account");
        }
      } else {
        const phoneCodeFactor = supportedFirstFactors?.find(isPhoneCodeFactor);

        if (phoneCodeFactor) {
          await signIn.prepareFirstFactor({
            strategy: "phone_code",
            phoneNumberId: phoneCodeFactor.phoneNumberId,
          });

          setVerificationStrategy("phone_code");
          setVerifying(true);
        } else {
          setError("Phone verification is not available for this account");
        }
      }
    } catch (err: any) {
      console.error(err);
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors);

        if (err.errors[0]?.code === "user_locked") {
          const meta = err.errors[0].meta as UserLockedErrorMeta;
          if (meta?.lockout_expires_in_seconds) {
            const currentDate = new Date();
            currentDate.setSeconds(
              currentDate.getSeconds() + meta.lockout_expires_in_seconds
            );
            const lockoutExpiresAt = currentDate.toLocaleString();
            setError(
              `Your account is locked. You will be able to try again at ${lockoutExpiresAt}`
            );
          } else {
            setError(
              err.errors[0]?.longMessage || "Your account is temporarily locked"
            );
          }
        } else {
          setError(
            err.errors[0]?.longMessage ||
              "Invalid credentials or user not found"
          );
        }
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors([]);

    if (!isLoaded || !signIn) return;

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: verificationStrategy!,
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        setError("Verification was not completed. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors);
        setError(err.errors[0]?.longMessage || "Invalid verification code");
      } else {
        setError("An error occurred during verification. Please try again.");
      }
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {verifying ? "Verify your account" : "Sign in to your account"}
          </h2>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {errors.length > 0 && !error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <ul className="list-disc pl-5">
              {errors.map((err, index) => (
                <li key={index} className="text-sm">
                  {err.longMessage}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!verifying ? (
          <>
            <div className="mt-8 space-y-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthSignIn("oauth_google")}
              >
                Sign in with Google
              </Button>

              <div className="flex items-center justify-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email-or-phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email or Phone Number
                  </label>
                  <Input
                    id="email-or-phone"
                    name="email-or-phone"
                    type="text"
                    required
                    placeholder="Email or Phone Number"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            </div>
          </>
        ) : (
          <form onSubmit={handleVerification} className="mt-8 space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="verification-code"
                className="block text-sm font-medium text-gray-700"
              >
                Verification Code
              </label>
              <Input
                id="verification-code"
                name="verification-code"
                type="text"
                required
                placeholder={`Enter ${
                  verificationStrategy === "email_code" ? "email" : "SMS"
                } verification code`}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Button type="submit" className="w-full">
                Verify
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setVerifying(false)}
              >
                Back
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

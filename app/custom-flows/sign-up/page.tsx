"use client";

import * as React from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClerkAPIError } from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

interface UserLockedErrorMeta {
  lockout_expires_in_seconds?: number;
}

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = React.useState(false);
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [verifyingPhone, setVerifyingPhone] = React.useState(false);
  const [verifyingEmail, setVerifyingEmail] = React.useState(false);
  const [errors, setErrors] = React.useState<Partial<ClerkAPIError>[]>([]);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErrors([]);

    if (!isLoaded || !signUp) return null;

    try {
      const res = await signUp.create({
        emailAddress: email,
        phoneNumber: phone,
        password,
      });

      if (res.status === "complete") {
        if (res.createdSessionId) {
          await setActive({ session: res.createdSessionId });
          router.push("/");
          return;
        }
      }

      if (email && phone) {
        await signUp.prepareEmailAddressVerification();
        setVerifyingEmail(true);
        setVerifying(true);
      } else if (email) {
        await signUp.prepareEmailAddressVerification();
        setVerifyingEmail(true);
        setVerifying(true);
      } else if (phone) {
        await signUp.preparePhoneNumberVerification();
        setVerifyingPhone(true);
        setVerifying(true);
      } else {
        setErrors([{ message: "Either email or phone number is required" }]);
      }
    } catch (err) {
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
            setErrors([
              {
                message: `Your account is locked. You will be able to try again at ${lockoutExpiresAt}`,
              },
            ]);
          } else {
            setErrors(err.errors);
          }
        } else {
          setErrors(err.errors);
        }
      } else {
        console.error("Error:", JSON.stringify(err, null, 2));
        setErrors([{ message: "Sign up failed. Please try again." }]);
      }
    }
  }

  async function handleVerification(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);

    if (!isLoaded || !signUp) return null;

    try {
      let verificationAttempt;

      if (verifyingPhone) {
        verificationAttempt = await signUp.attemptPhoneNumberVerification({
          code,
        });

        if (
          email &&
          !verifyingEmail &&
          verificationAttempt.status !== "complete"
        ) {
          await signUp.prepareEmailAddressVerification();
          setVerifyingPhone(false);
          setVerifyingEmail(true);
          setCode("");
          return;
        }
      } else if (verifyingEmail) {
        verificationAttempt = await signUp.attemptEmailAddressVerification({
          code,
        });

        if (
          phone &&
          !verifyingPhone &&
          verificationAttempt.status !== "complete"
        ) {
          await signUp.preparePhoneNumberVerification();
          setVerifyingEmail(false);
          setVerifyingPhone(true);
          setCode("");
          return;
        }
      }

      if (verificationAttempt && verificationAttempt.status === "complete") {
        await setActive({ session: verificationAttempt.createdSessionId });
        router.push("/");
      } else {
        console.error(verificationAttempt);
        setErrors([
          { message: "Verification was not completed. Please try again." },
        ]);
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors);
      } else {
        console.error("Error:", JSON.stringify(err, null, 2));
        setErrors([{ message: "Verification failed. Please try again." }]);
      }
    }
  }

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <h1 className="mt-6 text-center text-3xl font-extrabold">
            {verifyingEmail ? "Verify your email" : "Verify your phone number"}
          </h1>

          {errors.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <ul className="list-disc pl-5">
                {errors.map((err, index) => (
                  <li key={index} className="text-sm">
                    {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleVerification} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-1">
                Enter your verification code from{" "}
                {verifyingEmail ? "email" : "phone"}
              </label>
              <Input
                value={code}
                id="code"
                name="code"
                onChange={(e) => setCode(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Verify
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setVerifying(false);
                setVerifyingEmail(false);
                setVerifyingPhone(false);
              }}
            >
              Back
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Create a new account
          </h2>
        </div>

        {errors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <ul className="list-disc pl-5">
              {errors.map((err, index) => (
                <li key={index} className="text-sm">
                  {err.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              value={email}
              id="email"
              name="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <Input
              value={phone}
              id="phone"
              name="phone"
              type="tel"
              onChange={(e) => setPhone(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <Input
              value={password}
              id="password"
              name="password"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>

          <p className="text-xs text-gray-500">
            Provide at least one contact method (email or phone) and a password.
          </p>

          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}

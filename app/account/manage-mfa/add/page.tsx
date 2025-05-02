"use client";

import { useUser, useReverification } from "@clerk/nextjs";
import { TOTPResource } from "@clerk/types";
import Link from "next/link";
import * as React from "react";
import { QRCodeSVG } from "qrcode.react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GenerateBackupCodes } from "@/app/components/GenerateBackupCodes";

// ref: https://clerk.com/docs/custom-flows/manage-totp-based-mfa

type AddTotpSteps = "add-verify" | "backupcodes" | "success";

type DisplayFormat = "qr" | "uri";

function AddTotpScreen({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<AddTotpSteps>>;
}) {
  const { user } = useUser();
  const [totp, setTOTP] = React.useState<TOTPResource | undefined>(undefined);
  const [displayFormat, setDisplayFormat] = React.useState<DisplayFormat>("qr");
  //
  const createTOTP = useReverification(() => user?.createTOTP());

  // verification state
  const [code, setCode] = React.useState("");
  const verifyTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await user?.verifyTOTP({ code });
      setStep("backupcodes");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  React.useEffect(() => {
    void createTOTP()
      .then((totp: TOTPResource | undefined) => {
        if (totp) {
          setTOTP(totp);
        }
      })
      .catch((err) =>
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2))
      );
  }, []);

  return (
    <>
      <h1>Add TOTP MFA</h1>

      {totp && displayFormat === "qr" && (
        <>
          <div>
            <QRCodeSVG value={totp?.uri || ""} size={200} />
          </div>
          <Button onClick={() => setDisplayFormat("uri")}>
            Use URI instead
          </Button>
        </>
      )}
      {totp && displayFormat === "uri" && (
        <>
          <div>
            <p>{totp.uri}</p>
          </div>
          <Button onClick={() => setDisplayFormat("qr")}>
            Use QR Code instead
          </Button>
        </>
      )}
      <Button onClick={() => setStep("add-verify")}>Reset</Button>

      <p>Once you have set up your authentication app, verify your code</p>

      <form onSubmit={(e) => verifyTotp(e)} className="mt-4">
        <label htmlFor="totp-code">
          Enter the code from your authentication app
        </label>
        <Input
          type="text"
          id="totp-code"
          onChange={(e) => setCode(e.currentTarget.value)}
        />
        <Button type="submit">Verify code</Button>
        <Button onClick={() => setStep("add-verify")}>Reset</Button>
      </form>
    </>
  );
}

function BackupCodeScreen({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<AddTotpSteps>>;
}) {
  return (
    <>
      <h1>Verification was a success!</h1>
      <div>
        <p>
          Save this list of backup codes somewhere safe in case you need to
          access your account in an emergency
        </p>
        <GenerateBackupCodes />
        <Button onClick={() => setStep("success")}>Finish</Button>
      </div>
    </>
  );
}

function SuccessScreen() {
  return (
    <>
      <h1>Success!</h1>
      <p>
        You have successfully added TOTP MFA via an authentication application.
      </p>
    </>
  );
}

export default function AddMFaScreen() {
  const [step, setStep] = React.useState<AddTotpSteps>("add-verify");
  const { isLoaded, user } = useUser();

  if (!isLoaded) return null;

  if (!user) {
    return <p>You must be logged in to access this page</p>;
  }

  return (
    <>
      {step === "add-verify" && <AddTotpScreen setStep={setStep} />}
      {step === "backupcodes" && <BackupCodeScreen setStep={setStep} />}
      {step === "success" && <SuccessScreen />}
      <Link href="/account/manage-mfa">Manage MFA</Link>
    </>
  );
}

/**
 
jyvqd2y9
afgp058a
aunvg1bc
si7g0lpu
0in2mnj7
g9a295vy
bu78tol5
rxxx17kf
squyvjwb
i080yqvo


 */

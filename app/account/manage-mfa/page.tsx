"use client";

import * as React from "react";
import { useUser, useReverification } from "@clerk/nextjs";
import Link from "next/link";
import { BackupCodeResource } from "@clerk/types";
import { Button } from "@/components/ui/button";

// If TOTP is enabled, provide the option to disable it
const TotpEnabled = () => {
  const { user } = useUser();
  const disableTOTP = useReverification(() => user?.disableTOTP());

  return (
    <div>
      <p>
        TOTP via authentication app enabled -{" "}
        <Button onClick={() => disableTOTP()}>Remove</Button>
      </p>
    </div>
  );
};

// If TOTP is disabled, provide the option to enable it
const TotpDisabled = () => {
  return (
    <div>
      <p>
        Add TOTP via authentication app -{" "}
        <Link href="/account/manage-mfa/add">
          <Button>Add</Button>
        </Link>
      </p>
    </div>
  );
};

// Generate and display backup codes
export function GenerateBackupCodes() {
  const { user } = useUser();
  const [backupCodes, setBackupCodes] = React.useState<
    BackupCodeResource | undefined
  >(undefined);
  const createBackupCode = useReverification(() => user?.createBackupCode());

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (backupCodes) {
      return;
    }

    setLoading(true);
    void createBackupCode()
      .then((backupCode: BackupCodeResource | undefined) => {
        setBackupCodes(backupCode);
        setLoading(false);
      })
      .catch((err) => {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!backupCodes) {
    return <p>There was a problem generating backup codes</p>;
  }

  return (
    <ol>
      {backupCodes.codes.map((code, index) => (
        <li key={index}>{code}</li>
      ))}
    </ol>
  );
}

export default function ManageMFA() {
  const { isLoaded, user } = useUser();
  const [showNewCodes, setShowNewCodes] = React.useState(false);

  if (!isLoaded) return null;

  if (!user) {
    return <p>You must be logged in to access this page</p>;
  }

  return (
    <>
      <h1>User MFA Settings</h1>

      {/* Manage TOTP MFA */}
      {user.totpEnabled ? <TotpEnabled /> : <TotpDisabled />}

      {/* Manage backup codes */}
      {user.backupCodeEnabled && user.twoFactorEnabled && (
        <div>
          <p>
            Generate new backup codes? -{" "}
            <Button onClick={() => setShowNewCodes(true)}>Generate</Button>
          </p>
        </div>
      )}
      {showNewCodes && (
        <>
          <GenerateBackupCodes />
          <Button onClick={() => setShowNewCodes(false)}>Done</Button>
        </>
      )}
    </>
  );
}

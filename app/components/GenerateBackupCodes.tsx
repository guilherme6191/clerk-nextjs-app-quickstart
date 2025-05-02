"use client";

import { useReverification, useUser } from "@clerk/nextjs";
import { BackupCodeResource } from "@clerk/types";
import React from "react";

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

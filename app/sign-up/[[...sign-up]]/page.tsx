import { SignUp } from "@clerk/nextjs";

const appearance = {
  elements: {
    colorTextSecondary: "#1a10c8",
    rootBox: {
      boxShadow: "none",
      width: "100%",
      margin: "0 auto",
      maxWidth: "500px",
    },
    card: {
      border: "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      backgroundColor: "#3761ea",
    },
    headerTitle: {
      fontSize: "24px",
      fontWeight: "600",
      color: "white",
    },
    headerSubtitle: {
      color: "rgba(255, 255, 255, 0.8)",
      textAlign: "center",
    },
    formButtonPrimary: {
      backgroundColor: "#1d4ed8",
      color: "white",
      "&:hover": {
        backgroundColor: "#3761ea",
      },
    },
    formFieldLabel: {
      color: "white",
    },
    formFieldInput: {
      backgroundColor: "white",
    },
    formFieldInputShowPasswordButton: {
      color: "#3761ea",
    },
    identityPreview: {
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      color: "#3761ea",
    },
    footer: {
      color: "white",
    },
    footerActionLink: {
      color: "white",
      textDecoration: "underline",
    },
    socialButtonsIconButton: {
      backgroundColor: "white",
      "&:hover": {
        backgroundColor: "#f3f4f6",
      },
    },
  },
};

export default function Page() {
  console.log("sign-up page");

  return <SignUp appearance={appearance} />;
}

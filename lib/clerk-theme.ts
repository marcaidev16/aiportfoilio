import type { Appearance } from "@clerk/types";

export const clerkAppearance: Appearance = {
  baseTheme: undefined,
  variables: {
    colorPrimary: "#a855f7",
    colorDanger: "#ef4444",
    colorSuccess: "#10b981",
    colorWarning: "#f59e0b",
    colorNeutral: "#6b7280",
    colorBackground: "#1a1a24",
    colorInputBackground: "#1a1a24",
    colorInputText: "#ffffff",
    colorText: "#ffffff",
    colorTextSecondary: "#9ca3af",
    colorTextOnPrimaryBackground: "#ffffff",
    borderRadius: "0.75rem",
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    fontSize: "1rem",
  },
  elements: {
    // Root container
    rootBox: {
      width: "100%",
    },

    // Card styling
    card: {
      backgroundColor: "#1a1a24",
      backdropFilter: "blur(40px)",
      border: "2px solid #a855f7",
      boxShadow: "0 0 40px rgba(168, 85, 247, 0.4), 0 20px 25px -5px rgba(0, 0, 0, 0.5)",
      borderRadius: "1rem",
      padding: "2.5rem",
    },

    // Header
    headerTitle: {
      color: "#ffffff",
      fontSize: "1.875rem",
      fontWeight: "700",
      marginBottom: "0.5rem",
    },
    headerSubtitle: {
      color: "#d1d5db",
      fontSize: "0.95rem",
    },

    // Divider
    dividerLine: {
      backgroundColor: "rgba(168, 85, 247, 0.2)",
    },
    dividerText: {
      color: "#9ca3af",
      fontSize: "0.875rem",
    },

    // Social buttons
    socialButtonsBlockButton: {
      backgroundColor: "rgba(26, 26, 36, 0.8)",
      border: "1px solid rgba(168, 85, 247, 0.3)",
      color: "#ffffff",
      borderRadius: "0.75rem",
      padding: "0.75rem 1rem",
      fontSize: "0.95rem",
      fontWeight: "500",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "rgba(168, 85, 247, 0.15)",
        borderColor: "rgba(168, 85, 247, 0.5)",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(168, 85, 247, 0.2)",
      },
      "&:focus": {
        boxShadow: "0 0 0 3px rgba(168, 85, 247, 0.3)",
      },
    },
    socialButtonsIconButton: {
      border: "1px solid rgba(168, 85, 247, 0.3)",
      "&:hover": {
        backgroundColor: "rgba(168, 85, 247, 0.15)",
      },
    },

    // Form fields
    formFieldLabel: {
      color: "#e5e7eb",
      fontSize: "0.875rem",
      fontWeight: "500",
      marginBottom: "0.5rem",
    },
    formFieldInput: {
      backgroundColor: "#1a1a24",
      border: "1px solid rgba(168, 85, 247, 0.3)",
      color: "#ffffff",
      borderRadius: "0.75rem",
      padding: "0.75rem 1rem",
      fontSize: "0.95rem",
      transition: "all 0.3s ease",
      "&:hover": {
        borderColor: "rgba(168, 85, 247, 0.5)",
      },
      "&:focus": {
        borderColor: "#a855f7",
        boxShadow: "0 0 0 3px rgba(168, 85, 247, 0.2), 0 0 20px rgba(168, 85, 247, 0.15)",
        outline: "none",
      },
      "&::placeholder": {
        color: "#6b7280",
      },
    },
    formFieldInputShowPasswordButton: {
      color: "#a855f7",
    },

    // Primary button
    formButtonPrimary: {
      background: "linear-gradient(135deg, #a855f7 0%, #c026d3 100%)",
      color: "#ffffff",
      borderRadius: "0.75rem",
      padding: "0.875rem 1.5rem",
      fontSize: "1rem",
      fontWeight: "600",
      border: "none",
      boxShadow: "0 4px 14px rgba(168, 85, 247, 0.4)",
      transition: "all 0.3s ease",
      "&:hover": {
        background: "linear-gradient(135deg, #9333ea 0%, #a21caf 100%)",
        transform: "translateY(-2px)",
        boxShadow: "0 6px 20px rgba(168, 85, 247, 0.5)",
      },
      "&:active": {
        transform: "translateY(0)",
      },
      "&:focus": {
        boxShadow: "0 0 0 3px rgba(168, 85, 247, 0.4), 0 4px 14px rgba(168, 85, 247, 0.4)",
      },
    },

    // Footer links
    footerActionLink: {
      color: "#a855f7",
      fontWeight: "500",
      transition: "color 0.2s ease",
      "&:hover": {
        color: "#c084fc",
        textDecoration: "underline",
      },
    },
    footerActionText: {
      color: "#9ca3af",
    },

    // Alert
    alertText: {
      color: "#ffffff",
      fontSize: "0.875rem",
    },

    // Form error
    formFieldErrorText: {
      color: "#ef4444",
      fontSize: "0.875rem",
      marginTop: "0.25rem",
    },

    // Identity preview
    identityPreviewText: {
      color: "#ffffff",
    },
    identityPreviewEditButton: {
      color: "#a855f7",
      "&:hover": {
        color: "#c084fc",
      },
    },

    // Avatar
    avatarBox: {
      border: "2px solid rgba(168, 85, 247, 0.3)",
      boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)",
    },

    // Badge
    badge: {
      backgroundColor: "rgba(168, 85, 247, 0.15)",
      color: "#c084fc",
      border: "1px solid rgba(168, 85, 247, 0.3)",
      borderRadius: "0.5rem",
      padding: "0.25rem 0.75rem",
      fontSize: "0.75rem",
      fontWeight: "600",
    },

    // File upload
    fileDropAreaBox: {
      border: "2px dashed rgba(168, 85, 247, 0.4)",
      borderRadius: "0.75rem",
      backgroundColor: "rgba(168, 85, 247, 0.05)",
      transition: "all 0.3s ease",
      "&:hover": {
        borderColor: "#a855f7",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
      },
    },
    fileDropAreaText: {
      color: "#d1d5db",
    },
    fileDropAreaButtonPrimary: {
      color: "#a855f7",
      fontWeight: "600",
    },

    // OTP input
    otpCodeFieldInput: {
      backgroundColor: "#1a1a24",
      border: "1px solid rgba(168, 85, 247, 0.3)",
      color: "#ffffff",
      borderRadius: "0.75rem",
      fontSize: "1.5rem",
      fontWeight: "600",
      "&:focus": {
        borderColor: "#a855f7",
        boxShadow: "0 0 0 3px rgba(168, 85, 247, 0.2)",
      },
    },

    // Loading spinner
    spinner: {
      color: "#a855f7",
    },

    // Modal backdrop
    modalBackdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(8px)",
    },

    // Ocultar logo/marca de Clerk
    logoBox: {
      display: "none",
    },
    logoImage: {
      display: "none",
    },
    footer: {
      display: "none",
    },
    footerPages: {
      display: "none",
    },
  },
};

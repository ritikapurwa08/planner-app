// components/auth/LogoutButton.tsx
import React, { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button"; // Adjust path if needed
import { toast } from "react-hot-toast"; // Optional for feedback

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuthActions();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      toast.success("Successfully signed out."); // Optional success message
    } catch (error: any) {
      toast.error(`Sign out failed: ${error.message}`); // Optional error message
    } finally {
      setLoading(false); // May not always be reached due to redirection
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} disabled={loading}>
      {loading ? "Logging Out..." : "Log Out"}
    </Button>
  );
};

export default LogoutButton;

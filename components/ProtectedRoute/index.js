import { Progress } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/client";
import React, { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const [session, loading] = useSession();

  const isUser = !!session?.user;

  useEffect(() => {
    if (loading) return;
    // If not authenticated, force log in
    if (!isUser) signIn();
  }, [isUser, loading]);

  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <Progress {...styles.progress} />;
};

export { ProtectedRoute };

// Styles

const styles = {
  progress: {
    value: 20,
    size: "xs",
    colorScheme: "blackAlpha",
  },
};

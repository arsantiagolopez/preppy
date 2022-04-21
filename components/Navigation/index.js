import { useSession } from "next-auth/client";
import React from "react";
import { IconNavigation } from "./IconNavigation";
import { MainNavigation } from "./MainNavigation";

const Navigation = ({
  hideMobileMainNav,
  withTitle,
  withoutBlur,
  isSchedule,
  ...props
}) => {
  const [session] = useSession();

  const iconNavigationProps = { session, ...props };
  const mainNavigationProps = {
    session,
    hideMobileMainNav,
    withTitle,
    withoutBlur,
    isSchedule,
  };

  return (
    <>
      {
        // Show icon navigation to logged in mobile users
        session?.user && <IconNavigation {...iconNavigationProps} />
      }
      <MainNavigation {...mainNavigationProps} />
    </>
  );
};

export { Navigation };

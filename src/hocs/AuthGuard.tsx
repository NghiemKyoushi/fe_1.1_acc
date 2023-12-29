import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { cookieSetting } from "@/utils";
// import { useStateContext } from "@/context";
// import { useQuery } from "react-query";
// import { getMeFn } from "@/api/authApi";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
interface AuthGuardProps {
  children: React.ReactNode;
}
const AuthGuard = (props: AuthGuardProps) => {
  const userId = cookieSetting.get("userId");
  const { children } = props;
  const router = useRouter();
  const isAuthenticated = cookieSetting.get("token");
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  // const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (isAuthenticated === undefined || isAuthenticated === "") {
      router
        .replace({
          pathname: "/auth/login",
          query:
            router.asPath !== "/" ? { continueUrl: router.asPath } : undefined,
        })
        .catch(console.error);
    } else {
    }
  }, [isAuthenticated, router]);
  if (isLoading) {
    return <FullScreenLoader />;
  }
  return children;
};

export default AuthGuard;

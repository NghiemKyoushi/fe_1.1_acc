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
  // const stateContext = useStateContext();

  // const {
  //   isLoading,
  //   isFetching,
  //   data: user,
  // } = useQuery(["authUser"], getMeFn, {
  //   retry: 1,
  //   // select: (data) => data.userName,
  //   onSuccess: (data) => {
  //     stateContext.dispatch({ type: "SET_USER", payload: data });
  //   },
  // });
  const { children } = props;
  const router = useRouter();
  const isAuthenticated = cookieSetting.get("token");
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const ignore = useRef(false);
  // const [checked, setChecked] = useState(false);

  // Only do authentication check on component mount.
  // This flow allows you to manually redirect the user after sign-out, otherwise this will be
  // triggered and will automatically redirect to sign-in page.
 
  useEffect(() => {
    if (isAuthenticated === undefined) {
      // console.log("Not authenticated, redirecting");
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
  // if (!checked) {
  //   return null;
  // }

  return children;
};

export default AuthGuard;

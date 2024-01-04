import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { cookieSetting } from "@/utils";
import { usePathname } from "next/navigation";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import { items } from "../components/Layout/config";
interface AuthGuardProps {
  children: React.ReactNode;
}
const AuthGuard = (props: AuthGuardProps) => {
  const userId = cookieSetting.get("userId");
  const { children } = props;
  const router = useRouter();
  const isAuthenticated = cookieSetting.get("token");
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const roles = cookieSetting.get("roles");
  const pathname = usePathname();

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

  useEffect(() => {
    const findItem = items.find((item) => item.path === pathname);
    if (roles && findItem) {
      if (!findItem.roles?.includes(roles)) {
        router.push("/auth/login");
      }
    }
  }, []);
  if (isLoading) {
    return <FullScreenLoader />;
  }
  return children;
};

export default AuthGuard;

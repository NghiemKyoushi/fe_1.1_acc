import AuthGuard from "./AuthGuard";

export interface ChildProps {
  children: React.ReactNode;
}
const WithAuthGuard = (props: ChildProps) => {
  const { children } = props;
  
  return <AuthGuard>{children}</AuthGuard>;
};

WithAuthGuard.displayName = "WithAuthGuard";
export default WithAuthGuard;

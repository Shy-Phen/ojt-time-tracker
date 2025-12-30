import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { authClient } from "@/Lib/auth-client";
import { useNavigate, NavLink } from "react-router-dom";

export function Providers({ children }) {
  const navigate = useNavigate();

  // Link adapter for react-router v6
  const RouterLink = ({ href, ...props }) => {
    return <NavLink to={href} {...props} />;
  };

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={navigate}
      Link={RouterLink}
    >
      {children}
    </AuthUIProvider>
  );
}

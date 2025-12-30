import { useParams } from "react-router-dom";
import { AuthView } from "@daveyplate/better-auth-ui";

const AuthPage = () => {
  const { pathname } = useParams();
  return (
    <>
      <div className="navbar bg-base-100/10 backdrop-blur-md shadow-sm px-4 lg:px-8 fixed top-0 left-0 right-0 z-50">
        <div className="flex-1"></div>
        <div className="flex-none"></div>
      </div>
      <main className="p-6 flex flex-col justify-center  items-center h-screen">
        <AuthView
          pathname={pathname}
          classNames={{ base: "bg-black/10 ring ring-indigo-900" }}
        />
      </main>
    </>
  );
};

export default AuthPage;

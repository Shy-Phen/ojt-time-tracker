import timeit2 from "../assets/timeit2.svg";
import { Link } from "react-router-dom";
import { UserButton } from "@daveyplate/better-auth-ui";

const Navbar = () => {
  return (
    <>
      <div className="navbar backdrop-blur-md shadow-sm px-4 lg:px-8 fixed top-0 left-0 right-0 z-50">
        <Link to="/" onClick={() => scrollTo(0, 0)} className="flex-1">
          <img src={timeit2} alt="TimeIt Logo" className="h-5 w-auto" />
        </Link>
        <div className="flex-none ">
          <UserButton size="icon" className="bg-base-200" />
        </div>
      </div>
    </>
  );
};

export default Navbar;

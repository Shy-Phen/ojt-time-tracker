import timeit2 from "../assets/timeit2.svg";
import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <div className="navbar bg-base-100/20 backdrop-blur-md shadow-sm px-4 lg:px-8 fixed top-0 left-0 right-0 z-50">
        <Link to="/" onClick={() => scrollTo(0, 0)} className="flex-1">
          <img src={timeit2} alt="TimeIt Logo" className="h-10 w-auto" />
        </Link>
        <div className="flex-none">
          <UserButton />
        </div>
      </div>
    </>
  );
};

export default Navbar;

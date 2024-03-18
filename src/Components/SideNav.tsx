import { Link } from "react-router-dom";
import { AiFillHome, AiFillDatabase, AiOutlineClose } from "react-icons/ai";
import Logo from "./Logo";

function SideNav() {
  return (
    <div className="fixed left-5 top-5 w-80 h-95vh rounded-2xl bg-gray-800">
      <div className="flex w-full h-full flex-col justify-start text-white">
        <div className="flex justify-between">
          <Logo />
          <AiOutlineClose className={` mr-4 mt-4 w-7 h-7 `} />
        </div>
        <div>
          <Link
            to="/"
            className="flex justify-start pl-2 pt-3 ml-5 mt-5 hover:bg-gray-700 h-12 w-4/5 rounded-2xl transition duration-500 ease-in-out hover:text-black cursor-pointer "
          >
            <AiFillHome className="mt-1" />
            <a className=" pl-2"> Home</a>
          </Link>
        </div>
        <div>
          <Link
            to="/Library"
            className="flex justify-start pl-2 pt-3 ml-5 mt-2 h-12 w-4/5 rounded-2xl hover:bg-gray-700 transition duration-500 ease-in-out hover:text-black cursor-pointer"
          >
            <AiFillDatabase className="mt-1" />
            <a className="pl-2"> My Library</a>
          </Link>
        </div>
        <div className="  flex flex-col overflow-auto pl-2 pt-3 ml-5 mt-2"></div>
      </div>
    </div>
  );
}

export default SideNav;

import { Link } from "react-router-dom";
import { AiFillHome, AiFillDatabase, AiOutlineClose } from "react-icons/ai";
import Logo from "./Logo";

function SideNav(){
    return(
        <div className="sticky left-0 top-5 w-80 h-95vh rounded-2xl bg-gray-800">
            <div className="flex flex-col justify-start">
                 <ul className=" h-full text-white">
                <li className="flex justify-between">
                    <Logo/> 
                    < AiOutlineClose className={` mr-4 mt-4 w-7 h-7`}/>
                </li>
                <li>
                <Link to="/" className="flex justify-start pl-2 pt-3 ml-5 mt-5 hover:bg-gray-700 h-12 w-4/5 rounded-2xl transition duration-500 ease-in-out hover:text-black cursor-pointer ">
                    <AiFillHome className="mt-1"/ >
                       <a className=" pl-2"> Home</a> 
                </Link>
                </li>
                <li >
                    <Link to="/Library"  className="flex justify-start pl-2 pt-3 ml-5 mt-2 h-12 w-4/5 rounded-2xl hover:bg-gray-700 transition duration-500 ease-in-out hover:text-black cursor-pointer">
                    <AiFillDatabase className="mt-1"/> 
                      <a className="pl-2"> My Library</a>  
                    </Link>
                </li>
                <li className="absolute  bottom-0 h-16">
                    <Link to="/">Games</Link>
                </li>
            </ul>
            </div>

        </div>
    );
}

export default SideNav;

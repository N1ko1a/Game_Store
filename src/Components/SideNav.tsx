import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiFillHome, AiFillDatabase, AiOutlineDoubleRight } from "react-icons/ai";
import Icon from "./Icon.tsx"
function SideNav() {
    const[menu, setMenu] = useState(() => {return false;});
    const[but, setBut] = useState(() => {return false;});
    const[click, setClick] = useState(() => {return false;});
    useEffect(() => {
        const closeMenu = () => {
            if(window.innerWidth <= 1024){
                setMenu(true);
            }
            else{
                setMenu(false);
            }

        }
        const openBut = () => {
            if(window.innerWidth <= 1024){
                setBut(true);
            }
            else{
                setBut(false);
            }
        }
        // Attach the event listener
        window.addEventListener('resize', closeMenu);
        window.addEventListener('resize', openBut);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', closeMenu);
            window.removeEventListener('resize', openBut);
        };
    },[])
    const toggleMenu = () => {
        setMenu(!menu);
        setClick(!click);
    };
    return (
     <div>  

        <div className={`fixed left-5 top-6 bottom-6 w-80 bg-gray-800 rounded-2xl ${menu ? 'invisible' : 'visible'}`}>
            <ul className=" h-full text-white">
                <li className="">
                    <Icon />
                </li>
                <li className="flex justify-start pl-2 pt-3 ml-5 mt-5 hover:bg-gray-700 h-12 w-4/5 rounded-2xl transition duration-500 ease-in-out">
                    <AiFillHome className="mt-1"/ > 
                    <Link to="/" className="ml-2 ">
                        Home
                    </Link>
                </li>
                <li className="flex justify-start pl-2 pt-3 ml-5 mt-2 h-12 w-4/5 rounded-2xl hover:bg-gray-700 transition duration-500 ease-in-out">
                    <AiFillDatabase className="mt-1"/> 
                    <Link to="/Library" className="ml-2">
                        My Library
                    </Link>
                </li>
                <li className="absolute  bottom-0 h-16">
                    <Link to="/">Games</Link>
                </li>
            </ul>
        </div>
            <button className={`text-white flex items-center justify-center z-10 h-screen  ${but ? "float-right" : "float-left"} ` } onClick={toggleMenu}>

                <AiOutlineDoubleRight className="w-7 h-7" />
            </button>
        </div>
    );
}

export default SideNav;

import React, {useState, useEffect} from "react";
import { AnimatePresence, motion} from "framer-motion";
import { AiOutlineCompress, AiOutlineClose } from "react-icons/ai";
import Liked from "./Liked.tsx";
import Cart from "./Cart.js";
import Settings from "./Settings.js";
function OtherOptions(){
    const[moreBut, setMoreBut] = useState(() => {return false;});
    const[click, setClick] = useState(() => {return false;});
    const[but, setBut] = useState(() => {return false;});
    useEffect(() => {
        const closeMoreBut = () => {
            if(window.innerWidth <= 1024){
                setMoreBut(true);
            }
            else{
                setClick(false);
                setMoreBut(false);
            }

        }
        // Attach the event listener
        window.addEventListener('resize', closeMoreBut);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', closeMoreBut);
        };
    },[])

    const toggleMenu = () => {
        setClick(!click);
        setBut(true);
    }
    return(
        <div className="flex flex-row justify-evenly fixed right-2" >
        <motion.div className={`flex flex-row justify-evenly   ${moreBut ? 'invisible' : 'visible'} `} initial={{x:0 }} animate={{x: moreBut ? 100 : 0, transition: {type: "spring"}}}   >
            <Liked/>
            <Cart/>
            <Settings/>
            </motion.div>
            <motion.div initial={{x:1000 }} animate={{x: moreBut ? 0 : 1000, transition: {type: "spring"}}}>
                <button className={`flex fixed right-0 w-12 h-12 bg-gray-800 text-white mt-5 ml-2 mr-2 rounded-lg justify-center items-center hover:text-black hover:bg-gray-700  transition duration-500 ease-in-out cursor-pointer ${moreBut ? null : 'hidden'} ${click ? 'hidden' : null}`} onClick={toggleMenu} >
                    <AiOutlineCompress/>
                </button>
            </motion.div>
            <AnimatePresence>
                {click && <motion.div className="flex flex-col justify-center mt-20" initial={{x:100, opacity: 0 }} animate={{x: 0, opacity: 1, transition: {type: "spring"}}}  exit={{ x: 100, opacity: 0}}>
                <div className="flex justify-center">
                    <Settings/>
                </div>
                <div className="flex justify-start">
                    <Liked/>
                    <Cart/>
                    <button onClick={toggleMenu} className= {`w-12 h-12 rounded-lg bg-gray-800 flex justify-center items-center text-white hover:text-black hover:bg-gray-700 transition duration-500 ease-in-out cursor-pointer mt-5 ml-2 mr-2 ${click ? null : 'hidden'}` } >
                        <AiOutlineClose/>
                    </button>
                </div>
            </motion.div>}
            </AnimatePresence>

        </div>
    );
}

export default OtherOptions;

import React, {useState,useRef, useEffect} from "react";
import { AnimatePresence, motion} from "framer-motion";
import { AiOutlineCompress, AiOutlineClose } from "react-icons/ai";
import Liked from "./Liked.tsx";
import Cart from "./Cart.js";
import Settings from "./Settings.js";
function OtherOptions(){
    // Ovo nam daje sirinu na svakom renderu, na ovaj nacin znamo kako da postavimo pocetne vrednosti da li false ili true 
    // Da ne bi doslo do greske kad smo ispod 1024 i refreshamo onda nas vrati ko da smo iznad 1024
    const windowWidth = window.innerWidth;
    const[moreBut, setMoreBut] = useState(() => {
        if(windowWidth >= 1024){
            return false;
        }
        else{
            return true;
        }
    });
    const[click, setClick] = useState(() => { return false; });
    const[but, setBut] = useState(() => { if(windowWidth >= 1024){
            return false;
        }
        else{
            return true;
        } });

  console.log('width: ', windowWidth);
    useEffect(() => {
        const closeMoreBut = () => {
            if(window.innerWidth <= 1024){
                setMoreBut(true);
                console.log("Ispod 1024");
            }
            else{
                setClick(false);
                setMoreBut(false);
                console.log("Iznad 1024");
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
        <motion.div className={`flex flex-row justify-evenly   ${moreBut ? 'hidden' : null} `} initial={{x:100 }} animate={{x: moreBut ? 100 : 0, transition: {type: "spring"}}}   >
            <Liked/>
            <Cart/>
            <Settings/>
            </motion.div>
            <motion.div initial={{x:100 }} animate={{x: moreBut ? 0 : 100, transition: {type: "spring"}}}>
                <button className={`flex fixed right-0 w-12 h-12 bg-gray-800 text-white mt-5 ml-2 mr-2 rounded-lg justify-center items-center hover:text-black hover:bg-gray-700  transition duration-500 ease-in-out cursor-pointer ${moreBut ? null : 'hidden'} ${click ? 'hidden' : null}`} onClick={toggleMenu} >
                    <AiOutlineCompress/>
                </button>
            </motion.div>
            <AnimatePresence>
                {click && <motion.div className="flex flex-col justify-center mt-20" initial={{x:10, opacity: 0 }} animate={{x: 0, opacity: 1, transition: {type: "spring"}}}  exit={{ x: 10, opacity: 0}}>
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

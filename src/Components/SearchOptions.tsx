import React, { useState } from "react";
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";

import { motion, AnimatePresence} from "framer-motion";
function SearchOptions() {
    const [generClick, setGenerClick] = useState(() => {return false;});
    const [platformClick, setPlatformClick] = useState(() => {return false});
    const [selectedGener, setSelectedGener] = useState(() => {return null;});
    const [selectedPlatform, setSelectedPlatform] = useState(() => {return null;});
    const genre = ["Action", "Adventure", "RPG", "FPS", "Sports", "Racing", "Strategy", "Casual Games"];
    const platform =  ["PC", "Xbox", "PlayStation", "Nitendo Switch", "Mobile", "VR"];
    const toggleGenerClick = () => {
    {platformClick ? setPlatformClick(false) : null}
        setGenerClick(!generClick);
    };
    const togglePlatformClick = () => {
    {generClick ? setGenerClick(false): null}
        setPlatformClick(!platformClick);
    };

    const handleGenerClick = (chose) => {
        setSelectedGener(chose);
        setGenerClick(false);

    };
    const handlePlatformClick = (chose) =>{
        setSelectedPlatform(chose);
        setPlatformClick(false);
    }

    return (
        <motion.div className="flex flex-wrap justify-between relative z-10 max-w-xl min-w-fit rounded-2xl bg-gray-800 mt-10 border-2 border-gray-900"   initial={{y: "-100vh"}} animate={{y: 0, transition: {type: "spring"}}}  exit={{ y: "-100vh", transition: { duration: 0.01 } }}>
            <div>
                <button
                    onClick={toggleGenerClick}
                    className="bg-gray-700 m-5 w-44 h-7 p-4 flex items-center justify-between font-bold text-lg text-white rounded-lg tracking-wider border-4 border-transparent active:text-white active:border-white duration-300"
                >
                    {selectedGener || "Genre"} {generClick ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                </button>
                {generClick && (
                    <div className="bg-gray-700 absolute ml-5 w-44 rounded-lg flex flex-col items-center text-white font-bold">
                        {genre.map((item) => (
                            <div 
                                onClick={() => handleGenerClick(item)}
                            >
                                <h3 className="cursor-pointer hover:text-black duration-300 ">{item}</h3>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <button
                    onClick={togglePlatformClick}
                    className="bg-gray-700 m-5 w-44 h-7 p-4 flex items-center justify-between font-bold text-lg text-white rounded-lg tracking-wider border-4 border-transparent active:text-white active:border-white duration-300"
                >
                    {selectedPlatform || "Platform"} {platformClick ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                </button>
                {platformClick && (
                    <div className="bg-gray-700 absolute ml-5 w-44 rounded-lg flex flex-col items-center text-white font-bold">
                        {platform.map((item) => (
                            <div
                                onClick={() => handlePlatformClick(item)}
                            >
                                <h3 className="cursor-pointer hover:text-black duration-300">{item}</h3>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </motion.div>
    );
}

export default SearchOptions;


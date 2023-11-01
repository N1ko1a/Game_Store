import React, { useState } from "react";
import { AiOutlineAlignRight } from "react-icons/ai";
import SearchBarOptions from "./SearchBarOptions.tsx";

import { motion, AnimatePresence} from "framer-motion";
function SearchBar({onSearchChange}) {
    const [search, setSearch] = useState(() => "");
    const[isOpen, setIsOpen] = useState(() => {return false;});
    const handleInputChange = (event) => {
        setSearch(event.target.value);
    };
 //Tracing when the button is clicked so we can open search bar options
    const toggleSearch = () =>{
        setIsOpen(!isOpen);
    };
    const handleSearch = () => {
    onSearchChange(search);
  };
    return (
        <motion.div className= "flex flex-col fixed z-10 justify-start" initial={{opacity:0, y: -10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.3}} >
            <div className="flex w-96 h-10 mt-6 rounded-2xl bg-gray-800 ">
                <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    className="w-4/5 h-10 rounded-2xl bg-transparent outline-none text-white pl-4 hover:bg-gray-700 transition duration-500 ease-in-out hover:text-black " // Add outline-none class
                    onChange={handleInputChange} // Handle input changes
                />
                <AiOutlineAlignRight className=" mr-3 w-14 h-10 p-2 text-white hover:bg-gray-700 rounded-xl transition duration-500 ease-in-out hover:text-black cursor-pointer " onClick={toggleSearch}/>
                <button onClick={handleSearch}>Dugme</button>
            </div>

{/* Conditional rendering must be inside AnimatePresence because we won't know when the render is finished to use exit animation */}
            <AnimatePresence> 
                {isOpen && <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{duration: 0.3}}
                >
                    <SearchBarOptions />
                </motion.div>}
            </AnimatePresence> 
        </motion.div>
    );
}

export default SearchBar;



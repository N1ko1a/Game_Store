import React, { useState } from "react";
import { AiOutlineAlignRight } from "react-icons/ai";
import SearchOptions from "./SearchOptions";

import { motion, AnimatePresence} from "framer-motion";
function SearchBar() {
    const [search, setSearch] = useState(() => "");
    const[isOpen, setIsOpen] = useState(() => {return false;});
    const handleInputChange = (event) => {
        setSearch(event.target.value);
    };
 //Tracing when the button is clicked so we can open search bar options
    const toggleSearch = () =>{
        setIsOpen(!isOpen);
    };
    return (
        <div className="flex flex-col items-center w-2/4">
            <div className="flex w-96 h-10 mt-6 rounded-2xl bg-gray-800">
                <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    className="w-4/5 h-10 rounded-2xl bg-transparent outline-none text-white pl-4 hover:bg-gray-700" // Add outline-none class
                    onChange={handleInputChange} // Handle input changes
                />
                <AiOutlineAlignRight className=" mr-3 w-14 h-10 p-2 text-white hover:bg-gray-700 rounded-xl" onClick={toggleSearch}/>
            </div>

{/* Conditional rendering must be inside AnimatePresence because we won't know when the render is finished to use exit animation */}
            <AnimatePresence> 
                {isOpen && <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{duration: 0.3}}
                >
                    <SearchOptions/>
                </motion.div>}
            </AnimatePresence> 
        </div>
    );
}

export default SearchBar;


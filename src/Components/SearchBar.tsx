import { useState } from "react";
import { AiOutlineAlignRight } from "react-icons/ai";
import SearchBarOptions from "./SearchBarOptions.tsx";

import { motion, AnimatePresence } from "framer-motion";

function SearchBar({
  onStoreSelect,
  onSearchChange,
  onPlatformSelect,
  onGenerSelect,
  onRatingSelect,
  onAgeSelect,
}: {
  onStoreSelect: (chose: number) => void;
  onSearchChange: (searchText: string) => void;
  onPlatformSelect: (chose: number) => void;
  onGenerSelect: (chose: number) => void;
  onRatingSelect: (chose: number) => void;
  onAgeSelect: (chose: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value;
    setSearch(searchText);
    onSearchChange(searchText); // Trigger search as the user types
  };
  const toggleSearch = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      className="flex flex-col  justify-start"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex w-96 h-10 mt-6 rounded-2xl bg-gray-800">
        <input
          type="text"
          placeholder="Search"
          value={search}
          className="w-4/5 h-10 rounded-2xl bg-transparent outline-none text-white pl-4 hover:bg-gray-700 transition duration-500 ease-in-out hover:text-black"
          onChange={handleInputChange} // Update search results as the user types
        />
        <AiOutlineAlignRight
          className="mr-3 w-14 h-10 p-2 text-white hover:bg-gray-700 rounded-xl transition duration-500 ease-in-out hover:text-black cursor-pointer"
          onClick={toggleSearch}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/*FIlter platforme*/}
            <SearchBarOptions
              onPlatformSelect={onPlatformSelect}
              onStoreSelect={onStoreSelect}
              onGenerSelect={onGenerSelect}
              onRatingSelect={onRatingSelect}
              onAgeSelect={onAgeSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default SearchBar;

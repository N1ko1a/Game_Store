import { useState } from "react";

import {
  AiOutlineCaretUp,
  AiOutlineCaretDown,
  AiOutlineArrowUp,
  AiOutlineArrowDown,
} from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

type SortProp = {
  onSortingSelect: (chose: string) => void;
  onSignSelect: (chose: string) => void;
};

function Sort({ onSortingSelect, onSignSelect }: SortProp) {
  const list = ["Name", "Rating", "Released"];
  const [isSelected, setIsSelected] = useState(false);
  const [bgColorUp, setBgColorUp] = useState("");
  const [bgColorDown, setBgColorDown] = useState("");
  const [sortingClik, setSortingClick] = useState(() => {
    return false;
  });
  const [isBlack, setIsBlack] = useState(false);

  const [selectedSorting, setSelectedSorting] = useState(() => {
    return "";
  });

  const toggleSortingClick = () => {
    setSortingClick(!sortingClik);
  };

  const handleSortingClick = (chose: string) => {
    setSelectedSorting(chose);
    onSortingSelect(chose);
    setSortingClick(false);
  };
  const sendSorting = () => {
    setIsSelected(!isSelected);
    isSelected ? onSignSelect("-") : onSignSelect("");
  };
  const toggleColor = () => {
    setIsBlack(!isBlack);
    isBlack ? setBgColorUp("#F8F8FF") : setBgColorUp("#000000");
    isBlack ? setBgColorDown("#000000") : setBgColorDown("#F8F8FF");
  };

  return (
    <motion.div className=" flex mt-5">
      <div>
        <button
          onClick={toggleSortingClick}
          className="bg-gray-700 m-5 w-32 h-7 p-4 flex items-center justify-between font-medium text-l text-white rounded-lg tracking-wider border-4 border-transparent active:text-white active:border-white duration-300"
        >
          {selectedSorting || "Sort By"}{" "}
          {sortingClik ? (
            <AiOutlineCaretUp className="transition: 0,3" />
          ) : (
            <AiOutlineCaretDown />
          )}
        </button>
        <AnimatePresence>
          {/*conditional rendering if generClick is true the expresion will be shown if its false it will not be shown*/}
          {sortingClik && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-700 absolute ml-5 w-44 rounded-lg flex flex-col items-center text-white font-medium z-30 text-l"
            >
              {/* IteratsetPlatformgh the list and outputting them */}
              {list.map((itemg) => (
                <div
                  key={itemg}
                  onClick={() => {
                    handleSortingClick(itemg);
                    sendSorting();
                  }}
                >
                  <p className="cursor-pointer hover:text-black duration-300 text-l font-medium">
                    {itemg}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button
        onClick={() => {
          toggleColor();
          sendSorting();
        }}
        className="flex justify-center items-center h-10 text-white  mt-5 rounded-lg bg-gray-700 tracking-wider border-4 border-transparent active:text-white active:border-white duration-300"
      >
        <AiOutlineArrowUp style={{ color: bgColorUp }} />

        <AiOutlineArrowDown style={{ color: bgColorDown }} />
      </button>
    </motion.div>
  );
}

export default Sort;

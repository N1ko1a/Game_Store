import { useState, useEffect } from "react";
import {
  AiOutlineCaretUp,
  AiOutlineCaretDown,
  AiFillStar,
} from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

type Genre = {
  id: number;
  name: string;
};

type Platform = {
  id: number;
  name: string;
};

type Store = {
  id: number;
  name: string;
};
type SearchOptionsProps = {
  onPlatformSelect: (chose: number) => void;
  onGenerSelect: (chose: number) => void;
  onRatingSelect: (chose: number) => void;
  onAgeSelect: (chose: string) => void;
  onStoreSelect: (chose: number) => void;
};
const SearchOptions: React.FunctionComponent<SearchOptionsProps> = (props) => {
  const {
    onPlatformSelect,
    onGenerSelect,
    onRatingSelect,
    onAgeSelect,
    onStoreSelect,
  } = props;
  const [generClick, setGenerClick] = useState(() => {
    return false;
  });
  const [platformClick, setPlatformClick] = useState(() => {
    return false;
  });
  const [ratingClick, setRatingClick] = useState(() => {
    return false;
  });
  const [ageClick, setAgeClick] = useState(() => {
    return false;
  });
  const [storeClick, setStoreClick] = useState(() => {
    return false;
  });

  const [selectedGener, setSelectedGener] = useState(() => {
    return "";
  });
  const [selectedPlatform, setSelectedPlatform] = useState(() => {
    return "";
  });
  const [selectedRating, setSelectedRating] = useState(() => {
    return 0;
  });
  const [selectedAge, setSelectedAge] = useState(() => {
    return "";
  });
  const [selectedStore, setSelectedStore] = useState(() => {
    return "";
  });

  const [genres, setGenres] = useState<Genre[]>([]);
  const [store, setStore] = useState<Store[]>([]);
  const [platform, setPlatform] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const apiURLgeners = "http://localhost:8080/genres";

    fetch(apiURLgeners)
      .then((res) => res.json())
      .then((data) => {
        setGenres(data.genres);
        console.log(data.genres);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error: ", error);
        setIsLoading(false);
      });
  }, []);
  useEffect(() => {
    setIsLoading(true);
    const apiURLplatform = "http://localhost:8080/platforms";

    fetch(apiURLplatform)
      .then((res) => res.json())
      .then((data) => {
        setPlatform(data.platforms);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error: ", error);
        setIsLoading(false);
      });
  }, []);
  useEffect(() => {
    setIsLoading(true);
    const apiURLstores = "http://localhost:8080/stores";

    fetch(apiURLstores)
      .then((res) => res.json())
      .then((data) => {
        setStore(data.stores);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error: ", error);
        setIsLoading(false);
      });
  }, []);

  const rating = [1, 2, 3, 4, 5];
  const age = ["Everyone", "Everyone +10", "Teen", "Mature", "Adults Only"];

  //Tracking when we click the dropdown menu for Gener
  const toggleGenerClick = () => {
    {
      platformClick ? setPlatformClick(false) : null;
    }
    {
      ageClick ? setAgeClick(false) : null;
    } //logic for closing any other dropdown menu so that there are not 2 or more opened at the same time
    {
      ratingClick ? setRatingClick(false) : null;
    }
    {
      storeClick ? setStoreClick(false) : null;
    } //logic for closing any other dropdown menu so that there are not 2 or more opened at the same time
    setGenerClick(!generClick);
  };
  //Tracking when we click the dropdown menu for Platform
  const togglePlatformClick = () => {
    {
      generClick ? setGenerClick(false) : null;
    } //logic for closing any other dropdown menu so that there are not 2 or more opened at the same time
    {
      ageClick ? setAgeClick(false) : null;
    } //logic for closing any other dropdown menu so that there are not 2 or more opened at the same time
    {
      ratingClick ? setRatingClick(false) : null;
    } //logic for closing any other dropdown menu so that there are not 2 or more opened at the same time
    {
      storeClick ? setStoreClick(false) : null;
    } //logic for closing any other dropdown menu so that there are not 2 or more opened at the same time
    setPlatformClick(!platformClick);
  };

  const toggleRatingClick = () => {
    {
      platformClick ? setPlatformClick(false) : null;
    } //logic for closing any other dropdown menu so that there are not 2 or more opened at the same time
    {
      generClick ? setGenerClick(false) : null;
    } //logic for closing any other dropdown menu so that there are not 2 or more opened at the same time
    {
      ageClick ? setAgeClick(false) : null;
    } //logic for closing any other dropdown menu so that there are not 2 or more opened at the same time
    {
      storeClick ? setStoreClick(false) : null;
    } //logic for closing any other dropdown menu so that there are not 2 or more opened at the same time
    setRatingClick(!ratingClick);
  };

  const toggleAgeClick = () => {
    {
      platformClick ? setPlatformClick(false) : null;
    } //logic for closing any other dropdown menu so that there are not 2 or more opened at the same time
    {
      generClick ? setGenerClick(false) : null;
    } //logic for closing any other dropdown menu so that there are not 2 or more opened at the same time
    {
      ratingClick ? setRatingClick(false) : null;
    } //logic for closing any other dropdown menu so that there are not 2 or more opened at the same time
    {
      storeClick ? setStoreClick(false) : null;
    } //logic for closing any other dropdown menu so that there are not 2 or more opened at the same time
    setAgeClick(!ageClick);
  };

  const toggleStoreClick = () => {
    {
      platformClick ? setPlatformClick(false) : null;
    } //logic for closing any other dropdown menu so that there are not 2 or more opened at the same time
    {
      generClick ? setGenerClick(false) : null;
    } //logic for closing any other dropdown menu so that there are not 2 or more opened at the same time
    {
      ratingClick ? setRatingClick(false) : null;
    } //logic for closing any other dropdown menu so that there are not 2 or more opened at the same time
    {
      ageClick ? setAgeClick(false) : null;
    } //logic for closing any other dropdown menu so that there are not 2 or more opened at the same time
    setStoreClick(!storeClick);
  };

  //Placing the selected option and closing the dropdown menu
  const handleGenerClick = (chose: string) => {
    setSelectedGener(chose);
    setGenerClick(false);
  };
  // FIlter gener
  const sendGener = (chose: number) => {
    onGenerSelect(chose);
  };
  //Placing the selected option and closing the dropdown menu
  const handlePlatformClick = (chose: string) => {
    setSelectedPlatform(chose);
    setPlatformClick(false);
  };

  // FIlter platforme
  const sendPlatform = (chose: number) => {
    onPlatformSelect(chose);
  };
  const handleRatingClick = (chose: number) => {
    setSelectedRating(chose);
    setRatingClick(false);
  };

  // FIlter Rating
  const sendRating = (chose: number) => {
    onRatingSelect(chose);
  };

  const handleAgeClick = (chose: string) => {
    setSelectedAge(chose);
    setAgeClick(false);
  };
  // FIlter Age
  const sendAge = (chose: string) => {
    onAgeSelect(chose);
  };

  const handleStoreClick = (chose: string) => {
    setSelectedStore(chose);
    setStoreClick(false);
  };

  // FIlter Store
  const sendStore = (chose: number) => {
    onStoreSelect(chose);
  };

  return (
    <motion.div className="flex flex-wrap absolute justify-evenly  w-500 h-64 rounded-2xl bg-gray-800 mt-10 border-2 border-gray-900">
      <div>
        <button
          onClick={toggleGenerClick}
          className="bg-gray-700 m-5 w-44 h-7 p-4 flex items-center justify-between font-medium text-l text-white rounded-lg tracking-wider border-4 border-transparent active:text-white active:border-white duration-300"
        >
          {selectedGener || "Genre"}{" "}
          {generClick ? (
            <AiOutlineCaretUp className="transition: 0,3" />
          ) : (
            <AiOutlineCaretDown />
          )}
        </button>
        <AnimatePresence>
          {/*conditional rendering if generClick is true the expresion will be shown if its false it will not be shown*/}
          {generClick && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-700 absolute ml-5 w-44 rounded-lg flex flex-col items-center text-white font-medium text-l"
            >
              {/* IteratsetPlatformgh the list and outputting them */}
              {genres.map((itemg) => (
                <div
                  key={itemg.id}
                  onClick={() => {
                    handleGenerClick(itemg.name);
                    sendGener(itemg.id);
                  }}
                >
                  <p className="cursor-pointer hover:text-black duration-300 text-l font-medium">
                    {itemg.name}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Platform*/}
      <div>
        <button
          onClick={togglePlatformClick}
          className="bg-gray-700 m-5 w-44 h-7 p-4 flex items-center justify-between font-medium text-l text-white rounded-lg tracking-wider border-4 border-transparent active:text-white active:border-white duration-300"
        >
          {selectedPlatform || "Platform"}{" "}
          {platformClick ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
        </button>
        <AnimatePresence>
          {platformClick && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-700 z-20 absolute ml-5 w-44 rounded-lg flex flex-col items-center text-white font-medium text-l"
            >
              {platform.map((item) => (
                <div
                  onClick={() => {
                    handlePlatformClick(item.name);
                    sendPlatform(item.id);
                  }}
                >
                  <p className="cursor-pointer hover:text-black duration-300 text-l font-medium">
                    {item.name}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/*Rating*/}
      <div>
        <button
          onClick={toggleRatingClick}
          className="bg-gray-700 m-5 w-44 h-7 p-4 flex items-center justify-between font-medium text-l text-white rounded-lg tracking-wider border-4 border-transparent active:text-white active:border-white duration-300"
        >
          {selectedRating ? (
            <h3 className="flex justify-between">
              {selectedRating} <AiFillStar className="mt-1.5" />
            </h3>
          ) : (
            "Rating"
          )}{" "}
          {ratingClick ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
        </button>
        <AnimatePresence>
          {/*conditional rendering if generClick is true the expresion will be shown if its false it will not be shown*/}
          {ratingClick && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-700 absolute ml-5 w-44 rounded-lg flex flex-col items-center text-white font-medium text-l"
            >
              {/* Iterating through the list and outputting them */}
              {rating.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    handleRatingClick(item);
                    sendRating(item);
                  }}
                >
                  <p className="cursor-pointer hover:text-black duration-300 flex font-medium text-l justify-between">
                    {item} <AiFillStar className="mt-1" />
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/*Age Rating*/}
      <div>
        <button
          onClick={toggleAgeClick}
          className="bg-gray-700 m-5 w-44 h-7 p-4 flex items-center justify-between font-medium text-l text-white rounded-lg tracking-wider border-4 border-transparent active:text-white active:border-white duration-300"
        >
          {selectedAge || "Age Rating"}{" "}
          {ageClick ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
        </button>
        <AnimatePresence>
          {/*conditional rendering if generClick is true the expresion will be shown if its false it will not be shown*/}
          {ageClick && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-700 absolute ml-5 w-44 rounded-lg flex flex-col items-center text-white font-medium text-l"
            >
              {/* Iterating through the list and outputting them */}
              {age.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    handleAgeClick(item);
                    sendAge(item);
                  }}
                >
                  <p className="cursor-pointer hover:text-black duration-300 flex justify-between font-medium text-l">
                    {item}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/*Price*/}
      <div>
        <button
          onClick={toggleStoreClick}
          className="bg-gray-700 m-5 w-44 h-7 p-4 flex items-center justify-between font-medium text-l text-white rounded-lg tracking-wider border-4 border-transparent active:text-white active:border-white duration-300"
        >
          {selectedStore || "Store"}{" "}
          {storeClick ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
        </button>
        <AnimatePresence>
          {/*conditional rendering if generClick is true the expresion will be shown if its false it will not be shown*/}
          {storeClick && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-700 absolute ml-5 w-44 rounded-lg flex flex-col items-center text-white "
            >
              {/* Iterating through the list and outputting them */}
              {store.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    handleStoreClick(item.name);
                    sendStore(item.id);
                  }}
                >
                  <p className="cursor-pointer hover:text-black duration-300 flex justify-between text-l font-medium ">
                    {item.name}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SearchOptions;

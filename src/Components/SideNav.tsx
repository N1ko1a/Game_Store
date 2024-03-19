import { Link } from "react-router-dom";
import { AiFillHome, AiFillDatabase, AiOutlineClose } from "react-icons/ai";
import Logo from "./Logo";
import { useEffect, useState } from "react";
import LibGameCart from "./LibGameCart";
import { motion, AnimatePresence } from "framer-motion";

type Games = {
  id: number;
  name: string;
  background_image: string;
  description_raw: string;
  released: string;
  platforms: { platform: { name: string } }[];
  developers: { name: string }[];
  genres: { name: string }[];
  publishers: { name: string }[];
};

function SideNav({ rest, handletoggleMenu }) {
  const [libGames, setLibGames] = useState<Games[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isToken, setIsToken] = useState(
    JSON.parse(window.localStorage.getItem("Prisustvo_Tokena")) || false,
  );
  const [isGameAdded, setIsGameAdded] = useState(
    JSON.parse(window.localStorage.getItem("Game_added")) || false,
  );
  const [show, setShowe] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  console.log("Show", show);

  useEffect(() => {
    setShowe(isToken);
  }, [isToken]);

  useEffect(() => {
    setIsAdded(isGameAdded);
  }, [isGameAdded]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsToken(
        JSON.parse(window.localStorage.getItem("Prisustvo_Tokena")) || false,
      );
      setIsAdded(
        JSON.parse(window.localStorage.getItem("Game_added")) || false,
      );
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (show) {
      const email = JSON.parse(window.localStorage.getItem("Email_korisnika"));
      fetch(`http://localhost:8080/user/${email}`)
        .then((res) => res.json())
        .then((data1) => {
          setLibGames(data1.user.games);
          window.localStorage.setItem("Game_added", JSON.stringify(false));
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setIsLoading(false);
        });
    }
  }, [show, isAdded]);

  const onClick = () => {
    handletoggleMenu(true);
  };
  return (
    <AnimatePresence>
      <motion.div
        className="fixed z-30 left-5 top-5 w-80 h-95vh rounded-2xl bg-gray-800"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex w-full h-full flex-col justify-start text-white">
          <div className="flex justify-between">
            <Logo />
            {rest ? (
              <button onClick={onClick}>
                <AiOutlineClose className={`mr-4 mt-4 w-7 h-7`} />
              </button>
            ) : null}
          </div>
          <div>
            <Link
              to="/"
              className="flex justify-start pl-2 pt-3 ml-5 mt-5 hover:bg-gray-700 h-12 w-4/5 rounded-2xl transition duration-500 ease-in-out hover:text-black cursor-pointer "
            >
              <AiFillHome className="mt-1" />
              <span className="pl-2"> Home</span>
            </Link>
          </div>
          <div>
            <h1 className="flex justify-start pl-2 pt-3 ml-5 mt-2 h-12 w-4/5 rounded-2xl ">
              <AiFillDatabase className="mt-1" />
              <span className="pl-2"> My Library</span>
            </h1>
          </div>
          <div className="flex flex-col justify-start items-center mt-10 w-full h-full overflow-auto">
            {show ? (
              isLoading ? (
                <h1>Loading...</h1>
              ) : (
                libGames.map((game) => (
                  <LibGameCart
                    key={game.id}
                    id={game.id}
                    background={game.background_image}
                    name={game.name}
                  />
                ))
              )
            ) : null}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SideNav;

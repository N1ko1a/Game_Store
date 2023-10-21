import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import LoadSkeleton from "./LoadSkeleton";

function GamePrev() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
    const[width, setWidth] = useState(0);
    const ref= useRef(null);

 const windowWidth = window.innerWidth;
    const[grid, setGrid] = useState(() => { if(windowWidth >= 1800){
            return false;
        }
        else{
            return true;
        }});
 useEffect(() => {
        const changeJust = () => {
            if(window.innerWidth <= 1800){
                setGrid(true);
            }
            else{
                setGrid(false);
            }

        }

        // Attach the event listener
        window.addEventListener('resize', changeJust);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', changeJust);
        };
    },[])

    useEffect(() => {
        console.log("Ovo gledas: " + ref.current.scrollWidth + ref.current.offsetWidth)
         setWidth(ref.current.scrollWidth - ref.current.offsetWidth);
    },[])
  


  useEffect(() => {
    fetch(
      'https://api.rawg.io/api/games?key=4557ebdc3256470e8e4b78f25d277a04&dates=2019-09-01,2023-10-18&page_size=10&page=1&ordering=-popularity'
    )
      .then((res) => res.json())
      .then((data) => {
        setGames(data.results);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  }, []);

  return (
            <motion.div  className={`flex  mr-20  overflow-hidden ${grid ? "ml-0 " : "ml-96"} ${grid ? "mr-0 " : null} `}>
    <motion.div  ref={ref} className="flex  mt-14" drag="x" dragConstraints={{ right: 0 , left: -6000}}>
      {isLoading ? (
        Array.from({ length: 10 }).map((_, index) => (
          <LoadSkeleton key={index} />
        ))
      ) : (
        games.map((game) => (
          <motion.div
            key={game.id}
            className={`min-w-custom h-96 flex items-end  rounded-3xl m-5 ${grid ? "scale-100" : null}` }
            style={{
              backgroundImage: `url(${game.background_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
                                
            <motion.div className="text-white ml-5 mb-3">
              <h1 className="text-4xl font-bold w-1/2 mb-5">{game.name}</h1>
              <button className="bg-white text-black w-28 h-10 rounded-xl">See more</button>
            </motion.div>
          </motion.div>
        ))
      )}
    </motion.div>
    </motion.div>
  );
}

export default GamePrev;


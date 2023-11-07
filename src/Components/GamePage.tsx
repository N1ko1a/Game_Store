import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AiFillLeftCircle,
  AiOutlineDesktop,
  AiOutlineSetting,
  AiOutlineTags,
  AiOutlineGlobal,
} from "react-icons/ai";
import LoadingGame from "./LoadingGame";

function GamePage(props) {
  const [games, setGames] = useState(null); // Initialize as null
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://api.rawg.io/api/games/${props.id}?key=4557ebdc3256470e8e4b78f25d277a04`,
    )
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }, [props]);

  return (
    <div className="flex flex-col h-3/4 justify-start mt-28 ml-10">
      {isLoading ? (
        <LoadingGame /> // Display a loading indicator
      ) : games ? (
        <div>
          <div className="text-4xl font-bold text-white">
            <h1>{games.name}</h1>
          </div>
          <div className="mt-5 flex flex-row">
            <div className="w-2/4">
              <img
                src={games.background_image}
                alt="Game image"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
            <div className="ml-10 w-2/4 text-white">
              <h1 className="text-2xl">
                <span className="text-blue-500">Game</span> Description
              </h1>
              <p className="mt-2">{games.description_raw}</p>
              <div className="mt-10">
                <p className="flex items-center text-lg">
                  <AiFillLeftCircle className="mr-2" /> RELEAS DATE:
                  <span className="ml-2 text-sm"> {games.released} </span>{" "}
                </p>
                <p className="flex items-center mr-2 text-lg">
                  <AiOutlineDesktop className="mr-2" />
                  PLATFORMS:{" "}
                  <span className="ml-2 text-sm">
                    {games.platforms
                      .map((platform) => platform.platform.name)
                      .join(", ")}
                  </span>
                </p>

                <p className="flex items-center mr-2 text-lg">
                  <AiOutlineSetting className="mr-2" />
                  DEVELOPERS:{" "}
                  <span className="ml-2 text-sm">
                    {games.developers
                      .map((developer) => developer.name)
                      .join(", ")}
                  </span>{" "}
                </p>
                <p className="flex items-center mr-2 text-lg">
                  <AiOutlineTags className="mr-2" /> GENRES:{" "}
                  <span className="ml-2 text-sm">
                    {games.genres.map((gen) => gen.name).join(", ")}
                  </span>
                </p>
                <p className="flex items-center mr-2 text-lg">
                  <AiOutlineGlobal className="mr-2" /> PUBLISHERS:{" "}
                  <span className="ml-2 text-sm">
                    {games.publishers.map((pub) => pub.name).join(", ")}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>No game data available.</div>
      )}
    </div>
  );
}

export default GamePage;

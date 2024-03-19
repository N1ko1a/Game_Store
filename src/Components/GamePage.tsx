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

type GamesPageProp = {
  id: number;
};
type Games = {
  id: number;
  name: string;
  background_image: string;
  description_raw: string;
  released: string;
  // This property represents the platforms on which the game is available. It's an array of objects, where each object has a platform property, which in turn has a name property of type string. This allows for listing multiple platforms with their names.
  platforms: { platform: { name: string } }[];
  developers: { name: string }[];
  genres: { name: string }[];
  publishers: { name: string }[];
};
function GamePage(props: GamesPageProp) {
  const [games, setGames] = useState<Games | null>(null); // Initialize as null
  const [gamesTest, setGamesTest] = useState<Games | null>(null); // Initialize as null
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://api.rawg.io/api/games/${props.id}?key=daab5ee3f0004ba1bd33811319e3d65d`,
    )
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        console.log(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
    fetch(`https://api.rawg.io/api/games?key=daab5ee3f0004ba1bd33811319e3d65d`)
      .then((res) => res.json())
      .then((data1) => {
        setGamesTest(data1);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }, [props]);

  const onAddToLibrary = async () => {
    try {
      const email = JSON.parse(window.localStorage.getItem("Email_korisnika"));

      // Proverite da li postoje podaci o igri
      if (games) {
        const response = await fetch(
          `http://localhost:8080/userUpdate/${email}/${games.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();

        if (response.ok) {
          console.log("Successfully added game to the user");
          window.localStorage.setItem("Game_added", JSON.stringify(true));
          window.dispatchEvent(new Event("storage"));
        } else {
          // Handle error scenarios
          console.error("Failed to submit data to the backend");
        }
      } else {
        console.error("No game data available");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  return (
    <div className="flex flex-col h-3/4 justify-start mt-10 ml-10">
      {isLoading ? (
        <LoadingGame /> // Display a loading indicator
      ) : games ? (
        <div>
          <div className=" flex justify-between  h-12 w-2/4   text-white">
            <h1 className="text-4xl font-bold">{games.name}</h1>
            <button
              onClick={onAddToLibrary}
              className="bg-gray-800 hover:text-black hover:bg-gray-700 transition duration-500 ease-in-out cursor-pointer p-2 mr-5 rounded-2xl"
            >
              Add to Library
            </button>
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
              <h1 className="text-2xl ">Description</h1>
              <p className="mt-2 ">{games.description_raw}</p>
              <div className="mt-10">
                <p className="flex items-center text-lg">
                  <AiFillLeftCircle className="mr-2" /> RELEAS DATE:
                  <span className="ml-2 text-sm"> {games.released} </span>{" "}
                </p>
                <p className="flex items-center mr-2 text-lg">
                  <AiOutlineDesktop className="mr-2" />
                  PLATFORMS:{" "}
                  <span className="ml-2 text-sm">
                    {/*join spaja u jedan string umesto da se printa jedan po jedan element u svakom redu*/}
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

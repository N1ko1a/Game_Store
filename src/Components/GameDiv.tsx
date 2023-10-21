import React, { useEffect, useState } from "react";
import LoadSkeleton from "./LoadSkeleton.tsx";
import { AiFillStar } from "react-icons/ai";
function GameDiv(){
    const[games, setGames] = useState([])
    const[isLoading, setIsLoading] = useState(() => {return true;});
    useEffect(() => {
  fetch('https://api.rawg.io/api/games?key=4557ebdc3256470e8e4b78f25d277a04&dates=2019-09-01,2023-10-18&page_size=50&page=1&ordering=-popularity')
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
      return(
        <div className=" grid xl:grid-cols-5  md:grid-cols-3 sm:grid-cols-2 gap-10 mt-20 mr-20 ml-20 justify-center items-center  overflow-hidden">
            {isLoading ? (
            Array.from({length: 40}).map((_,index) => (
            <LoadSkeleton key={index}/>
            ))
            ) : (
                    games.map((game) => (
                <div>
            <button className="flex flex-col justify-start items-center w-60 h-56 rounded-3xl text-white hover:bg-gray-800 ease-in-out duration-500 hover:text-black">
                <div className="flex justify-center items-center w-56 h-36">
                <img src={game.background_image} alt="Game"  className="w-56 h-36 rounded-3xl object-fill  "/>
                </div>
                <div className="flex flex-row w-52 h-20 justify-between mt-2">
                    <h1>{game.name}</h1>
                    <span className="flex"><AiFillStar className="mt-1"/>{game.rating}</span>
                </div>
            </button>
            </div>
                ))


            )}
                   </div>

    );
}

export default GameDiv;

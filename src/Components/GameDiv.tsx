import React, { useEffect, useState } from "react";

function GameDiv(){
    const[games, setGames] = useState([])
    useEffect(() => {
  fetch('https://api.rawg.io/api/games?key=4557ebdc3256470e8e4b78f25d277a04&dates=2019-09-01,2023-10-18&page_size=50&page=50')
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
        setGames(data.results);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}, []);
    return(
        <div className=" grid xl:grid-cols-5  md:grid-cols-3 sm:grid-cols-2 gap-10 mt-20 mr-20 ml-20 justify-center items-center  overflow-hidden">
                {games.map((game) => (
                <div>
            <button className="flex flex-col justify-center items-center w-60 h-44 rounded-3xl text-white hover:bg-gray-800 ease-in-out duration-500 hover:text-black">
                <div className="flex justify-center items-center">
                <img src={game.background_image} alt="Game" className="w-56 h-32 rounded-3xl object-fill "/>
                </div>
                <div className="flex flex-row w-52 justify-between m-2">
                    <h1>{game.name}</h1>
                    <p>$50</p>
                </div>
            </button>
            </div>
                ))}
        </div>

    );
}

export default GameDiv;

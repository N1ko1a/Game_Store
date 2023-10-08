import React from "react"
import myImage from "../Slike/game-controller.png";
function Icon(){
    return (
        <div className="flex ml-5 mt-4 mb-4 ">
            <div>
                <img src={myImage} alt="Nema slike" className="w-16 place-content-centet " /> 
            </div>
            <div className="place-content-evenly mt-1.5 text-left ml-2">
                <h1 className="text-2xl font-extrabold text-white font-serif">PLAY</h1>
                <p className="text-xs text-white">GAMESTORE</p>
            </div>
        </div>
    )
}

export default Icon

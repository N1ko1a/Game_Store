import { AiFillStar } from "react-icons/ai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSSProperties } from "react";

type GameCartProp = {
  id: number;
  name: string;
  background: string;
  rating: number;
};

function LibGameCart(props: GameCartProp) {
  const navigate = useNavigate();
  const navigateToGame = () => {
    navigate("Game", { state: { id: props.id } });
  };
  const backgroundImageStyle: CSSProperties = {
    backgroundImage: `url(${props.background})`,
    backgroundSize: "cover", // Adjust this property as needed
    backgroundPosition: "center", // Center the background image
  };

  return (
    <div className="text-sm">
      <h1 className="text-white font-bold">{props.name}</h1>
      <button
        className="flex flex-col justify-start items-center w-60 h-16 mb-5 rounded-3xl text-white hover:bg-gray-800 ease-in-out duration-500 hover:text-black"
        style={backgroundImageStyle}
        onClick={navigateToGame}
      ></button>
    </div>
  );
}

export default LibGameCart;

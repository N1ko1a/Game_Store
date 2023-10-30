import { AiFillStar } from "react-icons/ai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Game from "../Routes/Game";
function GameCart(props) {
  const [imageLoaded, setImageLoaded] = useState(false);

    const navigate = useNavigate();
    const navigateToGame = () => {
        navigate('Game', { state: { id: props.id } });
    }
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const imageContainerStyle = {
    position: "relative",
    width: "100%",
    paddingTop: "64%", // Adjust this value to control the aspect ratio
    overflow: "hidden",
    borderRadius: "15px",
  };

  const imageStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "15px",
    objectFit: "cover",
    filter: imageLoaded ? "none" : "blur(8px)",
    transition: "filter 0.5s ease-in-out",
  };

  return (
    <button className="flex flex-col justify-start items-center w-60 h-56 rounded-3xl text-white hover:bg-gray-800 ease-in-out duration-500 hover:text-black" onClick={navigateToGame}>
      <div style={imageContainerStyle}>
        <img
          src={props.background}
          alt="Game image"
          loading="lazy"
          style={imageStyle}
          onLoad={handleImageLoad}
        />
      </div>
      <div className="flex flex-row w-52 h-20 justify-between mt-4">
        <h1 className="mr-2">{props.name}</h1>
        <span className="flex">
          <AiFillStar className="mt-1" />
          {props.rating}
        </span>
      </div>
    </button>
  );
}

export default GameCart;


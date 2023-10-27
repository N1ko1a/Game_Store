import {AiFillStar} from "react-icons/ai"

function GameCart(props){
    return(
            <button className="flex flex-col justify-start items-center w-60 h-56 rounded-3xl text-white hover:bg-gray-800 ease-in-out duration-500 hover:text-black">
                <img src={props.background} alt="Game image" className="w-56 h-36 rounded-3xl object-fill" />
                <div className="flex flex-row w-52 h-20 justify-between mt-2">
                    <h1>{props.name}</h1>
                    <span className="flex"><AiFillStar className="mt-1"/>{props.rating}</span>
                </div>


            </button>

    );
}

export default GameCart;

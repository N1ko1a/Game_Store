import { AiFillHeart } from "react-icons/ai";

function Liked() {
  return (
    <button className="w-12 h-12 mr-5  rounded-lg flex justify-center items-center bg-gray-900 text-white hover:text-black hover:bg-gray-700 transition duration-500 ease-in-out cursor-pointer">
      <AiFillHeart />
    </button>
  );
}

export default Liked;

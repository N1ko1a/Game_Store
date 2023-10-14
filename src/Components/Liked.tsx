import React, { useState } from "react";
import { AiFillHeart} from "react-icons/ai";

function Liked(){

        

    return(
        <div className="mt-5 ml-2 mr-2" >
            <button className="w-12 h-12 rounded-lg bg-gray-800 flex justify-center items-center text-white hover:text-black hover:bg-gray-700 transition duration-500 ease-in-out cursor-pointer">
                <AiFillHeart/>   
            </button>
        </div>
    );
}

export default Liked


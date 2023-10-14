import React from "react";
import { AiOutlineShoppingCart} from "react-icons/ai";

function Cart(){
    return(
        <div className="mt-5 ml-2 mr-2" >
            <button className="w-12 h-12  rounded-lg bg-gray-800 flex justify-center items-center text-white hover:text-black hover:bg-gray-700 transition duration-500 ease-in-out cursor-pointer">
                <AiOutlineShoppingCart/>   
            </button>
        </div>
    );
}

export default Cart

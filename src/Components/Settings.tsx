import React from "react";
import profile from "../Slike/Cyberpunk.jpg"

function Settings(){
    return(
        <div>
        

            <button className="flex flex-row w-44 h-12 bg-gray-800 mt-5 ml-2 mr-2 justify-start items-center pl-2 rounded-lg text-white hover:text-black hover:bg-gray-700  transition duration-500 ease-in-out cursor-pointer  " >
                
                <img src={profile} alt="Profilna" className="w-10 h-10 rounded-3xl pt-1 object-cover"/>
                <div className=" pl-2">
                    <h1 className="text-sm font-bold">Neski</h1>
                    <p className="text-xs text-gray-600">Veiw profile</p>
                </div>
            </button>

            
        </div>
    );
}

export default Settings

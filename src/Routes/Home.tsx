import SideNav from "../Components/SideNav"

import React, { useEffect, useState } from "react";
import SearchBar from "../Components/SearchBar"
import OtherOptions from "../Components/OtherOptions"
import GameDiv from "../Components/GameDiv"
import GamePrev from "../Components/GamePrev";

function Home(){
 const windowWidth = window.innerWidth;
    const[grid, setGrid] = useState(() => { if(windowWidth >= 1800){
            return false;
        }
        else{
            return true;
        }});
 useEffect(() => {
        const changeJust = () => {
            if(window.innerWidth <= 1800){
                setGrid(true);
            }
            else{
                setGrid(false);
            }

        }

        // Attach the event listener
        window.addEventListener('resize', changeJust);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', changeJust);
        };
    },[])
   
    return (
        <div className="flex flex-col">
            <SideNav/>
            <div className="flex flex-row justify-center">
                <SearchBar/>
                <OtherOptions/>
            </div>
                    <GamePrev/>
            <div className={`flex ${grid ? "justify-center " : "justify-end"}`}>
                    <GameDiv/>
            </div>
        </div>
    )
}

export default Home


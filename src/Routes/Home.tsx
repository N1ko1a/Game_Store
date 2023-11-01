import { useState } from "react";
import GameDisplay from "../Components/GameDisplay";
import GamePrev from "../Components/GamePrev";
import SideNav from "../Components/SideNav";
import TopNav from "../Components/TopNav";

function Home(){
const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };
    return(
        <div className="flex flex-row justify-center">
            <SideNav/>
            <div className="w-4/5">
                <TopNav onSearchChange={handleSearchChange}/>
                <GamePrev/>
                <GameDisplay searchValue = {searchValue}/>
            </div>
        </div>
    );
}

export default Home; 

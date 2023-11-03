import { useState } from "react";
import GameDisplay from "../Components/GameDisplay";
import GamePrev from "../Components/GamePrev";
import SideNav from "../Components/SideNav";
import TopNav from "../Components/TopNav";

function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedGener, setSelectedGener] = useState("");

  const handleOnPlatformSelect = (value) => {
    setSelectedPlatform(value);
  };
  const handleOnGenerSelect = (value) => {
    setSelectedGener(value);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  return (
    <div className="flex flex-row justify-center">
      <SideNav />
      <div className="w-4/5">
        <TopNav
          onSearchChange={handleSearchChange}
          onPlatformSelect={handleOnPlatformSelect} // Changed the prop name
                    onGenerSelect={handleOnGenerSelect}
        />
        <GamePrev />
                {}
        <GameDisplay searchValue={searchValue} selectedPlatform={selectedPlatform} selectedGenreSearch = {selectedGener} /> {/* Passed the selected platform */}
      </div>
    </div>
  );
}

export default Home;


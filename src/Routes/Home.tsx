import { useState } from "react";
import GameDisplay from "../Components/GameDisplay";
import GamePrev from "../Components/GamePrev";
import SideNav from "../Components/SideNav";
import TopNav from "../Components/TopNav";

function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState(0);
  const [selectedGener, setSelectedGener] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedStore, setSelectedStore] = useState(0);

  const handleOnPlatformSelect = (value: number) => {
    setSelectedPlatform(value);
  };
  const handleOnStoreSelect = (value: number) => {
    setSelectedStore(value);
  };
  const handleOnAgeSelect = (value: string) => {
    setSelectedAge(value);
  };
  const handleOnGenerSelect = (value: number) => {
    setSelectedGener(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleRatingChange = (value: number) => {
    setSelectedRating(value);
  };

  return (
    <div className="flex flex-row justify-center">
      <SideNav />
      <div className="w-4/5">
        <TopNav
          onSearchChange={handleSearchChange}
          onPlatformSelect={handleOnPlatformSelect} // Changed the prop name
          onGenerSelect={handleOnGenerSelect}
          onRatingSelect={handleRatingChange}
          onAgeSelect={handleOnAgeSelect}
          onStoreSelect={handleOnStoreSelect}
        />
        <GamePrev />
        {}
        <GameDisplay
          searchValue={searchValue}
          selectedStore={selectedStore}
          selectedAge={selectedAge}
          selectedPlatform={selectedPlatform}
          selectedRating={selectedRating}
          selectedGenreSearch={selectedGener}
        />{" "}
        {/* Passed the selected platform */}
      </div>
    </div>
  );
}

export default Home;

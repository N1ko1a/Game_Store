import { useState, useEffect } from "react";
import { AiOutlineDoubleRight } from "react-icons/ai";
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
  const [click, setClick] = useState(false);
  const windowWidth = window.innerWidth;
  const [menu, setMenu] = useState(() => {
    if (windowWidth >= 1800) {
      return false;
    } else {
      return true;
    }
  });
  const [rest, setRest] = useState(() => {
    if (windowWidth >= 1800) {
      return false;
    } else {
      return true;
    }
  });

  useEffect(() => {
    const closeMenu = () => {
      if (window.innerWidth <= 1800) {
        setMenu(true);
        setRest(true);
      } else {
        setMenu(false);
        setRest(false);
      }
    };
    // Attach the event listener
    window.addEventListener("resize", closeMenu);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", closeMenu);
    };
  }, []);
  const toggleMenu = () => {
    setMenu(false);
  };

  const handletoggleMenu = (value) => {
    setMenu(value);
    console.log(menu);
  };
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
    <div className="flex flex-row justify-center w-screen h-screen">
      <div className=" flex  items-center h-screen w-2/12">
        {menu ? (
          <AiOutlineDoubleRight
            onClick={toggleMenu}
            className="fixed w-8 h-8 text-white"
          />
        ) : (
          <SideNav rest={rest} handletoggleMenu={handletoggleMenu} />
        )}
      </div>
      {rest ? (
        <div className="w-screen h-full">
          <TopNav
            onSearchChange={handleSearchChange}
            onPlatformSelect={handleOnPlatformSelect} // Changed the prop name
            onGenerSelect={handleOnGenerSelect}
            onRatingSelect={handleRatingChange}
            onAgeSelect={handleOnAgeSelect}
            onStoreSelect={handleOnStoreSelect}
          />
          <GamePrev />
          <GameDisplay
            searchValue={searchValue}
            selectedStore={selectedStore}
            selectedAge={selectedAge}
            selectedPlatform={selectedPlatform}
            selectedRating={selectedRating}
            selectedGenreSearch={selectedGener}
          />
        </div>
      ) : (
        <div className="w-4/5 h-full">
          <TopNav
            onSearchChange={handleSearchChange}
            onPlatformSelect={handleOnPlatformSelect} // Changed the prop name
            onGenerSelect={handleOnGenerSelect}
            onRatingSelect={handleRatingChange}
            onAgeSelect={handleOnAgeSelect}
            onStoreSelect={handleOnStoreSelect}
          />
          <GamePrev />
          <GameDisplay
            searchValue={searchValue}
            selectedStore={selectedStore}
            selectedAge={selectedAge}
            selectedPlatform={selectedPlatform}
            selectedRating={selectedRating}
            selectedGenreSearch={selectedGener}
          />
        </div>
      )}
    </div>
  );
}

export default Home;

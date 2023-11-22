import { useEffect, useState } from "react";
import GameCart from "./GameCart";
import ReactPaginate from "react-paginate";
import LoadSkeleton from "./LoadSkeleton";
import MenuButtons from "./MenuButtons";
import Sort from "./Sort";

type GameType = {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  esrb_rating: { name: string };
};

function GameDisplay({
  searchValue,
  selectedStore,
  selectedPlatform,
  selectedGenreSearch,
  selectedRating,
  selectedAge,
}: {
  selectedStore: number;
  searchValue: string;
  selectedPlatform: number;
  selectedGenreSearch: number;
  selectedRating: number;
  selectedAge: string;
}) {
  const [games, setGames] = useState<GameType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedSort, setSelectedSort] = useState("");
  const [sign, setSign] = useState("");
  const maxPage = 50;
  const itemsPerPage = 20;
  const [vrednost, setVrednost] = useState(6);

  useEffect(() => {
    setIsLoading(true);
    const pageToFetch = currentPage + 1;
    const genreFilter =
      selectedGenre === "all" ? "" : `&genres=${selectedGenre}`;
    const genreFilterSearch = selectedGenreSearch ? selectedGenreSearch : "";
    const storeFilter = selectedStore ? selectedStore : "";
    const platformFilter = selectedPlatform ? selectedPlatform : "";
    switch (selectedRating) {
      case 1:
        setVrednost(1);
        break;
      case 2:
        setVrednost(2);
        break;
      case 3:
        setVrednost(3);
        break;
      case 4:
        setVrednost(4);
        break;
      case 5:
        setVrednost(5);
        break;
      default:
        break;
    }

    // const apiURL = `https://api.rawg.io/api/games?key=4557ebdc3256470e8e4b78f25d277a04&dates=2019-09-01,2023-10-18&page=${pageToFetch}&page_size=${itemsPerPage}&ordering=-popularity${genreFilter}${platformFilter}${genreFilterSearch}${storeFilter}&search=${searchValue}&ordering=${sign}${selectedSort.toLowerCase()}`;
    const apiURL = `http://localhost:8080/games?page=${pageToFetch}&pageSize=${itemsPerPage}&search=${searchValue}&platform=${platformFilter}&store=${storeFilter}&genre=${genreFilterSearch}`;

    fetch(apiURL)
      .then((res) => res.json())
      .then((data) => {
        const gameResults = data.games || []; // default to an empty array if results is undefined
        setGames(gameResults);
        setIsLoading(false);
        console.log("Podaci:", gameResults);
      })
      .catch((error) => {
        console.error("Error: ", error);
        setIsLoading(false);
      });
  }, [
    currentPage,
    vrednost,
    selectedGenre,
    selectedPlatform,
    selectedGenreSearch,
    selectedRating,
    selectedAge,
    selectedStore,
    searchValue,
    selectedSort,
    sign,
  ]);

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };
  const handleSortingChange = (sort: string) => {
    setSelectedSort(sort);
  };
  const handleSignChanfe = (sort: string) => {
    setSign(sort);
  };

  return (
    <div>
      <div className="flex justify-between   mr-20">
        <MenuButtons
          onGenreChange={handleGenreChange}
          selectedGenre={selectedGenre}
        />
        <Sort
          onSortingSelect={handleSortingChange}
          onSignSelect={handleSignChanfe}
        />
      </div>
      <div className="grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-10 mt-5 mr-20 ml-20 justify-center items-center overflow-hidden">
        {isLoading
          ? Array.from({ length: itemsPerPage }).map((_, index) => (
              <LoadSkeleton key={index} />
            ))
          : games
              //               .filter((item) => {
              //                 const ratingCondition =
              //                   vrednost === 6 ||
              //                   (item.rating >= vrednost && item.rating <= vrednost + 1);
              //                 {
              //                   /*If selectedAge is an empty string, the condition is immediately true, allowing all items to be displayed.
              // If selectedAge is not an empty string, it checks if item.esrb_rating is defined and whether the name property of item.esrb_rating matches the selectedAge. If these conditions are met, the item is displayed.*/
              //                 }
              //                 const ageCondition =
              //                   selectedAge === "" ||
              //                   (item.esrb_rating && item.esrb_rating.name === selectedAge);
              //
              //                 return ratingCondition && ageCondition;
              //               })
              .map((game) => (
                <GameCart
                  id={game.id}
                  background={game.background_image}
                  name={game.name}
                  rating={game.rating}
                />
              ))}
      </div>
      <div className="flex justify-center items-center">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={100}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={
            "flex flex-row text-white justify-between items-center w-96 h-10 p-2"
          }
          activeClassName={"active"}
          previousClassName={"hover:text-black ease-in-out duration-300"}
          nextClassName={"hover:text-black ease-in-out duration-300"}
          pageClassName={"hover:text-black ease-in-out duration-300"}
          breakClassName={""}
        />
      </div>
    </div>
  );
}

export default GameDisplay;

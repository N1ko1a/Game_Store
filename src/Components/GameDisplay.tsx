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
  const [selectedGenre, setSelectedGenre] = useState(0);
  const [selectedSort, setSelectedSort] = useState("");
  const [sign, setSign] = useState("");
  const [itemCount, setItemCount] = useState(0);
  const itemsPerPage = 20;
  const [vrednost, setVrednost] = useState(6);
  const pageCount = Math.ceil(itemCount / itemsPerPage);

  useEffect(() => {
    setIsLoading(true);
    const pageToFetch = currentPage + 1;
    const genreFilter = selectedGenre === 0 ? "" : selectedGenre;
    const genreFilterSearch = selectedGenreSearch ? selectedGenreSearch : "";
    const storeFilter = selectedStore ? selectedStore : "";
    const platformFilter = selectedPlatform ? selectedPlatform : "";

    if (selectedRating) {
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
    }
    const ratingFilter = selectedRating ? selectedRating : "";
    const apiURL = `http://localhost:8080/games?page=${pageToFetch}&pageSize=${itemsPerPage}&search=${searchValue}&platform=${platformFilter}&store=${storeFilter}&genre=${
      genreFilterSearch || genreFilter
    }&rating=${ratingFilter}&age=${selectedAge}&sort=${selectedSort}&sign=${sign}`;

    fetch(apiURL)
      .then((res) => res.json())
      .then((data) => {
        const gameResults = data.games || []; // default to an empty array if results is undefine
        setItemCount(data.countToReturn);
        setGames(gameResults);
        setIsLoading(false);
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
    <div className="  ">
      <div className="flex flex-col sm:flex-row w-full h-fit  justify-between">
        <div className="flex w-full sm:w-2/3 h-fit   ">
          <MenuButtons
            onGenreChange={handleGenreChange}
            selectedGenre={selectedGenre}
          />
        </div>
        <div className="flex justify-center sm:justify-end w-full sm:w-1/3 pr-5">
          <Sort
            onSortingSelect={handleSortingChange}
            onSignSelect={handleSignChanfe}
          />
        </div>
      </div>
      <div className="grid  grid-cols-1 xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-5 w-full mt-5  justify-items-center overflow-hidden">
        {isLoading
          ? Array.from({ length: itemsPerPage }).map((_, index) => (
              <LoadSkeleton key={index} />
            ))
          : games.map((game) => (
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
          pageCount={pageCount}
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

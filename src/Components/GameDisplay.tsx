import { useEffect, useState } from "react";
import GameCart from "./GameCart";
import ReactPaginate from "react-paginate";
import LoadSkeleton from "./LoadSkeleton";
import MenuButtons from "./MenuButtons";

function GameDisplay({ searchValue, selectedPlatform, selectedGenreSearch, selectedRating }) {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const itemsPerPage = 20;
    const [vrednost, setVrednost] = useState(6);
   

  useEffect(() => {
    setIsLoading(true);
    const pageToFetch = currentPage + 1;
    const genreFilter = selectedGenre === "all" ? "" : `&genres=${selectedGenre}`;
    const genreFilterSearch = selectedGenreSearch ? `&genres=${selectedGenreSearch}` : "";
    const platformFilter = selectedPlatform ? `&platforms=${selectedPlatform}` : "";
            setVrednost(4);
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
  

    const apiURL = `https://api.rawg.io/api/games?key=4557ebdc3256470e8e4b78f25d277a04&dates=2019-09-01,2023-10-18&page=${pageToFetch}&page_size=${itemsPerPage}&ordering=-popularity${genreFilter}${platformFilter}${genreFilterSearch}`;

    fetch(apiURL)
      .then((res) => res.json())
      .then((data) => {
        setGames(data.results);
        setIsLoading(false);
        console.log(data.results);
      })
      .catch((error) => {
        console.error('Error: ', error);
        setIsLoading(false);
      });
  }, [currentPage, vrednost, selectedGenre, selectedPlatform, selectedGenreSearch, selectedRating]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  return (
    <div>
      <MenuButtons onGenreChange={handleGenreChange}  selectedGenre={selectedGenre}  />
      <div className="grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-10 mt-5 mr-20 ml-20 justify-center items-center overflow-hidden">
        {isLoading ? (
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <LoadSkeleton key={index} />
          ))
        ) : (
         games.filter((item) => {
  const searchCondition = searchValue.toLowerCase() === "" || item.name.toLowerCase().includes(searchValue);
  const ratingCondition = item.rating < vrednost || (item.rating >= vrednost && item.rating <= vrednost+1);
  return searchCondition && ratingCondition;
})
            .map((game) => (
              <GameCart id={game.id} background={game.background_image} name={game.name} rating={game.rating} />
            ))
        )}
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
          containerClassName={"flex flex-row text-white justify-between items-center w-96 h-10 p-2"}
          subContainerClassName={"pages pagination"}
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


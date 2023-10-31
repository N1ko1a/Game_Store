import React, { useEffect, useState } from "react";
import GameCart from "./GameCart";
import ReactPaginate from "react-paginate";
import LoadSkeleton from "./LoadSkeleton";
import MenuButtons from "./MenuButtons";

function GameDisplay() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState("all"); // Default to "all" genres
  const itemsPerPage = 20;

  useEffect(() => {
    setIsLoading(true);
    const pageToFetch = currentPage + 1;
    const genreFilter = selectedGenre === "all" ? "" : `&genres=${selectedGenre}`;
    const apiURL = `https://api.rawg.io/api/games?key=4557ebdc3256470e8e4b78f25d277a04&dates=2019-09-01,2023-10-18&page=${pageToFetch}&page_size=${itemsPerPage}&ordering=-popularity${genreFilter}`;

    fetch(apiURL)
      .then((res) => res.json())
      .then((data) => {
        setGames(data.results);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error: ', error);
        setIsLoading(false);
      });
  }, [currentPage, selectedGenre]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  return (
    <div>
      <MenuButtons onGenreChange={handleGenreChange} selectedGenre={selectedGenre} />
      <div className="grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-10 mt-5 mr-20 ml-20 justify-center items-center overflow-hidden">
        {isLoading ? (
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <LoadSkeleton />
          ))
        ) : (
          games.map((game) => (
            <GameCart
              id={game.id}
              background={game.background_image}
              name={game.name}
              rating={game.rating}
            />
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


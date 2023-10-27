import React, { useEffect, useState } from "react";
import GameCart from "./GameCart";
import ReactPaginate from "react-paginate";

function GameDisplay() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // Start from the first page
  const itemsPerPage = 20; // Number of games to display per page

  useEffect(() => {
    setIsLoading(true);
    const pageToFetch = currentPage + 1; // Adjust for 1-based page numbering
    const apiURL = `https://api.rawg.io/api/games?key=4557ebdc3256470e8e4b78f25d277a04&dates=2019-09-01,2023-10-18&page=${pageToFetch}&page_size=${itemsPerPage}&ordering=-popularity`;

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
  }, [currentPage]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div>
      <div className="grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-10 mt-20 mr-20 ml-20 justify-center items-center overflow-hidden">
        {isLoading ? (
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <h1 key={index}>Loading.....</h1>
          ))
        ) : (
          games.map((game) => (
            <GameCart
              key={game.id}
              background={game.background_image}
              name={game.name}
              rating={game.rating}
            />
          ))
        )}
      </div>

      <ReactPaginate
                className="flex flex-row justify-center items-center w-96 h-10 p-2"
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={5} // Set to 5 for 5 pages
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />
    </div>
  );
}

export default GameDisplay;


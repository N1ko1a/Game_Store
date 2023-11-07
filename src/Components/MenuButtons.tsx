import { useEffect, useState } from "react";

function MenuButtons({ onGenreChange, selectedGenre }) {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const list = [4, 3, 5, 2, 10, 1, 6, 15];
  useEffect(() => {
    setIsLoading(true);
    const apiURL =
      "https://api.rawg.io/api/genres?key=4557ebdc3256470e8e4b78f25d277a04";

    fetch(apiURL)
      .then((res) => res.json())
      .then((data) => {
        setGenres(data.results);
        setIsLoading(false);
        console.log(data.results);
      })
      .catch((error) => {
        console.error("Error: ", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex justify-start ml-20 mt-10">
      <button
        className={`text-white hover:text-black ease-in-out duration-500 h-10 ml-2 mr-2 text-sm ${
          selectedGenre === "all" ? "font-bold" : ""
        }`}
        onClick={() => onGenreChange("all")}
      >
        All
      </button>
      {list.map((lis) => {
        const genre = genres.find((genre) => genre.id === lis);
        if (genre) {
          return (
            <button
              key={genre.id}
              className={`text-white hover:text-black ease-in-out duration-500 h-10 ml-2 mr-2 text-sm ${
                selectedGenre === genre.id ? "font-bold" : ""
              }`}
              onClick={() => onGenreChange(genre.id)}
            >
              {genre.name}
            </button>
          );
        }
        return null;
      })}
    </div>
  );
}

export default MenuButtons;

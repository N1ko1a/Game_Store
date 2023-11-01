import  { useEffect, useState } from "react";

function MenuButtons({ onGenreChange, selectedGenre }) {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const apiURL = "https://api.rawg.io/api/genres?key=4557ebdc3256470e8e4b78f25d277a04";

    fetch(apiURL)
      .then((res) => res.json())
      .then((data) => {
        setGenres(data.results);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error: ', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex justify-center mt-10">
      <button
        className={`text-white hover:text-black ease-in-out duration-300 h-10 ml-2 mr-2 text-sm ${
          selectedGenre === "all" ? "font-bold" : ""
        }`}
        onClick={() => onGenreChange("all")}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          className={`text-white hover:text-black ease-in-out duration-300 h-10 ml-2 mr-2 text-sm ${
            selectedGenre === genre.id ? "font-bold" : ""
          }`}
          onClick={() => onGenreChange(genre.id)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}

export default MenuButtons;


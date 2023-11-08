import { useEffect, useState } from "react";

type MenuButtonsProps = {
  onGenreChange: (genreId: number) => void;
  //A union type is a way to specify that a variable or parameter can hold values of multiple types
  selectedGenre: number | string;
};

type Gener = {
  name: string;
  id: number;
};
function MenuButtons({ onGenreChange, selectedGenre }: MenuButtonsProps) {
  const [genres, setGenres] = useState<Gener[]>([]);
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
        onClick={() => onGenreChange(0)}
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

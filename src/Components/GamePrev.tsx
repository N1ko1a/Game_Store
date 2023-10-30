import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoadingPrev from "./LoadingPrev";

function GamePrev() {
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [width, setWidth] = useState(0);
    const ref = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        fetch('https://api.rawg.io/api/games?key=4557ebdc3256470e8e4b78f25d277a04&dates=2019-09-01,2023-10-18&page_size=10&page=1&ordering=-popularity')
            .then((res) => res.json())
            .then((data) => {
                setGames(data.results);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        setWidth(ref.current.scrollWidth - ref.current.offsetWidth);
    }, []);

    const handleImageLoad = () => {
        setImageLoaded(true);
        console.log("Image is loaded");
    };

    return (
        <motion.div ref={ref} className="flex flex-row mt-20 ml-5 overflow-hidden">
            <motion.div className="flex  mt-14" drag="x" dragConstraints={{ right: 0, left: -width }}>
                {isLoading ? (
                    Array.from({ length: 10 }).map((_, index) => <LoadingPrev key={index} />)
                ) : (
                    games.map((game) => (
                        <motion.div
                            key={game.id}
                            className={`min-w-custom h-96 flex items-end  rounded-3xl m-5 `}
                            style={{
                                backgroundImage: `url(${game.background_image})`,
                                filter: imageLoaded ? "none" : "blur(8px)",
                                transition: "filter 0.5s ease-in-out",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <motion.div className="text-white ml-5 mb-3">
                                <h1 className="text-4xl font-bold w-1/2 mb-5">{game.name}</h1>
                                <button className="bg-white text-black w-28 h-10 rounded-xl">See more</button>
                            </motion.div>
                                {/* Ovaj img tag sluzi samo da prati da li se slika ucitala i da promeni stanje ucitavanja, a postavili smo display da bude none da ne bih duplirali sliku. Jer u suprotnom posto je slika background pa ne mozeo da pratimo onLoad bice uvek u fazi ucitavanja i uvek ce da bude blur*/}
                            <img
                                src={game.background_image}
                                alt=""
                                onLoad={handleImageLoad}
                                onError={handleImageLoad} // If there's an error loading the image, still consider it loaded
                                style={{ display: "none" }} // Hide the image tag
                            />
                        </motion.div>
                    ))
                )}
            </motion.div>
        </motion.div>
    );
}

export default GamePrev;


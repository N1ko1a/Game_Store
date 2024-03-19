import { useEffect, useState } from "react";
import Cart from "./Cart";
import Liked from "./Liked";
import Profile from "./Profile";
import RegisterForm from "./RegisterForm";

function Options() {
  const [isToken, setIsToken] = useState(
    JSON.parse(window.localStorage.getItem("Prisustvo_Tokena")) || false,
  );
  const [show, setShowe] = useState(false);

  useEffect(() => {
    setShowe(isToken);
  }, [isToken]);

  // Dodajte event listener za promene u local storage-u
  useEffect(() => {
    const handleStorageChange = () => {
      // Ažurirajte isToken na osnovu promene u local storage-u
      setIsToken(
        JSON.parse(window.localStorage.getItem("Prisustvo_Tokena")) || false,
      );
    };

    // Dodajte event listener
    window.addEventListener("storage", handleStorageChange);

    // Vratite cleanup funkciju kako biste uklonili event listener kada se komponenta demontira
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  return (
    <div className="flex flex-row justify-evenly  right-2">
      {show ? <Profile /> : <RegisterForm />}
    </div>
  );
}

export default Options;

import { useEffect, useState } from "react";
import profilna from "../Slike/Cyberpunk.jpg";

function Profile() {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    setUserName(JSON.parse(window.localStorage.getItem("User_name")));
  });
  const onLogout = async () => {
    try {
      const response = await fetch(`http://localhost:8080/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        window.localStorage.setItem("Prisustvo_Tokena", JSON.stringify(false));
        window.localStorage.removeItem("User_name");
        window.dispatchEvent(new Event("storage"));
      } else {
        // Handle error scenarios
        console.error("Failed to submit data to the backend");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  return (
    <button
      onClick={onLogout}
      className="flex flex-row w-fit h-12 bg-gray-800 mt-5 ml-2 mr-2 justify-start items-center pl-2 rounded-lg text-white hover:text-black hover:bg-gray-700 transition duration-500 ease-in-out cursor-pointer"
    >
      <img
        src={profilna}
        alt="Profilna"
        className="w-10 h-10 rounded-3xl pt-1 object-cover"
      />
      <div className="pl-2 mr-5">
        <h1 className="text-sm font-bold">{userName}</h1>
        <p>Logout</p>
      </div>
    </button>
  );
}

export default Profile;

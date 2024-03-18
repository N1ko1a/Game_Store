import { useState, useRef, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

const Sign_in = ({
  toggleSignIn,
}: {
  toggleSignIn: (arg0: boolean) => void; //treba biti funkcija koja prima jedan argument tipa boolean i ne vraća ništa (void)
}) => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [apiError, setApiError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null); //koristi ga input element pa je ovog tipa
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);
  const setTokenFalseAfterTimeout = () => {
    setTimeout(() => {
      // Postavi token na false nakon 1 sata (3600000 ms)
      window.localStorage.setItem("Prisustvo_Tokena", JSON.stringify(false));
      window.dispatchEvent(new Event("storage"));

      console.log("Token postavljen na false nakon 1 sata");
    }, 3600000); // 1 sat = 3600000 milisekundi
  };

  const handleClick = () => {
    toggleSignIn(false);
  };

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    //ocekujemo element koji je povezan sa change na input
    setEmailValue((event.target as HTMLInputElement).value); // kako bismo eksplicitno rekli TypeScriptu da prepozna event.target kao HTMLInputElement
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue((event.target as HTMLInputElement).value);
  };

  const handleButtonClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/login?email=${emailValue}&password=${passwordValue}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const data = await response.json();
      setApiError(data.error);
      if (response.ok) {
        window.localStorage.setItem("Prisustvo_Tokena", JSON.stringify(true));
        window.localStorage.setItem(
          "User_name",
          JSON.stringify(data.user.firstName),
        );
        window.dispatchEvent(new Event("storage"));
        setTokenFalseAfterTimeout();
        setEmailValue("");
        setPasswordValue("");
        setApiError("");
        toggleSignIn(false);
      } else {
        // Handle error scenarios
        console.error("Failed to submit data to the backend");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const handleEnterPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    ref: React.RefObject<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      if (ref === emailRef && passwordRef.current) {
        passwordRef.current.focus();
      } else if (ref === passwordRef) {
        handleButtonClick();
      }
    }
  };
  return (
    <div className="w-full h-screen  fixed z-40 top-1/4 left-40ps ">
      <div className="bg-gray-800 w-96 h-96 mb-10  text-white rounded-3xl ">
        <div className="w-full h-5 mr-10 relative mb-5 ">
          <AiOutlineClose
            className="w-5 h-5 absolute top-8 right-5 hover:text-black  transition duration-500 ease-in-out cursor-pointer"
            onClick={() => handleClick()}
          />
        </div>
        <div className="flex flex-col justify-center items-center mt-20">
          <input
            ref={emailRef}
            type="text"
            placeholder="Email"
            value={emailValue}
            onChange={handleEmail}
            onKeyDown={(event) => handleEnterPress(event, emailRef)}
            className="w-4/5 h-10 m-2 rounded-2xl bg-gray-900 outline-none text-white pl-4 hover:bg-gray-700 transition duration-500 ease-in-out "
          />
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            value={passwordValue}
            onChange={handlePassword}
            onKeyDown={(event) => handleEnterPress(event, passwordRef)}
            className={`w-4/5 h-10 m-2 rounded-2xl bg-gray-900 outline-none text-white pl-4 hover:bg-gray-700 transition duration-500 ease-in-out ${passwordValue ? "text-xs" : "text-base"} `}
          />
          {apiError != "" && (
            <p style={{ color: "red", textAlign: "center", margin: "0" }}>
              {apiError}
            </p>
          )}
          <button
            className=" w-2/5 h-10 mt-5  text-center rounded-2xl bg-gray-900 outline-none text-white  hover:bg-gray-700 transition duration-500 ease-in-out hover:text-black"
            onClick={handleButtonClick}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sign_in;

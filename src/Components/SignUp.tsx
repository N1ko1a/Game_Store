import { AiOutlineClose } from "react-icons/ai";
import { useState, useRef, useEffect } from "react";

const SignUp = ({
  toggleSignUp,
}: {
  toggleSignUp: (arg0: boolean) => void; //treba biti funkcija koja prima jedan argument tipa boolean i ne vraća ništa (void)
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfiramtion] = useState("");
  const [apiError, setApiError] = useState("");
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmationRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, []);

  const setTokenFalseAfterTimeout = () => {
    setTimeout(() => {
      // Postavi token na false nakon 1 sata (3600000 ms)
      window.localStorage.setItem("Prisustvo_Tokena", JSON.stringify(false));
      window.localStorage.removeItem("Email_korisnika");
      window.dispatchEvent(new Event("storage"));

      console.log("Token postavljen na false nakon 1 sata");
    }, 3600000); // 1 sat = 3600000 milisekundi
  };

  const handleFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };
  const handleLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };
  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handlePasswordConfirmation = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordConfiramtion(event.target.value);
  };
  const handleButtonClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/register?firstName=${firstName}&lastName=${lastName}&email=${email}&password=${password}&passwordConfirmation=${passwordConfirmation}`,
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
        console.log("Successfully registered");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setPasswordConfiramtion("");
        toggleSignUp(false);
        window.localStorage.setItem("Prisustvo_Tokena", JSON.stringify(true));
        window.localStorage.setItem("Email_korisnika", JSON.stringify(email));
        window.dispatchEvent(new Event("storage"));
        setTokenFalseAfterTimeout();
      } else {
        // Handle error scenarios
        console.error("Failed to submit data to the backend");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const handleClick = () => {
    toggleSignUp(false);
  };

  const handleEnterPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    ref: React.RefObject<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      if (ref === firstNameRef && lastNameRef.current) {
        lastNameRef.current.focus();
      } else if (ref === lastNameRef && emailRef.current) {
        emailRef.current.focus();
      } else if (ref === emailRef && passwordRef.current) {
        passwordRef.current.focus();
      } else if (ref === passwordRef && passwordConfirmationRef.current) {
        passwordConfirmationRef.current.focus();
      } else if (ref === passwordConfirmationRef) {
        handleButtonClick(); // Trigger sign-up action when Enter is pressed on the last field
      }
    }
  };

  return (
    <div className="w-full h-screen  fixed z-40 top-1/4 left-40ps ">
      <div className="bg-gray-800 w-96 h-fit mb-10  text-white rounded-3xl ">
        <div className="w-full h-5 mr-10 relative mb-5 ">
          <AiOutlineClose
            className="w-5 h-5 absolute top-8 right-5 hover:text-black  transition duration-500 ease-in-out cursor-pointer"
            onClick={handleClick}
          />
        </div>
        <div className="flex flex-col justify-center items-center mt-10">
          <input
            ref={firstNameRef}
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={handleFirstName}
            onKeyDown={(event) => handleEnterPress(event, firstNameRef)}
            className="w-4/5 h-10 m-2  rounded-2xl bg-gray-900 outline-none text-white pl-4 hover:bg-gray-700 transition duration-500 ease-in-out "
          />
          <input
            ref={lastNameRef}
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={handleLastName}
            onKeyDown={(event) => handleEnterPress(event, lastNameRef)}
            className="w-4/5 h-10 m-2 rounded-2xl bg-gray-900 outline-none text-white pl-4 hover:bg-gray-700 transition duration-500 ease-in-out "
          />

          <input
            ref={emailRef}
            type="text"
            placeholder="Email"
            value={email}
            onChange={handleEmail}
            onKeyDown={(event) => handleEnterPress(event, emailRef)}
            className="w-4/5 h-10 m-2 rounded-2xl bg-gray-900 outline-none text-white pl-4 hover:bg-gray-700 transition duration-500 ease-in-out "
          />
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePassword}
            onKeyDown={(event) => handleEnterPress(event, passwordRef)}
            className={`w-4/5 h-10 m-2 rounded-2xl bg-gray-900 outline-none text-white pl-4 hover:bg-gray-700 transition duration-500 ease-in-out ${password ? "text-xs" : "text-base"} `}
          />
          <input
            ref={passwordConfirmationRef}
            type="password"
            placeholder="Confirm Password"
            value={passwordConfirmation}
            onChange={handlePasswordConfirmation}
            onKeyDown={(event) =>
              handleEnterPress(event, passwordConfirmationRef)
            }
            className={`w-4/5 h-10 m-2 rounded-2xl bg-gray-900 outline-none text-white pl-4 hover:bg-gray-700 transition duration-500 ease-in-out ${passwordConfirmation ? "text-xs" : "text-base"} `}
          />
          {apiError != "" && (
            <p style={{ color: "red", textAlign: "center", margin: "0" }}>
              {apiError}
            </p>
          )}
          <button
            className=" w-2/5 h-10 mt-5 mb-5  text-center rounded-2xl bg-gray-900 outline-none text-white  hover:bg-gray-700 transition duration-500 ease-in-out hover:text-black"
            onClick={handleButtonClick}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

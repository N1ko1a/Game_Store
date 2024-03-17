import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";

const SignUp = ({ toggleSignUp }) => {
  const [onClick, setOnClick] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfiramtion] = useState("");
  const [isValideEmail, setIsValideEmail] = useState(true);
  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [isValidePassword, setIsValidePassword] = useState(true);
  const [errorMessagePassword, setErrorMessagePassword] = useState("");

  const handleFirstName = (event) => {
    setFirstName(event.target.value);
  };
  const handleLastName = (event) => {
    setLastName(event.target.value);
  };
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };
  const handlePasswordConfirmation = (event) => {
    setPasswordConfiramtion(event.target.value);
  };
  const handleButtonClick = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/register?firstName=Nikola&lastName=Ivanovic&email=ivanovicn@gmail.com&password=Otakustream1?&passwordConfirmation=Otakustream1?",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (response.ok) {
        console.log("Successfully registered");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setPasswordConfiramtion("");
      } else {
        // Handle error scenarios
        console.error("Failed to submit data to the backend");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const handleClick = () => {
    setOnClick(!onClick);
    toggleSignUp(onClick);
  };

  return (
    <div className="w-full h-screen  fixed z-40 top-1/4 left-40ps ">
      <div className="bg-gray-800 w-96 h-96 mb-10  text-white rounded-3xl ">
        <div className="w-full h-5 mr-10 relative mb-5 ">
          <AiOutlineClose
            className="w-5 h-5 absolute top-8 right-5 hover:text-black  transition duration-500 ease-in-out cursor-pointer"
            onClick={handleClick}
          />
        </div>
        <div className="flex flex-col justify-center items-center mt-10">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={handleFirstName}
            className="w-4/5 h-10 m-2  rounded-2xl bg-gray-900 outline-none text-white pl-4 hover:bg-gray-700 transition duration-500 ease-in-out hover:text-black"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={handleLastName}
            className="w-4/5 h-10 m-2 rounded-2xl bg-gray-900 outline-none text-white pl-4 hover:bg-gray-700 transition duration-500 ease-in-out hover:text-black"
          />

          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={handleEmail}
            className="w-4/5 h-10 m-2 rounded-2xl bg-gray-900 outline-none text-white pl-4 hover:bg-gray-700 transition duration-500 ease-in-out hover:text-black"
          />
          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={handlePassword}
            className="w-4/5 h-10 m-2 rounded-2xl bg-gray-900 outline-none text-white pl-4 hover:bg-gray-700 transition duration-500 ease-in-out hover:text-black"
          />
          <input
            type="text"
            placeholder="Confirm Password"
            value={passwordConfirmation}
            onChange={handlePasswordConfirmation}
            className="w-4/5 h-10 m-2 rounded-2xl bg-gray-900 outline-none text-white pl-4 hover:bg-gray-700 transition duration-500 ease-in-out hover:text-black"
          />
          {!isValideEmail && (
            <p style={{ color: "red", textAlign: "center", margin: "0" }}>
              {errorMessageEmail}
            </p>
          )}
          {!isValidePassword && (
            <p style={{ color: "red", textAlign: "center", margin: "0" }}>
              {errorMessagePassword}
            </p>
          )}
          <button
            className=" w-2/5 h-10 mt-5  text-center rounded-2xl bg-gray-900 outline-none text-white  hover:bg-gray-700 transition duration-500 ease-in-out hover:text-black"
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

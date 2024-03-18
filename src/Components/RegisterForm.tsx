import { useState } from "react";
import SignUp from "./SignUp";
import Sign_in from "./Sign_in";

function RegisterForm() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const openSignIn = () => {
    setShowSignIn(!showSignIn);
    setShowSignUp(false);
  };
  const openSignUp = () => {
    setShowSignUp(!showSignUp);
    setShowSignIn(false);
  };
  const toggleSignIn = (value: boolean) => {
    setShowSignIn(value);
  };
  const toggleSignUp = (value: boolean) => {
    setShowSignUp(value);
  };

  return (
    <div className="flex flex-row ">
      <button
        className="w-20 h-12 mt-5 ml-2 mr-1  bg-gray-800 rounded-lg text-white hover:text-black hover:bg-gray-700 transition duration-500 ease-in-out cursor-pointer"
        onClick={() => openSignIn()}
      >
        Sing In
      </button>
      <button
        className="w-20 h-12 mt-5  mr-2  bg-gray-800 rounded-lg text-white hover:text-black hover:bg-gray-700 transition duration-500 ease-in-out cursor-pointer"
        onClick={() => openSignUp()}
      >
        Sing Up
      </button>
      {showSignUp ? <SignUp toggleSignUp={toggleSignUp} /> : null}
      {showSignIn ? <Sign_in toggleSignIn={toggleSignIn} /> : null}
    </div>
  );
}
export default RegisterForm;

import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const Sign_in = ({ toggleSignIn }) => {
  const [onClick, setOnClick] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [submitedValue, setSubmitedValue] = useState(null);
  console.log(emailValue);

  const handleClick = () => {
    setOnClick(!onClick);
    toggleSignIn(onClick);
  };

  const handleEmail = (event) => {
    setEmailValue(event.target.value);
  };
  const handlePassword = (event) => {
    setPasswordValue(event.target.value);
  };
  //OVO TREBA DA SE POGLEDA NE ZNAM KAKO RADI I NIJE ZAVRSENO
  const handleButtonClick = async () => {
    try {
      const response = await fetch("your-backend-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubmitedValue(data.message); // Assuming your backend sends a message in response
      } else {
        // Handle error scenarios
        console.error("Failed to submit data to the backend");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
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
            type="text"
            placeholder="Email"
            value={emailValue}
            onChange={handleEmail}
            className="w-4/5 h-10 m-2 rounded-2xl bg-gray-900 outline-none text-white pl-4 hover:bg-gray-700 transition duration-500 ease-in-out hover:text-black"
          />
          <input
            type="text"
            placeholder="Password"
            value={passwordValue}
            onChange={handlePassword}
            className="w-4/5 h-10 m-2 rounded-2xl bg-gray-900 outline-none text-white pl-4 hover:bg-gray-700 transition duration-500 ease-in-out hover:text-black"
          />
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

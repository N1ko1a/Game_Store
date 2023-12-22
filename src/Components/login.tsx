function login() {
  return (
    <div className="w-full h-screen  fixed z-40 top-1/4 left-40ps ">
      <div className=" bg-gray-800 w-96 h-96  text-white rounded-3xl flex flex-col  items-center">
        <input
          type="text"
          placeholder="Email"
          className="w-4/5 h-10 m-2 rounded-2xl bg-gray-900 outline-none text-white pl-4 hover:bg-gray-700 transition duration-500 ease-in-out hover:text-black"
        />
        <input
          type="text"
          placeholder="Password"
          className="w-4/5 h-10 m-2 rounded-2xl bg-gray-900 outline-none text-white pl-4 hover:bg-gray-700 transition duration-500 ease-in-out hover:text-black"
        />
        <button className=" w-2/5 h-10 mt-5  text-center rounded-2xl bg-gray-900 outline-none text-white  hover:bg-gray-700 transition duration-500 ease-in-out hover:text-black">
          Sign in
        </button>
      </div>
    </div>
  );
}

export default login;

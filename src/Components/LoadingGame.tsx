function LoadingGame(){
    return(

        <div className="flex  flex-row  items-center min-w-custom h-3/4 mt-20 ml-10 rounded-3xl bg-gray-600 animate-pulse">
            <div className=" w-2/4 h-5/6 ml-5 rounded-3xl bg-gray-700">

            </div>
            <div className="flex w-2/4 flex-col">
            <div className="w-11/12 m-2 h-10 rounded-3xl bg-gray-700"></div>
            <div className="w-11/12 m-2 h-10 rounded-3xl bg-gray-700"></div>
            <div className="w-11/12 m-2 h-10 rounded-3xl bg-gray-700"></div>
            <div className="w-11/12 m-2 h-10 rounded-3xl bg-gray-700"></div>
            <div className="w-11/12 m-2 h-10 rounded-3xl bg-gray-700"></div>
            <div className="w-11/12 m-2 h-10 rounded-3xl bg-gray-700"></div>
            </div>
        </div>
    );
}

export default LoadingGame;

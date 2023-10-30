function LoadingPrev(){
    return(

        <div className="flex  items-end min-w-custom m-10 h-96 rounded-3xl bg-gray-600 animate-pulse">
            {/*Ovo je za ime i dugme*/}
            <div className="flex flex-col w-52 justify-start m-2">
                {/*Posto ne koristimo ni jedan drugi element sem div moramo da zamenimo h1 i p */}
                <div className="w-80 mb-14 ml-5 h-10 bg-gray-700"></div>
                <div className="w-28 ml-5 mb-5 h-10 bg-gray-700"></div>
            </div>
        </div>
    );
}

export default LoadingPrev;

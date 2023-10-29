
function LoadSkeleton(){
    return(
        //Ovaj je bio button i animate-pulse polako pulsira 
        <div className="flex flex-col justify-center items-center w-60 h-44 rounded-3xl bg-gray-600 animate-pulse">
            {/*Ovaj je za image */}
            <div className="w-56 h-32 rounded-3xl bg-gray-700"></div>
            {/*Ovo je za ime i cenu*/}
            <div className="flex flex-row w-52 justify-between m-2">
                {/*Posto ne koristimo ni jedan drugi element sem div moramo da zamenimo h1 i p */}
                <div className="w-20 h-4 bg-gray-700"></div>
                <div className="w-10 h-4 bg-gray-700"></div>
            </div>
        </div>
    )
}

export default LoadSkeleton;


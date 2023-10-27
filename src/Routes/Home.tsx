import GameDisplay from "../Components/GameDisplay";
import GamePrev from "../Components/GamePrev";
import SideNav from "../Components/SideNav";
import TopNav from "../Components/TopNav";

function Home(){
    return(
        <div className="flex flex-row justify-center">
            <SideNav/>
            <div className="w-4/5">
                <TopNav/>
                <GamePrev/>
                <GameDisplay/>
            </div>
        </div>
    );
}

export default Home;

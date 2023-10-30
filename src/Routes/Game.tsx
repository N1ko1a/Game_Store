import { useLocation } from "react-router-dom";
import GamePage from "../Components/GamePage";
import Options from "../Components/Options";
import SideNav from "../Components/SideNav";

function Game(props){
    const { id } = useLocation().state;

    return(
        <div className="flex flex-row justify-center">
            <SideNav/>
            <div className="w-4/5">
                <Options/>
                <GamePage id = {id}/>
            </div>

        </div>
    );
}

export default Game;

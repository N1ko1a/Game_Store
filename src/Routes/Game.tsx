import { useLocation } from "react-router-dom";

import GamePage from "../Components/GamePage";
import Options from "../Components/Options";
import SideNav from "../Components/SideNav";
import TopNav from "../Components/TopNav";

function Game() {
  const { id } = useLocation().state;

  return (
    <div className="flex flex-row justify-center">
      <div className="h-screen w-2/12">
        <SideNav />
      </div>
      <div className="w-4/5 h-full">
        <GamePage id={id} />
      </div>
    </div>
  );
}

export default Game;

import { useLocation } from "react-router-dom";

import GamePage from "../Components/GamePage";
import Options from "../Components/Options";
import SideNav from "../Components/SideNav";

function Game() {
  const { id } = useLocation().state;

  return (
    <div className="flex flex-row justify-center">
      <div className="mt-5">
        <SideNav />
      </div>
      <div className="w-4/5">
        <Options />
        <GamePage id={id} />
      </div>
    </div>
  );
}

export default Game;

import GamePage from "../Components/GamePage";
import {
  AiOutlineCaretUp,
  AiOutlineCaretDown,
  AiFillStar,
} from "react-icons/ai";
import Options from "../Components/Options";
import SideNav from "../Components/SideNav";
import TopNav from "../Components/TopNav";

function Library() {
  return (
    <div className="flex flex-row justify-center">
      <SideNav />
      <div className="w-4/5">
        <Options />
        <GamePage id="1" />
      </div>
    </div>
  );
}

export default Library;

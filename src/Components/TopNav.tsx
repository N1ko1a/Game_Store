import Options from "./Options";
import SearchBar from "./SearchBar";

function TopNav(){
    return(
        <div className="flex flex-row justify-between z-10  ml-20">
            <SearchBar/>
            <Options/>
        </div>
    );
}

export default TopNav;

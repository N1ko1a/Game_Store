import Options from "./Options";
import SearchBar from "./SearchBar";

function TopNav({onSearchChange}){
    return(
        <div className="flex flex-row justify-between z-10  ml-20">
            <SearchBar onSearchChange={onSearchChange} />
            <Options/>
        </div>
    );
}

export default TopNav;

import Options from "./Options";
import SearchBar from "./SearchBar";

function TopNav({onSearchChange, onPlatformSelect, onGenerSelect, onRatingSelect}){
    return(
        <div className="flex flex-row justify-between z-10  ml-20">
            {/*Filter platforme  */}
        
            <SearchBar onSearchChange={onSearchChange} onPlatformSelect={onPlatformSelect} onGenerSelect={onGenerSelect}  onRatingSelect={onRatingSelect}/>
            <Options/>
        </div>
    );
}

export default TopNav;

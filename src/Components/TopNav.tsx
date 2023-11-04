import Options from "./Options";
import SearchBar from "./SearchBar";

function TopNav({onSearchChange, onPlatformSelect, onGenerSelect, onRatingSelect, onStoreSelect, onAgeSelect}){
    return(
        <div className="flex flex-row justify-between z-10  ml-20">
            {/*Filter platforme  */}
        
            <SearchBar onSearchChange={onSearchChange} onPlatformSelect={onPlatformSelect} onStoreSelect={onStoreSelect} onAgeSelect={onAgeSelect} onGenerSelect={onGenerSelect}  onRatingSelect={onRatingSelect}/>
            <Options/>
        </div>
    );
}

export default TopNav;

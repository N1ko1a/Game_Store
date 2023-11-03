import Options from "./Options";
import SearchBar from "./SearchBar";

function TopNav({onSearchChange, onPlatformSelect, onGenerSelect}){
    console.log(onGenerSelect)
    return(
        <div className="flex flex-row justify-between z-10  ml-20">
            {/*Filter platforme  */}
        
            <SearchBar onSearchChange={onSearchChange} onPlatformSelect={onPlatformSelect} onGenerSelect={onGenerSelect} />
            <Options/>
        </div>
    );
}

export default TopNav;

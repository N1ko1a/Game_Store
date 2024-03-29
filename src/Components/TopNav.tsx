import Options from "./Options";
import SearchBar from "./SearchBar";

function TopNav({
  onSearchChange,
  onPlatformSelect,
  onGenerSelect,
  onRatingSelect,
  onStoreSelect,
  onAgeSelect,
}: {
  onStoreSelect: (chose: number) => void;
  onSearchChange: (searchText: string) => void;
  onPlatformSelect: (chose: number) => void;
  onGenerSelect: (chose: number) => void;
  onRatingSelect: (chose: number) => void;
  onAgeSelect: (chose: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-center sm:justify-between  w-full pl-5 pr-5 ">
      {/*Filter platforme  */}

      <SearchBar
        onSearchChange={onSearchChange}
        onPlatformSelect={onPlatformSelect}
        onStoreSelect={onStoreSelect}
        onAgeSelect={onAgeSelect}
        onGenerSelect={onGenerSelect}
        onRatingSelect={onRatingSelect}
      />
      <Options />
    </div>
  );
}

export default TopNav;

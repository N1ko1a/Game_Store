import Cart from "./Cart";
import Liked from "./Liked";
import Profile from "./Profile";

function Options() {
  return (
    <div className="flex flex-row justify-evenly  right-2">
      <Liked />
      <Cart />
      <Profile />
    </div>
  );
}

export default Options;

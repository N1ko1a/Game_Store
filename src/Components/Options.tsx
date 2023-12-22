import Cart from "./Cart";
import Liked from "./Liked";
import Profile from "./Profile";
import RegisterForm from "./RegisterForm";

function Options() {
  return (
    <div className="flex flex-row justify-evenly  right-2">
      <Liked />
      <Cart />
      {/* <Profile /> */}
      <RegisterForm />
    </div>
  );
}

export default Options;

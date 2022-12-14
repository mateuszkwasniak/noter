import classes from "./menu.module.scss";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Menu = ({ children }) => {
  return (
    <div className={classes.menu}>
      {children}
      <button
        className={classes.signOutBtn}
        onClick={() => {
          signOut(auth);
        }}
      >
        Sign out
      </button>
    </div>
  );
};

export default Menu;

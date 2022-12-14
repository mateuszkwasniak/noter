import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "../../firebase";

import { db } from "../../firebase";

import pen from "../../assets/images/pen.png";

//Login and Register share the same styles
import classes from "../Login/login.module.scss";
const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loginFlag, setLoginFlag] = useState(0);

  useEffect(() => {
    if (loginFlag === 1) {
      navigate("/");
    }
  }, [loginFlag, navigate]);

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    setError(null);
    const email = e.target[0].value;
    const name = e.target[1].value;
    const password = e.target[2].value;

    if (name.trim() === "") {
      setError("Please fill out the login input");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: name,
      });

      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        name: user.displayName,
        categories: [],
      });

      setLoginFlag(1);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={classes.login}>
      <div className={classes.login}>
        <div className={classes.box}>
          <div className={classes.corner} />
          <div className={classes.left}>
            <h1>NOTER</h1>
            <div className={classes.hr} />
            <p>
              Collect all the things you do not want to forget in one place.
            </p>
            <img src={pen} alt="Quill"></img>
          </div>
          <div className={classes.separator} />
          <div className={classes.right}>
            <h2>Register</h2>
            <form onSubmit={formSubmitHandler}>
              <input placeholder="Email" type="email"></input>
              <input placeholder="Name" type="text"></input>
              <input placeholder="Password" type="password"></input>
              <div className={classes.submitBox}>
                {error && <p className={classes.error}>{error}</p>}
                <button type="submit" className={classes.btnSubmit}>
                  Submit
                </button>
              </div>
            </form>

            <p className={classes.summary}>
              You already have the account?
              <br />
              <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

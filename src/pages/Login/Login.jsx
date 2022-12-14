import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import classes from "./login.module.scss";

import pen from "../../assets/images/pen.png";


const Login = () => {
  const [error, setError] = useState(null);
  const [loginFlag, setLoginFlag] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (loginFlag === 1) {
      navigate("/");
    }
  }, [loginFlag, navigate]);

  const submitFormHandler = async (e) => {
    e.preventDefault();
    setError(null);

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoginFlag(1);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={classes.login}>
      <div className={classes.box}>
        <div className={classes.corner} />
        <div className={classes.left}>
          <h1>NOTER</h1>
          <div className={classes.hr} />
          <p>Collect all the things you do not want to forget in one place.</p>
          <img src={pen} alt="Quill"></img>
        </div>
        <div className={classes.separator} />
        <div className={classes.right}>
          <h2>Login</h2>
          <form onSubmit={submitFormHandler}>
            <input placeholder="Email" type="text"></input>
            <input placeholder="Password" type="password"></input>
            <div className={classes.submitBox}>
              {error && <p className={classes.error}>{error}</p>}
              <button type="submit" className={classes.btnSubmit}>
                Submit
              </button>
            </div>
          </form>
          <p className={classes.summary}>
            You do not have the account yet?{" "}
            <span>
              <Link to="/register">Register</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React from "react";
import { useState, useEffect } from "react";
import { auth, provider } from "../../../firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import Cookies from "universal-cookie";
import "./signIn.css";

const cookies = new Cookies();

const SignIn = () => {
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [toggleState, setToggleState] = useState(1);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    return () => {
      listen();
    };
  }, []);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const signIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        signInEmail,
        signInPassword
      );
      cookies.set("authToken", userCredential.user.refreshToken);
    } catch (error) {
      console.error(error);
    }
    setSignInEmail("");
    setSignInPassword("");
  };

  const signUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signUpEmail,
        signUpPassword
      );
      cookies.set("authToken", userCredential.user.refreshToken);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
    }
    setSignUpEmail("");
    setSignUpPassword("");
  };

  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      cookies.set("authToken", userCredential.user.refreshToken);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
    }
  };

  return authUser ? (
    <></>
  ) : (
    <section className="sign-in__container">
      <div className="sign-in__wrapper">
        <form
          onSubmit={toggleState === 0 ? signIn : signUp}
          className="sign-in__form"
        >
          <div className="sign-in__tabs">
            <h1
              className={
                toggleState === 1
                  ? "sign__button sign__active button--flex"
                  : "sign__button button--flex"
              }
              onClick={() => toggleTab(1)}
            >
              Sign Up
            </h1>
            <span className="sign__line"></span>
            <h1
              className={
                toggleState === 0
                  ? "sign__button sign__active button--flex"
                  : "sign__button button--flex"
              }
              onClick={() => toggleTab(0)}
            >
              Sign In
            </h1>
          </div>
          <input
            className="sign-in__input"
            type="email"
            placeholder=" Enter your email"
            value={toggleState === 0 ? signInEmail : signUpEmail}
            onChange={(e) => {
              toggleState === 0
                ? setSignInEmail(e.target.value)
                : setSignUpEmail(e.target.value);
            }}
          />
          <input
            className="sign-in__input"
            type="password"
            placeholder=" Enter your password"
            value={toggleState === 0 ? signInPassword : signUpPassword}
            onChange={(e) => {
              toggleState === 0
                ? setSignInPassword(e.target.value)
                : setSignUpPassword(e.target.value);
            }}
          />
          <button type="submit" className="sign-in__btn">
            {toggleState === 0 ? "Sign In" : "Sign Up"}
          </button>

          <div onClick={signInWithGoogle} className="sign__in-google-btn">
            <div className="sign__in-google-icon-wrapper">
              <img
                className="sign__in-google-icon"
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google icon"
              />
            </div>
            <p className="sign__in-btn-text">
              <b>Sign In with Google</b>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignIn;

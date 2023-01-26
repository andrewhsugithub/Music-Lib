import React from "react";
import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./header.css";

const Header = () => {
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

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successfully");
      })
      .catch((error) => console.log(error));
  };

  return (
    <header className="header">
      <nav className="nav container">
        <a href="index.html" className="nav__logo">
          Lib Music
        </a>
        {authUser ? (
          <>
            <p className="welcome__large">Welcome {authUser.email}</p>
            <p className="welcome__small">WELCOME</p>
            <button onClick={userSignOut} class="google-btn">
              <div class="btn-text">
                <p>Log Out</p>
              </div>
            </button>
          </>
        ) : (
          <></>
        )}
      </nav>
    </header>
  );
};

export default Header;

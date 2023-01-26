import React from "react";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./music.css";
import MusicCard from "./MusicCard";
import UploadModal from "../modal/UploadModal";
import ChangeModal from "../modal/ChangeModal";

const Music = () => {
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

  const [songs, setSongs] = useState([]);

  let collectionRef = null;
  if (authUser) collectionRef = collection(db, `${auth.currentUser.uid}`);

  useEffect(() => {
    if (!authUser) return;
    const querySongs = query(collectionRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(querySongs, (snapshot) => {
      let songList = [];
      snapshot.forEach((doc) => {
        songList.push({ ...doc.data(), id: doc.id });
      });
      setSongs(songList);
    });
    return () => unsubscribe();
  }, [authUser]);

  const [toggleState, setToggleState] = useState("0");

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return authUser ? (
    <section className="album__container container grid">
      {songs.map((song, index) => (
        <div className="song__cards" key={song.id}>
          <MusicCard toggleTab={toggleTab} {...song} />
          <div
            className={
              toggleState === song.id
                ? "create__modal active-modal"
                : "create__modal"
            }
          >
            <ChangeModal
              authUser={authUser}
              toggleTab={toggleTab}
              index={String(index)}
              docId={song.id}
              {...song}
            />
          </div>
        </div>
      ))}
      <div className="album__card">
        <div className="create" onClick={() => toggleTab("create")}>
          <div className="add__button">+</div>
          <p className="add__text">Upload Album</p>
        </div>
      </div>
      <div
        className={
          toggleState === "create"
            ? "create__modal active-modal"
            : "create__modal"
        }
      >
        <UploadModal authUser={authUser} toggleTab={toggleTab} />
      </div>
    </section>
  ) : (
    <></>
  );
};

export default Music;

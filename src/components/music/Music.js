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
  // console.log(authUser);

  useEffect(() => {
    if (!authUser) return;
    //! console.log("i'm here");
    const querySongs = query(collectionRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(querySongs, (snapshot) => {
      console.log("new album");
      let songList = [];
      snapshot.forEach((doc) => {
        songList.push({ ...doc.data(), id: doc.id });
      });
      console.log("songList:", songList);
      setSongs(songList);
    });
    return () => unsubscribe();
  }, [authUser]);
  //   e.preventDefault();
  //   if (newName === "" || music === null || imgUpload === null) {
  //     alert("fill in the fields");
  //     return;
  //   }
  //   toggleTab("close");
  //   const imageRef = ref(
  //     storage,
  //     `${auth.currentUser.uid}/img/${imgUpload.name + v4()}`
  //   );
  //   await uploadBytes(imageRef, imgUpload).then(async (snapshot) => {
  //     const url = await getDownloadURL(snapshot.ref);
  //     console.log("img", url);
  //     imgList.push(url);
  //   });
  //   const musicRef = ref(
  //     storage,
  //     `${auth.currentUser.uid}/music/${music.name + v4()}`
  //   );
  //   await uploadBytes(musicRef, music).then(async (snapshot) => {
  //     const url = await getDownloadURL(snapshot.ref);
  //     console.log("music", url);
  //     musicList.push(url);
  //   });
  //   console.log(imgList, musicList);
  //   await addDoc(collectionRef, {
  //     name: newName,
  //     description: description,
  //     thumbnail: imgList[imgList.length - 1],
  //     music: musicList[imgList.length - 1],
  //     createdAt: serverTimestamp(),
  //     currentUser: auth.currentUser.displayName,
  //     userId: auth.currentUser.uid,
  //   });

  //   setNewName("");
  //   setDescription("");
  //   setMusic(null);
  //   setImgUpload(null);
  //   inputImgRef.current.value = "";
  //   inputAudioRef.current.value = "";
  // };

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

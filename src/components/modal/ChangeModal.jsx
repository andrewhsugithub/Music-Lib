import React from "react";
import { useState, useRef } from "react";
import { deleteDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import "../music/music.css";

const ChangeModal = ({ authUser, toggleTab, index, docId, ...song }) => {
  const [changeName, setChangeName] = useState(song.name);
  const [changeDescription, setChangeDescription] = useState(song.description);
  const [changeMusic, setChangeMusic] = useState(song.musicName);
  const [changeImg, setChangeImg] = useState(song.imgName);
  const [isEdit, setIsEdit] = useState(false);

  const changeImgRef = useRef();
  const changeAudioRef = useRef();
  const oldAudioRef = useRef(null);
  const audioRef = useRef(null);

  let imgList = [];
  let musicList = [];
  let docRef = doc(db, `${auth.currentUser.uid}`, docId);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (changeName === "" || changeMusic === null || changeImg === null) {
      alert("fill in the fields");
      return;
    }
    let updatedDoc = { createdAt: serverTimestamp() };
    for (const [key, value] of Object.entries(song)) {
      if (
        key === "currentUser" ||
        key === "userId" ||
        key === "createdAt" ||
        key === "thumbnail" ||
        key === "music"
      )
        continue;
      if (key === "name") {
        if (value === changeName) continue;
        else updatedDoc[key] = changeName;
      }
      if (key === "description") {
        if (value === changeDescription) continue;
        else updatedDoc[key] = changeDescription;
      }
      if (key === "musicName") {
        if (value === changeMusic) continue;
        else {
          const deleteMusicRef = ref(
            storage,
            `${auth.currentUser.uid}/music/${song.musicName}`
          );
          await deleteObject(deleteMusicRef);
          const musicRef = ref(
            storage,
            `${auth.currentUser.uid}/music/${changeMusic.name + v4()}`
          );
          await uploadBytes(musicRef, changeMusic).then(async (snapshot) => {
            const url = await getDownloadURL(snapshot.ref);
            musicList.push(url);
          });

          updatedDoc["music"] = musicList[imgList.length - 1];
        }
      }
      if (key === "imgName") {
        if (value === changeImg) continue;
        else {
          const deleteImgRef = ref(
            storage,
            `${auth.currentUser.uid}/img/${song.imgName}`
          );
          await deleteObject(deleteImgRef);

          const imageRef = ref(
            storage,
            `${auth.currentUser.uid}/img/${changeImg.name + v4()}`
          );
          await uploadBytes(imageRef, changeImg).then(async (snapshot) => {
            const url = await getDownloadURL(snapshot.ref);
            imgList.push(url);
          });
          updatedDoc["thumbnail"] = imgList[imgList.length - 1];
        }
      }
    }
    toggleTab("close");
    await updateDoc(docRef, updatedDoc);
    setIsEdit(false);
  };

  return (
    <>
      <div className="modal__container">
        <i
          onClick={() => {
            if (changeMusic !== song.musicName) {
              setChangeMusic(song.musicName);
              changeAudioRef.current.value = "";
            }
            if (changeImg !== song.imgName) {
              setChangeImg(song.imgName);
              changeImgRef.current.value = "";
            }
            if (changeName !== song.name) setChangeName(song.name);
            if (changeDescription !== song.description)
              setChangeDescription(song.description);
            setIsEdit(false);
            toggleTab("close");
          }}
          className="uil uil-times modal-close"
        ></i>
        {changeImg !== song.imgName ? (
          <>
            <label htmlFor={`changeThumb${index}`} className="thumbnail">
              <div className="image__container">
                <img
                  src={URL.createObjectURL(changeImg)}
                  className="thumbnail__img"
                  alt="Thumb"
                />
                <div className="thumbnail__txt">
                  <h1 className="">{song.name}</h1>
                  {isEdit && (
                    <div
                      className="change__image-btn"
                      onClick={() => {
                        // setChangeImg(song.imgName);
                        changeImgRef.current.value = "";
                      }}
                    >
                      Change Image
                    </div>
                  )}
                </div>
              </div>
            </label>
          </>
        ) : (
          <>
            <label htmlFor={`changeThumb${index}`} className="thumbnail">
              <div className="image__container">
                <img
                  className="thumbnail__img"
                  src={song.thumbnail}
                  alt="Thumb"
                />
                <div className="thumbnail__txt">
                  <h1>{song.name}</h1>
                  {isEdit && (
                    <div className="change__image-btn">Change Image</div>
                  )}
                </div>
              </div>
            </label>
          </>
        )}
        <form onSubmit={handleUpdate} className="album__form">
          <label htmlFor={`changeName${index}`}>
            <p className="album__text">Album Name</p>
            <input
              className="album__name"
              type="text"
              id={`changeName${index}`}
              placeholder=" maximum characters: 20 characters"
              onChange={(e) => setChangeName(e.target.value)}
              value={changeName}
              maxLength="20"
              readOnly={!isEdit ? true : false}
            />
          </label>
          <label htmlFor={`changeDesc${index}`}>
            <p className="album__text">Album Description</p>
            <textarea
              className="album__description"
              type="text"
              placeholder=" maximum characters: 300 characters"
              id={`changeDesc${index}`}
              onChange={(e) => setChangeDescription(e.target.value)}
              value={changeDescription}
              maxLength="300"
              readOnly={!isEdit ? true : false}
            />
          </label>
          <div className="upload__container">
            <input
              type="file"
              className="audioLabel"
              id={`changeAudio${index}`}
              placeholder="music"
              onChange={(e) => setChangeMusic(e.target.files[0])}
              accept="audio/*"
              ref={changeAudioRef}
              disabled={!isEdit ? true : false}
            />
            <div className="audio__container">
              {isEdit && (
                <label
                  htmlFor={`changeAudio${index}`}
                  className="audio"
                  onClick={() => {
                    if (changeMusic !== song.musicName) audioRef.current.load();
                  }}
                >
                  <i class="uil uil-upload"></i>
                  <p className="upload-audio-text">Change Audio</p>
                </label>
              )}

              {changeMusic !== song.musicName ? (
                <audio
                  src={URL.createObjectURL(changeMusic)}
                  controls="controls"
                  alt="audio"
                  ref={audioRef}
                  loop
                />
              ) : (
                <audio
                  className="album__audio"
                  src={song.music}
                  controls="controls"
                  ref={oldAudioRef}
                  loop
                ></audio>
              )}
            </div>
            <input
              type="file"
              className="changeThumbnail"
              id={`changeThumb${index}`}
              placeholder="thumbnail"
              onChange={(e) => setChangeImg(e.target.files[0])}
              accept="image/*"
              ref={changeImgRef}
              disabled={!isEdit ? true : false}
            />
            <div className="button__container">
              <button
                type="button"
                className="edit__button"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </button>
              <button
                type="button"
                className="delete__button"
                onClick={async () => {
                  let res = window.confirm("Press 'OK' to delete.");
                  if (res) {
                    const deleteImgRef = ref(
                      storage,
                      `${auth.currentUser.uid}/img/${song.imgName}`
                    );
                    const deleteMusicRef = ref(
                      storage,
                      `${auth.currentUser.uid}/music/${song.musicName}`
                    );
                    await Promise.all([
                      deleteDoc(docRef),
                      deleteObject(deleteImgRef),
                      deleteObject(deleteMusicRef),
                    ]);
                  }
                }}
              >
                Delete
              </button>
              {isEdit && (
                <button type="submit" className="upload__button">
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChangeModal;

import React from "react";
import { useState, useRef } from "react";
import { addDoc, serverTimestamp, collection } from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import "../music/music.css";

const UploadModal = ({ authUser, toggleTab }) => {
  const [newName, setNewName] = useState("");
  const [description, setDescription] = useState("");
  const [music, setMusic] = useState(null);
  const [imgUpload, setImgUpload] = useState(null);

  const inputImgRef = useRef();
  const inputAudioRef = useRef();
  const audioRef = useRef(null);

  let imgList = [];
  let musicList = [];
  let uploadCollectionRef = null;
  if (authUser) uploadCollectionRef = collection(db, `${auth.currentUser.uid}`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newName === "" || music === null || imgUpload === null) {
      alert("fill in the fields");
      return;
    }
    toggleTab("close");
    const imgName = imgUpload.name + v4();
    const imageRef = ref(storage, `${auth.currentUser.uid}/img/${imgName}`);
    await uploadBytes(imageRef, imgUpload).then(async (snapshot) => {
      const url = await getDownloadURL(snapshot.ref);
      imgList.push(url);
    });
    const musicName = music.name + v4();
    const musicRef = ref(storage, `${auth.currentUser.uid}/music/${musicName}`);
    await uploadBytes(musicRef, music).then(async (snapshot) => {
      const url = await getDownloadURL(snapshot.ref);
      musicList.push(url);
    });
    await addDoc(uploadCollectionRef, {
      name: newName,
      description: description,
      thumbnail: imgList[imgList.length - 1],
      imgName,
      music: musicList[imgList.length - 1],
      musicName,
      createdAt: serverTimestamp(),
      currentUser: auth.currentUser.displayName,
      userId: auth.currentUser.uid,
    });

    setNewName("");
    setDescription("");
    setMusic(null);
    setImgUpload(null);
    inputImgRef.current.value = "";
    inputAudioRef.current.value = "";
  };

  return (
    <>
      <div className="modal__container">
        <i
          onClick={() => {
            if (music) {
              setMusic(null);
              inputAudioRef.current.value = "";
            }
            if (imgUpload) {
              setImgUpload(null);
              inputImgRef.current.value = "";
            }
            if (newName) setNewName("");
            if (description) setDescription("");
            toggleTab("close");
          }}
          className="uil uil-times modal-close"
        ></i>
        <label htmlFor="labelForThumbnail" className="thumbnail">
          {imgUpload ? (
            <div className="image__container">
              <img
                src={URL.createObjectURL(imgUpload)}
                className="thumbnail__img"
                alt="Thumb"
              />
              <div className="thumbnail__txt">
                {/* <h1 className="">{imgUpload.name}</h1> */}
                <button
                  className="change__image-btn"
                  onClick={() => {
                    setImgUpload(null);
                  }}
                >
                  Change Image
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="add__button">+</div>
              <p className="add__text">Upload Image</p>
            </>
          )}
        </label>
        <form onSubmit={handleSubmit} className="album__form">
          <label htmlFor="album__name">
            <p className="album__text">Album Name</p>
            <input
              className="album__name"
              type="text"
              id="album__name"
              placeholder=" maximum characters: 20 characters"
              onChange={(e) => setNewName(e.target.value)}
              value={newName}
              maxLength="20"
            />
          </label>
          <label htmlFor="album__description">
            <p className="album__text">Album Description</p>
            <textarea
              className="album__description"
              type="text"
              placeholder=" maximum characters: 300 characters"
              id="album__description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              maxLength="300"
            />
          </label>
          <div className="upload__container">
            <div className="audio__container">
              <input
                type="file"
                id="audioLabel"
                placeholder="music"
                onChange={(e) => {
                  setMusic(e.target.files[0]);
                }}
                accept="audio/*"
                ref={inputAudioRef}
              />
              <label
                htmlFor="audioLabel"
                className="audio"
                onClick={() => {
                  if (music) audioRef.current.load();
                }}
              >
                <i class="uil uil-upload"></i>
                <p className="upload-audio-text">
                  {music ? "Change Audio" : "Upload Audio"}
                </p>
              </label>
              {music && (
                <audio
                  src={URL.createObjectURL(music)}
                  controls="controls"
                  alt="audio"
                  ref={audioRef}
                />
              )}
            </div>
            <input
              type="file"
              id="labelForThumbnail"
              placeholder="thumbnail"
              onChange={(e) => {
                setImgUpload(e.target.files[0]);
              }}
              accept="image/*"
              ref={inputImgRef}
            />
            <button type="submit" className="upload__button">
              Create Album
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UploadModal;

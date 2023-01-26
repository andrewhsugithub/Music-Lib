import React from "react";
import { useRef } from "react";
import "./music.css";

const MusicCard = ({ toggleTab, ...song }) => {
  const audioRef = useRef(null);

  return (
    <div
      key={song.id}
      className="album__card"
      onMouseOver={() => audioRef.current.play()}
      onMouseOut={() => audioRef.current.load()}
      onClick={() => toggleTab(song.id)}
    >
      <img className="album__img" src={song.thumbnail} alt="thumbnail" />
      <h3 className="album__title">{song.name}</h3>
      {/* <p>{song.description}</p> */}
      <audio
        className="album__audio"
        src={song.music}
        // controls="controls"
        ref={audioRef}
        loop={true}
      ></audio>
    </div>
  );
};

export default MusicCard;

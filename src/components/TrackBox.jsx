import React, { useState, useEffect, useRef } from "react";
import { ListGroup, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ReactComponent as Play } from "../assets/Play.svg";
import { ReactComponent as Trash } from "../assets/Trash.svg";
import Animated from "react-mount-animation";
import ProgressBar from "./ProgressBar";

export default function TrackBox(props) {
  // Audio Construction
  const audioFile = new Audio(props.track.url);

  // State
  const [isPlaying, setisPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [bars, setBars] = useState(0);

  // Refs
  const audioRef = useRef(audioFile);
  const intervalRef = useRef();

  // Destructure
  const { track, playStopAll, leaderTrack, sync } = props; // non function props
  const { addDuration, removeTrack, setLead } = props; // function props
  const { duration } = audioRef.current;
  const { bpm, owner, uid } = track;

  // Functions
  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        audioRef.current.currentTime = 0;
        audioRef.current.pause();
        setisPlaying(false);
        clearInterval(intervalRef.current);
        if (leaderTrack.uid === uid && sync) {
          leaderTrack.leadTime = 0;
        }
      } else {
        setTrackProgress(audioRef.current.currentTime);
        if (leaderTrack.uid === uid) {
          setLead((prev) => {
            return { ...prev, leadTime: audioRef.current.currentTime };
          });
        }
      }
    }, [1000]);
  };

  const calcMeasures = () => {
    const rythm = 4;
    setBars(((audioFile.duration / 60) * (bpm / rythm)).toFixed(0));
  };

  const handleRemove = () => {
    audioRef.current.pause();
    setIsMounted(false);
  };

  const handlePlayPause = () => {
    setisPlaying(!isPlaying);
    if (!isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  //Use effects

  // Initial Mount
  useEffect(() => {
    audioFile.onloadeddata = () => {
      startTimer();
      calcMeasures();
      setTrackProgress(audioRef.current.currentTime);
      if (leaderTrack.duration <= audioFile.duration) {
        setLead({ duration: audioFile.duration, bpm, uid, leadTime: 0 });
      }
      addDuration(audioFile.duration, uid);
    };
    setIsMounted(true);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  // Toggle Loop for incase PlayAll is true
  useEffect(() => {
    startTimer();
    if (!playStopAll) {
      audioRef.current.loop = false;
    } else {
      audioRef.current.loop = true;
    }
    if (sync) {
      audioRef.current.currentTime = leaderTrack.leadTime;
    }
    if (!isPlaying) {
    }
  }, [isPlaying]);

  // Handle playStopAll button toggle
  useEffect(() => {
    if (playStopAll) {
      setisPlaying(true);
      audioRef.current.currentTime = 0;
      audioRef.current.loop = true;
      audioRef.current.play();
    } else {
      setisPlaying(false);
      audioRef.current.pause();
      audioRef.current.loop = false;
      audioRef.current.currentTime = 0;
    }
  }, [playStopAll]);

  // Handle sync toggle
  useEffect(() => {
    if (sync) {
      audioRef.current.currentTime = leaderTrack.leadTime;
      audioRef.current.play();
      startTimer();
      setisPlaying(true);
    }
  }, [sync]);

  // Variables
  const currentPercentage = duration ? (trackProgress / duration) * 100 : 0;
  const mountAnimation = ` 
    0% {transform: translate(-50px, 0)}
    0% {height: 0px}
    85% {height: 100px} 
    85% {transform: translate(10px, 0)}
  `;

  return (
    <Animated.div
      show={isMounted}
      mountAnim={mountAnimation}
      time={0.5}
      onUnmountEnd={() => removeTrack(uid)}
    >
      <ListGroup.Item>
        <div className="d-flex gap-3 audio-controls">
          {isPlaying ? (
            <Button
              className="play"
              variant="outline-success"
              onClick={handlePlayPause}
            >
              <ProgressBar
                progress={currentPercentage}
                size={50}
                strokeWidth={5}
                circleOneStroke="#FFF"
                circleTwoStroke="#018786"
              />
            </Button>
          ) : (
            <Button
              className="play"
              variant="outline-success"
              onClick={handlePlayPause}
            >
              <Play />
            </Button>
          )}
          <div className="authorWrapper">
            <h1>Author: {owner}</h1>

            <OverlayTrigger
              placement="auto-start"
              delay={{ show: 250, hide: 400 }}
              overlay={<Tooltip>{`Original BPM ${bpm}`}</Tooltip>}
            >
              <h2>BPM: {sync ? leaderTrack.bpm : bpm}</h2>
            </OverlayTrigger>
          </div>

          <div className="d-flex flex-column">
            <Button
              className="trash ms-5"
              variant="outline-secondary"
              onClick={handleRemove}
            >
              <Trash />
            </Button>
            <h6># of Bars: {bars}</h6>
          </div>
        </div>
      </ListGroup.Item>
    </Animated.div>
  );
}

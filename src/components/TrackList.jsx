import TrackBox from "./TrackBox";
import { ListGroup } from "react-bootstrap";
import React, { useState, useEffect } from "react";

export default function TrackList({ tracks, setTracks, playStopAll, sync }) {
  // States
  const [leaderTrack, setLead] = useState({ duration: 0 });

  // Functions
  const removeTrack = (uid) => {
    const filteredList = tracks.filter((track) => track.uid !== uid);
    setTracks(filteredList);
  };

  const sortByDuration = (a, b) => {
    // Doesn't change anything because they're all the same length ¯\_(ツ)_/¯
    // It does work and it Reorders if you want to test it just change it from duration to Id
    if (a.duration < b.duration) return -1;
    if (a.duration > b.duration) return 1;
    return 0;
  };

  const addDuration = (duration, uid) => {
    for (let track of tracks) {
      if (track.uid === uid) {
        track.duration = duration;
      }
    }
  };

  //UseEffects
  useEffect(() => {
    if (sync) {
      tracks.sort(sortByDuration); 
    }
  }, [sync, tracks]);

  return (
    <ListGroup variant className="listGroupWrapper">
      {tracks.map((track) => {
        return (
          <TrackBox
            addDuration={addDuration}
            removeTrack={removeTrack}
            leaderTrack={leaderTrack}
            playStopAll={playStopAll}
            setLead={setLead}
            key={track.uid}
            track={track}
            sync={sync}
          />
        );
      })}
    </ListGroup>
  );
}

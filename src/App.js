import TrackList from "./components/TrackList";
import ButtonBar from "./components/ButtonBar";
import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";

const trackJSON = [
  {
    Id: 1,
    url: "https://academy.musico.io/audio/085e6a07-b700-3f12-809a-12e54d97f18e",
    owner: "Ori Winokur",
    bpm: 120,
  },
  {
    Id: 2,
    url: "https://academy.musico.io/audio/57abe259-5869-65eb-ee68-a1970a7e1594",
    owner: "Yonatan Pistiner",
    bpm: 100,
  },
  {
    Id: 3,
    url: "https://academy.musico.io/audio/1f2a9ae3-13f5-2a7a-b976-aa0af005dc89",
    owner: "Barak Inbar",
    bpm: 123,
  },
  {
    Id: 4,
    url: "https://academy.musico.io/audio/ca279e66-3e97-10ce-2ffe-feed34a7f6dc",
    owner: "Ori Winokur",
    bpm: 80,
  },
];

function App() {
  const [trackArray, setTrackArray] = useState([]);
  const [playStopAll, setPlayStopAll] = useState(false);
  const [sync, setSync] = useState(false);

  return (
    <Container>
      <Row className="d-flex p-3 flex-column gap-4">
        <ButtonBar
          tracks={trackJSON}
          addTrack={setTrackArray}
          playStopAll={playStopAll}
          setPlayStopAll={setPlayStopAll}
          setSync={setSync}
          sync={sync}
        />

        <TrackList
          tracks={trackArray}
          setTracks={setTrackArray}
          playStopAll={playStopAll}
          sync={sync}
        />
      </Row>
    </Container>
  );
}

export default App;

import { useState } from "react";
import {
  Button,
  DropdownButton,
  Dropdown,
  ButtonGroup,
  Alert,
} from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import AnimateHeight from "react-animate-height";

export default function ButtonBar(props) {
  //Destructure props
  const { tracks, addTrack, setPlayStopAll, playStopAll, setSync, sync } =
    props;

  //State
  const [dropTitle, setDropTitle] = useState("Select Track");
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [err, setErr] = useState(0);

  //Functions
  const selectHandler = (option) => {
    setDropTitle(`Track #${option}`);
    setSelectedTrack(option);
  };

  const addTrackHandler = () => {
    if (selectedTrack === null) {
      setErr("auto");
      return;
    }
    setErr(0);
    const copy = { ...tracks[+selectedTrack - 1] };
    copy.uid = uuidv4();
    addTrack((prev) => [...prev, copy]);
  };

  const handlePlayStopAll = () => {
    setPlayStopAll(!playStopAll);
  };

  const handleSync = () => {
    setSync(!sync);
  };

  return (
    <>
      <div className="d-flex gap-3">
        <Button variant="outline-primary" active={sync} onClick={handleSync}>
          Sync
        </Button>
        {playStopAll ? (
          <Button variant="outline-primary" onClick={handlePlayStopAll}>
            Stop All
          </Button>
        ) : (
          <Button
            variant="outline-primary"
            active={playStopAll}
            onClick={handlePlayStopAll}
          >
            Play All
          </Button>
        )}
        <ButtonGroup>
          <DropdownButton
            variant="outline-primary"
            as={ButtonGroup}
            title={dropTitle}
            onSelect={selectHandler}
          >
            {tracks.map((track) => {
              return (
                <Dropdown.Item key={track.Id} eventKey={track.Id}>
                  Track #{track.Id}
                </Dropdown.Item>
              );
            })}
          </DropdownButton>
          <Button variant="outline-primary" onClick={addTrackHandler}>
            Add Track
          </Button>
        </ButtonGroup>
      </div>
      <AnimateHeight id="example-panel" duration={500} height={err}>
        <Alert variant={"danger"}>Please Select a track</Alert>
      </AnimateHeight>
    </>
  );
}

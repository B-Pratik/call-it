/* eslint-disable no-alert */
import { useEffect, useRef, useState, useCallback } from "react";
import {NoticeBar, Button} from "antd-mobile";
import { ExclamationCircleOutline, CloseCircleOutline } from 'antd-mobile-icons'

import usePeer from "../services/usePeer";

import "./call.css";

window.facingMode = "user";
const generateStream = (facingMode = "user") => {
  const constraints = {
    audio: true,
    video: {
      frameRate: { ideal: 10, max: 15 },
      facingMode,
    },
  };

  return navigator.mediaDevices.getUserMedia(constraints).catch((e) => {
    console.error("Audio/Video permission error", e);
    return null;
  });
};

const Call = ({ meetingId = null, setCallState = () => {} }) => {
  const { getGuestStream, updateTrack, hangCall, connected } = usePeer();

  const callerStream = useRef(null);
  const calleeStream = useRef(null);

  const [mediaPermissionProvided, setPermision] = useState(true);
  const [fullScreen, setFullscreen] = useState(false);
  const [errorInConnection, setError] = useState(false);

  useEffect(() => {
    (async () => {
      const userStream = await generateStream(window.facingMode);
      if (!userStream) {
        return setPermision(false);
      }

      callerStream.current.srcObject = userStream;

      getGuestStream(userStream, meetingId, (error, guestStream) => {
        if (error) {
          setError(true);
          setCallState(false);
        } else if (guestStream) {
          calleeStream.current.srcObject = guestStream;
          setError(false);
          setCallState(true);
        }
      });
    })();
  }, [getGuestStream, meetingId, setCallState]);

  const setStream = useCallback(
    (stream) => {
      callerStream.current.srcObject = stream;
      const [track] = stream.getVideoTracks();
      updateTrack(track).catch((...e) => alert("failed" + JSON.stringify(e)));
    },
    [updateTrack]
  );

  const onFlip = useCallback(async () => {
    const newMode = window.facingMode === "user" ? "environment" : "user";

    const stream = await generateStream(newMode);
    setStream(stream);
    window.facingMode = newMode;
  }, [setStream]);

  const onScreen = useCallback(async () => {
    if (typeof navigator.mediaDevices.getDisplayMedia === "function") {
      let stream;
      try {
        stream = await navigator.mediaDevices.getDisplayMedia({
          audio: true,
          video: true,
        });
      } catch (error) {
        return alert("screen sharing not supported");
      }
      setStream(stream);
    }
  }, [setStream]);

  return (
    <>
      {!mediaPermissionProvided && (
        <div className="notice-bar">
          <NoticeBar icon={<ExclamationCircleOutline />}>
            Please provide permission to use camera/microphone and try again.
          </NoticeBar>
        </div>
      )}
      {errorInConnection && (
        <div className="notice-bar">
          <NoticeBar icon={<CloseCircleOutline />}>
            Call disconnected.
          </NoticeBar>
        </div>
      )}
      <div
        className={`guest-frame ${
          fullScreen && connected ? "full-screen" : ""
        }`}
        onClick={() => setFullscreen(!fullScreen)}
      >
        <video ref={calleeStream} autoPlay />
      </div>
      <div className="actions">
        <Button
          type="primary"
          inline
          onClick={onFlip}
          style={{ margin: "10px" }}
        >
          Flip
        </Button>
        <Button
          type="primary"
          inline
          onClick={onScreen}
          style={{ margin: "10px" }}
        >
          Share
        </Button>
        <Button
          type="warning"
          inline
          onClick={hangCall}
          style={{ margin: "10px" }}
        >
          Hang
        </Button>
      </div>
      <div className="self-frame">
        <video ref={callerStream} muted autoPlay />
      </div>
    </>
  );
};
export default Call;

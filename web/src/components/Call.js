import React, { useEffect, useRef } from "react";
import usePeer from "../services/usePeer";

import "./call.css";

const generateStram = () => {
  const constraints = {
    audio: true,
    video: {
      frameRate: { ideal: 10, max: 15 },
      facingMode: "user",
    },
  };

  return navigator.mediaDevices.getUserMedia(constraints).catch((error) => {
    console.error("error while capturing media", error);
    return null;
  });
};

const Call = ({ meetingId = null, setCallState = () => {} }) => {
  const { setUserStream } = usePeer();

  const callerStream = useRef(null);
  const calleeStream = useRef(null);

  useEffect(() => {
    generateStram()
      .then((userStram) => {
        if (userStram) {
          callerStream.current.srcObject = userStram;
          callerStream.current.play();
          return setUserStream(userStram, meetingId);
        }
      })
      .then((guestStram) => {
        if (guestStram) {
          calleeStream.current.srcObject = guestStram;
          calleeStream.current.play();
          setCallState(true);
        }
      });
  }, [meetingId, setCallState, setUserStream]);

  return (
    <>
      <div className="guest-frame">
        <video ref={calleeStream} />
      </div>
      <div className="self-frame">
        <video ref={callerStream} muted />
      </div>
    </>
  );
};
export default Call;

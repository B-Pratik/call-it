/* eslint-disable prefer-reflect */
/* eslint-disable no-undef */
import Peer from "peerjs";
import { useState, useCallback } from "react";

const peer = new Peer(undefined, {
  path: "/ourApp",
  secure: true,
  host: "our-peer.herokuapp.com",
  debug: 3,
});

const usePeer = () => {
  const [{ connected, id }, setConnection] = useState({
    connected: peer.open,
    id: peer.id,
  });

  const close = useCallback(
    () => setConnection({ id: null, connected: false }),
    []
  );

  const setUserStream = useCallback((userStram, meetingId) => {
    if (meetingId) {
      return new Promise((resolve) => {
        const call = peer.call(meetingId, userStram);
        call.on("stream", resolve);
      });
    } else {
      return new Promise((resolve) => {
        peer.on("call", (call) => {
          call.answer(userStram);
          call.on("stream", resolve);
        });
      });
    }
  }, []);

  peer.on("open", (id) => setConnection({ id, connected: true }));

  peer.on("close", close);
  peer.on("disconnected", close);
  peer.on("error", close);

  return { connected, id, setUserStream };
};

export default usePeer;

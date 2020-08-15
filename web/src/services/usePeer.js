/* eslint-disable prefer-reflect */
import Peer from "peerjs";
import { useState, useCallback } from "react";

const peer = new Peer(undefined, {
  path: "/ourApp",
  host: "/",
  secure: true,
  key: process.env.PEER_KEY,
  debug: 3,
  config: {
    iceServers: [
      { url: "stun:stun1.l.google.com:19302" },
      {
        url: "turn:turn.bistri.com:80",
        credential: "homeo",
        username: "homeo",
      },
    ],
  },
});

let callInstance;

const usePeer = () => {
  const [{ connected, id }, setConnection] = useState({
    connected: peer.open,
    id: peer.id,
  });

  const close = useCallback(() => {
    callInstance = null;
    setConnection({ id: null, connected: false });
  }, []);

  const hangCall = useCallback(() => {
    if (callInstance) {
      return callInstance.close();
    }
  }, []);

  const getGuestStream = useCallback((userStram, meetingId, callback) => {
    if (meetingId) {
      const call = peer.call(meetingId, userStram);
      call.on("stream", (stream) => callback(null, stream));
      call.on("error", () => callback(true));
      call.on("close", () => callback(true));
      callInstance = call;
    } else {
      peer.on("call", (call) => {
        call.answer(userStram);
        call.on("stream", (stream) => callback(null, stream));
        call.on("error", () => callback(true));
        call.on("close", () => callback(true));
        callInstance = call;
      });
    }
  }, []);

  const updateTrack = useCallback((track) => {
    if (callInstance) {
      var sender = callInstance.peerConnection.getSenders().find((s) => {
        return s.track.kind === track.kind;
      });

      return sender.replaceTrack(track);
    }
    return Promise.resolve(null);
  }, []);

  peer.on("open", (id) => setConnection({ id, connected: true }));

  peer.on("close", close);
  peer.on("disconnected", close);
  peer.on("error", close);

  return { connected, id, getGuestStream, updateTrack, hangCall };
};

export default usePeer;

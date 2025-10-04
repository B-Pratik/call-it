import { useCallback, useEffect, useRef, useState } from "react";
import usePeer from "../hooks/usePeer";

const Call = ({ meetingId = null }) => {
  const { connected, id, peerConnection, getGuestStream, updateTrack, hangCall } = usePeer();

  const [remoteConnected, setRemoteConnected] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showShareURL, setShowShareURL] = useState(false);
  const [shareURL, setShareURL] = useState("");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize local video and connect to remote
  useEffect(() => {
    const initStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        streamRef.current = stream;

        getGuestStream(stream, meetingId, (error, remoteStream) => {
          if (error) {
            console.error("Failed to get guest stream", error);
            return;
          }
          if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
            setRemoteConnected(true);
          }
        });
      } catch (err) {
        console.error("Error accessing media devices", err);
      }
    };
    initStream();
  }, [getGuestStream, meetingId]);

  const handleShareID = useCallback(() => {
    const url = `https://${window.location.host}/#/join/${id}`;
    if (navigator.share) {
      navigator.share({ title: "Call It", url }).catch(() => {
        setShareURL(url);
        setShowShareURL(true);
      });
    } else {
      setShareURL(url);
      setShowShareURL(true);
    }
  }, [id]);

  const handleFlip = async () => {
    if (!streamRef.current) return;
    const facingMode = isFlipped ? "user" : "environment";

    const newStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode },
      audio: true,
    });

    const newTrack = newStream.getVideoTracks()[0];
    const sender = peerConnection?.getSenders()?.find((s) => s.track?.kind === "video");
    if (sender) sender.replaceTrack(newTrack);

    if (localVideoRef.current) localVideoRef.current.srcObject = newStream;
    streamRef.current = newStream;
    setIsFlipped(!isFlipped);
  };

  const handleShareScreen = async () => {
    if (!navigator.mediaDevices.getDisplayMedia) {
      return alert("Screen sharing not supported");
    }
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const sender = peerConnection?.getSenders()?.find((s) => s.track?.kind === "video");
      if (sender) sender.replaceTrack(screenStream.getVideoTracks()[0]);
      if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
      streamRef.current = screenStream;
    } catch (err) {
      console.error("Screen share failed", err);
    }
  };

  const handleHangUp = () => {
    hangCall();
    setRemoteConnected(false);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      {/* Remote video */}
      <div className="relative w-full max-w-5xl flex justify-center items-center bg-black rounded-2xl overflow-hidden aspect-video">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover rounded-2xl"
        />
        {!remoteConnected && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
            Waiting for remote user to join...
          </div>
        )}
        {/* Local video floating */}
        <video
          ref={localVideoRef}
          muted
          autoPlay
          className="absolute bottom-4 right-4 w-40 h-28 object-cover rounded-lg border border-white/20 shadow-md"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mt-6">
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            remoteConnected
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          onClick={handleFlip}
          disabled={!remoteConnected}
        >
          Flip
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            remoteConnected
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          onClick={handleShareScreen}
          disabled={!remoteConnected}
        >
          Share Screen
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            connected
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          onClick={handleShareID}
          disabled={!connected}
        >
          Share ID
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            remoteConnected
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          onClick={handleHangUp}
          disabled={!remoteConnected}
        >
          Hang Up
        </button>
      </div>

      {showShareURL && (
        <div className="mt-4 bg-gray-800 rounded-lg p-3 text-center max-w-lg break-words text-sm">
          <p>Share this link to start the call:</p>
          <p className="mt-2 text-blue-400 font-mono">{shareURL}</p>
        </div>
      )}
    </div>
  );
};

export default Call;

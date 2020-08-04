import React, { useCallback, useState } from "react";
import Button from "antd-mobile/es/button";
import usePeer from "../services/usePeer";
import Call from "./Call";

import "antd-mobile/es/button/style/index.css";

const Create = () => {
  const { connected, id } = usePeer();
  const [callStarted, setCallState] = useState(false);
  const [{ showShareURL, shareURL }, setShare] = useState({
    showShareURL: false,
    shareURL: "",
  });

  const share = useCallback(() => {
    const url = `https://${window.location.host}/join/${id}`;

    const shareData = {
      title: "Peer IT",
      url,
    };

    if (navigator.share) {
      return navigator
        .share(shareData)
        .then(() => setShare({ showShareURL: false, shareURL: "" }))
        .catch(() => setShare({ showShareURL: true, shareURL: url }));
    } else {
      return setShare({ showShareURL: true, shareURL: url });
    }
  }, [id]);

  return (
    <>
      {!callStarted && (
        <>
          <div style={{ margin: "20px auto", width: "50vw" }}>
            <Button type="primary" disabled={!connected} onClick={share}>
              Share ID
            </Button>
          </div>
          {connected && (
            <div className="notice-bar info-bar">
              Note: After sharing call url, keep this page open so that call can
              be connected
            </div>
          )}
          {showShareURL && (
            <div className="notice-bar info-bar">
              Please share below url with person you would like to call.
              <br />
              <p>{shareURL}</p>
            </div>
          )}
        </>
      )}
      <Call setCallState={setCallState} />
    </>
  );
};
export default Create;

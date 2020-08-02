import React, { useCallback, useState } from "react";
import Button from "antd-mobile/es/button";
import usePeer from "../services/usePeer";
import Call from "./Call";

import "antd-mobile/es/button/style/index.css";

const Create = () => {
  const { connected, id } = usePeer();
  const [callStarted, setCallState] = useState(false);

  const share = useCallback(() => {
    const shareData = {
      title: "Peer IT",
      url: `https://${window.location.host}/join/${id}`,
    };

    if (navigator.share) {
      return navigator
        .share(shareData)
        .catch((e) => console.error("error while sharing", e));
    } else {
      // eslint-disable-next-line no-alert
      alert(`Please use this url, https://${window.location.host}/join/${id}`);
    }
  }, [id]);

  return (
    <>
      {!callStarted && (
        <div style={{ margin: "20px auto", width: "50vw" }}>
          <Button type="primary" disabled={!connected} onClick={share}>
            Share ID
          </Button>
        </div>
      )}
      <Call setCallState={setCallState} />
    </>
  );
};
export default Create;

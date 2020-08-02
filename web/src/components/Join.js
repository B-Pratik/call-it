import React from "react";
import { Redirect, useParams } from "react-router-dom";
import ActivityIndicator from "antd-mobile/es/activity-indicator";
import Call from "./Call";
import usePeer from "../services/usePeer";

import "antd-mobile/es/activity-indicator/style/index.css";

const Join = () => {
  const { connected } = usePeer();
  const { meetingId = null } = useParams();

  if (!meetingId) {
    return <Redirect to="/create" />;
  } else if (!connected) {
    return (
      <div style={{ margin: "50vw auto", width: "50vw" }}>
        <ActivityIndicator size="large" text="connecting" />
      </div>
    );
  }

  return <Call meetingId={meetingId} />;
};
export default Join;

import { Redirect, useParams } from "react-router-dom";
import { SpinLoading } from "antd-mobile";
import Call from "./Call";
import usePeer from "../services/usePeer";

const Join = () => {
  const { connected } = usePeer();
  const { meetingId = null } = useParams();

  if (!meetingId) {
    return <Redirect to="/create" />;
  } else if (!connected) {
    return (
      <div style={{ margin: "50vw auto", width: "50vw" }}>
        <SpinLoading />
      </div>
    );
  }

  return <Call meetingId={meetingId} />;
};
export default Join;

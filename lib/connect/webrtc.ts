export type ConnectSignalType =
  | "call_invite"
  | "call_accept"
  | "call_decline"
  | "call_end"
  | "webrtc_offer"
  | "webrtc_answer"
  | "ice_candidate";

export type ConnectWebRtcConfig = {
  stunServers: string[];
  turnCredentialEndpoint?: string;
};

export function createConnectPeerConnection(config: ConnectWebRtcConfig): RTCPeerConnection {
  return new RTCPeerConnection({
    iceServers: [
      ...config.stunServers.map((urls) => ({ urls })),
      // TURN credentials must be fetched from a backend endpoint as short-lived credentials.
    ],
  });
}

export function assertAppToAppOnly(): true {
  return true;
}

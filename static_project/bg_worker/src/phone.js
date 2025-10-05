import {
    UserAgent,
    Registerer,
    Inviter,
    SessionState
} from "sip.js";

const ICE_SERVERS = [
    { urls: "stun:stun.l.google.com:19302" },
];

let userAgent;
let registerer;
let currentSession;

const log = (...args) => {
    console.log("[SIP]", ...args);
}

const extractDomainFromWsUrl = (wssUrl) => {
    try {
        const url = new URL(wssUrl);
        return url.hostname;
    } catch (e) {
        console.error("Неверный URL:", wssUrl);
        return "webrtc.mobilon.ru";
    }
}

export async function initPhone(config) {
    console.log(`2: ${JSON.stringify(config)}`);

    const SIP_USER = config.user;
    const SIP_PASS = config.password;
    const WS_SERVER = config.url;

    const SIP_DISPLAYNAME = SIP_USER;
    const SIP_DOMAIN = extractDomainFromWsUrl(WS_SERVER);

    if (!SIP_DOMAIN) {
        log("SIP domain wrong format");
        return;
    }
     
    const uri = UserAgent.makeURI(`sip:${SIP_USER}@${SIP_DOMAIN}`);
    
    if (userAgent) {
        log("UA already initialized");
        return;
    }

    console.log(`3: ${SIP_USER} ${SIP_PASS} ${WS_SERVER} ${SIP_DISPLAYNAME} ${SIP_DOMAIN} ${uri}`);
   
    userAgent = new UserAgent({
        uri,
        transportOptions: {
            server: WS_SERVER
        },
        authorizationUsername: SIP_USER,
        authorizationPassword: SIP_PASS,
        displayName: SIP_DISPLAYNAME,
        sessionDescriptionHandlerFactoryOptions: {
            peerConnectionOptions: {
                rtcConfiguration: {
                    iceServers: ICE_SERVERS
                }
            }
        }
    });

    userAgent.delegate = {
        onInvite: (invitation) => {
            log("Incoming call, auto-accept");
            setupSession(invitation, true);
            invitation.accept({
                sessionDescriptionHandlerOptions: {
                    constraints: { audio: true, video: false }
                }
            });
        }
    };

    registerer = new Registerer(userAgent);

    await userAgent.start();
    await registerer.register();
    log("UA registered");
}

export async function makeCall(target, config) {
    try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Микрофон активирован");
    } catch (err) {
        console.error("Нет доступа к микрофону:", err);
        return;
    }


    const domain = extractDomainFromWsUrl(config.url);

    if (!domain) {
        log("SIP domain wrong format");
        return;
    }

    if (!userAgent) return log("UserAgent not initialized");
    if (currentSession) return log("Already in call");

    console.log(`4: ${target}`);

    const _target = UserAgent.makeURI(`sip:${target}@${domain}`);

    console.log(`5: ${_target}`);
    const inviter = new Inviter(userAgent, _target, {
        sessionDescriptionHandlerOptions: {
            constraints: { audio: true, video: false }
        }
    });

    setupSession(inviter, false);

    try {
        await inviter.invite();
        log("Invite sent");
    } catch (e) {
        log("Invite failed", e);
    }
}

export function hangup() {
    if (!currentSession) return;
    try {
        currentSession.dispose();
    } catch (e) {
        log("Dispose error", e);
    }
    cleanupSession();
}

function setupSession(session, isIncoming) {
    currentSession = session;

    session.stateChange.addListener((state) => {
        log("Session state:", state);
        if (state === SessionState.Established) {
            attachRemoteAudio(session);
        }
        if (state === SessionState.Terminated) {
            cleanupSession();
        }
    });
}

function attachRemoteAudio(session) {
    const pc = session.sessionDescriptionHandler.peerConnection;
    const remoteStream = new MediaStream();
    pc.getReceivers().forEach(r => {
        if (r.track) remoteStream.addTrack(r.track);
    });
    const audioEl = document.getElementById("remoteAudio");
    audioEl.srcObject = remoteStream;
    audioEl.play().catch(err => log("Play blocked", err));
    log("Remote audio attached");
}

function cleanupSession() {
    currentSession = null;
}

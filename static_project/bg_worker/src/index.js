import { initPhone, makeCall, hangup } from "./phone.js";
import { initializeB24Frame } from "@bitrix24/b24jssdk";

var getConfig = (userId) => {
    var host = "https://" + window.location.hostname + "/api/bitrix/widget";
    var data = {
        event: 'GETUSERDATA',
        userId: userId,
    };

    return fetch(host, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }).then(response => response.json());
}

var initializePhone = (b24) => b24.callBatch({ user: { method: "user.current" }, })
    .then(userResult => userResult._data.user)
    .then(user => {
        window.br_worker_store.userId = user.ID;
        return getConfig(user.ID);
    }).then(config => {
        console.log(`1: ${JSON.stringify(config)}`);
        window.br_worker_store.config = config;
        initPhone(config)
    });

document.addEventListener("DOMContentLoaded", () => {
    var storage = {
        muteBtn: false,
        holdBtn: false,
    };

    window.br_worker_store = storage;

    initializeB24Frame().then(b24 => {
        initializePhone(b24);

        b24.placement.bindEvent("BackgroundCallCard::initialized", result => {
            console.log(JSON.stringify(result));
            var callID = result.CALL_ID;
            var phone = result.PHONE_NUMBER;
            console.log(callID);

            makeCall(result.PHONE_NUMBER, window.br_worker_store.config);

            window.br_worker_store.callId = callID;

            b24.callBatch({
                changeTitle: { method: "CallCardSetCardTitle", params: { title: phone } },
                changeStatus: { method: "CallCardSetStatusText", params: { statusText: 'SIPjs WebRTC phone' } },
                changeState: { method: "CallCardSetUiState", params: { uiState: 'connected' } },
            })
        });

        b24.placement.bindEvent("BackgroundCallCard::muteButtonClick", () => {
            window.bg_worker_store.muteBtn = !window.br_worker_store.muteBtn;
            confirm.log("muteButtonClick: on: ", window.br_worker_store.muteBtn);
        });

        b24.placement.bindEvent("BackgroundCallCard::holdButtonClick", () => {
            window.bg_worker_store.holdBtn = !window.br_worker_store.holdBtn;
            confirm.log("holdButtonClick: on: ", window.bg_worker_store.holdBtn);
        });

        b24.placement.bindEvent("BackgroundCallCard::dialpadButtonClick", number => {
            confirm.log("dialpadButtonClick: ", number);
        });

        b24.placement.bindEvent("BackgroundCallCard::hangupButtonClick", () => {
            console.log('hangupButtonClick: завершение звонка');
            hangup();
            b24.callBatch({
                finishCall: { method: "telephony.externalcall.finish", params: { USER_ID: window.br_worker_store.userId, CALL_ID: window.br_worker_store.callId} },
            })
        });

        b24.placement.bindEvent("BackgroundCallCard::closeButtonClick", () => {
            console.log('closeButtonClick: завершение звонка');
            hangup();
            b24.callBatch({
                finishCall: { method: "telephony.externalcall.finish", params: { USER_ID: window.br_worker_store.userId, CALL_ID: window.br_worker_store.callId} },
            })
        });

        return initializePhone(b24);
    });
});



////ТАк начинаем звонок
//makeCall(target, config.url, (stream) => {
//    const audio = document.getElementById("remoteAudio");
//    audio.srcObject = stream;
//    audio.play().catch(console.error);
//});
//
////так завершаем
//hangup();
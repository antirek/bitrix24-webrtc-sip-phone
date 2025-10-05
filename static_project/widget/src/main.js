import './styles.css';
import { initializeB24Frame } from "@bitrix24/b24jssdk";

import { PB_callForm, showPhoneDialog, closePhoneDialog} from './components/phoneDialog/phoneDialog.js';

function renderApp(isAdmin, makeRequest, backendApi, user) {
    var root = document.getElementById('root');
    var downloadWidgetProc = !isAdmin 
        ? import("./components/userProfileWidget/userProfileWidget.js").then(scope => scope.userProfileWidget)
        : import("./components/adminWidget/adminWidget.js").then(scope => scope.adminWidget);
   
    downloadWidgetProc.then(widget => widget(makeRequest, backendApi, { show: showPhoneDialog })).then(element => {
        var wrapper = PB_callForm(
            (phone_number) => {
                makeRequest({
                    call: {
                        method: "telephony.externalcall.register",
                        params: {
                            USER_ID: user.ID,
                            PHONE_NUMBER: phone_number,
                            TYPE: 1
                        }
                    }
                })
                    .then(console.log)
                    .finally(closePhoneDialog)
            },
            closePhoneDialog,
            element
        );
        root.innerHTML = wrapper;
    });
}

document.addEventListener('DOMContentLoaded', () => {

    var initFrameProc = initializeB24Frame();
    initFrameProc.then(b24 => {
        var makeRequest = b24.callBatch.bind(b24);

        var host = "https://" + window.location.hostname + "/api/bitrix/widget";

        var backendApi = Object.entries({
            updateSettings: {0: "UPDATECREED", 1: ["clientId", "secretId"]},
            getUser: {0: "GETUSERDATA", 1: ["userId"]},
            saveUser: {0: "SAVEUSERDATA", 1: ["userId", "url", "user", "password"]},
            getUsers: {0: "GETUSERSDATA", 1: ["usersId"]},
        }).reduce(
            (api, method) => {
                var {0: eventName, 1: paramList} = method;
                var func = (...args) => fetch(host, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(paramList[1].reduce(
                        (o, key, i) => {
                            o[key] = args[i];
                            return o;
                        }, {event: paramList[0]}
                    )),
                }).then(res => res.json());
                api[eventName] = func;
                return api;
            }, {}
        );

        makeRequest({user: {method: "user.current"}}).then(
            user => renderApp(b24.auth.isAdmin, makeRequest, backendApi, user._data.user)
        );
    })
});
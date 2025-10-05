import "./userProfileWidget.css";
import "./../phoneButton/phoneButton.css";
import { phoneButton } from "../phoneButton/phoneButton";

var c = {
    webrtc: "upw_profile-webrtc",
    sipname: "upw_profile-sip",
    pswd: "upw_profile_pswd",
    root: "upw_profile-info-div"
}

var password_edit = () => {
    return `
        <div class="upw_info-item" id="${c.pswd}">
            <label>Новый пароль:</label>
            <input class="upw_input-fields" type="password" value="">
        </div>
    `;
}

var webrtc_info = (web_rtc_url) => {
    return `
        <div class="upw_info-item" id="${c.webrtc}" data-value="${web_rtc_url}">
            <label>WebRTC URL:</label>
            <span>${web_rtc_url}</span>
        </div>
    `;
}

var webrtc_edit = (web_rtc_url) => {
    return `
        <div class="upw_info-item" id="${c.webrtc}">
            <label>WebRTC URL:</label>
            <input class="upw_input-fields" type="text" value="${web_rtc_url}">
        </div>
    `;
}

var sip_info = (sip_username) => {
    return `
        <div class="upw_info-item" id="${c.sipname}" data-value="${sip_username}">
            <label>SIP Username:</label>
            <span>${sip_username}</span>
        </div>
    `;
}

var sip_edit = (sip_username) => {
    return `
        <div class="upw_info-item" id="${c.sipname}">
            <label>SIP Username:</label>
            <input class="upw_input-fields" type="text" value="${sip_username}">
        </div>
    `;
}

var saveButton = () => `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
`;

var editButton = () => `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
`;

export var userProfileWidget = (makeRequest, backendApi, phoneDialog) => {

    window.userProfileWidgetHandlers = {
        startEdit: () => {
            var webrtc = document.getElementById(c.webrtc);
            var sipname = document.getElementById(c.sipname);
            var pswd = document.getElementById(c.pswd);
            var editBtn = document.getElementById("upw_edit-profile-btn");

            var webrtcValue = webrtc.dataset.value;
            var sipValue = sipname.dataset.value;

            webrtc.outerHTML = webrtc_edit(webrtcValue);
            sipname.outerHTML = sip_edit(sipValue);
            pswd.outerHTML = password_edit();

            editBtn.innerHTML = saveButton();
            editBtn.onclick = userProfileWidgetHandlers.saveEdit;
            editBtn.classList.add('upw_save-btn');
        },

        saveEdit: () => {
            var webrtcInput = document.querySelector(`#${c.webrtc} .upw_input-fields`);
            var idspan = document.querySelector(`#upw_profile-id`);
            var sipInput = document.querySelector(`#${c.sipname} .upw_input-fields`);
            var pswd = document.querySelector(`#${c.pswd} .upw_input-fields`);
            var editBtn = document.getElementById("upw_edit-profile-btn");

            var newWebrtcValue = webrtcInput.value;
            var newSipValue = sipInput.value;
            var newPassword = pswd.value;
            var userId = idspan.textContent;

            var end = () => {
                var webrtcElement = document.getElementById(c.webrtc);
                var sipElement = document.getElementById(c.sipname);
                var pswdElement = document.getElementById(c.pswd);

                webrtcElement.outerHTML = webrtc_info(newWebrtcValue);
                sipElement.outerHTML = sip_info(newSipValue);
                pswdElement.outerHTML = `<div id="${c.pswd}" hidden></div>`;

                editBtn.innerHTML = editButton();
                editBtn.onclick = userProfileWidgetHandlers.startEdit;
                editBtn.classList.remove('upw_save-btn');
            };

            backendApi.saveUser(
                userId,
                newWebrtcValue,
                newSipValue,
                newPassword.length > 0 ? newPassword : undefined,
            ).then(end)
        }
    }

    return makeRequest({
        user: {
            method: "user.current"
        }
    }).then(response => {
        var resUser = response._data.user;
        return backendApi.getUser(resUser.ID).catch(error => ({})).then(
            backendRes => {
                var user = {
                    id: resUser.ID,
                    name: resUser.LAST_NAME + " " + resUser.NAME,
                    web_rtc_url: backendRes.url,
                    sip_username: backendRes.user,
                    status: resUser.ACTIVE
                };
                return `
                    <div class="upw_user-panel">
                        <div class="upw_profile-card">
                            <div class="upw_profile-header">
                                <h2>Мой профиль</h2>
                                ${phoneButton(() => phoneDialog.show())}
                                <button class="upw_edit-btn" id="upw_edit-profile-btn" onclick="userProfileWidgetHandlers.startEdit()">
                                    ${editButton()}
                                </button>
                            </div>
                            <div class="upw_profile-info" id="${c.root}">
                                <div class="upw_info-item">
                                    <label>ID:</label>
                                    <span id="upw_profile-id">${user.id}</span>
                                </div>
                                <div class="upw_info-item" id="upw_profile-name-item">
                                    <label>ФИО:</label>
                                    <span>${user.name}</span>
                                </div>
                                ${webrtc_info(user.web_rtc_url)}   
                                ${sip_info(user.sip_username)}
                                <div class="upw_info-item">
                                    <label>Статус:</label>
                                    <span id="upw_profile-status">${user.status ? 'Активен' : 'Неактивен'}</span>
                                </div>
                                <div id="${c.pswd}" hidden></div>
                            </div>
                        </div>
                    </div>
                `
            }
        );
    })
};
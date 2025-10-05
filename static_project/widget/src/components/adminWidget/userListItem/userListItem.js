import "./userListItem.css";

var c = {
    webrtc: "uli_profile-webrtc",
    sipname: "uli_profile-sip",
    status: "uli_profile-status",
    root: "uli_user-details",
    pswd: "uli_user-password"
}

var webrtc_info = (web_rtc_url) => {
    return `
        <div class="uli_detail-item" id="${c.webrtc}" data-value="${web_rtc_url}">
            <span class="uli_detail-label">WebRTC URL:</span>
            <span class="uli_detail-value">${web_rtc_url}</span>
        </div>
    `;
}

var webrtc_edit = (web_rtc_url) => {
    return `
        <div class="uli_detail-item" id="${c.webrtc}">
            <span class="uli_detail-label">WebRTC URL:</span>
            <input class="uli_input-fields" type="text" value="${web_rtc_url}">
        </div>
    `;
}

var sip_info = (sip_username) => {
    return `
        <div class="uli_detail-item" id="${c.sipname}" data-value="${sip_username}">
            <span class="uli_detail-label">SIP Username:</span>
            <span class="uli_detail-value">${sip_username}</span>
        </div>
    `;
}

var sip_edit = (sip_username) => {
    return `
        <div class="uli_detail-item" id="${c.sipname}">
            <span class="uli_detail-label">SIP Username:</span>
            <input class="uli_input-fields" type="text" value="${sip_username}">
        </div>
    `;
}

var pswd_info = () => `<div id="${c.pswd}" hidden></div>`
var pswd_edit = () => {
    return `
        <div class="uli_detail-item" id="${c.pswd}">
            <span class="uli_detail-label">Новый пароль:</span>
            <input class="uli_input-fields" type="password">
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

var userListListener = (saveUser) => (e) => {
    var target = e.target;
    var card = target.closest('.uli_user-card');

    if (!card) return;

    const userId = card.dataset.userId;
    const userData = window.uli_usersData?.[userId];

    if (!userData) {
        console.warn('User data not found for ID:', userId);
        return;
    }

    const statusBtn = target.closest('.uli_status-btn');
    const editBtn = target.closest('.uli_edit-btn');

    if (statusBtn) {
        userData.status = !userData.status;

        statusBtn.innerHTML = userData.status ? 'Активен' : 'Неактивен';
        statusBtn.className = `uli_status-btn ${userData.status ? 'uli_status-active' : 'uli_status-inactive'}`;

        console.log('Изменение статуса пользователя:', {
            userId: userId,
            newStatus: userData.status,
        });
    }

    else if (editBtn) {
        if (editBtn.classList.contains('uli_save-btn')) {
            var webrtcInput = card.querySelector(`#${c.webrtc} .uli_input-fields`);
            var sipInput = card.querySelector(`#${c.sipname} .uli_input-fields`);
            var pswdInput = card.querySelector(`#${c.pswd} .uli_input-fields`);

            var newWebrtcValue = webrtcInput.value;
            var newSipValue = sipInput.value;
            var pswdValue = pswdInput.value;

            var endS = () => {
                userData.web_rtc_url = newWebrtcValue;
                userData.sip_username = newSipValue;

                var webrtcElement = card.querySelector(`#${c.webrtc}`);
                var sipElement = card.querySelector(`#${c.sipname}`);
                var pswdElement = card.querySelector(`#${c.pswd}`);

                webrtcElement.outerHTML = webrtc_info(newWebrtcValue);
                sipElement.outerHTML = sip_info(newSipValue);
                pswdElement.outerHTML = pswd_info();

                editBtn.innerHTML = editButton();
                editBtn.classList.remove('uli_save-btn');
            };

            return saveUser(userId, newWebrtcValue, newSipValue, pswdValue).then(endS);

        } else {
            var webrtc = card.querySelector(`#${c.webrtc}`);
            var sipname = card.querySelector(`#${c.sipname}`);
            var pswd = card.querySelector(`#${c.pswd}`);

            if (webrtc && sipname) {
                var webrtcValue = webrtc.dataset.value || userData.web_rtc_url;
                var sipValue = sipname.dataset.value || userData.sip_username;

                webrtc.outerHTML = webrtc_edit(webrtcValue);
                sipname.outerHTML = sip_edit(sipValue);
                pswd.outerHTML = pswd_edit();

                editBtn.innerHTML = saveButton();
                editBtn.classList.add('uli_save-btn');
            }
        }
    }
}

var setUsersData = (users) => {
    if (!window.uli_usersData) {
        var obj = users.reduce((o, u) => {
            o[u.id] = u;
            return o;
        }, {});

        window.uli_usersData = JSON.parse(JSON.stringify(obj));
    }
};

export var initUserListListener = (container, users, saveUser) => {
    setUsersData(users);
    container.addEventListener('click', userListListener(saveUser));
};


export var userListItem = (user, noListeners = false) => {
    var cardId = `uli_card_${user.id}`;

    if (!noListeners) {
        window[`uli_handlers_${user.id}`] = {
            toggleStatus: () => {
                user.status = !user.status;

                var statusElement = document.querySelector(`#${cardId} .uli_status-btn`);
                if (statusElement) {
                    statusElement.innerHTML = user.status ? 'Активен' : 'Неактивен';
                    statusElement.className = `uli_status-btn ${user.status ? 'uli_status-active' : 'uli_status-inactive'}`;
                }

                console.log('Изменение статуса пользователя:', {
                    userId: user.id,
                    newStatus: user.status,
                });
            },

            startEdit: () => {
                var webrtc = document.querySelector(`#${cardId} #${c.webrtc}`);
                var sipname = document.querySelector(`#${cardId} #${c.sipname}`);
                var pswd = document.querySelector(`#${cardId} #${c.pswd}`);
                var editBtn = document.querySelector(`#${cardId} .uli_edit-btn`);

                var webrtcValue = webrtc.dataset.value;
                var sipValue = sipname.dataset.value;

                webrtc.outerHTML = webrtc_edit(webrtcValue);
                sipname.outerHTML = sip_edit(sipValue);
                pswd.outerHTML = pswd_edit();

                editBtn.innerHTML = saveButton();
                editBtn.onclick = () => window[`uli_handlers_${user.id}`].saveEdit();
                editBtn.classList.add('uli_save-btn');
            },

            saveEdit: () => {
                var webrtcInput = document.querySelector(`#${cardId} #${c.webrtc} .uli_input-fields`);
                var sipInput = document.querySelector(`#${cardId} #${c.sipname} .uli_input-fields`);
                var editBtn = document.querySelector(`#${cardId} .uli_edit-btn`);

                var newWebrtcValue = webrtcInput.value;
                var newSipValue = sipInput.value;

                console.log('Сохранение данных пользователя:', {
                    userId: user.id,
                    webrtc: newWebrtcValue,
                    sip: newSipValue,
                });

                user.web_rtc_url = newWebrtcValue;
                user.sip_username = newSipValue;

                var webrtcElement = document.querySelector(`#${cardId} #${c.webrtc}`);
                var sipElement = document.querySelector(`#${cardId} #${c.sipname}`);

                webrtcElement.outerHTML = webrtc_info(newWebrtcValue);
                sipElement.outerHTML = sip_info(newSipValue);

                editBtn.innerHTML = editButton();
                editBtn.onclick = () => window[`uli_handlers_${user.id}`].startEdit();
                editBtn.classList.remove('uli_save-btn');
            }
        };
    }

    return `
        <div class="uli_user-card" id="${cardId}" data-user-id="${user.id}">
            <div class="uli_user-header">
                <div class="uli_user-name">${user.name}</div>
                <div class="uli_user-controls">
                    <button class="uli_status-btn ${user.status ? 'uli_status-active' : 'uli_status-inactive'}" 
                            ${!noListeners ? `onclick="uli_handlers_${user.id}.toggleStatus()"` : ""}>
                        ${user.status ? 'Активен' : 'Неактивен'}
                    </button>
                    <button class="uli_edit-btn" ${!noListeners ? `onclick="uli_handlers_${user.id}.startEdit()"` : ""}>
                        ${editButton()}
                    </button>
                </div>
            </div>
            <div class="uli_user-details" id="${c.root}">
                ${webrtc_info(user.web_rtc_url)}   
                ${sip_info(user.sip_username)}
                ${pswd_info()}
            </div>
        </div>
    `;
};
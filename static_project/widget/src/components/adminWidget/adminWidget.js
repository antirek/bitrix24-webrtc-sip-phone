import "./adminWidget.css";
import "../phoneButton/phoneButton.css";

import { userListItem, initUserListListener } from "./userListItem/userListItem.js";
import { phoneButton } from "../phoneButton/phoneButton.js";

export var adminWidget = (makeRequest, backendApi, phoneDialog) => {
    return makeRequest({
        user_list: {
            method: "user.get"
        }
    }).then(response => {
        return backendApi.getUsers(response._data.user_list.map(x => x.ID)).catch(error => []).then(backendRes => {
            var usersRes = response._data.user_list;
            var backendUsers = backendRes?.users || [];

            var users = [];

            usersRes.forEach(u => {
                var bu = backendUsers.find(x => x.id == u.ID);
                users.push({
                    id: u.ID,
                    name: u.LAST_NAME + " " + u.NAME,
                    web_rtc_url: bu?.url,
                    sip_username: bu?.user,
                    status: u.ACTIVE
                });
            });

            window.AW_saveSettings = function () {
                var secretId = document.getElementById('AW_settings_secret_id').value;
                var clientId = document.getElementById('AW_settings_client_id').value;
            
                backendApi.updateSettings(clientId, secretId).then(() => window.alert("Успешно"), () => window.alert("Ошибка"));
            };

            var phoneBtn = phoneButton(() => phoneDialog.show());

            return {
                html: `
                    <div class="AW_admin-panel">
                        <div class="AW_settings-box">
                            <h3 class="AW_settings-title">Настройки системы</h3>
                            <div class="AW_settings-form">
                                <div class="AW_form-group">
                                    <label for="AW_settings_secret_id" class="AW_form-label">Secret ID:</label>
                                    <input type="text" id="AW_settings_secret_id" class="AW_input-field" value="">
                                </div>
                                <div class="AW_form-group">
                                    <label for="AW_settings_client_id" class="AW_form-label">Client ID:</label>
                                    <input type="text" id="AW_settings_client_id" class="AW_input-field" value="">
                                </div>
                            </div>

                            <div class="AW_settings-form">
                                <button class="AW_btn AW_btn-success" onclick="AW_saveSettings()">
                                    Сохранить настройки
                                </button>
                                ${phoneBtn}
                            </div>
                        </div>

                        <div class="AW_panel-header">
                            <h2 class="AW_panel-title">Управление пользователями</h2>
                        </div>

                        <div class="AW_users-grid" id="AW_users-grid">
                            ${users.map(user => userListItem(user, true)).join('')}
                        </div>
                    </div>
                `,
                userList: users
            };
        }).then(({ html, userList }) => {
            setTimeout(() => {
                var container = document.getElementById("AW_users-grid");
                if (container) {
                    initUserListListener(container, userList, backendApi.saveUser);
                }
            }, 0);

            return html;
        });
    });
}


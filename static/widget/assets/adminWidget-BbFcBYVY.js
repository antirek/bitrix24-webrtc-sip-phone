import{p as H}from"./phoneButton-Bku5cjdY.js";var s={webrtc:"uli_profile-webrtc",sipname:"uli_profile-sip",root:"uli_user-details",pswd:"uli_user-password"},$=t=>`
        <div class="uli_detail-item" id="${s.webrtc}" data-value="${t}">
            <span class="uli_detail-label">WebRTC URL:</span>
            <span class="uli_detail-value">${t}</span>
        </div>
    `,f=t=>`
        <div class="uli_detail-item" id="${s.webrtc}">
            <span class="uli_detail-label">WebRTC URL:</span>
            <input class="uli_input-fields" type="text" value="${t}">
        </div>
    `,w=t=>`
        <div class="uli_detail-item" id="${s.sipname}" data-value="${t}">
            <span class="uli_detail-label">SIP Username:</span>
            <span class="uli_detail-value">${t}</span>
        </div>
    `,g=t=>`
        <div class="uli_detail-item" id="${s.sipname}">
            <span class="uli_detail-label">SIP Username:</span>
            <input class="uli_input-fields" type="text" value="${t}">
        </div>
    `,h=()=>`<div id="${s.pswd}" hidden></div>`,L=()=>`
        <div class="uli_detail-item" id="${s.pswd}">
            <span class="uli_detail-label">Новый пароль:</span>
            <input class="uli_input-fields" type="password">
        </div>
    `,S=()=>`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
`,b=()=>`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
`,B=t=>n=>{var i=n.target,e=i.closest(".uli_user-card");if(!e)return;const l=e.dataset.userId,a=window.uli_usersData?.[l];if(!a){console.warn("User data not found for ID:",l);return}const r=i.closest(".uli_status-btn"),u=i.closest(".uli_edit-btn");if(r)a.status=!a.status,r.innerHTML=a.status?"Активен":"Неактивен",r.className=`uli_status-btn ${a.status?"uli_status-active":"uli_status-inactive"}`,console.log("Изменение статуса пользователя:",{userId:l,newStatus:a.status});else if(u)if(u.classList.contains("uli_save-btn")){var c=e.querySelector(`#${s.webrtc} .uli_input-fields`),d=e.querySelector(`#${s.sipname} .uli_input-fields`),v=e.querySelector(`#${s.pswd} .uli_input-fields`),o=c.value,_=d.value,y=v.value,A=()=>{a.web_rtc_url=o,a.sip_username=_;var T=e.querySelector(`#${s.webrtc}`),q=e.querySelector(`#${s.sipname}`),E=e.querySelector(`#${s.pswd}`);T.outerHTML=$(o),q.outerHTML=w(_),E.outerHTML=h(),u.innerHTML=b(),u.classList.remove("uli_save-btn")};return t(l,o,_,y).then(A)}else{var p=e.querySelector(`#${s.webrtc}`),m=e.querySelector(`#${s.sipname}`),W=e.querySelector(`#${s.pswd}`);if(p&&m){var I=p.dataset.value||a.web_rtc_url,M=m.dataset.value||a.sip_username;p.outerHTML=f(I),m.outerHTML=g(M),W.outerHTML=L(),u.innerHTML=S(),u.classList.add("uli_save-btn")}}},D=t=>{if(!window.uli_usersData){var n=t.reduce((i,e)=>(i[e.id]=e,i),{});window.uli_usersData=JSON.parse(JSON.stringify(n))}},U=(t,n,i)=>{D(n),t.addEventListener("click",B(i))},x=(t,n=!1)=>{var i=`uli_card_${t.id}`;return n||(window[`uli_handlers_${t.id}`]={toggleStatus:()=>{t.status=!t.status;var e=document.querySelector(`#${i} .uli_status-btn`);e&&(e.innerHTML=t.status?"Активен":"Неактивен",e.className=`uli_status-btn ${t.status?"uli_status-active":"uli_status-inactive"}`),console.log("Изменение статуса пользователя:",{userId:t.id,newStatus:t.status})},startEdit:()=>{var e=document.querySelector(`#${i} #${s.webrtc}`),l=document.querySelector(`#${i} #${s.sipname}`),a=document.querySelector(`#${i} #${s.pswd}`),r=document.querySelector(`#${i} .uli_edit-btn`),u=e.dataset.value,c=l.dataset.value;e.outerHTML=f(u),l.outerHTML=g(c),a.outerHTML=L(),r.innerHTML=S(),r.onclick=()=>window[`uli_handlers_${t.id}`].saveEdit(),r.classList.add("uli_save-btn")},saveEdit:()=>{var e=document.querySelector(`#${i} #${s.webrtc} .uli_input-fields`),l=document.querySelector(`#${i} #${s.sipname} .uli_input-fields`),a=document.querySelector(`#${i} .uli_edit-btn`),r=e.value,u=l.value;console.log("Сохранение данных пользователя:",{userId:t.id,webrtc:r,sip:u}),t.web_rtc_url=r,t.sip_username=u;var c=document.querySelector(`#${i} #${s.webrtc}`),d=document.querySelector(`#${i} #${s.sipname}`);c.outerHTML=$(r),d.outerHTML=w(u),a.innerHTML=b(),a.onclick=()=>window[`uli_handlers_${t.id}`].startEdit(),a.classList.remove("uli_save-btn")}}),`
        <div class="uli_user-card" id="${i}" data-user-id="${t.id}">
            <div class="uli_user-header">
                <div class="uli_user-name">${t.name}</div>
                <div class="uli_user-controls">
                    <button class="uli_status-btn ${t.status?"uli_status-active":"uli_status-inactive"}" 
                            ${n?"":`onclick="uli_handlers_${t.id}.toggleStatus()"`}>
                        ${t.status?"Активен":"Неактивен"}
                    </button>
                    <button class="uli_edit-btn" ${n?"":`onclick="uli_handlers_${t.id}.startEdit()"`}>
                        ${b()}
                    </button>
                </div>
            </div>
            <div class="uli_user-details" id="${s.root}">
                ${$(t.web_rtc_url)}   
                ${w(t.sip_username)}
                ${h()}
            </div>
        </div>
    `},N=(t,n,i)=>t({user_list:{method:"user.get"}}).then(e=>n.getUsers(e._data.user_list.map(l=>l.ID)).catch(l=>[]).then(l=>{var a=e._data.user_list,r=l?.users||[],u=[];a.forEach(d=>{var v=r.find(o=>o.id==d.ID);u.push({id:d.ID,name:d.LAST_NAME+" "+d.NAME,web_rtc_url:v?.url,sip_username:v?.user,status:d.ACTIVE})}),window.AW_saveSettings=function(){var d=document.getElementById("AW_settings_secret_id").value,v=document.getElementById("AW_settings_client_id").value;n.updateSettings(v,d).then(()=>window.alert("Успешно"),()=>window.alert("Ошибка"))};var c=H(()=>i.show());return{html:`
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
                                ${c}
                            </div>
                        </div>

                        <div class="AW_panel-header">
                            <h2 class="AW_panel-title">Управление пользователями</h2>
                        </div>

                        <div class="AW_users-grid" id="AW_users-grid">
                            ${u.map(d=>x(d,!0)).join("")}
                        </div>
                    </div>
                `,userList:u}}).then(({html:l,userList:a})=>(setTimeout(()=>{var r=document.getElementById("AW_users-grid");r&&U(r,a,n.saveUser)},0),l)));export{N as adminWidget};

import{p as h}from"./phoneButton-Bku5cjdY.js";var e={webrtc:"upw_profile-webrtc",sipname:"upw_profile-sip",pswd:"upw_profile_pswd",root:"upw_profile-info-div"},g=()=>`
        <div class="upw_info-item" id="${e.pswd}">
            <label>Новый пароль:</label>
            <input class="upw_input-fields" type="password" value="">
        </div>
    `,o=t=>`
        <div class="upw_info-item" id="${e.webrtc}" data-value="${t}">
            <label>WebRTC URL:</label>
            <span>${t}</span>
        </div>
    `,E=t=>`
        <div class="upw_info-item" id="${e.webrtc}">
            <label>WebRTC URL:</label>
            <input class="upw_input-fields" type="text" value="${t}">
        </div>
    `,v=t=>`
        <div class="upw_info-item" id="${e.sipname}" data-value="${t}">
            <label>SIP Username:</label>
            <span>${t}</span>
        </div>
    `,I=t=>`
        <div class="upw_info-item" id="${e.sipname}">
            <label>SIP Username:</label>
            <input class="upw_input-fields" type="text" value="${t}">
        </div>
    `,L=()=>`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
`,w=()=>`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
`,B=(t,n,c)=>(window.userProfileWidgetHandlers={startEdit:()=>{var d=document.getElementById(e.webrtc),r=document.getElementById(e.sipname),a=document.getElementById(e.pswd),i=document.getElementById("upw_edit-profile-btn"),s=d.dataset.value,l=r.dataset.value;d.outerHTML=E(s),r.outerHTML=I(l),a.outerHTML=g(),i.innerHTML=L(),i.onclick=userProfileWidgetHandlers.saveEdit,i.classList.add("upw_save-btn")},saveEdit:()=>{var d=document.querySelector(`#${e.webrtc} .upw_input-fields`),r=document.querySelector("#upw_profile-id"),a=document.querySelector(`#${e.sipname} .upw_input-fields`),i=document.querySelector(`#${e.pswd} .upw_input-fields`),s=document.getElementById("upw_edit-profile-btn"),l=d.value,u=a.value,p=i.value,m=r.textContent,_=()=>{var f=document.getElementById(e.webrtc),b=document.getElementById(e.sipname),$=document.getElementById(e.pswd);f.outerHTML=o(l),b.outerHTML=v(u),$.outerHTML=`<div id="${e.pswd}" hidden></div>`,s.innerHTML=w(),s.onclick=userProfileWidgetHandlers.startEdit,s.classList.remove("upw_save-btn")};n.saveUser(m,l,u,p.length>0?p:void 0).then(_)}},t({user:{method:"user.current"}}).then(d=>{var r=d._data.user;return n.getUser(r.ID).catch(a=>({})).then(a=>{var i={id:r.ID,name:r.LAST_NAME+" "+r.NAME,web_rtc_url:a.url,sip_username:a.user,status:r.ACTIVE};return`
                    <div class="upw_user-panel">
                        <div class="upw_profile-card">
                            <div class="upw_profile-header">
                                <h2>Мой профиль</h2>
                                ${h(()=>c.show())}
                                <button class="upw_edit-btn" id="upw_edit-profile-btn" onclick="userProfileWidgetHandlers.startEdit()">
                                    ${w()}
                                </button>
                            </div>
                            <div class="upw_profile-info" id="${e.root}">
                                <div class="upw_info-item">
                                    <label>ID:</label>
                                    <span id="upw_profile-id">${i.id}</span>
                                </div>
                                <div class="upw_info-item" id="upw_profile-name-item">
                                    <label>ФИО:</label>
                                    <span>${i.name}</span>
                                </div>
                                ${o(i.web_rtc_url)}   
                                ${v(i.sip_username)}
                                <div class="upw_info-item">
                                    <label>Статус:</label>
                                    <span id="upw_profile-status">${i.status?"Активен":"Неактивен"}</span>
                                </div>
                                <div id="${e.pswd}" hidden></div>
                            </div>
                        </div>
                    </div>
                `})}));export{B as userProfileWidget};

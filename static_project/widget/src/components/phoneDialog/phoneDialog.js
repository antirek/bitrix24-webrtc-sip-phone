import "./phoneDialog.css";

var PB_callStartButton = () => `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
    </svg>
`;

var PB_callCancelButton = () => `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
`;

export var showPhoneDialog = () => {
    var dialog = document.getElementById("PB_call-form-dialog");
    dialog.classList.remove("PB_disable");
    dialog.classList.add("PB_enable");
}
export var closePhoneDialog = () => {
    var dialog = document.getElementById("PB_call-form-dialog");
    dialog.classList.remove("PB_enable");
    dialog.classList.add("PB_disable");
}

export var PB_callForm = (onStartCall, onCancel, mainContent) => {
    
    window.PB_callFormHandlers = {
        startCall: () => {
            var phoneInput = document.getElementById("PB_call-phone-input");
            var phoneNumber = phoneInput.value.trim();
            
            if (!phoneNumber) {
                phoneInput.focus();
                phoneInput.style.borderColor = "#f44336";
                setTimeout(() => {
                    phoneInput.style.borderColor = "#e1e5e9";
                }, 2000);
                return;
            }
            
            if (onStartCall) {
                onStartCall(phoneNumber);
            }
        },
        
        cancelCall: () => {
            if (onCancel) {
                onCancel();
            }
        },
        
        handleKeyPress: (event) => {
            if (event.key === 'Enter') {
                PB_callFormHandlers.startCall();
            }
        }
    };



    return `
        <div class="PB_notCall-form">
            ${mainContent} 
        </div>
        <div class="PB_call-form-box PB_disable" id="PB_call-form-dialog">
            <div class="PB_call-form">
                <div class="PB_call-header">
                    <h2>Совершить звонок</h2>
                </div>
                <div class="PB_call-content">
                    <div class="PB_call-input-group">
                        <label class="PB_call-label" for="PB_call-phone-input">Номер телефона:</label>
                        <input 
                            class="PB_call-input" 
                            type="tel" 
                            id="PB_call-phone-input" 
                            placeholder="Введите номер телефона"
                            onkeypress="PB_callFormHandlers.handleKeyPress(event)"
                        >
                    </div>
                    <div class="PB_call-buttons">
                        <button class="PB_call-btn PB_call-cancel" onclick="PB_callFormHandlers.cancelCall()">
                            ${PB_callCancelButton()}
                            Отмена
                        </button>
                        <button class="PB_call-btn PB_call-start" onclick="PB_callFormHandlers.startCall()">
                            ${PB_callStartButton()}
                            Начать звонок
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};
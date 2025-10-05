import "./phoneButton.css";

export var phoneButton = (clickHandler) => {

    var uuid = (crypto && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString();
    var id = `pb_${uuid}`;
    var m = `${id.replaceAll("-", "")}_m`

    window[m] = clickHandler

    return `
        <button class="PB_btn" id="${id}" onclick="${m}()">📞</button>
    `;
}
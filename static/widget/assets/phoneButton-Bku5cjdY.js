var a=r=>{var n=crypto&&crypto.randomUUID?crypto.randomUUID():Date.now().toString(),t=`pb_${n}`,o=`${t.replaceAll("-","")}_m`;return window[o]=r,`
        <button class="PB_btn" id="${t}" onclick="${o}()">📞</button>
    `};export{a as p};

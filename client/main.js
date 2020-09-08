const $ = document.querySelector.bind(document);
const $a = document.querySelectorAll.bind(document);

const socket = io('/');

socket.on('log', data => {
    newLog(data);
});

socket.on('log-error', data => {
    newLog(data, true);
});

function newLog(data, isError = false) {
    const el = document.createElement('div');
    el.innerText = data.toString();
    if (isError) {
        el.style.color = '#78bbff';
    }
    $('#logs').append(el);
};

document.addEventListener('DOMContentLoaded', async () => {
    const tagify = new Tagify($('#packages-list'), {
        delimiters: ' ',
        editTags: 1,
        dropdown: {
           //clearOnSelect: false,
        },
    });
    let controller;

    tagify.on('input', onInput);

    function onInput(e) {
        var value = e.detail.value;
        tagify.settings.whitelist.length = 0; // reset the whitelist

        // https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
        controller && controller.abort();
        controller = new AbortController();

        // show loading animation and hide the suggestions dropdown
        tagify.loading(true).dropdown.hide.call(tagify);

        fetch('/api/search?q=' + value, {signal: controller.signal})
            .then(RES => RES.json())
            .then(function (whitelist) {
                // update inwhitelist Array in-place
                tagify.settings.whitelist.splice(0, whitelist.length, ...whitelist);
                tagify.loading(false).dropdown.show.call(tagify, value); // render the suggestions dropdown
            });
    }

    $('#submit-packages').addEventListener('click', () => {
        const packagesValue = tagify.value;
        const packagesNames = packagesValue.map(item => item.value);
        console.log(packagesNames);
        $('#logs').querySelectorAll(':scope > *').forEach(i => i.remove());

        // axios.get('/api/download/["chalk"]');
        location.href = `/api/download/${encodeURIComponent(JSON.stringify(packagesNames))}`;
    });
});

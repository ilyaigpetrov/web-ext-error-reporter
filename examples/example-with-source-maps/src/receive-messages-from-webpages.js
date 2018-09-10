// import * as Weer from './vendor/weer/index.js'

console.log('CONTENT SCRIPT STARTED', chrome.runtime);
// const port = chrome.runtime.connect();

window.addEventListener('message', function(event) {

    console.log('CS RECEIVED:', event);
    if (event.source != window) {
        console.log('EVENT.SOURCE IS:', event.source);
        return;
    }

    if (event.data.action === 'SEND_REPORT') {
        console.log('Content script received SEND_DATA:', event.data);
        chrome.runtime.sendMessage({ action: 'SEND_REPORT', report: 'abc3' }, {}, (...args) => console.log('YES', ...args));

        /*
        chrome.runtime.sendMessage({
            hello: 1a
        });
        */
    }
});

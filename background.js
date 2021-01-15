// when the extension gets installed on a user's browser 
const FREETIME_START = 'kp_cn_freetime_start';
const FREETIME_DURATION = 'kp_cn_freetime_duration';
const FREETIME_END = 'kp_cn_freetime_end';
const FREETIME_ACTIVE = 'kp_cn_freetime_active';

chrome.runtime.onInstalled.addListener(() => {
    console.log('something')
    cache = "hello"
    localStorage.setItem(FREETIME_ACTIVE, 'true');
})

// when a page gets loaded
// chrome.tabs.onCreated.addListener((tab) => {
// })

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case "close":
            chrome.tabs.remove(sender.tab.id);
            break;

        // getters
        case "getAll":
            sendResponse({
                response: {
                    start: localStorage.getItem(FREETIME_START),
                    end: localStorage.getItem(FREETIME_END),
                    duration: localStorage.getItem(FREETIME_DURATION),
                    active: localStorage.getItem(FREETIME_ACTIVE)
                }
            })
            break;
        case "getStart":
            sendResponse({ response: localStorage.getItem(FREETIME_START) })
            break;
        case "getEnd":
            sendResponse({ response: localStorage.getItem(FREETIME_END) })
            break;
        case "getDuration":
            sendResponse({ response: localStorage.getItem(FREETIME_DURATION) })
            break;
        case "getActive":
            sendResponse({ response: localStorage.getItem(FREETIME_ACTIVE) })
            break;

        // setters
        case "setStart":
            localStorage.setItem(FREETIME_START, message.payload)
            break;
        case "setEnd":
            localStorage.setItem(FREETIME_END, message.payload)
            break;
        case "setDuration":
            localStorage.setItem(FREETIME_DURATION, message.payload)
            break;
        case "setActive":
            localStorage.setItem(FREETIME_ACTIVE, message.payload)
            break;
    }
    if (message.close) chrome.tabs.remove(sender.tab.id);
});
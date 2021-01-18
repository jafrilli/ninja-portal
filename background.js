// when the extension gets installed on a user's browser 
const FREETIME_START = 'np_cn_freetime_start';
const FREETIME_END = 'np_cn_freetime_end';
const FREETIME_ACTIVE = 'np_cn_freetime_active';

const FREETIME_DURATION = 'np_cn_freetime_duration';
const FREETIME_WHITELIST = 'np_cn_freetime_whitelist';
const FREETIME_COOLDOWN = 'np_cn_freetime_cooldown';
const FREETIME_CODE = 'np_cn_freetime_code';


chrome.runtime.onInstalled.addListener(() => {
    localStorage.setItem(FREETIME_ACTIVE, 'false');

    // default settings
    localStorage.setItem(FREETIME_DURATION, 1)
    localStorage.setItem(FREETIME_COOLDOWN, 2)
    localStorage.setItem(FREETIME_WHITELIST, [
        "google.com",
        "youtube.com",
        "stackoverflow.com"
    ].join(','))
    localStorage.setItem(FREETIME_CODE, 1270)
})

// when a page gets loaded
// chrome.tabs.onCreated.addListener((tab) => {
// })

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case "close":
            chrome.tabs.remove(sender.tab.id);
            break;

        // freetime getters
        case "getAll":
            sendResponse({
                response: {
                    start: localStorage.getItem(FREETIME_START),
                    end: localStorage.getItem(FREETIME_END),
                    active: localStorage.getItem(FREETIME_ACTIVE),

                    duration: localStorage.getItem(FREETIME_DURATION),
                    whitelist: localStorage.getItem(FREETIME_WHITELIST),
                    cooldown: localStorage.getItem(FREETIME_COOLDOWN),
                    code: localStorage.getItem(FREETIME_CODE)
                }
            })
            break;
        case "getStart":
            sendResponse({ response: localStorage.getItem(FREETIME_START) })
            break;
        case "getEnd":
            sendResponse({ response: localStorage.getItem(FREETIME_END) })
            break;
        case "getActive":
            sendResponse({ response: localStorage.getItem(FREETIME_ACTIVE) })
            break;

        // freetime setters
        case "setStart":
            localStorage.setItem(FREETIME_START, message.payload)
            break;
        case "setEnd":
            localStorage.setItem(FREETIME_END, message.payload)
            break;
        case "setActive":
            localStorage.setItem(FREETIME_ACTIVE, message.payload)
            break;

        // whitelist setter/getter
        case "getWhitelist":
            sendResponse({ response: localStorage.getItem(FREETIME_WHITELIST) })
            break;
        case "addWhitelist":
            localStorage.setItem(FREETIME_WHITELIST, localStorage.getItem(FREETIME_WHITELIST) + ',' + message.payload)
            break;
        case "removeWhitelist":
            localStorage.setItem(FREETIME_WHITELIST, localStorage.getItem(FREETIME_WHITELIST).split(',').filter(m => m != message.payload).join(','))
            break;
        case "isWhitelist":
            sendResponse({ response: localStorage.getItem(FREETIME_WHITELIST).split(',').filter(w => message.payload.includes(w)).length > 0 ? 'true' : 'false' })
            break;

        // freetime duration
        case "getDuration":
            sendResponse({ response: localStorage.getItem(FREETIME_DURATION) })
            break;
        case "setDuration":
            localStorage.setItem(FREETIME_DURATION, message.payload)
            break;

        // freetime cooldown
        case "getCooldown":
            sendResponse({ response: localStorage.getItem(FREETIME_COOLDOWN) })
            break;
        case "setCooldown":
            localStorage.setItem(FREETIME_COOLDOWN, message.payload)
            break;

        // freetime code
        case "getCode":
            sendResponse({ response: localStorage.getItem(FREETIME_CODE) })
            break;
        case "setCode":
            localStorage.setItem(FREETIME_CODE, message.payload)
            break;
    }
    if (message.close) chrome.tabs.remove(sender.tab.id);
});
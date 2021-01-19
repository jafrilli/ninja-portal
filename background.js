// when the extension gets installed on a user's browser 
const FREETIME_START = 'np_cn_freetime_start';
const FREETIME_END = 'np_cn_freetime_end';
const FREETIME_ACTIVE = 'np_cn_freetime_active';

const FREETIME_DURATION = 'np_cn_freetime_duration';
const FREETIME_WHITELIST = 'np_cn_freetime_whitelist';
const FREETIME_COOLDOWN = 'np_cn_freetime_cooldown';
const FREETIME_CODE = 'np_cn_freetime_code';

const FREETIME_ACTIVITIES = 'np_cn_freetime_activities';

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
    localStorage.setItem(FREETIME_CODE, 1290)
    localStorage.setItem(FREETIME_ACTIVITIES, JSON.stringify([
        {
            "name": "Roblox",
            "image": "https://i.pinimg.com/564x/78/ea/38/78ea3884fc8d28d59e4ef395c7de4a52.jpg",
            "link": "https://roblox.com"
        },

        {
            "name": "Cool Math Games",
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3JmuJbBVOb89F3ClyRRFJYAELqt9jm7eFqA&usqp=CAU",
            "link": "https://coolmathgames.com"
        },

        {
            "name": "Krunker.io",
            "image": "https://mir-s3-cdn-cf.behance.net/projects/404/f5ef4785723537.Y3JvcCwxNjE2LDEyNjQsMCww.png",
            "link": "https://krunker.io"
        },

        {
            "name": "Paper.io",
            "image": "https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,g=0.5x0.5,f=auto/d2708e8aa31df3fe7b211bca36405d6d.png",
            "link": "https://paper-io.com"
        }
    ]))
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
            const res = {}
            res[FREETIME_START] = localStorage.getItem(FREETIME_START)
            res[FREETIME_END] = localStorage.getItem(FREETIME_END)
            res[FREETIME_ACTIVE] = localStorage.getItem(FREETIME_ACTIVE)
            res[FREETIME_DURATION] = localStorage.getItem(FREETIME_DURATION)
            res[FREETIME_WHITELIST] = localStorage.getItem(FREETIME_WHITELIST)
            res[FREETIME_COOLDOWN] = localStorage.getItem(FREETIME_COOLDOWN)
            res[FREETIME_CODE] = localStorage.getItem(FREETIME_CODE)
            res[FREETIME_ACTIVITIES] = JSON.parse(localStorage.getItem(FREETIME_ACTIVITIES))
            sendResponse({ response: res })
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

        // activity setter/getter
        case "getActivities":
            sendResponse({ response: JSON.parse(localStorage.getItem(FREETIME_ACTIVITIES)) })
            break;
        case "addActivity":
            let obj = JSON.parse(localStorage.getItem(FREETIME_ACTIVITIES))
            obj.push(message.payload)
            localStorage.setItem(FREETIME_ACTIVITIES, JSON.stringify(obj))
            break;
        case "removeActivity":
            let o = JSON.parse(localStorage.getItem(FREETIME_ACTIVITIES))
            o = o.filter(a => a.name != message.payload)
            localStorage.setItem(FREETIME_ACTIVITIES, JSON.stringify(o))
            break;
    }
    if (message.close) chrome.tabs.remove(sender.tab.id);
});
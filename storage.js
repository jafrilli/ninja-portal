const FREETIME_START = 'kp_cn_freetime_start';
const FREETIME_DURATION = 'kp_cn_freetime_duration';
const FREETIME_END = 'kp_cn_freetime_end';
const FREETIME_ACTIVE = 'kp_cn_freetime_active';

class FStorageManager {
    constructor() {
        this.cache = {}
    }

    async init(cb) {
        // fetch the gogole storage, and replace cache with it
        // await chrome.storage.local.get([FREETIME_ACTIVE, FREETIME_START, FREETIME_DURATION, FREETIME_END], r => {
        //     this.cache = r
        //     cb(this)
        // })
        chrome.runtime.sendMessage({ action: "getAll" }, ({ response }) => {
            this.cache = response;
            cb(this)
        })
    }

    getCache() {
        return this.cache
    }

    getStart() { return this.cache[FREETIME_START] }
    setStart(v) {
        this.cache[FREETIME_START] = v;
        chrome.runtime.sendMessage({ action: "setStart", payload: v })
    }

    getEnd() { return this.cache[FREETIME_END] }
    setEnd(v) {
        this.cache[FREETIME_END] = v;
        chrome.runtime.sendMessage({ action: "setEnd", payload: v })
    }

    getDuration() { return this.cache[FREETIME_DURATION] }
    setDuration(v) {
        this.cache[FREETIME_DURATION] = v;
        chrome.runtime.sendMessage({ action: "setDuration", payload: v })
    }

    getActive() { return this.cache[FREETIME_ACTIVE] }
    setActive(v) {
        this.cache[FREETIME_ACTIVE] = v;
        chrome.runtime.sendMessage({ action: "setActive", payload: v })
    }
}
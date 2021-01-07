const FREETIME_START = 'kp_cn_freetime_start';
const FREETIME_DURATION = 'kp_cn_freetime_duration';
const FREETIME_END = 'kp_cn_freetime_end';
const FREETIME_ACTIVE = 'kp_cn_freetime_active';

export class FStorageManager {
    constructor() {
        this.cache = {}
    }

    async init() {
        // fetch the gogole storage, and replace cache with it
        await chrome.storage.local.get([FREETIME_ACTIVE, FREETIME_START, FREETIME_DURATION, FREETIME_END], r => {
            this.cache = r
        })
        console.log('init complete')
    }

    getCache() {
        return this.cache
    }

    getStart() { return this.cache[FREETIME_START] }
    async setStart(v) {
        this.cache[FREETIME_START] = v;
        await chrome.storage.local.set(this.cache);
    }

    getEnd() { return this.cache[FREETIME_END] }
    async setEnd(v) {
        this.cache[FREETIME_END] = v;
        await chrome.storage.local.set(this.cache);
    }

    getDuration() { return this.cache[FREETIME_DURATION] }
    async setDuration(v) {
        this.cache[FREETIME_DURATION] = v;
        await chrome.storage.local.set(this.cache);
    }

    getActive() { return this.cache[FREETIME_ACTIVE] }
    async setActive(v) {
        this.cache[FREETIME_ACTIVE] = v;
        await chrome.storage.local.set(this.cache);
    }
}
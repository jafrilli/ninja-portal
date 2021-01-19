const FREETIME_START = 'np_cn_freetime_start';
const FREETIME_END = 'np_cn_freetime_end';
const FREETIME_ACTIVE = 'np_cn_freetime_active';

const FREETIME_DURATION = 'np_cn_freetime_duration';
const FREETIME_WHITELIST = 'np_cn_freetime_whitelist';
const FREETIME_COOLDOWN = 'np_cn_freetime_cooldown';
const FREETIME_CODE = 'np_cn_freetime_code';

const FREETIME_ACTIVITIES = 'np_cn_freetime_activities';


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

    getActive() { return this.cache[FREETIME_ACTIVE] }
    setActive(v) {
        this.cache[FREETIME_ACTIVE] = v;
        chrome.runtime.sendMessage({ action: "setActive", payload: v })
    }

    getDuration() { return this.cache[FREETIME_DURATION] }
    setDuration(v) {
        this.cache[FREETIME_DURATION] = v;
        chrome.runtime.sendMessage({ action: "setDuration", payload: v })
    }

    getCooldown() { return this.cache[FREETIME_COOLDOWN] }
    setCooldown(v) {
        this.cache[FREETIME_COOLDOWN] = v;
        chrome.runtime.sendMessage({ action: "setCooldown", payload: v })
    }

    getWhitelist() { return this.cache[FREETIME_WHITELIST] }
    addToWhitelist(v) {
        this.cache[FREETIME_WHITELIST] = this.cache[FREETIME_WHITELIST].length > 1 ? this.cache[FREETIME_WHITELIST] + ',' + v : v;
        chrome.runtime.sendMessage({ action: "addWhitelist", payload: v })
    }
    removeFromWhitelist(v) {
        this.cache[FREETIME_WHITELIST] = this.cache[FREETIME_WHITELIST].split(',').filter(m => m != v).join(',')
        if (this.cache[FREETIME_WHITELIST].length == 0) this.cache[FREETIME_WHITELIST] = '';
        chrome.runtime.sendMessage({ action: "removeWhitelist", payload: v })
    }

    getCode() { return this.cache[FREETIME_CODE] }
    setCode(v) {
        this.cache[FREETIME_CODE] = v;
        chrome.runtime.sendMessage({ action: "setCode", payload: v })
    }

    getActivities() { return this.cache[FREETIME_ACTIVITIES] }
    addToActivities(obj) {
        let activities = this.cache[FREETIME_ACTIVITIES]
        activities.push(obj)
        this.cache[FREETIME_ACTIVITIES] = activities
        chrome.runtime.sendMessage({ action: "addActivity", payload: obj })
    }
    removeFromActivities(name) {
        let activities = this.cache[FREETIME_ACTIVITIES]
        this.cache[FREETIME_ACTIVITIES] = activities.filter(a => a.name != name);
        chrome.runtime.sendMessage({ action: "removeActivity", payload: name })
    }
}
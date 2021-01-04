const FREETIME_START = 'kp_cn_freetime_start';
const FREETIME_DURATION = 'kp_cn_freetime_duration';
const FREETIME_ACTIVE = 'kp_cn_freetime_active';

class FreetimeManager {
    // initialize a new freetime session
    /**
     * Start's a new freetime session
     * @param {number} minutes how many minutes this freetime session will last
     * @param {function} cb callback to run after session ends
     */
    start(minutes, cb) {
        localStorage.setItem(FREETIME_START, new Date().getTime().toString());
        localStorage.setItem(FREETIME_DURATION, minutes.toString())
        localStorage.setItem(FREETIME_ACTIVE, 'true')

        setTimeout(() => {
            localStorage.setItem(FREETIME_ACTIVE, 'false')
            if (cb) cb()
        }, minutes * 1000 * 60)
    }

    /**
     * Compares last start time to now to see if <minutes> have passed
     * @param {number} minutes how many minutes have passed
     */
    compare(minutes) {
        const lastStart = localStorage.getItem(FREETIME_START);
        if (!lastStart) return true
        const start = new Date(lastStart);
        const now = new Date();
        return (now - start) > (minutes * 60 * 1000)
    }
}

module.exports = FreetimeManager;
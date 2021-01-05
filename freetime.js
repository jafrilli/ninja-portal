const FREETIME_START = 'kp_cn_freetime_start';
const FREETIME_DURATION = 'kp_cn_freetime_duration';
const FREETIME_END = 'kp_cn_freetime_end';
const FREETIME_ACTIVE = 'kp_cn_freetime_active';

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

class FreetimeManager {
    // initialize a new freetime session

    getStart() {
        const lastStart = localStorage.getItem(FREETIME_START);
        if (!lastStart) return;
        return new Date(parseInt(lastStart));
    }

    getEnd() {
        const lastStart = localStorage.getItem(FREETIME_END);
        if (!lastStart) return;
        return new Date(parseInt(lastStart));
    }

    handleRefresh() {
        // check to see if someone is still on freetime
        if (!this.isFreetime()) return;

        const timeLeft = this.getEnd() - new Date()
        // if timeleft is less than zero then end now
        if (timeLeft <= 0) return this.end();
        // create a new timeout using the time remaining
        setTimeout(this.end, timeLeft)
    }

    /**
     * Start's a new freetime session
     * @param {number} minutes how many minutes this freetime session will last
     * @param {function} cb callback to run after session ends
     */
    start(minutes) {
        localStorage.setItem(FREETIME_START, new Date().getTime().toString());
        localStorage.setItem(FREETIME_DURATION, minutes.toString())
        localStorage.setItem(FREETIME_END, addMinutes(new Date(), minutes).getTime().toString())
        localStorage.setItem(FREETIME_ACTIVE, 'true')

        setTimeout(this.end, minutes * 1000 * 60)

        console.log('Started freetime session!')
    }

    isFreetime() {
        return localStorage.getItem(FREETIME_ACTIVE) == 'true'
    }

    /**
     * Compares last start time to now to see if <minutes> have passed
     * @param {number} minutes how many minutes have passed
     */
    beenLongerThan(minutes) {
        const start = this.getStart() ?? 0;
        const now = new Date();
        return (now - start) > (minutes * 60 * 1000)
    }

    /**
     * Time remaining until the next freetime session
     * @param {number} minutes how many minutes does each break have
     * @param {boolean} date should return a date object
     */
    timeLeft(minutes, date) {
        const start = this.getStart() ?? 0;
        const now = new Date();
        if (date) return new Date((minutes * 60 * 1000) - (now - start));
        return ((minutes * 60 * 1000) - (now - start)) / (60 * 1000);
    }

    end() {
        localStorage.setItem(FREETIME_ACTIVE, 'false')
        alert("Session is over")
    }
}
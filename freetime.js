function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

class FreetimeManager {

    /**
     * 
     * @param {FStorageManager} sm the storage manager
     */
    constructor(sm) {
        this.sm = sm;
    }

    // initialize a new freetime session
    getEnd() {
        const end = sm.getEnd()
        if (end) return new Date(parseInt(end))
        return null
    }

    getStart() {
        const start = sm.getStart()
        if (start) return new Date(parseInt(start))
        return null
    }

    isFreetime() { return sm.getActive() == 'true' }

    init() {
        // if its not freetime then just return
        if (!this.isFreetime()) return;

        // if they are on freetime, get the time remaining, and update the timeout
        const timeLeft = this.getEnd() - new Date()

        console.log(timeLeft);

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
    async start(minutes) {
        await sm.setStart(new Date().getTime().toString())
        await sm.setDuration(minutes.toString())
        await sm.setEnd(addMinutes(new Date(), minutes).getTime().toString())
        await sm.setActive('true')
        // localStorage.setItem(FREETIME_START, new Date().getTime().toString());
        // localStorage.setItem(FREETIME_DURATION, minutes.toString())
        // localStorage.setItem(FREETIME_END, addMinutes(new Date(), minutes).getTime().toString())
        // localStorage.setItem(FREETIME_ACTIVE, 'true')

        setTimeout(this.end, minutes * 1000 * 60)

        console.log('Started freetime session!')
    }

    /**
     * Compares last start time to now to see if <minutes> have passed
     * @param {number} minutes how many minutes have passed
     */
    beenLongerThan(minutes) {
        const start = this.getStart ?? 0;
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
        //localStorage.setItem(FREETIME_ACTIVE, 'false')
        console.log('ended')
        sm.setActive('false').then(() => {
            alert("Session is over")
        })
    }
}
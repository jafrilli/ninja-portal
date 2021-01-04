const FREETIME_START = 'kp_cn_freetime_start';
const FREETIME_DURATION = 'kp_cn_freetime_duration';
const FREETIME_END = 'kp_cn_freetime_end';
const FREETIME_ACTIVE = 'kp_cn_freetime_active';

const freetimeDuration = 1;
const freetimeCooldown = 10;

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
     */
    timeLeft(minutes) {
        const start = this.getStart() ?? 0;
        const now = new Date();
        return ((minutes * 60 * 1000) - (now - start)) / (60 * 1000);
    }

    end() {
        localStorage.setItem(FREETIME_ACTIVE, 'false')
        alert("Session is over")
    }
}

const activities = [
    {
        name: 'Roblox',
        image: 'https://i.pinimg.com/564x/78/ea/38/78ea3884fc8d28d59e4ef395c7de4a52.jpg',
        link: 'https://roblox.com'
    },

    {
        name: 'Cool Math Games',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3JmuJbBVOb89F3ClyRRFJYAELqt9jm7eFqA&usqp=CAU',
        link: 'https://coolmathgames.com'
    },
]
const nameToInfo = {}

const activityContainer = document.getElementsByClassName("activity-container")[0];
console.log('rin')
let html = ''
activities.forEach(a => {
    nameToInfo[a.name] = a;
    html += `<div id="${a.name}" class="activity flex flex-col items-center">
        <img src="${a.image}" class="transition duration-200 ease-in-out w-40 h-40 transform hover:scale-105 rounded-lg">
        <div class="pt-2 text-lg">${a.name}</div>
    </div>`
})

activityContainer.innerHTML = html;

const activityTiles = document.getElementsByClassName("activity");
const fm = new FreetimeManager()

fm.handleRefresh()

console.log(activityTiles)

for (const t of activityTiles) {
    t.addEventListener('click', () => {
        // if its been longer than an hour since last session & they are 
        // not in a session, then they can have another session
        if (fm.beenLongerThan(freetimeCooldown) && !fm.isFreetime()) {
            fm.start(freetimeDuration)
        }
        // if link is there and valid open link
        if (fm.isFreetime()) {
            if (nameToInfo[t.id] && nameToInfo[t.id].link) window.open(nameToInfo[t.id].link);
        } else {
            // send alert
            alert("You're currently not on freetime. You have to wait " + fm.timeLeft(freetimeCooldown).toFixed(0) + " minutes for your next freetime session!");
        }
    })
}
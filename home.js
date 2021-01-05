const freetimeDuration = 1;
const freetimeCooldown = 1;
const fm = new FreetimeManager()
const nameToInfo = {}

// runs once on start
function setup() {
    fm.handleRefresh();
    addActivityTiles();
    addActivityTileListeners(fm);
}

// runs every second
function loop() {
    updateStatus()
}

function updateStatus() {
    // get dom elements
    const active = document.getElementById("status-active");
    const remaining = document.getElementById("status-remaining");
    const cooldown = document.getElementById("status-cooldown");

    const activeColor = "text-green-400"
    const yellowColor = "text-yellow-400"
    const inactiveColor = "text-red-400"

    const isFreetime = fm.isFreetime();

    active.className = ''
    remaining.className = ''
    cooldown.className = ''

    // update active
    if (isFreetime) {
        active.innerHTML = 'ACTIVE'
        active.classList.add(activeColor)
    } else {
        active.innerHTML = 'INACTIVE'
        active.classList.add(inactiveColor)
    }


    // update remaining
    if (isFreetime) {
        const now = new Date();
        const end = fm.getEnd()
        const left = ((end - now) / (60 * 1000)).toFixed(1);
        const leftT = new Date(end - now);

        remaining.innerHTML = leftT.getMinutes() + ":" + leftT.getSeconds();

        if (left < 2) remaining.classList.add(inactiveColor)
        else if (left < 5) remaining.classList.add(yellowColor)
        else remaining.classList.add(activeColor)
    } else {
        remaining.classList.add(inactiveColor)
        remaining.innerHTML = "NONE";
    }

    // update cooldown
    const left = fm.timeLeft(freetimeCooldown);
    const leftT = fm.timeLeft(freetimeCooldown, true);
    if (left && left >= 0) {
        cooldown.innerHTML = leftT.getMinutes() + ":" + leftT.getSeconds();
    } else {
        cooldown.innerHTML = "NOW!";
    }

    if (left < 2) cooldown.classList.add(activeColor)
    else if (left < 5) cooldown.classList.add(yellowColor)
    else cooldown.classList.add(inactiveColor)
}


function addActivityTiles() {
    const activityContainer = document.getElementsByClassName("activity-container")[0];

    let html = ''
    activities.forEach(a => {
        nameToInfo[a.name] = a;
        html += `<div id="${a.name}" class="activity flex flex-col items-center">
            <img src="${a.image}" class="transition duration-200 ease-in-out w-40 h-40 transform hover:scale-105 rounded-lg">
            <div class="pt-2 text-lg">${a.name}</div>
        </div>`
    })

    activityContainer.innerHTML = html;
}

function addActivityTileListeners(fm) {
    const activityTiles = document.getElementsByClassName("activity");

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
}

// run
setup()
setInterval(loop, 1000)
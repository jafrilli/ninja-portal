const sm = new FStorageManager()
const nameToInfo = {}

// runs once on start
async function setup(then) {
    // initialize the storage manager
    sm.init(async (sm) => {
        // authenticate
        const res = prompt('You must be a sensei in order to access settings. Enter the sensei code:')
        if (res && res.toString() != sm.getCode()) {
            chrome.runtime.sendMessage({ action: "close" })
            return;
        }
        // stuff
        setupFields(sm)
        setupList(sm)
        setupActivityTiles(sm)
        // after init cb
        then()
    })
}

function setupFields(sm) {
    const durationField = document.getElementById('npduration')
    const cooldownField = document.getElementById('npcooldown')
    const codeField = document.getElementById('npcode')

    const whitelistField = document.getElementById('npwhitelist')
    const whitelistAdd = document.getElementById('npwhitelistadd')

    const activityNameField = document.getElementById('npactivityname')
    const activityLinkField = document.getElementById('npactivitylink')
    const activityImageLinkField = document.getElementById('npactivityimagelink')
    const activityAdd = document.getElementById('npactivityadd')

    durationField.value = sm.getDuration()
    cooldownField.value = sm.getCooldown()
    codeField.value = sm.getCode()

    durationField.addEventListener('change', (event) => {
        // if(event.target.value)
        if (parseFloat(event.target.value) > 0) sm.setDuration(event.target.value)
        else durationField.value = 1
    })
    cooldownField.addEventListener('change', (event) => {
        if (parseFloat(event.target.value) > 0) sm.setCooldown(event.target.value)
        else cooldownField.value = 1
    })
    codeField.addEventListener('change', (event) => {
        sm.setCode(event.target.value.toString())
    })

    whitelistAdd.addEventListener('click', () => {
        if (whitelistField.value.length > 3) {
            sm.addToWhitelist(whitelistField.value)
            setupList(sm)
            whitelistField.value = ''
        }
    })

    activityAdd.addEventListener('click', () => {
        if (activityNameField.value.length > 0 && activityLinkField.value.length > 0 && activityImageLinkField.value.length > 0) {
            sm.addToActivities({
                name: activityNameField.value,
                link: activityLinkField.value,
                image: activityImageLinkField.value,
            })
            setupActivityTiles(sm)
            activityNameField.value = ''
            activityLinkField.value = ''
            activityImageLinkField.value = ''
        }
    })
}

function setupList(sm) {
    const listDiv = document.getElementById('hostlist')

    listDiv.innerHTML = ''

    if (sm.getWhitelist().length == 0) return;
    sm.getWhitelist().split(',').forEach(e => {
        listDiv.innerHTML += `<div class="flex flex-row items-center ml-5">
            <img id="${e.split(' ').join('')}" src="https://cdn0.iconfinder.com/data/icons/shift-free/32/Incorrect_Symbol-512.png" class="hostname header-logo w-5 h-5"></img>
            <p class="ml-5 text-sm">${e}</p>
        </div>`
    })

    setupListListeners(sm)
}

function setupListListeners(sm) {
    const hostnames = document.getElementsByClassName('hostname')

    for (const name of hostnames) {
        let id = name.id.split(' ').join('');
        let el = document.getElementById(id)
        if (el) el.addEventListener('click', () => {
            sm.getWhitelist().split(',').forEach(h => {
                if (h.split(' ').join('') == id) {
                    sm.removeFromWhitelist(h);
                    setupList(sm);
                }
            })
        })
    }
}

let nti = {}

function setupActivityTiles(sm) {
    const activityContainer = document.getElementById("activity-list");

    const activities = sm.getActivities()

    activityContainer.innerHTML = ''
    nti = {};

    for (const a of activities) {
        nti[a.name] = a;
        activityContainer.innerHTML += `<div id="${a.name}" class="flex flex-col items-center">
            <img src="${a.image}" class="activity transition duration-200 ease-in-out w-40 h-40 object-cover transform hover:scale-105 rounded-lg">
            <div class="flex flex-row items-center mt-2">
                <img id="${a.name + 'REMOVEICON'}" src="https://cdn0.iconfinder.com/data/icons/shift-free/32/Incorrect_Symbol-512.png" class="activityremove header-logo w-5 h-5"></img>
                <div class="ml-2 text-lg">${a.name}</div>
            </div>
        </div>`
    }
    setupActivityTileListeners(sm)
}

function setupActivityTileListeners(sm) {
    const activityTiles = document.getElementsByClassName("activity");
    const activityRemIcons = document.getElementsByClassName("activityremove");

    for (const t of activityTiles) {
        t.addEventListener('click', async () => {
            if (nti[t.id] && nti[t.id].link) window.open(nti[t.id].link);
        })
    }

    for (const icon of activityRemIcons) {
        icon.addEventListener('click', async () => {
            console.log(icon.id.replace('REMOVEICON', ''))
            sm.removeFromActivities(icon.id.replace('REMOVEICON', ''))
            setupActivityTiles(sm)
        })
    }
}


// runs every second
async function loop() {

}

// run
setup(() => {
    // when setup is complete
    loop()
    setInterval(loop, 1000)
})
const sm = new FStorageManager()
const fm = new FreetimeManager(sm)
const nameToInfo = {}

// runs once on start
async function setup(then) {
    // initialize the storage manager
    sm.init(async (sm) => {
        // initialize the freetime manager (handle refresh)
        await fm.init();
        // stuff
        setupFields(sm)
        setupList(sm)
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
        if (parseFloat(event.target.value) > 0) sm.setCode(event.target.value)
        else codeField.value = 1
    })

    whitelistAdd.addEventListener('click', () => {
        if (whitelistField.value.length > 3) {
            sm.addToWhitelist(whitelistField.value)
            setupList(sm)
            whitelistField.value = ''
        }
    })
}

function setupList(sm) {
    const listDiv = document.getElementById('hostlist')

    listDiv.innerHTML = ''

    console.log(sm.getWhitelist())
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

// runs every second
async function loop() {

}

// run
setup(() => {
    // when setup is complete
    loop()
    setInterval(loop, 1000)
})
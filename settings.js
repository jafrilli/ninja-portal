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

        // after init cb
        then()
    })
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
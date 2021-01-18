const home = document.getElementById('home')
const settings = document.getElementById('settings')

home.addEventListener('click', () => {
    chrome.tabs.create({
        url: 'home.html',
        active: true
    }, null)
})

settings.addEventListener('click', () => {
    chrome.tabs.create({
        url: 'settings.html',
        active: true
    }, null)
})
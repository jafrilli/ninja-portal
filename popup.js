const btn = document.getElementById('home')

btn.addEventListener('click', () => {
    chrome.tabs.create({
        url: 'home.html',
        active: true
    }, null)
})
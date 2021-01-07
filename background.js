// when the extension gets installed on a user's browser 
chrome.runtime.onInstalled.addListener(() => {
    console.log('something')
})

// when a page gets loaded
chrome.tabs.onCreated.addListener((tab) => {
    // alert('hola')
})
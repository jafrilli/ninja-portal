// check to see if on freetime or not
// alert(window.location.host)
// window.close()
// chrome.runtime.sendMessage({ "action": "close" });

// check to see if on freetime or not
// let active = prompt('what is active')
// chrome.runtime.sendMessage({ action: "setActive", payload: active })
// chrome.runtime.sendMessage({ action: "getActive" }, ({ response }) => {
//     alert(response)
// })

// check if freetime
chrome.runtime.sendMessage({ action: "getActive" }, ({ response }) => {
    if (response != 'true') {
        // check if in whitelist
        chrome.runtime.sendMessage({ action: "isWhitelist", payload: window.location.hostname }, ({ response }) => {
            // if it is not whitelisted
            // isWhitelist returns a boolean
            if (response != 'true') {
                // request for the code
                chrome.runtime.sendMessage({ action: "getCode" }, ({ response }) => {
                    const res = prompt("You cannot access this website (" + window.location.hostname + ") right now! If you would like access, ask a sensei to enter a valid code:")
                    // if no code or code invalid, close tab
                    if (!res || res != response) {
                        chrome.runtime.sendMessage({ action: "close" })
                    }
                })
            }
        })
    }
})

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("form").addEventListener("submit", onSubmit);

    function onSubmit() {
        var num = document.getElementById('num').value;
        var den = document.getElementById('den').value;
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, [num,den])
        })
    }
})



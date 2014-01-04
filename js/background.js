// extension initial defaults
var config = {
  hideVideos: true,
  maxHeight: 1500
};

var openPorts = 0;

var setBadge = function(hiddenList) {
  chrome.browserAction.setBadgeText({"text": _.size(hiddenList).toString()});
};

var incommingHidden = function(msg) {
  var hiddenList = JSON.parse(localStorage.getItem("hiddenList"));
  // console.log(msg);
  hiddenList[msg.url] = msg;
  localStorage.setItem("hiddenList", JSON.stringify(hiddenList));
  setBadge(hiddenList);
};

// TODO: not really using config for now, maybe implement later
if (!localStorage.isInitialized) {
  localStorage.setItem("config", JSON.stringify(config));
  localStorage.setItem("hiddenList", JSON.stringify({}));
  localStorage.isInitialized = true;
} else {
  config = localStorage.getItem("config");
}

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name == "9gag-hider") {
    var configMsg = {
      type: "config",
      config: config
    }
    port.onDisconnect.addListener(function() {
      openPorts--;
      if (openPorts == 0) {
        localStorage.setItem("hiddenList", JSON.stringify({}));
        setBadge({});
      }
    });
    openPorts++;
    port.postMessage(configMsg);
    port.onMessage.addListener(incommingHidden);
  }
});

// console.log(localStorage);
setBadge(JSON.parse(localStorage.getItem("hiddenList")));

// sane defaults - background will send user config as soon as port connects
var config = {
  hideVideos: true,
  maxHeight: 1500
};
var port = chrome.runtime.connect({name: "9gag-hider"});
var timeout = null;

// TODO: If options change, need to possibly reshow/hide new stuff.
var hider = function () {
  // hide videos
  if (config.hideVideos) {
    $("div.badge-video-container:visible").closest("article").each(function () {
      var title = $(this).find("h2.badge-item-title > a").text().trim();
      var url = $(this).attr("data-entry-url");
      // console.log('Hiding video post <a href="'+url+'">'+title+'</a>');
      port.postMessage({
        title: title,
        type: "video",
        url: url
      });
      $(this).remove();
    });
  }

  // hide long posts (> config.maxHeight)
  $("article.badge-entry-container:visible").each(function () {
    var height = $(this).height();
    var title = $(this).find("h2.badge-item-title > a").text().trim();
    var url = $(this).attr("data-entry-url");
    if (height > config.maxHeight) {
      // console.log('Hiding image post <a href="'+url+'">'+title+"</a> with height "+height+"px");
      port.postMessage({
        height: height,
        title: title,
        type: "image",
        url: url
      });
      $(this).remove();
    }
  });
}

$(document).bind("DOMSubtreeModified", function () {
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(hider, 500);
});

port.onMessage.addListener(function (msg) {
  if (msg.type == "config") {
    // console.log("Received new config.");
    config = JSON.parse(msg.config);
  }
});

hider();

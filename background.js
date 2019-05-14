  chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });
  // This Listener listens to the Timetable Button click event
  chrome.runtime.onMessage.addListener( 
    function(request, sender)
    {
      if (request.action == "LaunchTimetableFile")
        chrome.tabs.create({ url: chrome.runtime.getURL("table.html") });
    } 
  );
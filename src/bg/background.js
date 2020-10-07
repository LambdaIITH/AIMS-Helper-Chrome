chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {},
      }),
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()],
    }]);
  });
});
// This Listener listens to the Timetable Button click event
chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.action == 'LaunchTimetableFile') { chrome.tabs.create({ url: chrome.runtime.getURL('/src/timetable/table.html') }); }
});

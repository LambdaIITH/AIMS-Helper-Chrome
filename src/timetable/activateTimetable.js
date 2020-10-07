function activate() {
  const timeTabIcons = document.getElementsByClassName('time_tab_icon');
  timeTabIcons.forEach((icon) => icon.click());
  return true;
}

chrome.runtime.sendMessage({
  action: 'activateTimetable',
  status: activate(),
});

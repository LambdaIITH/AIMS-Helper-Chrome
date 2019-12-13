function activate() {
	var timeTabIcons = document.getElementsByClassName("time_tab_icon");
	for (var i = 0 ; i < timeTabIcons.length ; i++)
	{
		timeTabIcons[i].click();
	}
	return true ;
}

chrome.runtime.sendMessage({
    action: "activateTimetable",
    status: activate()
});
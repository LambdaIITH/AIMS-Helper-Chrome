function activate() {

	if (!(document.location.href === "https://aims.iith.ac.in/aims/courseReg/studentRegForm/44")) {
		return false
	}

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
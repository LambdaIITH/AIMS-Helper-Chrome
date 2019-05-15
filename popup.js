
var whichButton = 0 ; // 0 : no button has been clicked
chrome.runtime.onMessage.addListener((request, sender) => {
	if (request.action == "activateTimetable" && request.status == true)
	{
		onWindowLoad();
	}
});
chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    if (whichButton == 1)
    {
    	localStorage.setItem("DOM", request.source);
    	chrome.runtime.sendMessage({
    		action: "LaunchTimetableFile",
    		source: "hello"
    	}, function(data) {
    		console.log(chrome.runtime.lastError.message);
    	} );
    }
    else if (whichButton == 2) // Code for CGPA
    {

    }
    else
    {
    	console.log("You shouldn't be here. "); // Um, just like that. 
    }
  }
});

function onWindowLoad() {
	chrome.tabs.executeScript(null, {
    file: "getSource.js"
  }, function() {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message);
    }
  });
}

function injectTimetable() {
	document.getElementById("loading-image").style.display = "block";
	chrome.tabs.executeScript(null, {
		file: "activateTimetable.js"
	}, function() {
		if (chrome.runtime.lastError)	console.log(chrome.runtime.lastError.message);
	});
}

document.getElementsByClassName("generate-timetable-button")[0].onclick = function() {
	whichButton = 1 ; // timetable button click event
	injectTimetable();
};
document.getElementsByClassName("calculate-gpa-button")[0].onclick = function() {
	whichButton = 2 ; // GPA Button click event
	injectTimetable();
};
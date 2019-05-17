
var whichButton = 0 ; // 0 : no button has been clicked
chrome.runtime.onMessage.addListener((request, sender) => {
	if (request.action == "activateGetSource" && request.status == true)
	{
		onWindowLoad();
	}
});
chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
  	localStorage.setItem("DOM", request.source);
  	var message;
    if (whichButton == 1)
    {
    	message = {
    		action: "LaunchTimetableFile",
    		source: "hello"
    	};
    }
    else if (whichButton == 2) // Code for CGPA
    {
    	message = {
    		action: "LaunchGPAFile",
    		source: "bye"
    	};
    }
    else
    {
    	console.log("You shouldn't be here. "); // Um, just like that. 
    }
    chrome.runtime.sendMessage(message,
    	 function(data) {
    		console.log(chrome.runtime.lastError.message);
    	} );
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

function displayLoading() {
	document.getElementById("loading-image").style.display = "block";
	document.getElementsByClassName("button-container")[0].style.display="none";
}

function injectTimetable() {
	displayLoading();
	chrome.tabs.executeScript(null, {
		file: "activateTimetable.js"
	}, function() {
		if (chrome.runtime.lastError)	console.log(chrome.runtime.lastError.message);
	});
}

function injectGPA() {
	displayLoading();
	chrome.runtime.sendMessage({
		action: "activateGetSource",
		status: true
	});
}

document.getElementsByClassName("generate-timetable-button")[0].onclick = function() {
	whichButton = 1 ; // timetable button click event
	injectTimetable();
};
document.getElementsByClassName("calculate-gpa-button")[0].onclick = function() {
	whichButton = 2 ; // GPA Button click event
	injectGPA();
};
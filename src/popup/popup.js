
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
    else
    {
    	console.log("You shouldn't be here. "); // Um, just like that. 
    }
  }
});

function onWindowLoad() {
	chrome.tabs.executeScript(null, {
    file: "/src/timetable/getSource.js"
  }, function() {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message);
    }
  });
}

function showLoading() {
    document.getElementById("loading-image").style.display = "block";
    document.getElementsByClassName("button-container")[0].style.display="none";
}

function removeLoading() {
    document.getElementById("loading-image").style.display = "none";
    document.getElementsByClassName("button-container")[0].style.display = "block";
}

function injectTimetable() {
    showLoading();
	chrome.tabs.executeScript(null, {
		file: "/src/timetable/activateTimetable.js"
	}, function() {
		if (chrome.runtime.lastError)	console.log(chrome.runtime.lastError.message);
	});
}

function injectGPA() {
    showLoading();
    chrome.tabs.executeScript(null, {
        file: "/js/jquery-3.4.1.min.js"
    }, function(result){
        chrome.tabs.executeScript(null, {
            file: "/src/gpa/activateGPA.js"
        }, function() {
            if(chrome.runtime.lastError) console.log(chrome.runtime.lastError.message);
        });
    });
}
chrome.runtime.onMessage.addListener(function(request, sender){
    if(request.action == "parsedGPA"){
        removeLoading();
        var gpa_value = request.data.gpa;
        document.getElementsByClassName("gpa-container")[0].style.display = "flex";
        document.getElementsByClassName("gpa-value")[0].innerText = gpa_value;
        //TODO: use the courses and GPA to display in another tab.

        localStorage.setItem("courseGPA", JSON.stringify(request.data));
        chrome.tabs.create({ url: chrome.runtime.getURL("/src/gpa/gpa_report.html")});
    }
});
document.getElementsByClassName("generate-timetable-button")[0].onclick = function() {
	whichButton = 1 ; // timetable button click event
	injectTimetable();
};
document.getElementsByClassName("calculate-gpa-button")[0].onclick = function() {
	whichButton = 2 ; // GPA Button click event
	injectGPA();
};

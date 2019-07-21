// Firebase AUTH

var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
var slots = ["09:00-09:55", "10:00-10:55", "11:00-11:55", "12:00-12:55", "13:00-14:30", "14:30-15:55", "16:00-17:25", "17:30-18:55", "19:00-20:30"] ;



var parser = new DOMParser();
var DOM = parser.parseFromString(localStorage.getItem("DOM"), "text/html");
var data_deg_dtl = DOM.getElementsByClassName("studentDegDtls")[0].getAttribute("data-deg-dtl");
var studentDegreeString = "stdntDeg_x_"+data_deg_dtl+"_1"; // Course Div String (x represents the serial number of the course)

var currentID = 1 ;

while (true)
{
	var courseCodeID = "cCd_"+currentID+"_"+data_deg_dtl+"_1";
	var timetableRowsClass = "timeTabTr_"+currentID+"_"+data_deg_dtl+"_1";
	var currentTimetableRows = DOM.getElementsByClassName(timetableRowsClass);
	var currentCourseCodeInput = DOM.getElementById(courseCodeID);
	if (currentCourseCodeInput == null)
		break ;
	if (currentCourseCodeInput.getAttribute("title") == null)
		currentCourseCodeInput.setAttribute("title", currentCourseCodeInput.previousSibling.data);
	for (var i = 0 ; i < currentTimetableRows.length ; i++)
	{
		var currentSegmentStart = currentTimetableRows[i].getElementsByClassName("ttd1")[0].textContent.split("-")[0] ;
		var currentSegmentEnd = currentTimetableRows[i].getElementsByClassName("ttd1")[0].textContent.split("-")[1] ;
		var day = currentTimetableRows[i].getElementsByClassName("ttd2")[0].getElementsByTagName("span")[1].textContent.split("-")[0] ;
		var time = currentTimetableRows[i].getElementsByClassName("ttd2")[0].getElementsByTagName("span")[1].textContent.split("-")[1]+"-"+currentTimetableRows[i].getElementsByClassName("ttd2")[0].getElementsByTagName("span")[1].textContent.split("-")[2] ;
		var start = (parseInt(currentSegmentStart, 10) + 1) / 2 ;
		var end = (parseInt(currentSegmentEnd, 10)) / 2 ;
		for (; start <= end ; start++)
		{
			var cellClass = (days.indexOf(day)+1).toString() + "-" + start.toString() + "-" + (slots.indexOf(time)+1).toString();
			if (true)
				document.getElementsByClassName(cellClass)[0].textContent = currentCourseCodeInput.getAttribute("title") ;
			else
				break ;
		}
	}
	currentID += 1 ;
}
document.addEventListener('DOMContentLoaded', function() {
	document.getElementsByClassName("download-pdf")[0].addEventListener('click', function() {
		var element = document.getElementById('timetable');
		html2pdf(element);
	});
	
});
document.getElementsByClassName("send-to-db")[0].addEventListener('click', function() {
	var config = {
		apiKey: 'AIzaSyADsA9d1jkV3ly_8fezijTV7LvSTMGD6EM',
		databaseURL: 'https://aims-helper-247320.firebaseio.com',
		storageBucket: 'aims-helper-247320.appspot.com'
	};
	firebase.initializeApp(config);
	chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
		var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
		firebase.auth().signInWithCredential(credential);
		console.log(token);
	});		
});



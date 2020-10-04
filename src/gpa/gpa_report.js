var data = JSON.parse(localStorage.getItem("courseGPA"));



document.getElementsByClassName("value name")[0].innerText = data.name;
document.getElementsByClassName("value cgpa")[0].innerText = data.gpa;
document.getElementsByClassName("value rollno")[0].innerText = data.rollno;
document.getElementsByClassName("value branch")[0].innerText = data.branch;
document.getElementsByClassName("value student-type")[0].innerText = data.studentType;


var summaryTable = document.getElementsByClassName("summary")[0];
var totalCredits = 0;
//right now the code in other file is such that the excluded courses are not reaching here.
var typeCreditsMap = new Map(JSON.parse(data.typeCreditsMap));
for(var [type, credits] of typeCreditsMap.entries()) {
    var row = document.createElement("tr");
    console.log(type, credits);
    totalCredits += credits;
    row.innerHTML = `<td>${type}</td><td class="credits">${credits}</td>`;
    summaryTable.appendChild(row);
}
var totalRow = document.createElement("tr");
totalRow.className = "total";
totalRow.innerHTML = `<td>Total</td><td class="credits">${totalCredits}</td>`;
summaryTable.appendChild(totalRow);
console.log(data);


var coursesTable = document.getElementsByClassName("courses")[0];
var coursesArray = JSON.parse(data.courses);
coursesArray.sort(function(a, b){
    if (a.code < b.code)
        return -1;
    if (a.code > b.code)
        return 1;
    else return 0;
});
for (var course of coursesArray) {
    var row = document.createElement("tr");
    row.innerHTML = `<td>${course.code}</td>
                     <td>${course.name}</td>
                     <td class="credits">${course.credits}</td>
                     <td class="credits">${course.grade}</td>`;
    coursesTable.appendChild(row);
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementsByClassName("download-pdf")[0].addEventListener('click', function() {
        var element = document.getElementsByClassName('report')[0];
        html2pdf(element);
    });
});

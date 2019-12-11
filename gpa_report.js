data = JSON.parse(localStorage.getItem("courseGPA"));



document.getElementsByClassName("value name")[0].innerText = data.name;
document.getElementsByClassName("value cgpa")[0].innerText = data.gpa;
document.getElementsByClassName("value rollno")[0].innerText = data.rollno;
document.getElementsByClassName("value branch")[0].innerText = data.branch;
document.getElementsByClassName("value student-type")[0].innerText = data.student_type;


var summary_table = document.getElementsByClassName("summary")[0];
var total_credits = 0;
//right now the code in other file is such that the excluded courses are not reaching here.
var type_credits_map = new Map(JSON.parse(data.type_credits_map));
for(var [type, credits] of type_credits_map.entries()) {
    var row = document.createElement("tr");
    console.log(type, credits);
    total_credits += credits;
    row.innerHTML = `<td>${type}</td><td class="credits">${credits}</td>`;
    summary_table.appendChild(row);
}
var total_row = document.createElement("tr");
total_row.className = "total";
total_row.innerHTML = `<td>Total</td><td class="credits">${total_credits}</td>`;
summary_table.appendChild(total_row);
console.log(data);
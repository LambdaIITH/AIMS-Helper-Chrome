const data = JSON.parse(localStorage.getItem('courseGPA'));

document.getElementsByClassName('value name')[0].innerText = data.name;
document.getElementsByClassName('value cgpa')[0].innerText = data.gpa;
document.getElementsByClassName('value rollno')[0].innerText = data.rollno;
document.getElementsByClassName('value branch')[0].innerText = data.branch;
document.getElementsByClassName('value student-type')[0].innerText = data.student_type;

const summary_table = document.getElementsByClassName('summary')[0];
let total_credits = 0;
// right now the code in other file is such that the excluded courses are not reaching here.
const type_credits_map = new Map(JSON.parse(data.type_credits_map));
for (const [type, credits] of type_credits_map.entries()) {
  var row = document.createElement('tr');
  console.log(type, credits);
  total_credits += credits;
  row.innerHTML = `<td>${type}</td><td class="credits">${credits}</td>`;
  summary_table.appendChild(row);
}
const total_row = document.createElement('tr');
total_row.className = 'total';
total_row.innerHTML = `<td>Total</td><td class="credits">${total_credits}</td>`;
summary_table.appendChild(total_row);
console.log(data);

const courses_table = document.getElementsByClassName('courses')[0];
const courses_array = JSON.parse(data.courses);
courses_array.sort((a, b) => {
  if (a.code < b.code) { return -1; }
  if (a.code > b.code) { return 1; }
  return 0;
});
for (const course of courses_array) {
  var row = document.createElement('tr');
  row.innerHTML = `<td>${course.code}</td>
                     <td>${course.name}</td>
                     <td class="credits">${course.credits}</td>
                     <td class="credits">${course.grade}</td>`;
  courses_table.appendChild(row);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementsByClassName('download-pdf')[0].addEventListener('click', () => {
    const element = document.getElementsByClassName('report')[0];
    html2pdf(element);
  });
});

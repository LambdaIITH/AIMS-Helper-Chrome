const data = JSON.parse(localStorage.getItem('courseGPA'));

document.getElementsByClassName('value name')[0].innerText = data.name;
document.getElementsByClassName('value cgpa')[0].innerText = data.gpa;
document.getElementsByClassName('value rollno')[0].innerText = data.rollno;
document.getElementsByClassName('value branch')[0].innerText = data.branch;
document.getElementsByClassName('value student-type')[0].innerText = data.studentType;

const summaryTable = document.getElementsByClassName('summary')[0];
let totalCredits = 0;

// right now the code in other file is such that the excluded courses are not reaching here.
const typeCreditsMap = new Map(JSON.parse(data.typeCreditsMap));
typeCreditsMap.forEach((credits, type) => {
  const row = document.createElement('tr');
  totalCredits += credits;
  row.innerHTML = `<td>${type}</td><td class="credits">${credits}</td>`;
  summaryTable.appendChild(row);
});
const totalRow = document.createElement('tr');
totalRow.className = 'total';
totalRow.innerHTML = `<td>Total</td><td class="credits">${totalCredits}</td>`;
summaryTable.appendChild(totalRow);

const coursesTable = document.getElementsByClassName('courses')[0];
const coursesArray = JSON.parse(data.courses);
coursesArray.sort((a, b) => {
  if (a.code < b.code) {
    return -1;
  }
  if (a.code > b.code) {
    return 1;
  }
  return 0;
});

coursesArray.forEach((course) => {
  const row = document.createElement('tr');
  row.innerHTML = `<td>${course.code}</td>
                     <td>${course.name}</td>
                     <td class="credits">${course.credits}</td>
                     <td class="credits">${course.grade}</td>`;
  coursesTable.appendChild(row);
});

document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementsByClassName('download-pdf')[0]
    .addEventListener('click', () => {
      const element = document.getElementsByClassName('report')[0];
      html2pdf(element);
    });
});

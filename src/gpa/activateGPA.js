/*
Source: https://github.com/IITH/aims-gpa-calculator
*/

const excludeList = [
  'Minor core',
  'Honors core',
  'Honours project',
  'Honours coursework',
  'FCC',
  'Additional',
];
const gradeValues = {
  'A+': 10,
  A: 10,
  'A-': 9,
  B: 8,
  'B-': 7,
  C: 6,
  'C-': 5,
  D: 4,
  FR: 0,
  FS: 0,
};
// console.log(studentId);
const appendCheckbox = (parent, isChecked) => {
  parent.append(
    `<input class="cgpa_cal_check" type="checkbox" ${
      isChecked ? 'checked' : ''
    } />`,
  );
};

const addCheckboxes = () => {
  const coursesChecked = new Set();
  $('.cgpa_cal_check').remove();
  const elems = $('.hierarchyLi.dataLi').not('.hierarchyHdr, .hierarchySubHdr');
  elems.each(() => {
    const courseID = $(this).children('.col1').html().trim();
    if (coursesChecked.has(courseID)) {
      appendCheckbox($(this).children('.col1'), false);
      return;
    }
    let isChecked = true;
    const type = $(this).children('.col5').html().trim()
      .slice(6);
    const grade = $(this).children('.col8').html().trim()
      .slice(6);
    if (excludeList.indexOf(type) > -1 || grade === '' || grade === 'I') {
      isChecked = false;
    }

    if (isChecked) {
      coursesChecked.add(courseID);
    }
    appendCheckbox($(this).children('.col1'), isChecked);
  });
};

const showTotalGPA = () => {
  const courses = [];
  let totalGrades = 0;
  let totalCredits = 0;
  $('#gpa_button').val('Calculating');
  $('#gpa_bar').remove();
  if ($('.cgpa_cal_check').length === 0) {
    addCheckboxes();
  }
  const elems = $('.hierarchyLi.dataLi').not('.hierarchyHdr, .hierarchySubHdr');
  const typeCreditsMap = new Map();
  elems.each(() => {
    if ($(this).find('.cgpa_cal_check:checked').length === 0) {
      return;
    }

    const course = {};
    course.code = $(this)
      .children('.col1')
      .contents()
      .filter(() => this.nodeType === Node.TEXT_NODE)
      .text()
      .trim();
    course.name = $(this).children('.col2').html().trim();
    course.type = $(this).children('.col5').html().trim()
      .slice(6);
    course.grade = $(this).children('.col8').html().trim()
      .slice(6);
    course.credits = Number($(this).children('.col3').html().trim()
      .slice(6));
    if (!(course.grade in gradeValues)) {
      return;
    }

    if (typeCreditsMap.has(course.type)) {
      typeCreditsMap.set(
        course.type,
        typeCreditsMap.get(course.type) + course.credits,
      );
    } else {
      typeCreditsMap.set(course.type, course.credits);
    }

    const gradeValue = gradeValues[course.grade];
    const { credits } = course;
    totalGrades += credits * gradeValue;
    totalCredits += credits;
    courses.push(course);
  });
  const gpa = (totalGrades / totalCredits).toFixed(2);
  return {
    name: $('.stuName').text().trim(),
    rollno: $('.studentInfoDiv>.flexDiv:nth-child(3)')
      .find('span')
      .text()
      .trim(),
    branch: $('.studentInfoDiv>.flexDiv:nth-child(5)')
      .find('div:nth-child(1)')
      .find('span')
      .text()
      .trim(),
    student_type: $('.studentInfoDiv>.flexDiv:nth-child(5)')
      .find('div:nth-child(2)')
      .find('span')
      .text()
      .trim(),
    type_credits_map: JSON.stringify(Array.from(typeCreditsMap)),
    courses: JSON.stringify(courses),
    gpa,
  };
};
chrome.runtime.sendMessage({
  action: 'parsedGPA',
  data: showTotalGPA(),
});

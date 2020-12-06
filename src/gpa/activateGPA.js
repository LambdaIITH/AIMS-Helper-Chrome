/*
Source: https://github.com/IITH/aims-gpa-calculator
*/

(function main() {
  const appendCheckbox = (parent, isChecked) => {
    const checkbox = document.createElement('input');
    checkbox.className = 'cgpa_cal_check';
    checkbox.type = 'checkbox';
    if (isChecked === true) checkbox.checked = true;
    else checkbox.checked = false;
    parent.before(checkbox);
  };
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

  const addCheckboxes = () => {
    const coursesChecked = new Set();
    const checkboxList = document.querySelectorAll('.cgpa_cal_check');
    checkboxList.forEach((each) => {
      each.remove();
    });
    const elems = document.querySelectorAll('.hierarchyLi.dataLi.tab_body_bg');
    elems.forEach((eachCourse) => {
      if (eachCourse.childNodes.length < 9) return;

      const courseID = eachCourse.childNodes[0].innerText;
      if (coursesChecked.has(courseID)) {
        // incase the course has already been done before
        // For example, Improvements, do not include it.
        appendCheckbox(eachCourse.childNodes[0], false);
        return;
      }
      let isChecked = true; // assume all courses to be valid
      const type = eachCourse.childNodes[4].innerText.trim();
      const grade = eachCourse.childNodes[7].innerText.trim();
      // console.log(grade);
      if (excludeList.indexOf(type) > -1 || grade === '' || grade === 'I') {
        // If Course is incomplete, hasn't finished or is to be excluded
        isChecked = false;
      }
      if (isChecked) {
        coursesChecked.add(courseID);
      }
      appendCheckbox(eachCourse.childNodes[0], isChecked);
    });
  };

  const showTotalGPA = () => {
    const courses = [];
    let totalGrades = 0;
    let totalCredits = 0;
    const gpaButton = document.querySelectorAll('#gpa_button');
    gpaButton.innerHTML = 'Calculating';
    const checkboxList = document.querySelectorAll('.cgpa_cal_check');
    if (checkboxList.length === 0) {
      // add checboxes in case they don't exist.
      addCheckboxes();
    }
    const elems = document.querySelectorAll('.hierarchyLi.dataLi.tab_body_bg');

    const typeCreditsMap = new Map();
    elems.forEach((eachCourse) => {
      if (eachCourse.querySelectorAll('.cgpa_cal_check:checked').length === 0) {
        return;
      }
      if (eachCourse.childNodes.length < 9) return;
      const course = {};
      course.code = eachCourse.childNodes[1].innerText.trim();
      course.name = eachCourse.childNodes[2].innerText;
      course.type = eachCourse.childNodes[5].innerText.trim();
      course.grade = eachCourse.childNodes[8].innerText.trim();
      course.credits = Number(eachCourse.childNodes[3].innerText.trim());
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
    const studentDataDiv = document.querySelectorAll(
      '.studentInfoDiv.inlineBlock',
    )[0];
    return {
      name: studentDataDiv.childNodes[1].innerHTML,
      rollno: studentDataDiv.childNodes[5].childNodes[3].innerHTML,
      branch:
        studentDataDiv.childNodes[9].childNodes[1].childNodes[3].innerHTML,
      studentType:
        studentDataDiv.childNodes[9].childNodes[3].childNodes[3].innerText,
      typeCreditsMap: JSON.stringify(Array.from(typeCreditsMap)),
      courses: JSON.stringify(courses),
      gpa,
    };
  };
  chrome.runtime.sendMessage({
    action: 'parsedGPA',
    data: showTotalGPA(),
  });
}());

/*
Source: https://github.com/IITH/aims-gpa-calculator
*/

var excludeList = [
  'Minor core',
  'Honors core',
  'Honours project',
  'Honours coursework',
  'FCC',
  'Additional'
];
var gradeValues = {
  'A+': 10,
  'A': 10,
  'A-': 9,
  'B': 8,
  'B-': 7,
  'C': 6,
  'C-': 5,
  'D': 4,
  'FR': 0,
  'FS': 0
};
//console.log(studentId);
appendCheckbox = function(parent, isChecked){
    parent.append("<input class=\"cgpa_cal_check\" type=\"checkbox\" "+(isChecked?"checked":"")+" />");
}
addCheckboxes = function(){
    var coursesChecked = new Set();
    $(".cgpa_cal_check").remove();
    elems = $(".hierarchyLi.dataLi").not(".hierarchyHdr, .hierarchySubHdr");
    elems.each(function(i){
        var courseId = $(this).children(".col1").html().trim();
        if (coursesChecked.has(courseId)){
            appendCheckbox($(this).children(".col1"), false);
            return;
        }
        isChecked = true;
        type = $(this).children(".col5").html().trim().slice(6);
        grade = $(this).children(".col8").html().trim().slice(6);
        console.log(grade, grade.length);
        if (excludeList.indexOf(type) > -1 || grade == "" || grade == "I")
            isChecked = false;
        if (isChecked)
            coursesChecked.add(courseId);
        appendCheckbox($(this).children(".col1"), isChecked);
    });
}

showTotalGpa = function(){
    var courses = [];
    $('#gpa_button').val('Calculating');
    $('#gpa_bar').remove();
    totalGrades = 0;
    totalCredits = 0;
    if ($(".cgpa_cal_check").length==0)
        addCheckboxes();
    elems = $(".hierarchyLi.dataLi").not(".hierarchyHdr, .hierarchySubHdr");
    var typeCreditsMap = new Map();
    elems.each(function(i){
        if ($(this).find(".cgpa_cal_check:checked").length == 0 )
            return;

        var course = new Object();
        course.code = $(this).children(".col1").contents().filter(function(){
            return this.nodeType == Node.TEXT_NODE;
          }).text().trim();
        course.name = $(this).children(".col2").html().trim();
        course.type = $(this).children(".col5").html().trim().slice(6);
        course.grade = $(this).children(".col8").html().trim().slice(6);
        course.credits = Number($(this).children(".col3").html().trim().slice(6));
        if (!(course.grade in gradeValues))
            return;

        if (typeCreditsMap.has(course.type))
          typeCreditsMap.set(course.type, typeCreditsMap.get(course.type) + course.credits);
        else
          typeCreditsMap.set(course.type, course.credits);


        gradeValue = gradeValues[course.grade];
        credits = course.credits;
        totalGrades += credits * gradeValue;
        totalCredits += credits;
        courses.push(course);
    });
    console.log(totalGrades, totalCredits);
    var gpa = (totalGrades / totalCredits).toFixed(2);
    return {
        name: $(".stuName").text().trim(),
        rollno: $(".studentInfoDiv>.flexDiv:nth-child(3)").find("span").text().trim(),
        branch: $(".studentInfoDiv>.flexDiv:nth-child(5)").find("div:nth-child(1)").find("span").text().trim(),
        studentType: $(".studentInfoDiv>.flexDiv:nth-child(5)").find("div:nth-child(2)").find("span").text().trim(),
        typeCreditsMap: JSON.stringify(Array.from(typeCreditsMap)),
        courses: JSON.stringify(courses),
        gpa: gpa
    };
}
chrome.runtime.sendMessage({
    action: "parsedGPA",
    data: showTotalGpa()
});

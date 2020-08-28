/*
Source: https://github.com/IITH/aims-gpa-calculator
*/

var exclude_list = ['Minor core', 'Honors core', 'Honours project', 'Honours coursework', 'FCC'];
var grade_values = {
	'A+': 10,
	'A': 10,
	'A-': 9,
	'B': 8,
	'B-': 7,
	'C': 6,
	'C-': 5,
	'D': 4,
	'FR': 0,
	'FS': 0,
	'S': 0
};
//console.log(studentId);
append_checkbox = function (parent, is_checked) {
	parent.append('<input class="cgpa_cal_check" type="checkbox" ' + (is_checked ? 'checked' : '') + ' />');
};
add_checkboxes = function () {
	var courses_checked = new Set();
	$('.cgpa_cal_check').remove();
	elems = $('.hierarchyLi.dataLi').not('.hierarchyHdr, .hierarchySubHdr');
	elems.each(function (i) {
		var course_id = $(this).children('.col1').html().trim();
		if (courses_checked.has(course_id)) {
			append_checkbox($(this).children('.col1'), false);
			return;
		}
		is_checked = true;
		type = $(this).children('.col5').html().trim().slice(6);
		grade = $(this).children('.col8').html().trim().slice(6);
		console.log(grade, grade.length);
		if (exclude_list.indexOf(type) > -1 || grade == '' || grade == 'I') is_checked = false;
		if (is_checked) courses_checked.add(course_id);
		append_checkbox($(this).children('.col1'), is_checked);
	});
};

show_total_gpa = function () {
	var courses = [];
	$('#gpa_button').val('Calculating');
	$('#gpa_bar').remove();
	total_grades = 0;
	total_credits = 0;
	if ($('.cgpa_cal_check').length == 0) add_checkboxes();
	elems = $('.hierarchyLi.dataLi').not('.hierarchyHdr, .hierarchySubHdr');
	var type_credits_map = new Map();
	elems.each(function (i) {
		if ($(this).find('.cgpa_cal_check:checked').length == 0) return;

		var course = new Object();
		course.code = $(this)
			.children('.col1')
			.contents()
			.filter(function () {
				return this.nodeType == Node.TEXT_NODE;
			})
			.text()
			.trim();
		course.name = $(this).children('.col2').html().trim();
		course.type = $(this).children('.col5').html().trim().slice(6);
		course.grade = $(this).children('.col8').html().trim().slice(6);
		course.credits = Number($(this).children('.col3').html().trim().slice(6));
		if (!(course.grade in grade_values)) return;

		if (type_credits_map.has(course.type))
			type_credits_map.set(course.type, type_credits_map.get(course.type) + course.credits);
		else type_credits_map.set(course.type, course.credits);

		grade_value = grade_values[course.grade];
		credits = (course.grade === 'S' || course.type === 'Additional') ? 0 : course.credits;
		total_grades += credits * grade_value;
		total_credits += credits;
		courses.push(course);
	});
	console.log(total_grades, total_credits);
	var gpa = (total_grades / total_credits).toFixed(2);
	return {
		name: $('.stuName').text().trim(),
		rollno: $('.studentInfoDiv>.flexDiv:nth-child(3)').find('span').text().trim(),
		branch: $('.studentInfoDiv>.flexDiv:nth-child(5)').find('div:nth-child(1)').find('span').text().trim(),
		student_type: $('.studentInfoDiv>.flexDiv:nth-child(5)').find('div:nth-child(2)').find('span').text().trim(),
		type_credits_map: JSON.stringify(Array.from(type_credits_map)),
		courses: JSON.stringify(courses),
		gpa: gpa
	};
};

chrome.runtime.sendMessage({
	action: 'parsedGPA',
	data: show_total_gpa()
});

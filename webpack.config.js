const path = require("path");

module.exports = {
	entry: {
		gpa_report:"./src/gpa/gpa_report.js",
		popup: "./src/popup/popup.js",
		table: "./src/timetable/table.js"	
	},
	output : {
		filename:"[name].js",
		path: path.resolve(__dirname,'build')
	}
}

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import html2pdf from 'html2pdf.js';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const slots = [
  '09:00-09:55',
  '10:00-10:55',
  '11:00-11:55',
  '12:00-12:55',
  '14:30-15:55',
  '16:00-17:25',
  '17:30-19:00',
  '19:00-20:30',
];

const slotIndex = {};
days.forEach((item) => {
  slotIndex[item] = {};
});

const allPossibilities = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'P',
  'Q',
  'R',
  'S',
  'W',
  'X',
  'Y',
  'Z',
  'FN1',
  'FN2',
  'FN3',
  'FN4',
  'FN5',
  'AN1',
  'AN2',
  'AN4',
  'AN5',
  'CL',
];

slotIndex.Monday['09:00-09:55'] = ['A', 'FN1'];
slotIndex.Monday['10:00-10:55'] = ['B', 'FN1'];
slotIndex.Monday['11:00-11:55'] = ['C', 'FN1'];
slotIndex.Monday['12:00-12:55'] = ['D'];
slotIndex.Monday['14:30-15:55'] = ['P', 'AN1'];
slotIndex.Monday['16:00-17:25'] = ['Q', 'AN1'];
slotIndex.Monday['17:30-19:00'] = ['W'];
slotIndex.Monday['19:00-20:30'] = ['X'];

slotIndex.Tuesday['09:00-09:55'] = ['D', 'FN2'];
slotIndex.Tuesday['10:00-10:55'] = ['E', 'FN2'];
slotIndex.Tuesday['11:00-11:55'] = ['F', 'FN2'];
slotIndex.Tuesday['12:00-12:55'] = ['G'];
slotIndex.Tuesday['14:30-15:55'] = ['R', 'AN2'];
slotIndex.Tuesday['16:00-17:25'] = ['S', 'AN2'];
slotIndex.Tuesday['17:30-19:00'] = ['Y'];
slotIndex.Tuesday['19:00-20:30'] = ['Z'];

slotIndex.Wednesday['09:00-09:55'] = ['B', 'FN3'];
slotIndex.Wednesday['10:00-10:55'] = ['C', 'FN3'];
slotIndex.Wednesday['11:00-11:55'] = ['A', 'FN3'];
slotIndex.Wednesday['12:00-12:55'] = ['G'];
slotIndex.Wednesday['14:30-15:55'] = ['F'];
slotIndex.Wednesday['16:00-17:25'] = ['CL'];

slotIndex.Thursday['09:00-09:55'] = ['C', 'FN4'];
slotIndex.Thursday['10:00-10:55'] = ['A', 'FN4'];
slotIndex.Thursday['11:00-11:55'] = ['B', 'FN4'];
slotIndex.Thursday['12:00-12:55'] = ['E'];
slotIndex.Thursday['14:30-15:55'] = ['Q', 'AN4'];
slotIndex.Thursday['16:00-17:25'] = ['P', 'AN4'];
slotIndex.Thursday['17:30-19:00'] = ['W'];
slotIndex.Thursday['19:00-20:30'] = ['X'];

slotIndex.Friday['09:00-09:55'] = ['E', 'FN5'];
slotIndex.Friday['10:00-10:55'] = ['F', 'FN5'];
slotIndex.Friday['11:00-11:55'] = ['D', 'FN5'];
slotIndex.Friday['12:00-12:55'] = ['G'];
slotIndex.Friday['14:30-15:55'] = ['S', 'AN5'];
slotIndex.Friday['16:00-17:25'] = ['R', 'AN5'];
slotIndex.Friday['17:30-19:00'] = ['Y'];
slotIndex.Friday['19:00-20:30'] = ['Z'];

function getAllIndexes(arr, val) {
  const indexes = [];
  let i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
}

const parser = new DOMParser();
const DOM = parser.parseFromString(localStorage.getItem('DOM'), 'text/html');
const data_deg_dtl = DOM.getElementsByClassName('studentDegDtls')[0].getAttribute(
  'data-deg-dtl',
);
const studentDegreeString = `stdntDeg_x_${data_deg_dtl}_1`; // Course Div String (x represents the serial number of the course)
const noMatchFound = [];
let currentID = 1;
const identifiedCourses = [];
const identifiedSlots = [];
const identifiedSegments = [];

while (true) {
  const courseCodeID = `cCd_${currentID}_${data_deg_dtl}_1`;
  const timetableRowsClass = `timeTabTr_${currentID}_${data_deg_dtl}_1`;
  const currentTimetableRows = DOM.getElementsByClassName(timetableRowsClass);
  const currentCourseCodeInput = DOM.getElementById(courseCodeID);
  if (currentCourseCodeInput == null) break;
  if (currentCourseCodeInput.getAttribute('title') == null) {
    currentCourseCodeInput.setAttribute(
      'title',
      currentCourseCodeInput.previousSibling.data,
    );
  }
  // Get the course segment duration.getElements
  let segmentString = '';
  if (!currentTimetableRows[0].getElementsByClassName('ttd1')[0]) {
    currentID += 1;
    noMatchFound.push(currentCourseCodeInput.getAttribute('title'));
    continue;
  }
  const currentSegmentStart = currentTimetableRows[0]
    .getElementsByClassName('ttd1')[0]
    .textContent.split('-')[0];

  const currentSegmentEnd = currentTimetableRows[0]
    .getElementsByClassName('ttd1')[0]
    .textContent.split('-')[1];
  let counterSegment = parseInt(currentSegmentStart, 10);
  while (counterSegment <= parseInt(currentSegmentEnd, 10)) {
    segmentString += counterSegment.toString();
    counterSegment++;
  }
  // Get the list of prospective slots from the first entry.
  var day = currentTimetableRows[0]
    .getElementsByClassName('ttd2')[0]
    .getElementsByTagName('span')[1]
    .textContent.split('-')[0];
  var time = `${currentTimetableRows[0]
    .getElementsByClassName('ttd2')[0]
    .getElementsByTagName('span')[1]
    .textContent.split('-')[1]
  }-${
    currentTimetableRows[0]
      .getElementsByClassName('ttd2')[0]
      .getElementsByTagName('span')[1]
      .textContent.split('-')[2]}`;
  let possibilities = slotIndex[day][time];
  for (var i = 1; i < currentTimetableRows.length; i++) {
    var day = currentTimetableRows[i]
      .getElementsByClassName('ttd2')[0]
      .getElementsByTagName('span')[1]
      .textContent.split('-')[0];
    var time = `${currentTimetableRows[i]
      .getElementsByClassName('ttd2')[0]
      .getElementsByTagName('span')[1]
      .textContent.split('-')[1]
    }-${
      currentTimetableRows[i]
        .getElementsByClassName('ttd2')[0]
        .getElementsByTagName('span')[1]
        .textContent.split('-')[2]}`;
    var newPossibilities = [];
    if (!possibilities || !slotIndex[day][time]) {
      noMatchFound.push(currentCourseCodeInput.getAttribute('title'));
      break;
    }
    possibilities.forEach((possibility) => {
      if (slotIndex[day][time].includes(possibility)) {
        newPossibilities.push(possibility);
      }
    });
    possibilities = newPossibilities;
    if (possibilities.length == 0) {
      break;
    }
  }
  if (possibilities) {
    if (possibilities.length == 1) {
      identifiedCourses.push(currentCourseCodeInput.getAttribute('title'));
      identifiedSlots.push(possibilities[0]);
      identifiedSegments.push(segmentString);
    } else {
      noMatchFound.push(currentCourseCodeInput.getAttribute('title'));
    }
  }
  currentID += 1;
}
// Add warning about noMatchFound
console.log(identifiedCourses);
// Actually Put Timetable On Screen
for (var i = 0; i < days.length; i++) {
  for (var j = 0; j < slots.length; j++) {
    if (slotIndex[days[i]][slots[j]]) {
      slotIndex[days[i]][slots[j]].forEach((slotCode) => {
        indices = getAllIndexes(identifiedSlots, slotCode);
        indices.forEach((index) => {
          mainSegment = 0;
          const querySegments = identifiedSegments[index].length / 2;
          let startSegment = parseInt(identifiedSegments[index][0], 10) + 1;
          for (let k = 1; k <= querySegments; k++) {
            dayint = i + 1;
            slotint = j + 1;
            segmentint = parseInt(startSegment / 2);
            queryString = `${dayint.toString()
            }-${
              segmentint.toString()
            }-${
              slotint.toString()}`;
            document.getElementsByClassName(queryString)[0].textContent = identifiedCourses[index];
            startSegment += 2;
          }
        });
      });
    }
  }
}
// noMatchFound.forEach((course) => {
// 	var node = document.createTextNode(course + " ");
// 	document.getElementsByClassName("warning")[0].appendChild(node);
// });
document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementsByClassName('download-pdf')[0]
    .addEventListener('click', () => {
      const element = document.getElementById('timetable');
      html2pdf(element);
    });
});

document
  .getElementsByClassName('send-to-db')[0]
  .addEventListener('click', () => {
    firebase.initializeApp({
      apiKey: 'AIzaSyADsA9d1jkV3ly_8fezijTV7LvSTMGD6EM',
      authDomain: 'aims-helper-247320.web.app',
      projectId: 'aims-helper-247320',
    });
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = result.credential.accessToken;
        // The signed-in user info.
        const { user } = result;
        const db = firebase.firestore();
        const docRef = db
          .collection('users')
          .doc(firebase.auth().currentUser.uid);
        const o = {};
        docRef.get().then((thisDoc) => {
          if (thisDoc.exists) {
            // user is already there, write only last login
            o.email = user.email;
            o.token = token;
            o.identifiedCourses = identifiedCourses;
            o.identifiedSegments = identifiedSegments;
            o.identifiedSlots = identifiedSlots;
            docRef.update(o);
            document.getElementsByClassName('send-to-db')[0].remove();
          } else {
            o.email = user.email;
            o.token = token;
            o.identifiedCourses = identifiedCourses;
            o.identifiedSegments = identifiedSegments;
            o.identifiedSlots = identifiedSlots;
            docRef.set(o);
            document.getElementsByClassName('send-to-db')[0].remove();
          }
        });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const { email } = error;
        // The firebase.auth.AuthCredential type that was used.
        const { credential } = error;
        // ...
        console.log(`Eror${errorCode}`);
      });
  });

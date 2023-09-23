"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.countParticipants = countParticipants;
exports.getMaxNum = getMaxNum;
exports.getParticipantEvents = getParticipantEvents;
exports.getParticipants = getParticipants;
var _cors = _interopRequireDefault(require("cors"));
var _partyday = require("../../lib/partyday");
var R = _interopRequireWildcard(require("ramda"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/*
* тестовые данные
*/

// Участники междусобойчика
var participants = [{
  "fkParty": 1,
  "num": 1,
  "surname": "Пупкин",
  "patronymic": "Владленович",
  "name": "Валерий",
  "phone": "+7(980)678-90-99",
  "email": "pups@gmail.com",
  "dtReg": _partyday.PartyDate.toTS("01.02.23 01:45"),
  "club": "TSK Triumf",
  "role": "leader",
  "price": 5000,
  "paid": 0,
  "comment": "вечно пьяный"
}, {
  "fkParty": 2,
  "num": 1,
  "surname": "Пупкин",
  "patronymic": "Владленович",
  "name": "Вениамин",
  "phone": "+7(980)678-90-99",
  "email": "pups@gmail.com",
  "dtReg": _partyday.PartyDate.toTS("01.02.23 02:45"),
  "club": "TSK Triumf",
  "role": "leader",
  "price": 5000,
  "paid": 0,
  "comment": null
}, {
  "fkParty": 1,
  "num": 2,
  "surname": "Хренова",
  "patronymic": "Михайловна",
  "name": "Александра",
  "phone": "+7(981)678-77-99",
  "email": "pups@gmail.com",
  "dtReg": _partyday.PartyDate.toTS("02.02.23 03:20"),
  "club": "TSK Triumf",
  "role": "follower",
  "price": 5000,
  "paid": 5000,
  "comment": null
}, {
  "fkParty": 2,
  "num": 2,
  "surname": "Хреновая",
  "patronymic": "Михайловна",
  "name": "Александрина",
  "phone": "+7(981)678-77-99",
  "email": "pups@gmail.com",
  "dtReg": _partyday.PartyDate.toTS("01.02.23 01:23"),
  "club": "TSK Triumf",
  "role": "follower",
  "price": 5000,
  "paid": 5000,
  "comment": null
}, {
  "fkParty": 1,
  "num": 3,
  "surname": "Удивительный",
  "patronymic": "Стоянович",
  "name": "Марат",
  "phone": "+7(960)978-90-99",
  "email": "ups@gmail.com",
  "dtReg": _partyday.PartyDate.toTS("03.02.23 05:05"),
  "club": "Swingtown",
  "role": "leader",
  "price": 5000,
  "paid": 2500,
  "comment": null
}, {
  "fkParty": 1,
  "num": 4,
  "surname": "Непомнящий",
  "patronymic": "Иванович",
  "name": "Михаил",
  "phone": "+7(960)978-93-99",
  "email": "pup1s@gmail.com",
  "dtReg": _partyday.PartyDate.toTS("01.02.23 01:34"),
  "club": "TSK Triumf",
  "role": "leader",
  "price": 5000,
  "paid": 2500,
  "comment": null
}, {
  "fkParty": 1,
  "num": 5,
  "surname": "Веселая",
  "patronymic": "Павловна",
  "name": "Вера",
  "phone": "+7(930)666-66-99",
  "email": "lil@gmail.com",
  "dtReg": _partyday.PartyDate.toTS("01.02.23 06:05"),
  "club": "TSK Triumf",
  "role": "ivara",
  "price": 5000,
  "paid": 5000,
  "comment": null
}, {
  "fkParty": 1,
  "num": 6,
  "surname": "Удивительный",
  "patronymic": "Стоянович",
  "name": "Марат",
  "phone": "+7(960)978-90-99",
  "email": "pups@gmail.com",
  "dtReg": _partyday.PartyDate.toTS("04.02.23 01:33"),
  "club": "ivara",
  "role": "leader",
  "price": 5000,
  "paid": 2500,
  "comment": null
}, {
  "fkParty": 1,
  "num": 7,
  "surname": "Смехова",
  "patronymic": "Алексеевна",
  "name": "Ольга",
  "phone": "+7(960)978-90-66",
  "email": "das@gmail.com",
  "dtReg": _partyday.PartyDate.toTS("03.02.23 21:51"),
  "club": "Tanzclass",
  "role": "follower",
  "price": 5000,
  "paid": 0,
  "comment": null
}, {
  "fkParty": 1,
  "num": 8,
  "surname": "Мишин",
  "patronymic": "Петрович",
  "name": "Ринат",
  "phone": "+7(960)978-77-88",
  "email": "pus@gmail.com",
  "dtReg": _partyday.PartyDate.toTS("03.02.23 00:12"),
  "club": "Swingtown",
  "role": "leader",
  "price": 5000,
  "paid": 5000,
  "comment": null
}];

/*
* События в которых заинтересован участник
*/
var participantEvents = [{
  partyName: 'Swingtown Little Cup 2023',
  eventName: 'Mix&Match Kids',
  name: 'Валерий',
  price: 500,
  role: ''
}, {
  partyName: 'Swingtown Little Cup 2023',
  name: 'Валерий',
  eventName: 'Strictly Kids',
  price: 1000,
  role: ''
}, {
  partyName: 'Swingtown Little Cup 2023',
  name: 'Александра',
  eventName: 'Mix&Match Kids',
  price: 500,
  role: ''
}, {
  partyName: 'Swingtown Little Cup 2023',
  name: 'Александра',
  eventName: 'Strictly Kids',
  price: 1000,
  role: ''
}];
function getParticipants() {
  return participants;
}
function getParticipantEvents() {
  return participantEvents;
}

/**
 * Получит максимальный номер участника 
 */
function getMaxNum() {
  var maxNum = function maxNum(acc, elem) {
    return R.max(acc, elem.num);
  };
  return R.reduce(maxNum, 0, getParticipants());
}
function countParticipants(fkParty) {
  var cnt = function cnt(acc, elem) {
    return elem.fkParty === fkParty ? acc + 1 : acc;
  };
  return R.reduce(cnt, 0, getParticipants());
}
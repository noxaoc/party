"use strict";

var _dayjs = _interopRequireDefault(require("dayjs"));
var _partyday = require("../partyday");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
test("PartyDate.toTS('15.01.23 00:01:03')", function () {
  var dt_str = '15.01.23 00:01:03';
  var ts = _partyday.PartyDate.toTS(dt_str);
  var dt = _partyday.PartyDate.fromTS(ts);
  expect(dt).toEqual(dt_str);
});
test("PartyDate.toTS('15.01.23 01:01')", function () {
  var dt_str = '15.01.23 01:01:00';
  var ts = _partyday.PartyDate.toTS('15.01.23 01:01');
  var dt = _partyday.PartyDate.fromTS(ts);
  expect(dt).toEqual(dt_str);
});
test("PartyDate.dateToTS('15.01.23')", function () {
  var dt_str = '15.01.23';
  var ts = _partyday.PartyDate.dateToTS(dt_str);
  var dt = _partyday.PartyDate.dateFromTS(ts);
  expect(dt).toEqual(dt_str);
});
test("PartyDate.getCurrDate()", function () {
  var curDate = (0, _dayjs["default"])();
  var dt = _dayjs["default"].unix(_partyday.PartyDate.getCurrDate());
  expect(curDate.year()).toEqual(dt.year());
  expect(curDate.month()).toEqual(dt.month());
  expect(curDate.day()).toEqual(dt.day());
  expect(dt.hour()).toEqual(0);
  expect(dt.minute()).toEqual(0);
  expect(dt.second()).toEqual(0);
});
"use strict";

var _partyday = require("../partyday");
test("PartyDate.dateToTS('15.01.23')", function () {
  var dt_str = '15.01.23';
  var ts = _partyday.PartyDate.dateToTS(dt_str);
  var dt = _partyday.PartyDate.dateFromTS(ts);
  expect(dt).toEqual(dt_str);
});
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.remove = exports.read = void 0;
/*export default class  Party{
    static  read( id ){
        console.log("call read")
        return null
    }
}
*/

var read = function read(req, res, next) {
  res.send("call read");
};
exports.read = read;
var remove = function remove(req, res, next) {
  res.send("call remove");
};
exports.remove = remove;
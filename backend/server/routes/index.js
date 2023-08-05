//var express = require('express');
import express from 'express'
import {doTestSQL} from '../models/sqlite/dbschema'

let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  doTestSQL()
  res.send('Welcome to Express')

});

//module.exports = router;
export default router;


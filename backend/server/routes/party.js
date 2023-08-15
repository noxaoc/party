/* 
Маршрут к сервису междусобойчика
*/
import { execWebFunc } from '../webobj'
import express from 'express'
let router = express.Router();

//https://<домен>/<сервис>/<версия API>/<модуль>/<функция>?<параметры>


/* GET users listing. */
router.get('/:module/:func', function(req, res, next) {
  execWebFunc(req.params.module, req.params.func)
  res.send(`module=${req.params.module} func=${req.params.func}`)
})

export default router
/*
Утилиты для формирования маршрутов
*/
import * as fs from 'node:fs'
import path from 'path'
import cors from 'cors'

/*
В папку webfuncs кладутся модули с экспортируемыми функциями связываемыми с маршрутами
во время старта приложения для каждого модуля и его функций создается маршрут формата
":url_path/:module_name/:func_name" где
:module_name - имя модуля
func_name - название фнукции
url_path - общий url - путь, например, "/party"
fpath - путь до папки где лежат модули с экспортируемыми web - функциями
*/
export const makeRoutes = ( express, app, url_path, fpath )=>{
    // разрешаем CORS
    const corsOptions = {
        origin: 'http://localhost:3000',
        methods: ['POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type']
    }
   
    let fnames = fs.readdirSync( fpath )
    // obj - экспортируемый  по умолчанию объект модуля к объекту привязаны функции
    const createRoute  = ( obj, module_name )=>{
        let router = express.Router();
        for ( let func_name in obj) {
            router.post( '/' + func_name, cors(corsOptions), obj[func_name] )
            router.options( '/' + func_name, cors(corsOptions ) )
        }
        console.log( url_path + '/' + module_name )
        app.use( url_path + '/' + module_name, router  )
    }
    
    const makeRoute = ( fname )=>{
        const mname = fpath + '/' + fname
        const module_name = path.basename( fname, '.js')
        return import(mname)
            .then( obj => createRoute(obj, module_name) )
            .catch(err => console.log(`Модуль ${mname} не удалось загрузить! Возникла ошибка ${err}.`) )
    }
    Promise.all( fnames.map( makeRoute ))
}
/* собираем все функции в глобальный объект  webFuncs и зовем их оттуда
формат объекта
ключ: __<module_name>__<func_name>
значение: ccылка на функцию
*/


const webFuncs = {}
/*
Подчеркивание добавляем чтобы не могли позвать произвольную функцию
*/
export const addWebFunc = ( module_name, func_name, web_func )=>{
    webFuncs['__' + module_name + '__' + func_name] = web_func
}

/*
Выполнить web - функцию
*/
export const execWebFunc = ( module_name, func_name )=>{
    const web_func = webFuncs['__' + module_name + '__' + func_name]
    if( web_func )
        web_func()
}
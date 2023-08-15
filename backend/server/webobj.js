// собираем все функции
// в глобальный объект и зовем их оттуда

const webFuncs = {}
/*
Подчеркивание добавляем чтобы не могли позвать произвольную функцию
*/
export const addWebFunc = ( module_name, func_name, web_func )=>{
    webFuncs['__' + module_name + '__' + func_name] = web_func
}

export const execWebFunc = ( module_name, func_name )=>{
    const web_func = webFuncs['__' + module_name + '__' + func_name]
    if( web_func )
        web_func()
}
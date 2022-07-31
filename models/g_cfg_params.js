/*  Глобальные параметры работы приложения
*   действительны на все время работы 
*/
const global_config_params = {
    // режим "Все в памяти" - Redis, Postgres фактически использование Mock
    in_memory: true,
    // время жизни сессии в сек по-умолчанию
    sid_life_time: 60 * 60 * 24
}

module.exports = { in_memory: () => { return global_config_params.in_memory } , 
                   sid_life_time: () => { return global_config_params.sid_life_time }
                 }
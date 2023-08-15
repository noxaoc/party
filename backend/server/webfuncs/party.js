/*export default class  Party{
    static  read( id ){
        console.log("call read")
        return null
    }
}
*/


export const read = ( req, res, next )=>{
    res.send("call read")
}

export const remove = ( req, res, next )=>{
    res.send("call remove")
}
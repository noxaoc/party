import React from "react";
import { Button } from '@themesberg/react-bootstrap'

/* Кнопка переключения между режимом редактирования формы и просмотра
* 
*/
export const EditButton = ( props )=>{
//    console.log(props)
const { hookEdit, onSubmit} = props
const [editMode, setEditMode] = hookEdit
const type = editMode ? "submit" : "button"
const onClick = editMode ? onSubmit : ()=>setEditMode(true)
const name = editMode ? "Сохранить" : "Изменить"
return (
        <Button className="border-0" variant="link"  type={type} onClick={onClick} > 
            {name}
        </Button>
    )
}
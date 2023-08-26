/*
Элемент для ввода комментария на форме
*/
import React from "react";
import { Form } from '@themesberg/react-bootstrap'
    
export const  InputComment = ( props )=>{
const { editMode, value, onChange, name } = props
//console.log(props)
return (
<Form.Group className="mb-2" controlId="pForm.comment">
    <Form.Control as="textarea" 
                  name={name}
                  rows={3} 
                  placeholder="Комментарий" 
                  value={value} 
                  onChange={onChange}
                  readOnly={!editMode} />
</Form.Group>
)
}

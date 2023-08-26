
/* Линия ввода данных
Поле ввода данных на форме, распололоженные в одну линию с меткой
Достаточно распространенный вариант компоновки см. схематичный вариант
 ______________форма _____________
|   ________     _____________    |
|  | Label  |   | Input Field |   |
|   --------     -------------    |
|  | Label  |   | Input Field |   |
|   --------     -------------    |
|                                 |
 ---------------------------------
Параметры компонента:
ctrlId - уникальный идентификатор поля ввода
label - заголовок поля ввода
type - html тип поля ввода
value - значение поля ввода
placeholder - подсказка в поле ввода
*/

import React from "react";
import * as R from "ramda"
import {  Col, Row, Form } from '@themesberg/react-bootstrap'
  
//field: An object containing onChange, onBlur, name, and value of the field (see FieldInputProps)
export const  InputLine = ( props )=>{

const { ctrlId, editMode, name, type, label, value, placeholder, onChange } = props
const type_elem = R.isNil(type) ? "input" : type;
console.log(value)
return (
    <Form.Group as={Row} className="mb-1" controlId={ctrlId}>
        <Form.Label column sm={3}>{label}</Form.Label>
        <Col sm={9}>
            <Form.Control type={type_elem} 
                          name={name}
                          value={value} 
                          placeholder={placeholder} 
                          readOnly={!editMode} 
                          onChange={onChange}/>
        </Col>
    </Form.Group>
)
}

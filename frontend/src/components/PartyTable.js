
import React, { useState, useEffect } from "react"
import { Formik, Form as FormikForm, Field } from 'formik'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import {  Col, Row, Card,  Button, Table, Dropdown, 
          Modal, ButtonGroup, Form } from '@themesberg/react-bootstrap'

import {InputLine} from "./InputLine"
import { makePlainObj, mapRSet, lengthRSet, makePlainObjByIdx } from "../lib/record"
import { Party } from "../data/party"
//mport { TypeEventParty } from "../data/typeEventParty"
import { InputComment } from "./InputComment"
import { EditButton } from "./EditButton"
const R = require('ramda');



/*
* Диалог показа данных и редактирования участника междусобойчика
* Если есть данные диалог открывается в режиме просмотра по-умолчанию.
* Чтобы перейти в режим редактирования надо нажать кнопку "Изменить"
* свойства:
* hookShowDlg:
*   showDlg:  
*     schow
*       false - модальный диалог скрыт
*       true - модальный диалог выводится
*     editRec - редактируемое событие междусобойчика
*   setShowDdlg - функция переводящая диалог в противоположное указанному в showDefault состояние
*   typeEvents - список событий
*/
export const EventPartyDlg = ( { hookShowDlg,  typeEvents, hookChgEvents } )=>{
  const [showDlg, setShowDlg] = hookShowDlg
  // перевод в режим редактирования диалога просмотра события
  // false - режим просмотра, без изменения данных
  // true - режим редактирования данных, в этом режиме при нажатии кнопки сохранить данные меняются
  const initEditMode = R.isNil(showDlg.editRec.pkID)? true : false
  const [editMode, setEditMode] = useState(initEditMode)
  const [changed, setChanged] = hookChgEvents

  // обработка закрытия формы
  const handleClose = () => {
    setShowDlg( {showDlg:false, editRec:{}} )
  }
 
  // сохранить участника
  const saveEvent = ( values )=>{
    // собрать данные с формы и записать или вставить
    console.log(values)
    Party.upsert(values, ()=>setChanged(!changed) )
    handleClose()
  }

  return (
    <Formik initialValues={ {...showDlg.editRec} }  
            onSubmit={saveEvent} >
     { (props)=>(
        <Form as={FormikForm}> 
          {/*console.log(props)*/}
          <Modal as={Modal.Dialog} show={true} onHide={handleClose} size="md" >
            <Modal.Header className="py-1" as={Row} >
              <Col sm={8}>
                <Modal.Title className="h5">Событие</Modal.Title>
              </Col>
              <Col sm={3} className="d-flex justify-content-end" >
                <EditButton hookEdit={[editMode, setEditMode]} onSubmit={props.handleSubmit}/>
              </Col>
              <Col sm={1} className="d-flex justify-content-end" >
                <Button className="m-0 py-2" variant="close" aria-label="Close" onClick={handleClose} />
              </Col>
            </Modal.Header>
            <Modal.Body className="py-1">
                <Field as={InputLine} editMode={editMode}  name="name" placeholder="Название события" ctrlId="eForm.name" label="Название" />
                <Field as={InputLine} editMode={editMode} name="dtStart" placeholder="Дата начала" ctrlId="eForm.dtStart" label="Дата начала" />
                {!editMode && <Field as={InputLine} editMode={editMode} name="evTypeName" ctrlId="eForm.evTypeName" label="Вид" />}
                <Field as={InputComment} editMode={editMode} name="description" />
            </Modal.Body>
          </Modal>
        </Form>
      )}     
    </Formik>

    )
}


const ErrorMsgAlert = ()=>{
  return (
      <Card border="light" className="table-wrapper table-responsive shadow-sm">
        <Card.Body className="pt-0 pb-1 px-2">
          <Card.Title>Произошла непредвиденная ошибка</Card.Title>
          <Card.Text>
            Мы искренне сожалеем, но по неизвестной причине запрос не удается исполнить.
            Если перезагрузка страницы не помогает, обратитесь в техническую поддержку.
          </Card.Text>
        </Card.Body>
      </Card>
  )
}

/*
 Список междусобойчиков
id - идентификатор события
name - название события
typeEvent - тип события
startDate - дата и время начала события
comment - к событию    
*/
export const PartyTable = ( props ) => {
  // changed = true если данные событий поменялись
  const [ changed, setChanged ] = useState(false)
  // показывать или нет диалог просмотра участника
  /* showDlg - показать диалог редактирования, 
     editRec - редактируемая запись
  */
  const [showDlg, setShowDlg] = props.hookShowDlg
  //const [showDlg, setShowDlg] = useState({showDlg:false, editRec:{}});
  // перевод в режим редактирования диалог просмотра события
  //const [editMode, setEditMode] = useState(false);
  // список событий, если events === undefined, то произошла ошибка
  const [partys, setPartys] = useState([])
  // список типов событий, он никогда почти не меняется
  //const [typeEvents, setTypeEvents]=useState([])
  /*
  useEffect(() => {
    TypeEventParty.all( result=> setTypeEvents(result) )
    return ()=>{}
  },[])
  */

  useEffect(() => {
    // получить список междусобойчиков в соответствии с фильтрацией
    const filter = { searchStr : props.searchStr }
    Party.list( filter, null, null,  result=>setPartys(result) )
    return ()=>{}
  },[props.searchStr, changed])
  
  // создать обработчик на редактирование записи
  const makeOnEditHdl = ( id )=>{
    return () => {
      Party.list( {ids:[id] }, null, null, 
                     result =>setShowDlg( {showDlg:true, editRec:makePlainObjByIdx(result) } ) )
    }
  }

  //удалить событие по id и вызвать обновление списка  событий
  const doRemoveEvent = id =>{
    return ()=>{
      Party.remove( { ids:[id] }, 
                    ( result )=>{ R.isNil(result) ? alert("Произошла неизвестная ошибка") : setChanged(!changed) }, 
                    ( error )=>console.log(error.message) ) 
    }
  }

  const recHdl = ( rec, frmt  )=>{
    const pobj = makePlainObj(rec,frmt)
    return <TableRow key={`party-${pobj.pkID}`} {...pobj} />
  }

  const TableRow = (props) => {
    const { pkID, name, place, description, dtStart, dtEnd, outgoing, payment, profit } = props;
    return (
      <tr>
        <td className="p-1">
          <span className="fw-normal">
            { name }
          </span>          
        </td>
        <td className="p-1">
            <span className="fw-normal">
              { place }
            </span>
        </td>
        <td className="p-1">
            <span className="fw-normal">
                {dtStart + ' - ' + dtEnd}
            </span>
        </td>
        <td className="p-1">
          <span className="fw-normal">
            {description}
          </span>
        </td>
        <td className="p-1">
          <span className="fw-normal">
            {outgoing}
          </span>
        </td>
        <td className="p-1">
          <span className="fw-normal">
            {payment}
          </span>
        </td>
        <td className="p-1">
          <span className="fw-normal">
            {profit}
          </span>
        </td>
        <td className="p-1">
          {/**выпадающий список */}
          <Dropdown as={ButtonGroup} >
            {/**переключатель на который нажимают */}
            <Dropdown.Toggle as={Button}  split variant="link" className="text-dark m-0 p-0" > 
                <span className="fw-normal">
                   Действие
                </span>   
            </Dropdown.Toggle>
            {/** выпадающее меню из пунктов при нажатии переключателя */}
            <Dropdown.Menu>
              <Dropdown.Item onClick={ makeOnEditHdl(pkID) }>
                <FontAwesomeIcon icon={faEdit} className="me-2" /> Редактировать
              </Dropdown.Item>

              <Dropdown.Item className="text-danger" onClick={doRemoveEvent(pkID)}>
                <FontAwesomeIcon icon={faTrashAlt} className="me-2"  /> Удалить
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };
  if( partys === undefined )
    return  <ErrorMsgAlert /> 
  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      { showDlg.showDlg && <EventPartyDlg hookShowDlg={[showDlg, setShowDlg]} 
                                          hookChgEvents={[changed, setChanged]} /> } 
      <Card.Body className="pt-0 pb-1 px-2">
        <Table hover className="user-table align-items-center">
            <thead>
            <tr>
              <th className="border-bottom px-1">Название</th>
              <th className="border-bottom text-center">Место</th>
              <th className="border-bottom text-center">Даты проведения</th>
              <th className="border-bottom px-1">Описание</th>
              <th className="border-bottom px-1">Затраты</th>
              <th className="border-bottom px-1">Поступления</th>
              <th className="border-bottom px-1">Прибыль</th>
              <th className="border-bottom text-center px-1">Что?</th>
            </tr>
          </thead>
          <tbody>
            {mapRSet( recHdl, partys )}
          </tbody>
        </Table>
        <Card.Footer className="px-1 py-2 border-0 d-flex justify-content-start">
          <small className="fw-bold">
            Всего: <b>{ lengthRSet(partys) }</b>
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};


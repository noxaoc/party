
import React, { useState, useEffect } from "react"
import { Formik, Form as FormikForm, Field } from 'formik'
import { generatePath, Link } from "react-router-dom";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import {  Col, Row, Card,  Button, Table, Dropdown, 
          Modal, ButtonGroup, Form } from '@themesberg/react-bootstrap'

import { Routes } from "../routes";
import {InputLine} from "./InputLine"
import { makePlainObj, mapRSet, lengthRSet, makePlainObjByIdx, changeNullValueToEmptyStr } from "../lib/record"
import { Party } from "../data/party"
import { PartyMoney } from "../lib/money"
//mport { TypeEventParty } from "../data/typeEventParty"
import { InputComment } from "./InputComment"
import { EditButton } from "./EditButton"
const R = require('ramda');



/*
* Диалог показа данных и редактирования междусобойчика
* Если есть данные диалог открывается в режиме просмотра по-умолчанию.
* Чтобы перейти в режим редактирования надо нажать кнопку "Изменить"
* свойства:
* hookShowDlg:
*   showDlg:  
*     schow
*       false - модальный диалог скрыт
*       true - модальный диалог выводится
*     editRec - редактируемый междусобойчик
*   setShowDdlg - функция переводящая диалог в противоположное указанному в showDefault состояние
*  hookChgPartys - хук изменения списка междусобойчиков
*/
export const PartyDlg = ( { hookShowDlg,  hookChgPartys } )=>{
  const [showDlg, setShowDlg] = hookShowDlg
  // перевод в режим редактирования диалога просмотра междусобойчика
  // false - режим просмотра, без изменения данных
  // true - режим редактирования данных, в этом режиме при нажатии кнопки сохранить данные меняются
  const initEditMode = R.isNil(showDlg.editRec.pkID)? true : false
  const [editMode, setEditMode] = useState(initEditMode)
  const [changed, setChanged] = hookChgPartys

  //console.log(showDlg.editRec)
  // обработка закрытия формы
  const handleClose = () => {
    setShowDlg( {showDlg:false, editRec:{}} )
  }
 
  // сохранить запись
  const saveRec = ( values )=>{
    // собрать данные с формы и записать или вставить
    console.log(values)
    Party.upsert(values, ()=>setChanged(!changed) )
    handleClose()
  }

  return (
    <Formik initialValues={ {...showDlg.editRec} }  
            onSubmit={saveRec} >
     { (props)=>(
        <Form as={FormikForm}> 
          {/*console.log(props)*/}
          <Modal as={Modal.Dialog} show={true} onHide={handleClose} size="md" >
            <Modal.Header className="py-1" as={Row} >
              <Col sm={8}>
                <Modal.Title className="h5">Междусобойчик</Modal.Title>
              </Col>
              <Col sm={3} className="d-flex justify-content-end" >
                <EditButton hookEdit={[editMode, setEditMode]} onSubmit={props.handleSubmit}/>
              </Col>
              <Col sm={1} className="d-flex justify-content-end" >
                <Button className="m-0 py-2" variant="close" aria-label="Close" onClick={handleClose} />
              </Col>
            </Modal.Header>
            <Modal.Body className="py-1">
                <Field as={InputLine} editMode={editMode}  name="name" placeholder="Название междусобойчика" ctrlId="eForm.name" label="Название" />
                <Field as={InputLine} editMode={editMode} name="place" placeholder="Место проведения" ctrlId="eForm.place" label="Место" />
                <Field as={InputLine} editMode={editMode} name="dtStart" placeholder="Дата начала" ctrlId="eForm.dtStart" label="Дата начала" />
                <Field as={InputLine} editMode={editMode} name="dtEnd" placeholder="Дата окончания" ctrlId="eForm.dtEnd" label="Дата окончания" />
                <Field as={InputComment} editMode={editMode} name="description" ctrlId="eForm.description" />
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
*/
export const PartyTable = ( props ) => {
  // changed = true если данные событий поменялись
  const [ changed, setChanged ] = useState(false)
  // показывать или нет диалог просмотра участника
  /* showDlg - показать диалог редактирования, 
     editRec - редактируемая запись
  */
  const [showDlg, setShowDlg] = props.hookShowDlg
  // список междусобойчиков, если partys === undefined, то произошла ошибка
  const [partys, setPartys] = useState([])

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
                     result =>setShowDlg( {showDlg:true, 
                                           editRec:changeNullValueToEmptyStr(makePlainObjByIdx(result)) } ) )
    }
  }

  //удалить междусобойчик по id и вызвать обновление списка  междусобойчиков
  const doRemoveByID = id =>{
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

  const makeSpace = str => R.isEmpty(str) ? <pre>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</pre> : (str +"...")

  const TableRow = (props) => {
    const { pkID, name, place, dtStart, dtEnd, outgoing, payment, profit, description } = props;
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
            {PartyMoney.getEmpty(outgoing)}
          </span>
        </td>
        <td className="p-1">
          <span className="fw-normal">
            {PartyMoney.getEmpty(payment)}
          </span>
        </td>
        <td className="p-1">
          {/**выпадающий список */}
          <Dropdown as={ButtonGroup} >
            {/**переключатель на который нажимают */}
            <Dropdown.Toggle as={Button}  split variant="link" className="text-dark m-0 p-0" > 
                <span className="fw-normal">
                { makeSpace( PartyMoney.getEmpty(profit) ) }
                </span>   
            </Dropdown.Toggle>
            {/** выпадающее меню из пунктов при нажатии переключателя */}
            <Dropdown.Menu>
              <Dropdown.Item onClick={ makeOnEditHdl(pkID) }>
                <FontAwesomeIcon icon={faEdit} className="me-2" /> Редактировать
              </Dropdown.Item>
              <Dropdown.Item as={Link} to={ generatePath(Routes.Partys.path,{ partyID: pkID}) }>
                <FontAwesomeIcon icon={faEdit} className="me-2" /> Сделать текущим
              </Dropdown.Item>
              <Dropdown.Item className="text-danger" onClick={doRemoveByID(pkID)}>
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
      { showDlg.showDlg && <PartyDlg hookShowDlg={[showDlg, setShowDlg]} 
                                     hookChgPartys={[changed, setChanged]} /> } 
      <Card.Body className="pt-0 pb-1 px-2">
        <Table hover className="user-table align-items-center">
            <thead>
            <tr>
              <th className="border-bottom px-1">Название</th>
              <th className="border-bottom px-1">Место</th>
              <th className="border-bottom px-1">Даты проведения</th>
              <th className="border-bottom px-1">Затраты</th>
              <th className="border-bottom px-1">Поступления</th>
              <th className="border-bottom px-1">Прибыль</th>
            </tr>
          </thead>
          <tbody>
            {mapRSet( recHdl, partys )}
          </tbody>
        </Table>
        <Card.Footer className="px-1 py-2 border-0 d-flex justify-content-start">
          <small className="fw-bold">
            Всего междусобойчиков: <b>{ lengthRSet(partys) }</b>
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};


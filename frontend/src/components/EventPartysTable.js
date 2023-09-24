
import React, { useState, useEffect } from "react"
import { Formik, Form as FormikForm, Field } from 'formik'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import {  Col, Row, Card,  Button, Table, Dropdown, 
          Modal, ButtonGroup, Container, Form } from '@themesberg/react-bootstrap'
import { useParams, generatePath, Link } from "react-router-dom"

import { Routes } from "../routes";
import {InputLine} from "./InputLine"
import { makePlainObj, mapRSet, lengthRSet, makePlainObjByIdx } from "../lib/record"
import { EventParty } from "../data/eventParty"
import { TypeEventParty } from "../data/typeEventParty"
import { InputComment } from "./InputComment"
import { EditButton } from "./EditButton"
import { getPartyID } from "../lib/partypath"
const R = require('ramda');

/*
// создать пустое событие для текущего gid
export function createEventParty(){
  const e = Event.createNull( {gid:getPartyID() })
  return { ...e, dateStartStr: "", typeEventName: "" }
}


export const readEventParty=( id )=>{
  const events = Event.listAll( getPartyID(), { ids: [id]} )
  if( R.isNil(events) || R.isEmpty(events) )
    return createEventParty()
  return events[0]
}
*/
/*
Поле для редактирования типа события междусобойчика
принимает на вход запись формата Participant.GetSchema
editMode - true если режим редактирования
typeEvents - список типов событий
*/
const InputEventTypeParty =( props )=>{
  // получить список типов событий
  const {value, typeEvents, onChange, name } = props
  const gOption = ( te )=>{
      return <option key={`type-event-${te.pkID}`} value={te.pkID}>{te.name}</option>
  }
                    
  return (
    <Form.Group as={Row} className="mb-1" controlId="eForm.evTypeName">
      <Form.Label column sm={3}>Вид</Form.Label>
        <Col sm={9}>
          <Form.Select aria-label="Default select example" name={name} value={value} onChange={onChange} >
            <option>Не выбрано</option>
            {R.map( gOption, typeEvents)}
          </Form.Select>
        </Col>
    </Form.Group>
  )
}

/* Вкладки на диалоге редактирования участников
*/
/*
function ControlledTabsParticipant( {editMode, pState } ) {
  // по-умолчанию активная вкладка общей информации об участнике
  const [key, setKey] = useState("participant");

  return (
    <Tabs
      id="controlled-tab-participant"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-1 justify-content-end"
    >
      <Tab eventKey="participant" tabClassName="py-1" title="Общее">
        <EventPartyForm editMode={editMode} pState={pState}/>
      </Tab>
      <Tab eventKey="events" tabClassName="py-1" title="Участвует">
        <ListEventOfParticipant editMode={editMode} pid={pState.id.value} />
      </Tab>
    </Tabs>
  );
}
*/


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
    EventParty.upsert(values, ()=>setChanged(!changed) )
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
                {editMode && <Field as={InputEventTypeParty} editMode={editMode} name="fkTypeEvent" typeEvents={typeEvents} />}
                <Field as={InputLine} editMode={editMode} name="price" placeholder="Стоимость" ctrlId="eForm.price" label="Стоимость" />
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
 Список событий междусобойчика
id - идентификатор события
name - название события
typeEvent - тип события
startDate - дата и время начала события
comment - к событию    
*/
export const EventsPartyTable = ( props ) => {
  // текущий идентификатор между собойчика
  const { partyID } = useParams()

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
  const [events, setEvents] = useState([])
  // список типов событий, он никогда почти не меняется
  const [typeEvents, setTypeEvents]=useState([])
  
  useEffect(() => {
    TypeEventParty.all( result=> setTypeEvents(result) )
    return ()=>{}
  },[])

  useEffect(() => {
    // получить список событий в соответствии с фильтрацией
    const filter = { searchStr : props.searchStr, pid: partyID }
    EventParty.list( filter, null, null,  result=>setEvents(result) )
    return ()=>{}
  },[props.searchStr, changed, partyID])
  
  // создать обработчик на редактирование записи
  const makeOnEditHdl = ( id )=>{
    return () => {
      EventParty.list( {ids:[id], pid: getPartyID() }, null, null, 
                     result =>setShowDlg( {showDlg:true, editRec:makePlainObjByIdx(result) } ) )
          
    }
  }

  //удалить событие по id и вызвать обновление списка  событий
  const doRemoveEvent = id =>{
    return ()=>{
      EventParty.remove( {fkParty:getPartyID(), ids:[id] }, 
                    ( result )=>{ R.isNil(result) ? alert("Произошла неизвестная ошибка") : setChanged(!changed) } , 
                    ( error )=>console.log(error.message) ) 
    }
  }

  const recHdl = ( rec, frmt  )=>{
    const pobj = makePlainObj(rec,frmt)
    return <TableRow key={`event-${pobj.pkID}`} {...pobj} />
  }

  const makeSpace = str => R.isEmpty(str) ? <pre>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</pre> : (str +"...")

  const TableRow = (props) => {
    const { pkID, name, evTypeName, description, dtStart, price } = props;
    let dt_arr = R.split(' ', dtStart )
    return (
      <tr>
        <td className="p-1">
          <span className="fw-normal">
            { name }
          </span>          
        </td>
        <td className="p-1">
            <span className="fw-normal">
              { evTypeName }
            </span>
        </td>
        <td className="p-1 text-center">
          <Container className="d-flex flex-column px-0">
            <span className="fw-normal">
                {dt_arr[0]}
            </span>
            <span className="fw-normal">
                {dt_arr[1]}
            </span>
          </Container>
        </td>
        <td className="p-1">
            <span className="fw-normal">
              { parseFloat(price).toFixed(2)}
            </span>
        </td>
        <td className="p-1">
          {/**выпадающий список */}
          <Dropdown as={ButtonGroup} >
            {/**переключатель на который нажимают */}
            <Dropdown.Toggle as={Button}  split variant="link" className="text-dark m-0 p-0" > 
                <span className="fw-normal">
                  { makeSpace(description) }
                </span>   
            </Dropdown.Toggle>
            {/** выпадающее меню из пунктов при нажатии переключателя */}
            <Dropdown.Menu>
              <Dropdown.Item onClick={ makeOnEditHdl(pkID) }>
                <FontAwesomeIcon icon={faEdit} className="me-2" /> Редактировать
              </Dropdown.Item>
              <Dropdown.Item as={Link} to={ generatePath(Routes.ConcreteEventParty.path,{ partyID: partyID, eventID: pkID}) }>
                <FontAwesomeIcon icon={faEdit} className="me-2" /> Перейти к событию
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
  if( events === undefined )
    return  <ErrorMsgAlert /> 
  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      { showDlg.showDlg && <EventPartyDlg hookShowDlg={[showDlg, setShowDlg]} 
                                          hookChgEvents={[changed, setChanged]}
                                          typeEvents={typeEvents} /> } 
      <Card.Body className="pt-0 pb-1 px-2">
        <Table hover className="user-table align-items-center" width="100%" table-layout="fixed">
          <colgroup>
            <col width="30%"/>
            <col width="10%"/>
            <col width="10%"/>
            <col width="10%"/>
            <col width="40%" overflow="hidden"/>
          </colgroup>
          <thead>
            <tr>
              <th className="border-bottom px-1">Название</th>
              <th className="border-bottom text-center px-1">Вид</th>
              <th className="border-bottom text-center px-1">Дата<br/>начала</th>
              <th className="border-bottom text-center px-1">Стоимость,<br/> руб</th>
              <th className="border-bottom px-1">Описание</th>
            </tr>
          </thead>
          <tbody>
            {mapRSet(recHdl,events)}
          </tbody>
        </Table>
        <Card.Footer className="px-1 py-2 border-0 d-flex justify-content-start">
          <small className="fw-bold">
            Всего событий: <b>{ lengthRSet(events) }</b>
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};


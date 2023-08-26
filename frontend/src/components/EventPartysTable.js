
import React, { useState, useEffect } from "react"
import { Formik, Form as FormikForm, Field } from 'formik'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import {  Col, Row, Card,  Button, Table, Dropdown, 
          Modal, ButtonGroup, Container, Form } from '@themesberg/react-bootstrap'

import {InputLine} from "./InputLine"
import { makePlainObj, mapRSet, lengthRSet, makePlainObjByIdx } from "../lib/record"
import { EventParty } from "../data/eventParty"
import { TypeEventParty } from "../data/typeEventParty"
import { InputComment } from "./InputComment"
const R = require('ramda');

// получить идентификатор текущего междусобойчика
function getCurrentGID(){
  return 1;
}

// создать пустое событие для текущего gid
export function createEventParty(){
  const e = Event.createNull( {gid:getCurrentGID() })
  return { ...e, dateStartStr: "", typeEventName: "" }
}


export const readEventParty=( id )=>{
  const events = Event.listAll( getCurrentGID(), { ids: [id]} )
  if( R.isNil(events) || R.isEmpty(events) )
    return createEventParty()
  return events[0]
}

/*
Поле для редактирования типа события междусобойчика
принимает на вход запись формата Participant.GetSchema
editMode - true если режим редактирования
typeEvents - список типов событий
*/
const InputEventTypeParty =( props )=>{
  // получить список типов событий
  const {editMode, value, typeEvents } = props
  const gOption = ( te )=>{
      return <option key={`type-event-${te.pkID}`} value={te.pkID}>{te.name}</option>
  }
  const form_select = <Form.Select aria-label="Default select example"  >
                          <option>Не выбрано</option>
                          {R.map( gOption, typeEvents)}
                      </Form.Select>
                        
  const form_input = <Form.Control type="input" value={value} readOnly />

  return (
    <Form.Group as={Row} className="mb-1" controlId="eForm.evTypeName">
      <Form.Label column sm={3}>Вид</Form.Label>
        <Col sm={9}>
        { editMode ? form_select : form_input }
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


/**
 * Форма данных участника междусобойчика
 * editMode = true - форма в режиме редактирования
 * eventRec - редактируемая запись события
 */
const EventPartyForm=({ editMode, eventRec, typeEvents })=>{
return (  
    <Formik initialValues={ {...eventRec} }>
    { (props)=>(
      <Form as={FormikForm}> 
       {/*console.log(props)*/}
        <Field as={InputLine} editMode={editMode} name="name" placeholder="Название события" ctrlId="eForm.name" label="Название" />
        <Field as={InputLine} editMode={editMode} name="dtStart" placeholder="Дата начала" ctrlId="eForm.dtStart" label="Дата начала" />
        <Field as={InputEventTypeParty} editMode={editMode} name="evTypeName" typeEvents={typeEvents} />
        <Field as={InputComment} editMode={editMode} name="description" />
      </Form>
      )
    }
    </Formik>
)
}


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
* hookEdit:
*   editMode: 
*     false - режим просмотра, без изменения данных
*     true - режим редактирования данных, в этом режиме при нажатии кнопки сохранить данные меняются
*   setEditMode - перевести в режим редактирования или снять его
*   typeEvents - список событий
*/
export const EventPartyDlg = ( { hookShowDlg, hookEdit, typeEvents } )=>{
  const [showDlg, setShowDlg] = hookShowDlg
  const [editMode, setEditMode] = hookEdit

  // обработка закрытия формы
  const handleClose = () => {
    setShowDlg( {showDlg:false, editRec:{}} )
    setEditMode(false)
  }
 
  // сохранить участника
  const saveEvent = ()=>{
    // собрать данные с формы и записать или вставить
    console.log(showDlg.editRec)
    /*
    event.startDate = parseDateTimeStr( event.dateStartStr )
    if( R.isNil( event.id ) ){
      if( !checkAlert( Event.create(event)) )
        return
    }
    else if( !checkAlert(Event.update(event)) )
        return
      */
    handleClose()
  }
 
return (
<Modal as={Modal.Dialog} show={true} onHide={handleClose} size="md" >
  <Modal.Header className="py-1" as={Row} >
    <Col sm={8}>
      <Modal.Title className="h5">Событие</Modal.Title>
    </Col>
    <Col sm={3} className="d-flex justify-content-end" >
      <Button className="border-0" variant="link" onClick={ editMode ? saveEvent : ()=>setEditMode(true) }>
        { editMode ?  "Сохранить": "Изменить" }
      </Button>
    </Col>
    <Col sm={1} className="d-flex justify-content-end" >
      <Button className="m-0 py-2" variant="close" aria-label="Close" onClick={handleClose} />
    </Col>
  </Modal.Header>
  <Modal.Body className="py-1">
    <EventPartyForm editMode={editMode} eventRec={showDlg.editRec} typeEvents={typeEvents} />
  </Modal.Body>
</Modal>
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
  // changed = true если данные событий поменялись
  const [ changed, setState ] = useState(false)
  // показывать или нет диалог просмотра участника
  /* showDlg - показать диалог редактирования, 
     editRec - редактируемая запись
  */
  const [showDlg, setShowDlg] = useState({showDlg:false, editRec:{}});
  // перевод в режим редактирования диалог просмотра события
  const [editMode, setEditMode] = useState(false);
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
    const filter = { searchStr : props.searchStr, pid: getCurrentGID() }
    EventParty.list( filter, null, null,  result=>setEvents(result) )
    return ()=>{}
  },[props.searchStr])
  
  // создать обработчик на редактирование записи
  const makeOnEditHdl = ( id )=>{
    return () => {
      EventParty.list( {ids:[id], pid: getCurrentGID() }, null, null, 
                     result =>setShowDlg( {showDlg:true, editRec:makePlainObjByIdx(result) } ) )
          
    }
  }

  //удалить событие по id и вызвать обновление списка  событий
  const doRemoveEvent = id =>{
    return ()=>{
      EventParty.remove( {fkParty:getCurrentGID(), ids:[id] }, 
                    ( result )=>{ R.isNil(result) ? alert("Произошла неизвестная ошибка") : setState(!changed) } , 
                    ( error )=>console.log(error.message) ) 
    }
  }

  const recHdl = ( rec, frmt  )=>{
    const pobj = makePlainObj(rec,frmt)
    return <TableRow key={`event-${pobj.id}`} {...pobj} />
  }

  const TableRow = (props) => {
    const { id, name, evTypeName, description, dtStart } = props;
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
        <td className="p-1">
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
            {description}
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
              <Dropdown.Item onClick={ makeOnEditHdl(id) }>
                <FontAwesomeIcon icon={faEdit} className="me-2" /> Редактировать
              </Dropdown.Item>

              <Dropdown.Item className="text-danger" onClick={doRemoveEvent(id)}>
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
                                          hookEdit={[editMode,setEditMode]}
                                          typeEvents={typeEvents} /> } 
      <Card.Body className="pt-0 pb-1 px-2">
        <Table hover className="user-table align-items-center">
            <thead>
            <tr>
              <th className="border-bottom px-1">Название</th>
              <th className="border-bottom text-center">Вид</th>
              <th className="border-bottom text-center">Дата начала</th>
              <th className="border-bottom px-1">Описание</th>
              <th className="border-bottom text-center px-1">Что?</th>
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


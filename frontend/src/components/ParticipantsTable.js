
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {  Col, Row, Card, Button, Table, Dropdown, 
          Modal, ButtonGroup, Container, Form, Tab, Tabs } from '@themesberg/react-bootstrap';
import { Formik, Form as FormikForm, Field } from 'formik'
import { useParams } from "react-router-dom";
import * as R from 'ramda'

import { ParticipantEvent } from "../data/participantevent"
import { Participant } from "../data/participant"
import { InputLine } from "./InputLine"
import { InputComment } from "./InputComment"
import { EditButton } from "./EditButton"
import { makePlainObjByIdx, mapRSet, makePlainObj, changeNullValueToEmptyStr  } from "../lib/record"

/*
Поле для редактирования роли участника
принимает на вход запись формата Participant.GetSchema
editMode - true если режим редактирования
*/
const ParticipantRole =( props )=>{
  const { value, onChange, name } = props
  return (
    <Form.Group as={Row} className="mb-1" controlId="pForm.role">
      <Form.Label column sm={3}>Роль в паре</Form.Label>
        <Col sm={9}>
          <Form.Select aria-label="Default select example" name={name} value={value} onChange={onChange} >
            <option>Не выбрано</option>
            <option value="follower">follower</option>
            <option value="leader">leader</option>
          </Form.Select>
        </Col>
    </Form.Group>
  )
}

/*
 Суммовые поля участника К оплате и Оплачено в одной строке
  _____________________________форма ___________________________
|   ________     _____________    ________     _____________    |
|  | Label  |   | Input Field |  | Label  |   | Input Field |   |
|   --------     -------------    --------     -------------    |
|                                                               |
 ---------------------------------------------------------------
 принимает на вход запись формата Participant.GetSchema
*/
const Sums =( props )=>{
  const { editMode } = props
  return (
    <Form.Group as={Row} className="mb-1" controlId="eForm.Sums">
      <Form.Label column sm={3}>К оплате</Form.Label>
        <Col sm={3}>
          <Field as={Form.Control} readOnly={!editMode} name="price" placeholder="К оплате" 
                  label="К оплате" />
        </Col>
        <Form.Label column sm={3}>Оплачено</Form.Label>
        <Col sm={3}>
          <Field as={Form.Control} readOnly={!editMode} name="paid" placeholder="Оплачено" 
                 label="Оплачено" /> 
        </Col>
    </Form.Group>
  )
}

/*
Номер и дата регистрации в одной строке на форме
 ________________форма _______________
|   ________         ________         |
|  | Label  |       | Label  |        |
|   --------         -------------    |
|  | Input Field |  | Input Field |   |
|   -------------    -------------    |
|                                     |
 -------------------------------------
 принимает на вход запись формата Participant.GetSchema
 editMode - true - элемент в режиме редактирования
*/

const NumAndRegistration =( props )=>{
  const { editMode } = props
  return (
    <Form.Group as={Row} className="mb-1" controlId="eForm.num">
      <Form.Label column sm={3}>Номер</Form.Label>
        <Col sm={2}>
          <Field as={Form.Control} readOnly={!editMode} name="num" pattern="\d*" />
        </Col>
        <Form.Label  column sm={2}>Регистр.</Form.Label>
        <Col sm={5}>
          <Field as={Form.Control} readOnly={!editMode} name="dtReg" type="datetime" />
        </Col>
    </Form.Group>
  )
}

/*
name название события
*/
const EventOfParticipant=( props ) => {
    const { editMode, id, name, price, role } = props;
    const doRemoveEventOfP=() => ParticipantEvent.remove(id)
    return (
      <tr>
        <td className="p-1">
          <Container className="d-flex flex-column px-0">
            <span className="fw-normal">
              {name}
            </span>
            <span className="fw-normal text-muted">
              {role}
            </span>
          </Container>
        </td>
        <td className="p-1">
          { /**выпадающий список */
            editMode ?
            <Dropdown as={ButtonGroup}>
              {/**переключатель на который нажимают */}
              <Dropdown.Toggle as={Button} split variant="link" className="text-dark m-0 p-0">
                <span className="fw-normal">
                  {price}
                </span>
              </Dropdown.Toggle>
              {/** выпадающее меню из пунктов при нажатии переключателя */}
                <Dropdown.Menu>
                  <Dropdown.Item onClick={()=>alert("Ok")/*(_)=>setShowDlg( {showDlg:true,currEventID:eventID} )*/}>
                    <FontAwesomeIcon icon={faEdit} className="me-2" /> Редактировать
                  </Dropdown.Item>
                  <Dropdown.Item className="text-danger" onClick={doRemoveEventOfP}>
                    <FontAwesomeIcon icon={faTrashAlt} className="me-2"  /> Удалить
                  </Dropdown.Item>
                </Dropdown.Menu> 
            </Dropdown> :   <span className="fw-normal"> {price}</span>
          }
        </td>
      </tr>
    )

}

/*
События в которых заинтересован участник
*/
const ListEventOfParticipant = ( props ) => {
  const { editMode, editRec }   = props
  const [ events, setEvents ]   = useState([])
  const [ changed, setChanged ] = useState(false)

  useEffect(() => {
    console.log("вызываю ParticipanEvent.list ")
    // получить список  событий участника
    if(  R.isNotNil(editRec.pkID) ){
      const filter = { fkParty: editRec.fkParty, fkParticipant: editRec.pkID }
      ParticipantEvent.list( filter, null, null,  result =>{ if( R.isNotNil(result) ) setEvents(result) }  )
    }
    return ()=>{}
  },[ changed,  editRec.fkParty, editRec.pkID ])

/*
  // создать обработчик на редактирование записи
  const makeOnEditHdl = id =>{
    return () => {
      ParticipantEvent.list( {ids:[id], fkParty: editRec.fkParty }, null, null, 
                     result => setShowDlg( {showDlg:true, 
                                           editRec:changeNullValueToEmptyStr(makePlainObjByIdx(result)) } ) )
    }
  }
  */

  //удалить участника по id и вызвать обновление списка
  const doRemoveByID = id =>{
    return ()=>{
      ParticipantEvent.remove( { ids:[id], fkParty: editRec.fkParty }, 
                    result => { R.isNil(result) ? alert("Произошла неизвестная ошибка") : setChanged(!changed); }, 
                    error => console.log(error.message) ) 
    }
  }

  const totalEvents = events.length ? events.length - 1 : 0

  const recHdl = ( rec, frmt  )=>{
      const pobj = makePlainObj(rec,frmt)
      return <EventOfParticipant key={`event-${pobj.pkID}`} editMode={editMode} {...pobj} />
  }

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      {/*showDlg.showDlg && <ParticipantDlg hookShowDlg={[showDlg, setShowDlg]} 
                                           hookEdit={[editMode,setEditMode]}
                                           participant={readParticipant(showDlg.currPid)} /> */} 
      <Card.Header className="p-1">
        { editMode && <Button variant="outline-primary" size="sm" onClick={()=>alert("Тут надо добавлять событие")}>+</Button> }
      </Card.Header>
      <Card.Body className="pt-0 pb-1 px-2">
        <Table hover className="user-table align-items-center">
            <thead>
            <tr>
              <th className="border-bottom px-1">Событие<br/>Роль</th>
              <th className="border-bottom px-1">Стоимость, руб</th>
            </tr>
          </thead>
          <tbody>
            {mapRSet( recHdl, events )}
          </tbody>
        </Table>
        <Card.Footer className="px-1 py-2 border-0 d-flex justify-content-start">
          <small className="fw-bold">
            Всего событий <b>{totalEvents}</b>
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
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
*     currPid - pid редактируемого участника
*   setShowDdlg - функция переводящая диалог в противоположное указанному в showDefault состояние
* hookEdit:
*   editMode: 
*     false - режим просмотра, без изменения данных
*     true - режим редактирования данных, в этом режиме при нажатии кнопки сохранить данные меняются
*   setEditMode - перевести в режим редактирования или снять его
*/
export const ParticipantDlg = ( { hookShowDlg, hookChgParticipants } )=>{
  const [showDlg, setShowDlg] = hookShowDlg
  // перевод в режим редактирования диалога просмотра события
  // false - режим просмотра, без изменения данных
  // true - режим редактирования данных, в этом режиме при нажатии кнопки сохранить данные меняются
  const initEditMode = R.isNil(showDlg.editRec.pkID)? true : false
  const [editMode, setEditMode] = useState(initEditMode)
  const [changed, setChanged] = hookChgParticipants
  // состояние для установки текущей активной вкладки
  const [key, setKey] = useState('participant')

  // обработка закрытия формы
  const handleClose = () => {
    setShowDlg( {showDlg:false, editRec:{}} )
  }
 
  // сохранить участника
  const saveEvent = ( values )=>{
    // собрать данные с формы и записать или вставить
    console.log(values)
    Participant.upsert(values, ()=>setChanged(!changed) )
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
                <Modal.Title className="h5">Карточка участника</Modal.Title>
              </Col>
              <Col sm={3} className="d-flex justify-content-end" >
                <EditButton hookEdit={[editMode, setEditMode]} onSubmit={props.handleSubmit}/>
              </Col>
              <Col sm={1} className="d-flex justify-content-end" >
                <Button className="m-0 py-2" variant="close" aria-label="Close" onClick={handleClose} />
              </Col>
            </Modal.Header>
            <Modal.Body className="py-1">
              <Tabs id="controlled-tab-participant" activeKey={key}
                    onSelect={ k => setKey(k) } className="mb-1 justify-content-end">
                <Tab eventKey="participant" tabClassName="py-1" title="Общее">
                  <NumAndRegistration editMode={editMode} />
                  <Field as={InputLine} editMode={editMode} name="surname" placeholder="Фамилия участника" ctrlId="eForm.surname" label="Фамилия" />
                  <Field as={InputLine} editMode={editMode} name="name" placeholder="Имя участника" ctrlId="eForm.name" label="Имя" />
                  <Field as={InputLine} editMode={editMode} name="patronymic" placeholder="Отчество участника" ctrlId="eForm.patronymic" label="Отчество" />
                  <Field as={InputLine} editMode={editMode} name="club" placeholder="Клуб участника" ctrlId="eForm.club" label="Клуб" />
                  <Field as={InputLine} editMode={editMode} name="phone" placeholder="Телефон участника" ctrlId="eForm.phone" label="Телефон" />
                  <Field as={InputLine} editMode={editMode} name="email" placeholder="email участника" ctrlId="eForm.email" label="email" />
                  { !editMode && <Field as={InputLine} editMode={editMode} name="role" placeholder="Роль участника" ctrlId="eForm.role" label="Роль в паре" /> }
                  { editMode && <Field as={ParticipantRole} editMode={editMode} name="role" /> }
                  <Sums editMode={editMode} ctrlId="eForm.sums"/>
                  <Field as={InputComment} editMode={editMode} name="comment" />
                </Tab>
                <Tab eventKey="events" tabClassName="py-1" title="Участвует">
                  <ListEventOfParticipant { ... showDlg } />
                </Tab>
              </Tabs>
            </Modal.Body>
          </Modal>
        </Form>
      )}     
    </Formik>

    )

}

/*
Получение списка участников
Номер(pid), Фамилия(surname), Отчество(patronymic), Имя(name), Телефон(phone), email,
regDate - дата и время регистрации,
role - роль в паре "leader" | "follower"
club - клуб
price - сумма оплаты, paid - оплачено
состояние оплаты(status) - success - полностью оплачено, 
*/
export const ParticipantTable = ( props ) => {
  const { partyID } = useParams()
  console.log("перерисовываю participantы table partyID=" + partyID)

  // changed = true если данные участников поменялись
  const [ changed, setChanged ] = useState(false)
  // показывать или нет диалог просмотра участника
  /* showDlg - показать диалог редактирования, 
     editRec - редактируемая запись
  */
  const [showDlg, setShowDlg] = props.hookShowDlg
  // список участников, если participants === undefined, то произошла ошибка
  const [participants, setParticipants] = useState([])

  useEffect(() => {
    //console.log("вызываю Participant.lisе с partyID=" + partyID)

    // получить список  участников в соответствии с фильтрацией
    const filter = { searchStr : props.searchStr, fkParty: partyID }
    Participant.list( filter, null, null,  result=>setParticipants(result) )
    return ()=>{}
  },[props.searchStr, changed, partyID  ])
  
  // создать обработчик на редактирование записи
  const makeOnEditHdl = ( id )=>{
    return () => {
      Participant.list( {ids:[id], fkParty: partyID }, null, null, 
                     result =>setShowDlg( {showDlg:true, 
                                           editRec:changeNullValueToEmptyStr(makePlainObjByIdx(result)) } ) )
    }
  }

  //удалить участника по id и вызвать обновление списка
  const doRemoveByID = id =>{
    return ()=>{
      Participant.remove( { ids:[id], fkParty: partyID }, 
                    ( result )=>{ R.isNil(result) ? alert("Произошла неизвестная ошибка") : setChanged(!changed); }, 
                    ( error )=>console.log(error.message) ) 
    }
  }

  const totalParticipants = participants.length - 1

  const recHdl = ( rec, frmt  )=>{
      const pobj = makePlainObj(rec,frmt)
      return <TableRow key={`participant-${pobj.pkID}`} {...pobj} />
  }

  const TableRow = (props) => {
    const { pkID, num, surname, patronymic, name, club, dtReg, role, phone, email, price, paid } = props;
    //console.log( "Table row dtReg="+dtReg)
    let dt_arr = R.split(' ', dtReg )
    const rest = Math.abs(price - paid);
    const statusVariant = rest < 0.01 ? "success"
        : ( rest === price  ?  "danger" : "warning" );
    return (
      <tr>
        <td className="p-1">
          <span className="fw-normal">
            { num }
          </span>          
        </td>
        <td className="p-1">
          <Container className="d-flex flex-column px-0">
            <span className="fw-normal">
              { surname + " " + name + " " + patronymic }
            </span>
            <span className="fw-normal text-muted">
              {club}
            </span>
          </Container>
        </td>
        <td className="p-1">
          <Container className="d-flex flex-column px-0">
            <span className="fw-normal">
              {phone}
            </span>
            <span className="fw-normal">
              {email}
            </span>
          </Container>
        </td>
        <td className="p-1">
          <span className="fw-normal">
            {role}
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
{/*
        <td className="p-1">
          <Container className="d-flex flex-column px-0">
            <span className="fw-normal">
              ${parseFloat(price).toFixed(2)}
            </span>
            <span className={`fw-normal text-${statusVariant}`}>
              {paid}
            </span>
          </Container>
        </td>
*/}
        <td className="p-1">
          {/**выпадающий список */}
          <Dropdown as={ButtonGroup} >
            {/**переключатель на который нажимают */}
            <Dropdown.Toggle as={Button}  split variant="link" className="text-dark m-0 p-0" > 
              <Container className="d-flex flex-column px-0">
                <span className="fw-normal">
                  {parseFloat(price).toFixed(2)}
                </span>
                <span className={`fw-normal text-${statusVariant} text-left`}>
                  {parseFloat(paid).toFixed(2)}
                </span>
              </Container>
            </Dropdown.Toggle>
            {/** выпадающее меню из пунктов при нажатии переключателя */}
            <Dropdown.Menu>
    {/*
              <Dropdown.Item>
                <FontAwesomeIcon icon={faEye} className="me-2" /> View Details
              </Dropdown.Item>
    */}
              <Dropdown.Item onClick={ makeOnEditHdl(pkID) }>
                <FontAwesomeIcon icon={faEdit} className="me-2" /> Редактировать
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

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      {showDlg.showDlg && <ParticipantDlg hookShowDlg={[showDlg, setShowDlg]}
                                          hookChgParticipants={[changed, setChanged]} /> }
      <Card.Body className="pt-0 pb-1 px-2">
        <Table hover className="user-table align-items-center">
            <thead>
            <tr>
              <th className="border-bottom px-1">Номер</th>
              <th className="border-bottom text-center">ФИО<br/>Kлуб</th>
              <th className="border-bottom text-center">Телефон<br/>email</th>
              <th className="border-bottom px-1">Роль<br/>в паре</th>
              <th className="border-bottom text-center px-1">Дата<br/>регистрации</th>
             {/* <th className="border-bottom px-1">К оплате<br/>Оплачено, руб</th>*/}
              <th className="border-bottom px-1">К оплате<br/>Оплачено, руб</th>
            </tr>
          </thead>
          <tbody>
            {mapRSet( recHdl, participants )}
          </tbody>
        </Table>
        <Card.Footer className="px-1 py-2 border-0 d-flex justify-content-start">
          <small className="fw-bold">
            Всего участников <b>{totalParticipants}</b>
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};

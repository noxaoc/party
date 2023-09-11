
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {  Col, Row, Card, Button, Table, Dropdown, 
          Modal, ButtonGroup, Container, Form, Tab, Tabs } from '@themesberg/react-bootstrap';
          import { Formik, Form as FormikForm, Field } from 'formik'


import { ParticipantEvent } from "../data/participants";
import { Participant } from "../data/participant";
import {InputLine} from "./InputLine"
import { InputComment } from "./InputComment"
import { EditButton } from "./EditButton"


import { makePlainObjByIdx, mapRSet, makePlainObj, changeNullValueToEmptyStr  } from "../lib/record"
import { useParams } from "react-router-dom";
//import { placeholder } from "@babel/types";
//import { N } from "ts-toolbelt";
const R = require('ramda');


export const readParticipant=( )=>{
  console.log("readPart")
  alert('код для чтения участников не написан')
  /*
  let p = Participant.read(getPartyID(), pid )
  if( R.isNil(p) )
    return createParticipant()
  return calcExtFldParticipant(p) 
  */
}

/*
Поле ввода данных на форме LLFIFld ( Label Left From Input Field )вида:  
 ______________форма _____________
|   ________     _____________    |
|  | Label  |   | Input Field |   |
|   --------     -------------    |
|  | Label  |   | Input Field |   |
|   --------     -------------    |
|                                 |
 ---------------------------------
ctrlId - уникальный идентификатор поля ввод
label - заголовок поля ввода
type - html тип поля ввода
value - значение поля ввода
placehiledr - подсказка в поле ввода
*/
const LLFIFld = ( { ctrlId, editMode, type, label, value, placeholder, onChange } )=>{
  const type_elem = R.isNil(type) ? "input" : type;
  return (
    <Form.Group as={Row} className="mb-1" controlId={ctrlId}>
      <Form.Label column sm={3}>{label}</Form.Label>
      <Col sm={9}>
        <Form.Control type={type_elem} value={value} 
                  placeholder={placeholder} readOnly={!editMode} onChange={onChange}/>
{/*}
        <Form.Control type={type_elem} defaultValue={value} 
                  placeholder={placeholder} readOnly={!editMode}  onChange={onChange}/>
  */}
      </Col>
    </Form.Group>
  )
}

/*
Поле для редактирования роли участника
принимает на вход запись формата Participant.GetSchema
editMode - true если режим редактирования
*/
const ParticipantRole =( props )=>{
  const {value, onChange, name } = props
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
const Sums =( { pState} )=>{
  return (
    <Form.Group as={Row} className="mb-1" controlId="ParticipantForm.Sums">
    <Field as={InputLine} editMode={editMode} name="club" placeholder="Клуб участника" ctrlId="eForm.club" label="Клуб" />

        <Form.Label column sm={3}>К оплате</Form.Label>
        <Col sm={3}>
          <Form.Control type="input" {...pState.price} readOnly />
        </Col>
        <Form.Label column sm={3}>Оплачено</Form.Label>
        <Col sm={3}>
          <Form.Control type="input" {...pState.paid} readOnly />
        </Col>
    </Form.Group>
  )
}

*/

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

const NumAndRegistration =( { editMode, pState } )=>{
  return (
    <Form.Group as={Row} className="mb-1" controlId="ParticipantForm.Num">
      <Form.Label column sm={3}>Номер</Form.Label>
        <Col sm={2}>
          <Form.Control type="input" {...pState.num} readOnly={!editMode} pattern="\d*" />
        </Col>
        <Form.Label  column sm={2}>Регистр.</Form.Label>
        <Col sm={5}>
          <Form.Control type="datetime" {...pState.regDateStr}  readOnly={!editMode} />
        </Col>
    </Form.Group>
  )
}


/* Вкладки на диалоге редактирования участников
*/
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
        <ParticipantForm editMode={editMode} pState={pState}/>
      </Tab>
      <Tab eventKey="events" tabClassName="py-1" title="Участвует">
        <ListEventOfParticipant editMode={editMode} pid={pState.pid.value} />
      </Tab>
    </Tabs>
  );
}
/*
name название события
*/
const EventOfParticipant=( props )=>{
    const { editMode, id, name, price, role } = props;
    const doRemoveEventOfP=()=> ParticipantEvent.remove(id)
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
const ListEventOfParticipant=( props )=>{
  const { editMode, pid } = props
  const events = []//Participant.events( getPartyID(), pid )
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
            {events.map(t => <EventOfParticipant key={`event-${t.id}`} editMode={editMode} {...t} />)}
          </tbody>
        </Table>
        <Card.Footer className="px-1 py-2 border-0 d-flex justify-content-start">
          <small className="fw-bold">
            Всего событий <b>{0}</b>
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  )
}

/**
 * Форма данных участника междусобойчика
 * editMode = true - форма в режиме редактирования
 * curPid - идентификатор текущей записи, может быть null 
 */
const ParticipantForm=({ editMode, pState })=>{
  const data = [ ["pForm.surname", "input", "Фамилия", "Фамилия участника", pState.surname ],
                 ["pForm.name","input","Имя","Имя участника", pState.name ],
                 ["pForm.patronymic","input","Отчество","Отчество участника", pState.patronymic ],
                 ["pForm.club","input","Клуб","Клуб участника", pState.club ],
                 ["pForm.phone","tel","Телефон","Телефон участника", pState.phone ],
                 ["pForm.email","email","email","email участника", pState.email ],
               ]
/*
  return (
      <Form>
        <Form.Group as={Row} >
          <Col sm={7}>
            <NumAndRegistration editMode={editMode} pState={pState} />
            { data.map( arr => { return ( <LLFIFld editMode={editMode} key={arr[0]} ctrlId={arr[0]} type={arr[1]} 
                                          label={arr[2]} placeholder={arr[3]} {...arr[4]} />) }  ) }
          
            <ParticipantRole  editMode={editMode} pState={pState} />
            <Sums pState={pState}/>
            <Form.Group className="mb-2" controlId="pForm.comment">
              <Form.Control as="textarea" rows={3} placeholder="Комментарий" 
              {...pState.comment} readOnly={!editMode} />
            </Form.Group>
          </Col>
          <Col sm={5}>
            <ListEventOfParticipant pid={pState.pid.value} />
          </Col>
        </Form.Group>
      </Form>
  )
*/


  return (
    <Form>
      <NumAndRegistration editMode={editMode} pState={pState} />
      { data.map( arr => { return ( <LLFIFld editMode={editMode} key={arr[0]} ctrlId={arr[0]} type={arr[1]} 
                                     label={arr[2]} placeholder={arr[3]} {...arr[4]} />) }  ) }
    
      <ParticipantRole  editMode={editMode} pState={pState} />
      <Sums pState={pState}/>
      <Form.Group className="mb-2" controlId="pForm.comment">
        <Form.Control as="textarea" rows={3} placeholder="Комментарий" 
        {...pState.comment} readOnly={!editMode} />
      </Form.Group>
    </Form>
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
            </Modal.Body>
          </Modal>
        </Form>
      )}     
    </Formik>

    )

}
/*
export const ParticipantDlg = ( { hookShowDlg, hookEdit, participant } )=>{
  const [, setShowDlg] = hookShowDlg
  const [editMode, setEditMode] = hookEdit
 
  //console.log(`pid= ${showDlg.currPid} showDlg= ${showDlg.showDlg}`)
 // let participant = Participant.read(getPartyID(), showDlg.currPid )
  //if( R.isNil(participant ) )
  //  participant = Participant.createNull({gid:getPartyID()})
  const pState = useObjInput(participant)
  console.log("render participantdlg")

  // обработка закрытия формы
  const handleClose = () => {
    setShowDlg( {showDlg:false,currPid:null} )
    setEditMode(false)
  }
 
  // сохранить участника
  const saveParticipant = ()=>{
    // собрать данные с формы и записать
    // console.log(participant.name)
    participant.regDate = parseDateTimeStr( participant.regDateStr )
    if( R.isNil( participant.pid ) ){
      if( !checkAlert( Participant.create(participant)) )
        return
    }
    else if( !checkAlert(Participant.update(participant)) )
        return
    handleClose()
  }
 
return (
<Modal as={Modal.Dialog} show={true} onHide={handleClose} size="md" >
  <Modal.Header className="py-1" as={Row} >
    <Col sm={8}>
      <Modal.Title className="h5">Карточка участника</Modal.Title>
    </Col>
    <Col sm={3} className="d-flex justify-content-end" >
      <Button className="border-0" variant="link" onClick={ editMode ? saveParticipant : ()=>setEditMode(true) }>
        { editMode ?  "Сохранить": "Изменить" }
      </Button>
    </Col>
    <Col sm={1} className="d-flex justify-content-end" >
      <Button className="m-0 py-2" variant="close" aria-label="Close" onClick={handleClose} />
    </Col>
  </Modal.Header>
  <Modal.Body className="py-1">
    <ControlledTabsParticipant  editMode={editMode} pState={pState} />
    {/*<ParticipantForm editMode={editMode} pState={pState}/>*
  </Modal.Body>
</Modal>
)

}
*/

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


  /*
  // changed = true если данные участников поменялись
  const [ changed, setState ] = useState(false)
  // показывать или нет диалог просмотра участника
  // showDlg - показать диалог редактирования, currPid - pid участника для редактирования
  const [showDlg, setShowDlg] = useState({showDlg:false,currPid:null});
  // перевод в режим редактирования диалог просмотра участника
  const [editMode, setEditMode] = useState(false);
  // получить список участников в соответствии с фильтрацией
  const filter = { searchStr : props.searchStr }
  const participants = Participant.listMain(getPartyID(), filter)
  */
  const totalParticipants = participants.length

/*
  //удалить участника по pid и вызвать обновление списка участников
  const doRemoveParticipant = (pid)=>{
    return (_)=>{
      Participant.remove(getPartyID(),pid);
      setState(!changed);
    }
  }
*/
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

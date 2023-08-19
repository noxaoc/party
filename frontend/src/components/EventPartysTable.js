
import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import {  Col, Row, Card,  Button, Table, Dropdown, 
          Modal, ButtonGroup, Container, Form } from '@themesberg/react-bootstrap'
import { makePlainObj, mapRSet } from "../lib/record"
import { Event, TypeEvent, parseDateTimeStr } from "../data/participants"
import { EventParty } from "../data/eventParty"
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

/* выводить alert - сообщение если val является null
   если сообщение выведено, то возвращается false
*/
function checkAlert( [val, errMsg ] ){
  if( R.isNil(val) ){
    alert(errMsg)
    return false
  }
  return true
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
Поле для редактирования типа события
принимает на вход запись формата Participant.GetSchema
editMode - true если режим редактирования
*/
const CTypeEvent =( {editMode, pState } )=>{
    const typeEvents = TypeEvent.list()
    const gOption = ( te )=>{
        return <option key={`type-event-${te.id}`} value={te.id}>{te.name}</option>
    }
    const form_select = <Form.Select aria-label="Default select example" {...pState.id} >
                            <option>Не выбрано</option>
                            {R.map( gOption, typeEvents)}
                        </Form.Select>
                          
    const form_input = <Form.Control type="input" {...pState.typeEventName} readOnly />
  
    return (
      <Form.Group as={Row} className="mb-1" controlId="eForm.typeEvent">
        <Form.Label column sm={3}>Вид</Form.Label>
          <Col sm={9}>
          { editMode ? form_select : form_input }
          </Col>
      </Form.Group>
    )
  }


/* 
Пользовательский хук для связи списка элементов ключ:значение передаваемых в объекте initialValue 
возвращает новый объект в котором каждое свойство, это свойство из объекта initialValue, а значение
это объект состоящий из значения в которое помещается значение из поля ввода и функции обработчика
помещающей это значение из поля ввода при какждом изменение в поле ввода
возвращает  { initiaValue.key: {value, onChange}, }
в onChange одновременно копируется новое значение в объект initvalue
*/
const useObjInput = initialValue => {
  const useMakeState = ( val, key ) => {
    const [value, setValue] = useState(val)
    return { value, onChange: e => { 
      switch( typeof(val) ){
         case "number": 
            const tmpInt =  parseInt(e.target.value)
            initialValue[key] = tmpInt 
            setValue(tmpInt)
            break
            /*
         case "bigint": 
            const tmp =  parseBigInt(e.target.value)
            initialValue[key] = tmp 
            setValue(tmp)
            break
         case "boolean": 
            const tmpFloat =  parseFloat(e.target.value)
            initialValue[key] = tmpFloat
            setValue(tmpFloat)
            break*/
         default:
            initialValue[key] = e.target.value
            setValue(e.target.value)
            break

      } 
      //if( key === 'num')
      //  console.log( `num in onChange=${initialValue[key]} type_num=${typeof(initialValue[key])}` ) 
    } }
  }
  return R.mapObjIndexed( useMakeState, initialValue ) //=> { initiaValue.key: {value, onChange}, }
}

/*

Есть запись данных recData
Есть редактируемая запись на форме recForm

1.При сохранении формы данные из recForm преобразуются и  копиируются в recData и отправляются на сохранение 
2.При изменении полей на форме данные из  поля recForm преобразуются и копируются в одно или несколько полей recData. 
  При сохранении формы recData отправляется на сохранение

Мне 1 больше нравиться т.к меньше преобразований на изменение поля

Итого:
Инициализация
recData = read()
recForm = createRecEdit( recData )
makeUseInput
Сохранение
newRecData = createRecData(recForm)
update(newRecData)

Record{frmt: <frmt>, data:  }
RecordSet{ frmt : frmt,  value: [value][value] }
class RecFld{
    constructor(frmt,data){
        this._frmt = frmt
        this._data = data
    }
    data(){return this._data}
    frmt(){return this._frmt}
    toString(){ return this._frmt.toString(this._data)}
}

function makeRecord( scheme ){
  
    return { name, RecFld }
}



function createRecEdit( initRec, flds ){
    const recForm = { id: initRec.id.data }
    const createEditVal( value, name )=>{
        if( R.includes( name, flds ) ){
            recForm[name] = value.toString()
        }
    }
    R.forEachObjIndexed(createEditVal, initRec ); 

}


function makeOnChangeHdl( initialRec, val, key, frmt, setValue )
{
    if(frmt.type() === "number")
    {
        if( frmt.format() === "datetime")
            return ( e ) => {
                const dt = parseDateTimeStr( e.target.value )
                initialRec[key] = dt
                setValue(tmpInt)   
            }
        return ( e )=>{
            const tmpInt =  parseInt(e.target.value)
            initialRec[key] = tmpInt 
            setValue(tmpInt)
        }
    }
    else if( frmt.type() === "string" ){

    }
}

const useObjInput2 = ( initialRec ) => {
    const frmt = initialRec.format()

    const useMakeState = ( val, key ) => {
      if( key === "_frmt" )
        return
      const [value, setValue] = useState(val)

      return { value, onChange: e => { 
        switch( frmt.type()){
           case "number": 
              if( frmt.format() === "datime")

              else
                const tmpInt =  parseInt(e.target.value)
              initialValue[key] = tmpInt 
              setValue(tmpInt)
              break
          case "string":
               if( frmt.format() === "datetime" )
               dateTimeToStr()
             
           default:
              initialValue[key] = e.target.value
              setValue(e.target.value)
              break
  
        } 
        //if( key === 'num')
        //  console.log( `num in onChange=${initialValue[key]} type_num=${typeof(initialValue[key])}` ) 
      } }
    }
    return R.mapObjIndexed( useMakeState, initialValue ) //=> { initiaValue.key: {value, onChange}, }

    return R.mapObjIndexed( useMakeState, initialValue ) //=> { initiaValue.key: {value, onChange}, }
  }
  
*/

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
 * curPid - идентификатор текущей записи, может быть null 
 */
const EventPartyForm=({ editMode, pState })=>{
  const data = [ ["eForm.name", "input", "Название", "Название события", pState.name ],
                 //["eForm.typeEventName","input","Вид","Вид события", pState.typeEventName ],
                 ["eForm.dateStartStr","input","Дата начала","Дата начала", pState.dateStartStr ],
               ]
  return (
    <Form>
      { data.map( arr => { return ( <LLFIFld editMode={editMode} key={arr[0]} ctrlId={arr[0]} type={arr[1]} 
                                     label={arr[2]} placeholder={arr[3]} {...arr[4]} />) }  ) }
      <CTypeEvent editMode={editMode} pState={pState} />                   
      <Form.Group className="mb-2" controlId="eForm.comment">
        <Form.Control as="textarea" rows={3} placeholder="Комментарий" 
        {...pState.description} readOnly={!editMode} />
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
export const EventPartyDlg = ( { hookShowDlg, hookEdit, event } )=>{
  const [, setShowDlg] = hookShowDlg
  const [editMode, setEditMode] = hookEdit
  const pState = useObjInput(event)

  // обработка закрытия формы
  const handleClose = () => {
    setShowDlg( {showDlg:false,currID:null} )
    setEditMode(false)
  }
 
  // сохранить участника
  const saveEvent = ()=>{
    // собрать данные с формы и записать
    // console.log(participant.name)
    event.startDate = parseDateTimeStr( event.dateStartStr )
    if( R.isNil( event.id ) ){
      if( !checkAlert( Event.create(event)) )
        return
    }
    else if( !checkAlert(Event.update(event)) )
        return
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
    {/*<ControlledTabsEventParty  editMode={editMode} pState={pState} />*/}
    <EventPartyForm editMode={editMode} pState={pState} />
  </Modal.Body>
</Modal>
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
  // showDlg - показать диалог редактирования, currID - id события для редактирования
  const [showDlg, setShowDlg] = useState({showDlg:false,currID:null});
  // перевод в режим редактирования диалог просмотра события
  const [editMode, setEditMode] = useState(false);
  // список событий
  const [events, setEvents] = useState([])

  // получить список событий в соответствии с фильтрацией
  const filter = { searchStr : props.searchStr, pid: getCurrentGID() }
  //const events = Event.listAll(getCurrentGID(), filter)
  //const totalEvents = events.length

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    EventParty.list( filter, null, null, ( result )=>setEvents(result), (error)=>console.log("Какая то ошибка!") )
  }, [filter])

  //удалить событие по id и вызвать обновление списка  событий
  const doRemoveEvent = (id)=>{
    return (_)=>{
      Event.remove(getCurrentGID(),id);
      setState(!changed);
    }
  }

  const recHdl = ( rec, frmt  )=>{
    const pobj = makePlainObj(rec,frmt)
    return <TableRow key={`event-${pobj.id}`} {...pobj} />
  }

  const TableRow = (props) => {
   // const { id, name, typeEvent, typeEventName, startDate, dateStartStr, description } = props;
   const { id, name, evTypeName, description, dtStart,  } = props;

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
                   Что?
                </span>   
            </Dropdown.Toggle>
            {/** выпадающее меню из пунктов при нажатии переключателя */}
            <Dropdown.Menu>
              <Dropdown.Item onClick={(_)=>setShowDlg( {showDlg:true,currID:id} )}>
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

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      { showDlg.showDlg && <EventPartyDlg hookShowDlg={[showDlg, setShowDlg]} 
                                           hookEdit={[editMode,setEditMode]}
                                           event={readEventParty(showDlg.currID)} /> } 
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
            {/*events.map(t => <TableRow key={`event-${t.id}`} {...t} />)*/}
            {mapRSet(recHdl,events)}
          </tbody>
        </Table>
        <Card.Footer className="px-1 py-2 border-0 d-flex justify-content-start">
          <small className="fw-bold">
            Всего событий <b>{ R.empty(events) ? 0 : (R.length(events) - 1) }</b>
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};



import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faArrowDown, faArrowUp, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {  Col, Row, Card, Image, Button, Table, Dropdown, ProgressBar,
          Modal, ButtonGroup, Container, Form, Tab, Tabs } from '@themesberg/react-bootstrap';

//import { Routes } from "../routes";
import { pageVisits, pageTraffic, pageRanking } from "../data/tables";
//import participants from "../data/participants";
import { ParticipantEvent } from "../data/participants";
import { Participant } from "../data/participant";

import { makePlainObjByIdx, mapRSet, makePlainObj, changeNullValueToEmptyStr  } from "../lib/record"
import { useParams } from "react-router-dom";
//import { placeholder } from "@babel/types";
//import { N } from "ts-toolbelt";
const R = require('ramda');

/*
// получить идентификатор текущего междусобойчика
function getPartyID(){
  return 1;
}
*/
 /* формат DD.MM.YY HH:MM:SS
  */
 const parseDateTimeStr=( datetimeStr )=>{
  // преобразуем строку в формат DD.MM.YYHH:MM:SS
  const dtStr = R.replace( ' ', '', R.trim(datetimeStr) )
  const day = parseInt(dtStr.slice(0,2))
  const month = parseInt(dtStr.slice(3,5)) - 1
  const year = parseInt(dtStr.slice(6,8)) + 2000
  const hour = parseInt(dtStr.slice(8,10))
  const minute = parseInt(dtStr.slice(11,13))
  const second = parseInt(dtStr.slice(14,16))
 return new Date(year, month, day, hour, minute, second )
}

const dateTimeToStr=( dt )=>{
  // преобразуем дату в формат DD.MM.YY HH:MM:SS
  // никаких проверко на то что год < 2000 или 3000 не проверяется
  const day = dt.getDate()
  const month = dt.getMonth() + 1
  const year = dt.getFullYear() - 2000
  const hour = dt.getHours()
  const minute = dt.getMinutes()
  const second = dt.getSeconds()
  return `${day<10?0:''}${day}.${month<10?0:''}${month}.${year<10?0:''}${year} ${hour<10?0:''}${hour}:${minute<10?0:''}${minute}:${second<10?0:''}${second}`
}

// вычислить дополнительные поля участника
function calcExtFldParticipant( participant ){
  return R.mergeDeepLeft( participant, { regDateStr: dateTimeToStr(participant.regDate) } )
}

/*
// создать пустого участника для текущего gid
export function createParticipant(){
  console.log("createPart")

  const p = Participant.createNull( {gid:getPartyID() }  )
  return calcExtFldParticipant(p)
}
*/

export const readParticipant=( pid )=>{
  console.log("readPart")
  alert('код для чтения участников не написан')
  /*
  let p = Participant.read(getPartyID(), pid )
  if( R.isNil(p) )
    return createParticipant()
  return calcExtFldParticipant(p) 
  */
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

const ValueChange = ({ value, suffix }) => {
  const valueIcon = value < 0 ? faAngleDown : faAngleUp;
  const valueTxtColor = value < 0 ? "text-danger" : "text-success";

  return (
    value ? <span className={valueTxtColor}>
      <FontAwesomeIcon icon={valueIcon} />
      <span className="fw-bold ms-1">
        {Math.abs(value)}{suffix}
      </span>
    </span> : "--"
  );
};

export const PageVisitsTable = () => {
  const TableRow = (props) => {
    const { pageName, views, returnValue, bounceRate } = props;
    const bounceIcon = bounceRate < 0 ? faArrowDown : faArrowUp;
    const bounceTxtColor = bounceRate < 0 ? "text-danger" : "text-success";

    return (
      <tr>
        <th scope="row">{pageName}</th>
        <td>{views}</td>
        <td>${returnValue}</td>
        <td>
          <FontAwesomeIcon icon={bounceIcon} className={`${bounceTxtColor} me-3`} />
          {Math.abs(bounceRate)}%
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5>Page visits</h5>
          </Col>
          <Col className="text-end">
            <Button variant="secondary" size="sm">See all</Button>
          </Col>
        </Row>
      </Card.Header>
      <Table responsive className="align-items-center table-flush">
        <thead className="thead-light">
          <tr>
            <th scope="col">Page name</th>
            <th scope="col">Page Views</th>
            <th scope="col">Page Value</th>
            <th scope="col">Bounce rate</th>
          </tr>
        </thead>
        <tbody>
          {pageVisits.map(pv => <TableRow key={`page-visit-${pv.id}`} {...pv} />)}
        </tbody>
      </Table>
    </Card>
  );
};

export const PageTrafficTable = () => {
  const TableRow = (props) => {
    const { id, source, sourceIcon, sourceIconColor, sourceType, category, rank, trafficShare, change } = props;

    return (
      <tr>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">{id}</Card.Link>
        </td>
        <td className="fw-bold">
          <FontAwesomeIcon icon={sourceIcon} className={`icon icon-xs text-${sourceIconColor} w-30`} />
          {source}
        </td>
        <td>{sourceType}</td>
        <td>{category ? category : "--"}</td>
        <td>{rank ? rank : "--"}</td>
        <td>
          <Row className="d-flex align-items-center">
            <Col xs={12} xl={2} className="px-0">
              <small className="fw-bold">{trafficShare}%</small>
            </Col>
            <Col xs={12} xl={10} className="px-0 px-xl-1">
              <ProgressBar variant="primary" className="progress-lg mb-0" now={trafficShare} min={0} max={100} />
            </Col>
          </Row>
        </td>
        <td>
          <ValueChange value={change} suffix="%" />
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm mb-4">
      <Card.Body className="pb-0">
        <Table responsive className="table-centered table-nowrap rounded mb-0">
          <thead className="thead-light">
            <tr>
              <th className="border-0">#</th>
              <th className="border-0">Traffic Source</th>
              <th className="border-0">Source Type</th>
              <th className="border-0">Category</th>
              <th className="border-0">Global Rank</th>
              <th className="border-0">Traffic Share</th>
              <th className="border-0">Change</th>
            </tr>
          </thead>
          <tbody>
            {pageTraffic.map(pt => <TableRow key={`page-traffic-${pt.id}`} {...pt} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export const RankingTable = () => {
  const TableRow = (props) => {
    const { country, countryImage, overallRank, overallRankChange, travelRank, travelRankChange, widgetsRank, widgetsRankChange } = props;

    return (
      <tr>
        <td className="border-0">
          <Card.Link href="#" className="d-flex align-items-center">
            <Image src={countryImage} className="image-small rounded-circle me-2" />
            <div><span className="h6">{country}</span></div>
          </Card.Link>
        </td>
        <td className="fw-bold border-0">
          {overallRank ? overallRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={overallRankChange} />
        </td>
        <td className="fw-bold border-0">
          {travelRank ? travelRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={travelRankChange} />
        </td>
        <td className="fw-bold border-0">
          {widgetsRank ? widgetsRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={widgetsRankChange} />
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Body className="pb-0">
        <Table responsive className="table-centered table-nowrap rounded mb-0">
          <thead className="thead-light">
            <tr>
              <th className="border-0">Country</th>
              <th className="border-0">All</th>
              <th className="border-0">All Change</th>
              <th className="border-0">Travel & Local</th>
              <th className="border-0">Travel & Local Change</th>
              <th className="border-0">Widgets</th>
              <th className="border-0">Widgets Change</th>
            </tr>
          </thead>
          <tbody>
            {pageRanking.map(r => <TableRow key={`ranking-${r.id}`} {...r} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

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
const ParticipantRole =( {editMode, pState } )=>{
  const form_select = <Form.Select aria-label="Default select example" {...pState.role} >
                          <option>Не выбрано</option>
                          <option value="follower">follower</option>
                          <option value="leader">leader</option>
                      </Form.Select>
                        
  const form_input = <Form.Control type="input" {...pState.role} readOnly />

  return (
    <Form.Group as={Row} className="mb-1" controlId="pForm.role">
      <Form.Label column sm={3}>Роль в паре</Form.Label>
        <Col sm={9}>
        { editMode ? form_select : form_input }
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
const Sums =( { pState} )=>{
  return (
    <Form.Group as={Row} className="mb-1" controlId="ParticipantForm.Sums">
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
function TabsExample() {
  return (
    <Nav variant="tabs" defaultActiveKey="/home">
      <Nav.Item>
        <Nav.Link href="/home">Active</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-1">Option 2</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="disabled" disabled>
          Disabled
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
*/

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
    {/*<ParticipantForm editMode={editMode} pState={pState}/>*/}
  </Modal.Body>
</Modal>
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
  console.log("перерисовываю participantы table")

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
    console.log("вызываю Participant.lisе с partyID=" + partyID)

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

  //удалить междусобойчик по id и вызвать обновление списка  междусобойчиков
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
      {/* showDlg.showDlg && <ParticipantDlg hookShowDlg={[showDlg, setShowDlg]} 
                                           hookEdit={[editMode,setEditMode]}
  participant={readParticipant(showDlg.currPid)} /> */} 
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

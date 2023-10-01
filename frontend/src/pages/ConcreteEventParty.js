/*
Страница междусобойчика путь к ней /:partyID/event/:eventID
*/


import React, {useState,useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCog, faEdit, faTrashAlt  } from '@fortawesome/free-solid-svg-icons'
import { Button, ButtonGroup, Dropdown, Tab, Tabs, Card, Table, Container,
         Row, Col, Form } from '@themesberg/react-bootstrap'
import { useParams } from "react-router-dom";
import { Formik, Field, Form as FormikForm} from "formik";
import * as R from 'ramda'

import { StageEventParty } from "../data/stageEventParty"
import { TotalTaskStage } from "../data/totalTaskStage"
import { TaskStageEvent } from "../data/taskStageEvent"
import { makePlainObjByIdx, mapRSet, makePlainObj } from "../lib/record"
import { InputLine } from "../components/InputLine";

/*
                <Formik initialValues={ {...stageRec} }  onSubmit={null} >
                { (props)=>(
                    <Row>
                        <Col>
                            <Form.Label htmlFor="temp">Темп</Form.Label>
                            <Field name="temp" placeholder="Темп bpm" ctrlId="temp"/> 
                        </Col>
                        <Col>
                            <Form.Label htmlFor="judgment">Судейство</Form.Label>
                            <Field name="judgment" placeholder="Судейство" ctrlId="judgment"/> 
                        </Col>
                        <Col>
                            <Form.Label htmlFor="dtStart">Время начала</Form.Label>
                            <Field name="dtStart" placeholder="Судейство" ctrlId="dtStart"/> 
                        </Col>
                    </Row>
                    
                )}     
                </Formik>
                */
/*
* Сконструировать заголовки номеров судей
*/
const makeJudges = ( countJudges ) =>{
    const judges = R.range(1, countJudges + 1) 
    return R.map( num => <th className="border-bottom text-center px-1" key={`judgenumber-${num}`}>Судья №{num}</th>, judges )
}

const StageEventPartyComponent = ( props ) => {
    const {stageRec} = props
    const { dtStart, temp, judgment, countJudges, countParticipants } = stageRec
    return (
        <Card border="light" className="table-wrapper table-responsive shadow-sm">
            <Card.Header>
                <small className="fw-bold">
                    { `Время начала: ${dtStart}, судейство: ${judgment}, темп: ${temp} bpm, 
                        кол-во судей: ${countJudges}` }
                </small>
            </Card.Header>
            <Card.Body className="pt-0 pb-1 px-2">
                <Table hover className="user-table align-items-center">
                    <colgroup>
                        <col width="5%"/>
                        <col width="15%" overflow="hidden"/>
                    
                    </colgroup>
                    <thead>
                        <tr>
                            <th className="border-bottom px-1">Номер</th>
                            <th className="border-bottom px-1">ФИО<br/>Kлуб</th>
                            {makeJudges(countJudges)}
                            <th className="border-bottom px-1">Результат</th>

                        </tr>
                    </thead>
                    <tbody>
                        Нет ни одного участника!
                    </tbody>
                </Table>  
            </Card.Body>
        </Card>
  )
}

/*
* Участники этапа события междусобойчика
*/
const ParticipansOfStageEventParty = ( props ) => {
    const { currentStageID } = props

    const rc = {dtStart:"23.01.02 23:50", temp: 192, judgment:"skating", countJudges:5, countParticipants:100 } 
    const { dtStart, temp, judgment, countJudges, countParticipants } = rc
/*
    useEffect(() => {
        // получить список задач этапа
        const filter = { fkParty: partyID, fkEvent: eventID }
        const resultHdl = result => {
            setStageEventParty(result)
        }
        StageEventParty.list( filter, null, null, resultHdl ) 
        return ()=>{}
      },[partyID,eventID])
*/
    //const { dtStart, temp, judgment, countJudges, countParticipants } = props.subStageRec
    return (
        <Card border="light" className="table-wrapper table-responsive shadow-sm">
            <Card.Header>
                <small className="fw-bold">
                    {`Время начала: ${dtStart}, темп: ${temp} bpm, кол-во судей: ${countJudges}` }
                </small>
            </Card.Header>
            <Card.Body className="pt-0 pb-1 px-2">
                <Table hover className="user-table align-items-center">
                    <colgroup>
                        <col width="5%"/>
                        <col width="15%" overflow="hidden"/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th className="border-bottom px-1">Номер</th>
                            <th className="border-bottom px-1">ФИО<br/>Kлуб</th>
                            {makeJudges(countJudges)}
                            <th className="border-bottom px-1">Результат</th>
                        </tr>
                    </thead>
                    <tbody>
                        Нет ни одного участника!
                    </tbody>
                </Table>  
            </Card.Body>
        </Card>
  )
}

/*
* Итого по карточке каждого судьи
*/
const makeTotalJudges = ( cards ) =>{
    return R.map( card => <td className="p-1 text-center" key={`totaljudges-${card.fkCard}`}> <span className="fw-normal">{card.total}</span></td>, cards )
}

/*
* Итоговые результаты задачи этапа междусобойчика
*/
const TotalTaskStageEventParty = ( props ) => {
    const { currentTaskID, partyID } = props
    const rc = {dtStart:"23.01.02 23:50", temp: 192, judgment:"skating", countJudges:5, countParticipants:100 } 
    // результаты задачи
    const [ totalsTask, setTotalsTask ] = useState([])

    useEffect(() => {
        // получить результаты задачи
        const filter = { fkParty: partyID, fkTask: currentTaskID }
        const resultHdl = result => {
            setTotalsTask(result)
        }
        TotalTaskStage.list( filter, null, null, resultHdl ) 
        return ()=>{}
      },[partyID,currentTaskID])
    
    const recHdl = ( rec, frmt  ) => {
        const obj = makePlainObj(rec,frmt)
        return (
            <tr key={`totals-${obj.pkID}`}>
                 <td className="p-1">
                    <span className="fw-normal">
                    { obj.num  }
                    </span>
                </td>
                <td className="p-1">
                    <Container className="d-flex flex-column px-0">
                        <span className="fw-normal">
                        { obj.name  }
                        </span>
                        <span className="fw-normal text-muted">
                        {"Надо указать"}
                        </span>
                    </Container>
                </td>
                {makeTotalJudges(obj.cards)}
                <td className="p-1 text-center">
                    <span className="fw-normal">
                    { obj.total  }
                    </span>
                </td>
            </tr>
        )           
    }
    return (
        <Card border="light" className="table-wrapper table-responsive shadow-sm">
            <Card.Header>
                <small className="fw-bold">
                    {`Время начала: ${rc.dtStart}, темп: ${rc.temp} bpm, кол-во судей: ${rc.countJudges}` }
                </small>
            </Card.Header>
            <Card.Body className="pt-0 pb-1 px-2">
                <Table hover className="user-table align-items-center">
                    <colgroup>
                        <col width="5%"/>
                        <col width="15%" overflow="hidden"/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th className="border-bottom px-1">Номер</th>
                            <th className="border-bottom text-center px-1">ФИО<br/>Kлуб</th>
                            {makeJudges(rc.countJudges)}
                            <th className="border-bottom text-center px-1">Результат</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mapRSet( recHdl, totalsTask )}
                        {/*Нет ни одного участника!*/}
                    </tbody>
                </Table>  
            </Card.Body>
        </Card>
  )
}


/*
* Задания этапа события междусобойчика
*/
const TasksStageEventParty = ( props ) => {
    // текeщий этап и междусобойчик
    const { currentStageID, partyID } = props
    // задания этапа
    const [ tasksStage, setTasksStage ] = useState([])
    // состояние для установки текущей активной задачи этапа
    const [currentTask, setCurrentTask] = useState("totalsstageevent")

    //const rc = {dtStart:"23.01.02 23:50", temp: 192, judgment:"skating", countJudges:5, countParticipants:100 } 

    useEffect(() => {
        // получить список задач этапа
        const filter = { fkParty: partyID, fkStage: currentStageID }
        const resultHdl = result => {
            setTasksStage(result)
        }
        TaskStageEvent.list( filter, null, null, resultHdl ) 
        return ()=>{}
      },[partyID, currentStageID])

    const recHdl = ( rec, frmt  ) => {
        const obj = makePlainObj(rec,frmt)
        return (
            <Tab key={`taskstageparty-${obj.pkID}`} eventKey={obj.pkID} tabClassName="py-1" title={obj.name}>
                <TotalTaskStageEventParty stageRec={{...obj}}/>
            </Tab>
        )           
    }

    return (
    <Tabs id="controlled-tab-stageeventparty" 
        activeKey={currentTask}
        onSelect={ newCurrentTask => setCurrentTask(newCurrentTask) } 
        className="mb-1 justify-content-start">
        <Tab key="totalsstageevent" eventKey="totalsstageevent" tabClassName="py-1" title="Результаты">
            Здесь будут итоги по этапу
        </Tab>
        {mapRSet( recHdl, tasksStage )}
    </Tabs>
  )
}


/*
* Запись об этапе события
*/
const StageEventPartyRec = ( props ) => {
    const [ focusRec, setFocusRec ] = props.focusRecHook
    const { pkID, name, dtStart, judgment, countJudges, countParticipants } = props.stageRec
    // создать обработчик на редактирование записи
    const makeOnEditHdl = id =>{
        return () => {
            alert("Надо редактироват")
/*
        Participant.list( {ids:[id], fkParty: partyID }, null, null, 
                        result =>setShowDlg( {showDlg:true, 
                                            editRec:changeNullValueToEmptyStr(makePlainObjByIdx(result)) } ) )
*/
        }
    }

    //удалить участника по id и вызвать обновление списка
    const doRemoveByID = id =>{
        return ()=>{
                    alert("Надо удалять")
/*
        Participant.remove( { ids:[id], fkParty: partyID }, 
                        ( result )=>{ R.isNil(result) ? alert("Произошла неизвестная ошибка") : setChanged(!changed); }, 
                        ( error )=>console.log(error.message) ) 
*/
        }

    }

    return (
        <tr onClick={ () => setFocusRec(pkID)}>
            {  focusRec === pkID ? <td className="p-0 bg-danger"/> : <td className="p-0"/> }
            <td className="p-1">
                <Container className="d-flex flex-column px-0">
                    <span className="fw-normal">
                    { name  }
                    </span>
                    <span className="fw-normal text-muted">
                    {dtStart}
                    </span>
                </Container>
            </td>
            <td className="p-1">
            {/**выпадающий список */}
            <Dropdown as={ButtonGroup} >
                {/**переключатель на который нажимают */}
                <Dropdown.Toggle as={Button}  split variant="link" className="text-dark m-0 p-0" > 
                    <Container className="d-flex flex-column px-0">
                        <span className="fw-light">
                            {judgment}
                        </span>
                    </Container>
                </Dropdown.Toggle>
                {/** выпадающее меню из пунктов при нажатии переключателя */}
                <Dropdown.Menu>
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
  )
}



export default ( props ) => {
    // showDlg - показать диалог создания события, currEventID - id редактируемого события, он при создании всегда null
    const [showDlg, setShowDlg] = useState({showDlg:false,editRec:{}});
    const { partyID, eventID } = useParams()
    const [stagesEventParty, setStageEventParty] = useState([])
    //установка фокуса на этап
    const [ focusRec, setFocusRec ] = useState(null)

     // состояние для установки текущей активной вкладки
    //const [currentStage, setCurrentStage] = useState('1_qualification')

    useEffect(() => {
        // получить список этапов события
        const filter = { fkParty: partyID, fkEvent: eventID }
        const resultHdl = result => {
            setStageEventParty(result)
        }
        StageEventParty.list( filter, null, null, resultHdl ) 
        return ()=>{}
      },[partyID,eventID])

    const stageHdl = ( rec, frmt  ) => {
        const obj = makePlainObj(rec,frmt)
        return ( <StageEventPartyRec key={`stageeventparty-${obj.pkID}`} 
                 focusRecHook={[focusRec,setFocusRec]} 
                 stageRec={{...obj}}/> )           
    }

    //диалог создания всегда в режиме редактирования
    //const [editMode, setEditMode] = useState(true)
   
    const onClickCreateStageEvent= ()=>{
        StageEventParty.init( { initRec:{ fkParty: partyID, fkEvent: eventID}, 
                                method: "StageEventParty.list" }, 
                       result =>setShowDlg( {showDlg:true, editRec:makePlainObjByIdx(result) } ) )
    }

    return (
      <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2">
          <div className="d-flex mb-4 mb-md-0 align-items-center">
            <div>
              <h4>Этапы события</h4>
            </div>
            <div>
              <Button variant="outline-primary" size="sm" onClick={onClickCreateStageEvent}>+</Button>
            </div>
          </div>
          <div className="btn-toolbar mb-2 mb-md-0">  
              <Button variant="outline-primary" size="sm">Выгрузить</Button>
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle split as={Button} variant="link" className="text-dark m-0 p-0">
                    <span className="icon icon-sm icon-gray">
                        <FontAwesomeIcon icon={faCog} />
                    </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-xs dropdown-menu-right">
                    <Dropdown.Item className="fw-bold text-dark">Показывать</Dropdown.Item>
                    <Dropdown.Item className="d-flex fw-bold">
                        100 <span className="icon icon-small ms-auto"><FontAwesomeIcon icon={faCheck} /></span>
                    </Dropdown.Item>
                    <Dropdown.Item className="fw-bold">200</Dropdown.Item>
                    <Dropdown.Item className="fw-bold">300</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        {/*список этапов*/}
        <Row>
            <Col sm={3}>
                <Card border="light" className="table-wrapper table-responsive shadow-sm">
                    {/*showDlg.showDlg && <ParticipantDlg hookShowDlg={[showDlg, setShowDlg]}
                                                        hookChgParticipants={[changed, setChanged]} />*/ }
                    <Card.Body className="pt-0 pb-1 px-2">
                        <Table hover className="user-table align-items-center" width="100%">
                            <colgroup>
                                <col width="1"/>
                                <col width="60%" overflow="hidden"/>
                                <col width="39%" overflow="hidden"/>
                            </colgroup>
                            <thead>
                                <tr>
                                    <th className="border-bottom px-1">#</th>
                                    <th className="border-bottom px-1">Название</th>
                                    <th className="border-bottom px-1">Судейство</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mapRSet( stageHdl, stagesEventParty )}
                            </tbody>
                        </Table>
                        <Card.Footer className="px-1 py-2 border-0 d-flex justify-content-start">
                            <small className="fw-bold">
                                Всего этапов: <b>{stagesEventParty.length - 1}</b>
                            </small>
                        </Card.Footer>
                    </Card.Body>
                </Card>
            </Col>
            <Col sm={9}>
                {/*<ParticipansOfStageEventParty currentStageID={1} partyID={partyID}/>*/}
                <TasksStageEventParty currentStageID={1} partyID={partyID}/>
            </Col>                                    
        </Row>
        
      </>
    );
  };
  
/*

export const OLD = ( props ) => {
    // showDlg - показать диалог создания события, currEventID - id редактируемого события, он при создании всегда null
    const [showDlg, setShowDlg] = useState({showDlg:false,editRec:{}});
    const { partyID, eventID } = useParams()
    const [stagesEventParty, setStageEventParty] = useState([])
     // состояние для установки текущей активной вкладки
    const [currentStage, setCurrentStage] = useState('1_qualification')

    useEffect(() => {
        // получить список этапов события
        const filter = { fkParty: partyID, fkEvent: eventID }
        const resultHdl = result => {
            setStageEventParty(result)
        }
        StageEventParty.list( filter, null, null, resultHdl ) 
        return ()=>{}
      },[partyID,eventID])

    const recHdl = ( rec, frmt  ) => {
        const obj = makePlainObj(rec,frmt)
        return (
            <Tab key={`stageeventparty-${obj.pkID}`} eventKey={obj.type} tabClassName="py-1" title={obj.name}>
                <StageEventPartyComponent stageRec={{...obj}}/>
            </Tab>
        )           
    }

    //диалог создания всегда в режиме редактирования
    //const [editMode, setEditMode] = useState(true)
   
    const onClickCreateStageEvent= ()=>{
        StageEventParty.init( { initRec:{ fkParty: partyID, fkEvent: eventID}, 
                                method: "StageEventParty.list" }, 
                       result =>setShowDlg( {showDlg:true, editRec:makePlainObjByIdx(result) } ) )
    }

    return (
      <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2">
          <div className="d-flex mb-4 mb-md-0 align-items-center">
            <div>
              <h4>Этапы события</h4>
            </div>
            <div>
              <Button variant="outline-primary" size="sm" onClick={onClickCreateStageEvent}>+</Button>
            </div>
          </div>
          <div className="btn-toolbar mb-2 mb-md-0">  
              <Button variant="outline-primary" size="sm">Выгрузить</Button>
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle split as={Button} variant="link" className="text-dark m-0 p-0">
                    <span className="icon icon-sm icon-gray">
                        <FontAwesomeIcon icon={faCog} />
                    </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-xs dropdown-menu-right">
                    <Dropdown.Item className="fw-bold text-dark">Показывать</Dropdown.Item>
                    <Dropdown.Item className="d-flex fw-bold">
                        100 <span className="icon icon-small ms-auto"><FontAwesomeIcon icon={faCheck} /></span>
                    </Dropdown.Item>
                    <Dropdown.Item className="fw-bold">200</Dropdown.Item>
                    <Dropdown.Item className="fw-bold">300</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        
        <Tabs id="controlled-tab-stageeventparty" 
              activeKey={currentStage}
              onSelect={ newCurrentStage => setCurrentStage(newCurrentStage) } 
              className="mb-1 justify-content-start">
              {mapRSet( recHdl, stagesEventParty )}
        </Tabs>
        
      </>
    );
  };
  
*/
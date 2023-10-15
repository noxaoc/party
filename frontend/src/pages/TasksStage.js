/*
Задачи этапы
*/

/*
Страница междусобойчика путь к ней /:partyID/event/:eventID
*/


import React, {useState,useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCog, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { Button, ButtonGroup, Dropdown, Tab, Tabs, Card, Table, Container, Breadcrumb,
         Row, Col, Form } from '@themesberg/react-bootstrap'

import { useParams, generatePath, Link } from "react-router-dom"
import { Routes } from "../routes";
import { Formik, Field, Form as FormikForm} from "formik";
import * as R from 'ramda'

import { EventStageTaskTemplate } from "../components/EventStageTaskTemplate";
import { StageEventParty } from "../data/stageEventParty"
import { TotalTaskStage } from "../data/totalTaskStage"
import { TaskStageEvent } from "../data/taskStageEvent"
import { EventParty } from "../data/eventParty";
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
                <td className="p-1 text-center">
                    <span className="fw-normal">
                    { obj.place  }
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
                            <th className="border-bottom text-center px-1">Место</th>
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
* Итоговые результаты этапа междусобойчика
*/
const AllTotalStageEventParty = ( props ) => {
    const { currentStageID, partyID } = props
    const rc = {dtStart:"23.01.02 23:50", temp: 192, judgment:"skating", countJudges:5, countParticipants:100 } 
    // результаты задачи
    const [ totals, setTotals ] = useState([])

    useEffect(() => {
        // получить результаты задачи
        const filter = { fkParty: partyID, fkStage: currentStageID }
        const resultHdl = result => {
            setTotals(result)
        }
        TotalTaskStage.totals( filter, null, null, resultHdl ) 
        return ()=>{}
      },[partyID,currentStageID])
    
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
                <td className="p-1 text-center">
                    <span className="fw-normal">
                    { obj.place  }
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
                            <th className="border-bottom text-center px-1">Место</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mapRSet( recHdl, totals )}
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
export default ( props ) => {

const { partyID, eventID, stageID } = useParams()
// задания этапа
const [ tasksStage, setTasksStage ] = useState([])
// состояние для установки текущей активной задачи этапа
const [currentTask, setCurrentTask] = useState("totalsstageevent")

//const rc = {dtStart:"23.01.02 23:50", temp: 192, judgment:"skating", countJudges:5, countParticipants:100 } 

useEffect(() => {
    // получить список задач этапа
    const filter = { fkParty: partyID, fkStage: stageID }
    const resultHdl = result => {
        setTasksStage(result)
    }
    TaskStageEvent.list( filter, null, null, resultHdl ) 
    return ()=>{}
    },[partyID, stageID])

const recHdl = ( rec, frmt  ) => {
    const obj = makePlainObj(rec,frmt)
    return (
        <Tab key={`taskstageparty-${obj.pkID}`} eventKey={obj.pkID} tabClassName="py-1" title={obj.name}>
            <TotalTaskStageEventParty stageRec={{...obj}}/>
        </Tab>
    )           
}

const onClickCreateStageEvent= ()=>{
    alert("вставка не готова")
}

return (
<>
    <EventStageTaskTemplate  onClickCreateRec={onClickCreateStageEvent} 
            partyID={partyID} eventID={eventID} />
    <Tabs id="controlled-tab-stageeventparty" 
        activeKey={currentTask}
        onSelect={ newCurrentTask => setCurrentTask(newCurrentTask) } 
        className="mb-1 justify-content-start">
        <Tab key="totalsstageevent" eventKey="totalsstageevent" tabClassName="py-1" title="Результаты">
            <AllTotalStageEventParty currentStageID={stageID} partyID={partyID}/>
        </Tab>
        {mapRSet( recHdl, tasksStage )}
    </Tabs>
</>
)

}


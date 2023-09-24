/*
Страница междусобойчика путь к ней /:partyID/event/:eventID
*/


import React, {useState,useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCog } from '@fortawesome/free-solid-svg-icons'
import { Button, ButtonGroup, Dropdown, Tab, Tabs, Card, Table, Row, Col, Form } from '@themesberg/react-bootstrap'
import { useParams } from "react-router-dom";
import { Formik, Field, Form as FormikForm} from "formik";
import * as R from 'ramda'

import { StageEventParty } from "../data/stageEventParty";
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
const makeJudges = ( countJudges ) =>{
    const judges = R.range(1, countJudges + 1) 
    return R.map( num => <th className="border-bottom px-1">Судья №{num}</th>, judges )
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

export default ( props ) => {
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
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
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
        
        <Tabs id="controlled-tab-stageeventparty" 
              activeKey={currentStage}
              onSelect={ newCurrentStage => setCurrentStage(newCurrentStage) } 
              className="mb-1 justify-content-start">
              {mapRSet( recHdl, stagesEventParty )}
        </Tabs>
        
      </>
    );
  };
  
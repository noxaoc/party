/*
* Шаблон для списков этапов и задач
*/

import React, {useState,useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCog } from '@fortawesome/free-solid-svg-icons'
import { Button, ButtonGroup, Dropdown,  Breadcrumb } from '@themesberg/react-bootstrap'
import {  generatePath } from "react-router-dom"
import { Routes } from "../routes";
import { EventParty } from "../data/eventParty";
import { makePlainObjByIdx} from "../lib/record"


/**
 * 
 * @param {*} props 
 *   partyID - идентификатор междусобойчика
 *   eventID - идентификатор события
 *   stageID - идентификатор текущего этапа
 * @returns 
 */
function BreadcrumbEventStage( props ) {
    const { partyID, eventID } = props
    const [ eventName, setEventName ] = useState("...")
    useEffect(() => {
        // прочитать название события
        const filter = { fkParty: partyID, pkID: eventID }
        const resultHdl = result => {
            console.log(result)
            const eventRec = makePlainObjByIdx(result)
            setEventName(eventRec.name)
        }
        EventParty.read( filter, resultHdl ) 
        return ()=>{}
      },[partyID,eventID])
//       <Breadcrumb className="d-none d-md-inline-block"
    return (
      <Breadcrumb
                  listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
        <Breadcrumb.Item href={generatePath(Routes.EventsParty.path, { partyID: partyID })}>
            {eventName}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Этапы</Breadcrumb.Item>
      </Breadcrumb>
    );
  }

/*
onClickCreateRec - обработка события создания записи в списке
*/
export const EventStageTaskTemplate = (props ) =>{
    const { onClickCreateRec, partyID, eventID, stageID } = props
    // showDlg - показать диалог создания события, currEventID - id редактируемого события, он при создании всегда null
    //const [showDlg, setShowDlg] = useState({showDlg:false,editRec:{}});
    //const [stagesEventParty, setStageEventParty] = useState([])
    
    // состояние для установки текущей активной вкладки
    //const [currentStage, setCurrentStage] = useState('1_qualification')
    
    
    //диалог создания всегда в режиме редактирования
    //const [editMode, setEditMode] = useState(true)
    
    return (
    <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2">
            <div className="d-flex mb-4 mb-md-0 align-items-center">
                <div>
                    <BreadcrumbEventStage partyID={partyID} eventID={eventID} stageID={stageID} />
                </div>
                <div className="mx-2">
                    <Button variant="outline-primary" size="sm" onClick={onClickCreateRec}>+</Button>
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
    </>
    );
    }
    
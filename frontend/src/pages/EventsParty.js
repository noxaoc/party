/*
События междусобойчика
1. Создание и редактирование
*/


import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCog } from '@fortawesome/free-solid-svg-icons'
import { Button, ButtonGroup, Dropdown } from '@themesberg/react-bootstrap'
import {  EventsPartyTable } from "../components/EventPartysTable"
import { EventParty } from "../data/eventParty"
import { makePlainObjByIdx } from "../lib/record"
import { useParams } from "react-router-dom";

export default ( props ) => {
    const { partyID } = useParams()

    // showDlg - показать диалог создания события, currEventID - id редактируемого события, он при создании всегда null
    const [showDlg, setShowDlg] = useState({showDlg:false,editRec:{}});
    //диалог создания всегда в режиме редактирования
    //const [editMode, setEditMode] = useState(true)
    const onClickCreateEvent= ()=>{
        EventParty.init( { initRec:{ fkParty: partyID }, method: "EventParty.list" }, 
                       result =>setShowDlg( {showDlg:true, editRec:makePlainObjByIdx(result) } ) )
    }
    return (
      <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <div className="d-flex mb-4 mb-md-0 align-items-center">
            <div>
              <h4>События</h4>
            </div>
            <div>
              <Button variant="outline-primary" size="sm" onClick={onClickCreateEvent}>+</Button>
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
      {/* showDlg.showDlg && <EventPartyDlg hookShowDlg={[showDlg, setShowDlg]} 
                                            hookEdit={[editMode,setEditMode]} 
                                            event={createEventParty()} 
                                            hookChgEvents={[changed, setChanged]}
                                            typeEvents={typeEvents}
                                            />
                                            
                                            */}
  
      {/*собственно список участников*/}
        <EventsPartyTable {...props}  hookShowDlg={[showDlg, setShowDlg]} />
      </>
    );
  };
  
/*
    Участники междусобойчика
    Сценарии:
    1. Регистрация участников
    2. Просмотр и редактирование списка участников
*/
import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCog } from '@fortawesome/free-solid-svg-icons';
import { Button, ButtonGroup, Dropdown } from '@themesberg/react-bootstrap';
import { ParticipantTable } from "../components/ParticipantsTable";
import { Participant } from "../data/participant"
import { makePlainObjByIdx } from "../lib/record";
import { useParams } from "react-router-dom";

export default ( props ) => {
  // showDlg - показать диалог создания междусобойчика, editRec - редактируемая запись, editMode - режим редактирования записи
  const { partyID } = useParams()
  const [showDlg, setShowDlg] = useState({showDlg:false,editRec:{},уditMode:false});
  const onClickCreateParticipant = ()=>{
      Participant.init( { initRec:{fkParty:partyID}, method: "Participant.list", insImmediatly:true }, 
                      result => setShowDlg( {showDlg:true, editRec:makePlainObjByIdx(result), editMode:true } ) )
  }
 
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-flex mb-4 mb-md-0 align-items-center">
          <div>
            <h4>Участники</h4>
          </div>
          <div>
            <Button variant="outline-primary" size="sm" onClick={onClickCreateParticipant}>+</Button>
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
    {/*собственно список участников*/}
      <ParticipantTable  {...props} hookShowDlg={[showDlg, setShowDlg]} />
    </>
  )
}

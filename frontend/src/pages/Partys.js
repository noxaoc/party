/* 
Список междусобойчиков
1. Создание и редактирование
2. 
*/

import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCog } from '@fortawesome/free-solid-svg-icons'
import { Button, ButtonGroup, Dropdown } from '@themesberg/react-bootstrap'
import {  PartyTable } from "../components/PartyTable"
import { Party } from "../data/party"
import { makePlainObjByIdx } from "../lib/record"

export default ( props ) => {
    //console.log(props.match.params)
    // showDlg - показать диалог создания междусобойчика
    const [showDlg, setShowDlg] = useState({showDlg:false,editRec:{}});
    const onClickCreateParty= ()=>{
        Party.init( { initRec:{}, method: "Party.list" }, 
                       result =>setShowDlg( {showDlg:true, editRec:makePlainObjByIdx(result) } ) )
    }
    return (
      <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <div className="d-flex mb-4 mb-md-0 align-items-center">
            <div>
              <h4>Междусобойчики</h4>
            </div>
            <div>
              <Button variant="outline-primary" size="sm" onClick={onClickCreateParty}>+</Button>
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
        {/* список междусобойчиков */}
        <PartyTable {...props} hookShowDlg={[showDlg, setShowDlg]} />
      </>
    );
  };
  
/*
 навигационная панель почти на всех страницах с поисковой строкой и аватаркой пользователя
*/
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faSearch, faSignOutAlt, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { Nav, Form, Image, Navbar, Dropdown, Container, InputGroup } from '@themesberg/react-bootstrap';

import { Party } from "../data/party";
import { makePlainObjByIdx } from "../lib/record";
import * as R from "ramda" 

//import NOTIFICATIONS_DATA from "../data/notifications";
import Profile3 from "../assets/img/team/profile-picture-3.jpg";
import PartyIco from "../assets/img/jazz-dance.svg"

export default (props) => {
  const { partyID } = useParams()
  const [partyInfo, setCurrPartyInfo] = useState({partyID:null, text:"Выберите текущий междусобойчик"})
  console.log("render Navbar partyID="+ partyID )

  useEffect(() => {
    // получить имя текущего междусобойчика
    //console.log(`вызван useeffect`)
    const onRespHdl = result =>{
      const partyObj = makePlainObjByIdx(result)
      //console.log(`вызван ${partyObj.name}`)
      if(R.isNotNil(partyObj.pkID) ){
        const text = partyObj.name + ', ' + partyObj.place + ', ' + partyObj.dtStart + ' - ' + partyObj.dtEnd
        setCurrPartyInfo({partyID:partyObj.pkID, text: text})
      }
      else
        setCurrPartyInfo({partyID:null, text:"Выберите текущий междусобойчик"})

    }
    const pkID = Number(partyID)
    if( R.isNotNil(pkID) && !isNaN(pkID) )
      Party.read( {pkID:pkID},  onRespHdl )
    return ()=>{}
  },[partyID])
  
  const {onChangeSearchStr} = props
  /*
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const areNotificationsRead = notifications.reduce((acc, notif) => acc && notif.read, true);
  const markNotificationsAsRead = () => {
    setTimeout(() => {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }, 300);
  };
  */
/*
  const Notification = (props) => {
    const { link, sender, image, time, message, read = false } = props;
    const readClassName = read ? "" : "text-danger";

    return (
      <ListGroup.Item action href={link} className="border-bottom border-light">
        <Row className="align-items-center">
          <Col className="col-auto">
            <Image src={image} className="user-avatar lg-avatar rounded-circle" />
          </Col>
          <Col className="ps-0 ms--2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="h6 mb-0 text-small">{sender}</h4>
              </div>
              <div className="text-end">
                <small className={readClassName}>{time}</small>
              </div>
            </div>
            <p className="font-small mt-1 mb-0">{message}</p>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  };
*/
  return (
    <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          {/* форма для обработки информации введенной в строку для поиска */}
          <div className="d-flex align-items-center">
            <Form className="navbar-search">
              <Form.Group id="topbarSearch">
                <InputGroup className="input-group-merge search-bar">
                  {/**Иконка поиска */}
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faSearch} />
                  </InputGroup.Text>
                  {/** подсказка в строке поиска */}
                  <Form.Control type="text" placeholder="Введите строку для поиска" 
                      onChange={onChangeSearchStr /*(e) => console.log(e.target.value)*/} />           
                </InputGroup>
              </Form.Group>
            </Form>
          </div>
          <div className="media d-flex align-items-center">
          {/** Тут иконка междусобойчика должна быть */}  
            <Image src={PartyIco} className="user-avatar md-avatar rounded-circle" />
            <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                <span className="mb-0 font-small fw-bold">{partyInfo.text}</span>
            </div>
          </div>
          <Nav className="align-items-center">
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                {/*Вывод аватарки текущего пользователя */}
                <div className="media d-flex align-items-center">
                  <Image src={Profile3} className="user-avatar md-avatar rounded-circle" />
                  <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                    <span className="mb-0 font-small fw-bold">Башарина Мария</span>
                  </div>
                </div>
              </Dropdown.Toggle>
              {/** выпадающее меню при нажатии на аватарку */}
              <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                <Dropdown.Item className="fw-bold">
                  <FontAwesomeIcon icon={faUserCircle} className="me-2" /> Мой профиль
                </Dropdown.Item>
                <Dropdown.Item className="fw-bold">
                  <FontAwesomeIcon icon={faCog} className="me-2" /> Настройки
                </Dropdown.Item>
                <Dropdown.Item className="fw-bold">
                  <FontAwesomeIcon icon={faUserShield} className="me-2" /> Техподдержка
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item className="fw-bold">
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-danger me-2" /> Выйти
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};

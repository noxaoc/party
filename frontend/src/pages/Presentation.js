/*
* Разводящая страница. Отсюда осуществляется переход в админк и к событиям междусобойчика
*/
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
//import { faBootstrap, faGithub, faJs, faReact, faSass } from "@fortawesome/free-brands-svg-icons";
import { Col, Row, Card, Image, Button, Container, Navbar, Nav } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
//import Code from "../components/CodeEditor";
//import GitHubButton from 'react-github-btn';

import { Routes } from "../routes";
//import ThemesbergLogoIcon from "../assets/img/themesberg.svg";
//import ThemesbergLogo from "../assets/img/themesberg-logo.svg";
//import MockupPresentation from "../assets/img/mockup-presentation.png";
import ReactHero from "../assets/img/technologies/react-hero-logo.svg";
//import MapboxImg from "../assets/img/mockup-map-presentation.png";
//import CalendarImg from "../assets/img/mockup-calendar-presentation.png";
//import ReactMockupImg from "../assets/img/react-mockup.png";
//import BS5IllustrationsImg from "../assets/img/illustrations/bs5-illustrations.svg";
//import BS5Logo from "../assets/img/technologies/bootstrap-5-logo.svg";
//import ReactLogo from "../assets/img/technologies/react-logo.svg";

//import pages from "../data/pages";
//import features from "../data/features";

export default () => {
  /*
  const PagePreview = (props) => {
    const { name, image, link } = props;

    return (
      <Col xs={6} className="mb-5">
        <Card.Link as={Link} to={link} className="page-preview page-preview-lg scale-up-hover-2">
          <Image src={image} className="shadow-lg rounded scale" alt="Dashboard page preview" />

          <div className="text-center show-on-hover">
            <h6 className="m-0 text-center text-white">
              {name} <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-2" />
            </h6>
          </div>
        </Card.Link>
      </Col>
    );
  };
*/

  /*
  const Feature = (props) => {
    const { title, description, icon } = props;

    return (
      <Col xs={12} sm={6} lg={3}>
        <Card className="bg-white shadow-soft text-primary rounded mb-4">
          <div className="px-3 px-lg-4 py-5 text-center">
            <span className="icon icon-lg mb-4">
              <FontAwesomeIcon icon={icon} />
            </span>
            <h5 className="fw-bold text-primary">{title}</h5>
            <p>{description}</p>
          </div>
        </Card>
      </Col>
    );
  };
*/
/*
  const FolderItem = (props) => {
    const { name, icon, tooltip, iconColor } = props;
    const color = iconColor ? `text-${iconColor}` : "";

    return (
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="left"
        overlay={<Tooltip>{tooltip}</Tooltip>}
      >
        <li data-toggle="tooltip" data-placement="left" title="Main folder that you will be working with">
          <FontAwesomeIcon icon={icon ? icon : faFolder} className={`${color} me-2`} /> {name}
        </li>
      </OverlayTrigger>
    );
  };
  */
  /* 
  overflow-hidden - если контент невлезает в элемент, просто обрежет его по нижней границе, т.е. скроет(hidden)
  bg-primary - выставление фону класс расцветки primary
  text-white - выставить тексту класс расцветки white
  pt-5  для xs padding-top = $spacer
  pt-lg-6 для компьтерных экранов padding-top выставляется в какой - то размер
  pb-9 для xs padding-bottom выставляется в какой - то размер
  pb-lg-12 для компьтерных экранов padding-bottom выставляется в какой - то размер
  d-none для xs скрыть элемент
  
  */ 

  return (
    <Container fluid className="bg-dark vh-100" >
      <Navbar variant="dark" expand="lg" bg="dark" className="navbar-transparent navbar-theme-primary px-1">
        <Container className="position-relative justify-content-between px-3">
          <Navbar.Brand as={HashLink} to="#home" className="me-lg-3 d-flex align-items-center">
            <Image src={ReactHero} />
            <span className="ms-2 brand-text d-none d-md-inline">Междусобойчик</span>
          </Navbar.Brand>
          <div className="d-flex align-items-center">
            <Navbar.Collapse id="navbar-default-primary">
              <Nav className="navbar-nav-hover align-items-lg-center">
                <Nav.Link as={HashLink} to="#events">В междусобойчик</Nav.Link>
                <Nav.Link as={HashLink} to="#admin">Управление</Nav.Link>               
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>

      <section className="section-header pt-1 pb-1 pt-lg-6 bg-primary text-white flex-fill"  id="home">
      <Container>
        <Row>
          <Col xs={12} className="text-center">
            <div className="react-big-icon d-none d-lg-block"><span className="fab fa-react"></span></div>
            <h1 className="fw-bolder text-secondary">Междусобойчик</h1>
            <p className="text-muted fw-light mb-5 h5">Проведение встреч, вечеринок, лагерей, соревнований</p>
            <div className="d-flex align-items-center justify-content-center">
              <Button variant="secondary" as={Link} to={Routes.DashboardOverview.path} className="text-dark me-3">
                К событиям <FontAwesomeIcon icon={faExternalLinkAlt} className="d-none d-sm-inline ms-1" />
              </Button>
              <Button variant="secondary" as={Link} to={Routes.DashboardOverview.path} className="text-dark me-3">
                Управление <FontAwesomeIcon icon={faExternalLinkAlt} className="d-none d-sm-inline ms-1" />
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      </section>
      <footer className="footer pt-2 pb-0 bg-dark text-white fixed-bottom">
        <Container>
          <Row>
            <Col xs={6} md={2} className="mb-5 mb-lg-0">
              <span className="h5">Jazz Kids</span>
              <ul className="links-vertical mt-2">
                <li><Card.Link target="_blank" href="https://themesberg.com/about">О нас</Card.Link></li>
                <li><Card.Link target="_blank" href="https://themesberg.com/contact">Контакты</Card.Link></li>
              </ul>
            </Col>
            <Col xs={6} md={2} className="mb-5 mb-lg-0">
              <span className="h5">Разное</span>
              <ul className="links-vertical mt-2">
                <li>
                  <Card.Link as={Link} to={Routes.DocsQuickStart.path} target="_blank">Попробуем?</Card.Link>
                </li>
                <li><Card.Link as={Link} to={Routes.DocsChangelog.path} target="_blank">Список изменений</Card.Link></li>
                <li><Card.Link target="_blank" href="https://themesberg.com/licensing">Лицензия</Card.Link></li>
              </ul>
            </Col>
            <Col xs={12} md={4} className="mb-5 mb-lg-0 flex-grow-1">
              <span className="h5 mb-3 d-block">Подписка на уведомления</span>
              <form action="#">
                <div className="form-row mb-2">
                  <div className="col-5">
                    <input type="email" className="form-control mb-2" placeholder="example@company.com" name="email" aria-label="Subscribe form" required />
                  </div>
                  <div className="col-5">
                    <button type="submit" className="btn btn-secondary text-dark shadow-soft btn-block" data-loading-text="Sending">
                      <span>Хочу уведомления</span>
                    </button>
                  </div>
                </div>
              </form>
              <p className="text-muted font-small m-0">Мы никому не сливаем ваши данные <Card.Link className="text-white" href="#">Privacy Policy</Card.Link></p>
            </Col>
          </Row>
        
          <Row>
            <Col className="mb-md">
              <div className="d-flex text-center justify-content-center align-items-center" role="contentinfo">
                <p className="font-weight-normal font-small mb-0">Copyright © Al Ter Inc-<span className="current-year">2023</span>. Права никем никак нифига не зарезервированы</p>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
   
    </Container>
  );
/*
  return (
   
    <Container fluid className="bg-blue" >
      <Row className="d-flex flex-column justify-content-beetween vh-100">
        <Col className="bg-red">  
         Первый
        </Col>
        <Col className="bg-dark">
        Второй
        </Col>
        <Col className="bg-danger">
         Третий
        </Col>
      </Row>
    </Container>
 
  );*/
};

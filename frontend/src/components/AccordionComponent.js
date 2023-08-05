/*
* Аккордеон ( компонент Accordion ) - это навигационная панель состоящая из группы элементов 
Каждый элемент аккордеона Accordion.Item - имеет заголовочный элемент, на который щелкают ( Accordion.Header  )
и он открывает тело ( Accordion.Body )
Каждый Accordion.Item имеет свойство eventKey это уникальный идентификатор отличающий один элемент в аккордеоне от другого


*/
import React from 'react';
import { Card, Accordion } from '@themesberg/react-bootstrap';


// конструктор аккордеона
export default (props) => {
  const { defaultKey, data = [], className = "" } = props;
  
  const AccordionItem = (item) => {
    const { eventKey, title, description } = item;
    // title - название элемента аккордеона, description - тело аккордеона
    return (
      <Accordion.Item eventKey={eventKey}>
        <Accordion.Button variant="link" className="w-100 d-flex justify-content-between">
          <span className="h6 mb-0 fw-bold">
            {title}
          </span>
        </Accordion.Button>
        <Accordion.Body>
          <Card.Body className="py-2 px-0">
            <Card.Text className="mb-0">
              {description}
            </Card.Text>
          </Card.Body>
        </Accordion.Body>
      </Accordion.Item>
    );
  };
  
  // defaultActiveKey - активный по умолчанию элемент аккордеона
  return (
    <Accordion className={className} defaultActiveKey={defaultKey}>
      {data.map(d => <AccordionItem key={`accordion-${d.id}`} {...d} />)}
    </Accordion>
  );
};
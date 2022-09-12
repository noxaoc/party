//import logo from './logo.svg';
//import './App.css';



function App() {
  return (
    <div className="App">
      <header className="App-header">
       Header
      </header>
      <nav className="App-accordion">
        <div className="App-accordion-header">
          <img  className="App-accordion-logo"  src="logo.png" alt="logo" width="40" height="32"/>
          <h3>Междусобойчик</h3>
        </div>
        <ul className="App-accordion-nav">
          <a href="#">Клиенты</a>
          <a href="#">Администраторы</a>
          <a href="#">Отчеты</a>
        </ul>
      </nav>
      <main className="App-main">
        <div className="App-main-filter">
          <input className="App-main-filter-search-input" type="search"  placeholder="Поиск" aria-label="Search">
          </input>
          <button className="App-main-filter-search-btn" type="button" title="Поиск">
            Поиск
          </button>
          <div className="App-main-filter-filter-info">
            <div className="App-main-filter-filter-info-text">
              Тут строка данных фильтра, она прижата к кнопке фильтра
            </div>
          </div>
          <button className="App-main-filter-filter-btn" type="button" title="Фильтр">
            Фильтр
          </button>
        </div>
        <div className="App-main-data">
          Основной контент
        </div>
      </main>
      <aside className="App-instrumental">
        <button className="App-instrumental-btn" type="button" title="Имя текущего пользователя">
          ТА
        </button>
        <button className="App-instrumental-btn" type="button" title="История изменений">
          ИС
        </button>
      </aside>
      <footer className="App-footer">
        версия 0.0.1 от 03.09.23, разработчик Al Ter
      </footer>
    </div>
  );
}


export default App;


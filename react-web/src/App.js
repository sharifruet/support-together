import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import RouteComponent from './basicRouting'
import NavBar from './layout/navbar';
import Footer from './layout/footer';
import { GlobalProvider } from './GlobalContext'

function App() {
  return (
    <div className="App">
      <GlobalProvider>
        <header>
          <NavBar/>
          <RouteComponent/>
          <Footer/>
        </header>
      </GlobalProvider>
    </div>
  );
}

export default App;

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import RouteComponent from './basicRouting'
import NavBar from './layout/navbar';
import Footer from './layout/footer';

function App() {
  return (
    <div className="App">
      <header>
        <NavBar/>
        <RouteComponent/>
        <Footer/>
      </header>
    </div>
  );
}

export default App;

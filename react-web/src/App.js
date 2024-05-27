import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import RouteComponent from './basicRouting'
import NavBar from './layout/navbar';
import Footer from './layout/footer';
import { GlobalProvider } from './GlobalContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <GlobalProvider>
        <header>
          <NavBar />
        </header>
        <main>
          <RouteComponent />
        </main>
        <footer>
          <Footer />
        </footer>
        <ToastContainer />
      </GlobalProvider>
    </div>
  );
}

export default App;

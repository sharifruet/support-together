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
          <NavBar />
        </header>
        <main>
          <RouteComponent />
        </main>
        <footer>
          <Footer />
        </footer>
      </GlobalProvider>
    </div>
  );
}

export default App;

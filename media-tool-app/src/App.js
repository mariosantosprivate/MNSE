import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Webcam from "react-webcam";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Webcam />
        <p>
          This is your camera feed
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        
      </header>
      
    </div>
  );
}

export default App;

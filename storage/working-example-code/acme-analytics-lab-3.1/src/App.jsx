import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DatasetProvider } from './context/DatasetContext';
import Header from './components/Header';
import About from './pages/About';
import Dashboards from './pages/Dashboards';
import DataChat from './pages/DataChat';
import './app.scss';

function App() {
  return (
    <DatasetProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<About />} />
              <Route path="/dashboards" element={<Dashboards />} />
              <Route path="/datachat" element={<DataChat />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DatasetProvider>
  );
}

export default App;

// Made with Bob

import CyberSecurityFlashcards from './components/CyberSecurityFlashcards'
import './App.css'
import OfflineIndicator from './components/OfflineIndicator';
import SyncStatus from './components/SyncStatus';

function App() {
  return (
    <div className="App">
      <CyberSecurityFlashcards />
      <OfflineIndicator />
      <SyncStatus />
    </div>
  );
}

export default App

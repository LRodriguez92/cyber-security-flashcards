import { AuthGuard, CyberSecurityFlashcards } from './components'
import './App.css'

function App() {
  return (
    <div className="App">
      <AuthGuard>
        <CyberSecurityFlashcards />
      </AuthGuard>
    </div>
  );
}

export default App

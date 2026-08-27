import { useState } from 'react'
import WeightTracker from './WeightTracker'
import ExerciseTracker from './ExerciseTracker'
import './App.css'

type Tab = 'weight' | 'exercise'

function App() {
  const [tab, setTab] = useState<Tab>('weight')

  return (
    <div className="app">
      <header className="app-header">
        <h1>Fit Tracker</h1>
        <nav className="tabs">
          <button
            type="button"
            className={tab === 'weight' ? 'tab active' : 'tab'}
            onClick={() => setTab('weight')}
          >
            Weight
          </button>
          <button
            type="button"
            className={tab === 'exercise' ? 'tab active' : 'tab'}
            onClick={() => setTab('exercise')}
          >
            Exercise
          </button>
        </nav>
      </header>

      <main>{tab === 'weight' ? <WeightTracker /> : <ExerciseTracker />}</main>
    </div>
  )
}

export default App

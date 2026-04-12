import React from 'react'
import ReactDOM from 'react-dom/client'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-amber-800">Mappa Imperium Refactor Initialized!</h1>
        <p className="mt-2 text-gray-600">Phase 1 Complete. Ready for Phase 2.</p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

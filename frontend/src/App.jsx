import { useState, useEffect } from 'react'
import axios from 'axios'
import { Activity } from 'lucide-react'
import PatientCard from './components/PatientCard'

function App() {
  const [patients, setPatients] = useState({})
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/dashboard/overview')
      setPatients(response.data)
      setLastUpdated(new Date())
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 2000) // Poll every 2s
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-10 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 p-3 rounded-lg shadow-lg shadow-blue-500/20">
            <Activity size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              Sentinel Dashboard
            </h1>
            <p className="text-gray-500 text-sm">Patient Deterioration Monitoring System</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Live Monitoring</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">Last update: {lastUpdated.toLocaleTimeString()}</p>
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full text-center py-20 text-gray-500">Initializing Uplink...</div>
        ) : Object.keys(patients).length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500">No Patient Data Stream Detected</div>
        ) : (
          Object.values(patients).map(patient => (
             <PatientCard key={patient.patient_id} data={patient} />
          ))
        )}
      </main>
    </div>
  )
}

export default App

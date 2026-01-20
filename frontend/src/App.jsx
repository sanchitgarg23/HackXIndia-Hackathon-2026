import { useState, useEffect } from 'react'
import axios from 'axios'
import { Activity } from 'lucide-react'
import PatientCard from './components/PatientCard'
import PatientDetailsModal from './components/PatientDetailsModal'

function App() {
  const [patients, setPatients] = useState({})
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  
  // Modal State
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientHistory, setPatientHistory] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/dashboard/overview')
      setPatients(response.data)
      setLastUpdated(new Date())
      setLoading(false)
      
      // If modal is open, refresh history for that patient too
      if (selectedPatient) {
         fetchHistory(selectedPatient.patient_id)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const fetchHistory = async (pid) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/patients/${pid}/history`)
      setPatientHistory(response.data)
    } catch (error) {
      console.error("Error fetching history:", error)
    }
  }

  const handlePatientClick = async (patient) => {
    setSelectedPatient(patient)
    await fetchHistory(patient.patient_id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPatient(null)
    setPatientHistory([])
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 2000) // Poll every 2s
    return () => clearInterval(interval)
  }, [selectedPatient]) // Add dependency to ensure refetch logic works

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
             <div key={patient.patient_id} onClick={() => handlePatientClick(patient)} className="cursor-pointer hover:transform hover:scale-105 transition-transform duration-200">
                <PatientCard data={patient} />
             </div>
          ))
        )}
      </main>

      {/* Detail Modal */}
      {isModalOpen && (
        <PatientDetailsModal 
          patient={selectedPatient} 
          history={patientHistory} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  )
}

export default App

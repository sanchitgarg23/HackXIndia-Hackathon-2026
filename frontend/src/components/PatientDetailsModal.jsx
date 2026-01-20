import React from 'react';
import { X, Activity, Heart, Wind, Thermometer } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const PatientDetailsModal = ({ patient, history, onClose }) => {
  if (!patient) return null;

  // Format timestamp for chart X-axis
  const chartData = history.map(item => ({
    ...item,
    time: item.timestamp.split('T')[1].split('.')[0].substring(0, 5) // HH:MM
  }));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 p-6 flex justify-between items-center border-b border-gray-700">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              {patient.patient_id}
              <span className={`text-sm px-3 py-1 rounded-full ${
                patient.risk_level === 'CRITICAL' ? 'bg-red-600' :
                patient.risk_level === 'HIGH' ? 'bg-orange-500' : 'bg-green-600'
              }`}>
                {patient.risk_level}
              </span>
            </h2>
            <p className="text-gray-400 mt-1">Live Monitoring Details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Heart Rate Chart */}
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold text-pink-400 mb-4 flex items-center gap-2">
                <Heart size={20} /> Heart Rate Trend
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis domain={[40, 160]} stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
                    <ReferenceLine y={100} stroke="#EF4444" strokeDasharray="3 3" label="High" />
                    <ReferenceLine y={60} stroke="#EF4444" strokeDasharray="3 3" label="Low" />
                    <Line type="monotone" dataKey="heart_rate" stroke="#EC4899" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* BP Chart */}
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <Activity size={20} /> Blood Pressure Trend
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis domain={[50, 200]} stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
                    <ReferenceLine y={90} stroke="#EF4444" strokeDasharray="3 3" label="Hypo" />
                    <Line type="monotone" dataKey="systolic_bp" stroke="#60A5FA" strokeWidth={3} dot={false} name="Systolic" />
                    <Line type="monotone" dataKey="diastolic_bp" stroke="#93C5FD" strokeWidth={2} dot={false} name="Diastolic" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SpO2 Chart */}
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                <Wind size={20} /> SpO2 Trend
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis domain={[80, 100]} stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
                    <ReferenceLine y={90} stroke="#EF4444" strokeDasharray="3 3" label="Hypoxia" />
                    <Line type="monotone" dataKey="sp_o2" stroke="#22D3EE" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Interventions Panel */}
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex flex-col">
               <h3 className="text-lg font-semibold text-yellow-500 mb-4 flex items-center gap-2">
                 ⚠️ Active Risks & Interventions
               </h3>
               {patient.suggested_interventions.length > 0 ? (
                 <div className="flex-1 bg-yellow-900/10 rounded-lg p-4 border border-yellow-900/30 overflow-y-auto">
                    <ul className="space-y-3">
                      {patient.suggested_interventions.map((action, i) => (
                        <li key={i} className="flex items-start gap-3 p-3 bg-gray-900 rounded-lg">
                          <span className="text-yellow-500 font-bold text-lg">{i+1}</span>
                          <span className="text-gray-200">{action}</span>
                        </li>
                      ))}
                    </ul>
                 </div>
               ) : (
                 <div className="flex-1 flex items-center justify-center text-gray-500 italic">
                   No active interventions required. Patient is stable.
                 </div>
               )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;

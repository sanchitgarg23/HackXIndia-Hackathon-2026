import React from 'react';
import { Heart, Activity, Thermometer, Wind, AlertTriangle, AlertOctagon } from 'lucide-react';

const PatientCard = ({ data }) => {
  const isCritical = data.risk_level === 'CRITICAL';
  const isHigh = data.risk_level === 'HIGH';
  
  const cardBorder = isCritical ? 'border-red-600 animate-pulse' : 
                   isHigh ? 'border-orange-500' : 'border-green-800';
                   
  const bgClass = isCritical ? 'bg-red-950/30' : 
                 isHigh ? 'bg-orange-950/20' : 'bg-gray-800';

  return (
    <div className={`rounded-xl border-2 ${cardBorder} ${bgClass} p-6 shadow-xl transition-all duration-300`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">{data.patient_id}</h2>
          <span className="text-gray-400 text-sm">{data.timestamp.split('T')[1].split('.')[0]}</span>
        </div>
        <div className={`px-4 py-1 rounded-full font-bold text-sm tracking-wider
          ${isCritical ? 'bg-red-600 text-white' : 
            isHigh ? 'bg-orange-500 text-white' : 
            'bg-green-600 text-white'}`}>
          {data.risk_level}
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3 bg-gray-900/50 p-3 rounded-lg">
          <Heart className="text-pink-500" size={24} />
          <div>
            <p className="text-xs text-gray-400">Heart Rate</p>
            <p className="text-xl font-mono font-bold text-gray-200">{data.heart_rate} <span className="text-xs text-gray-500">bpm</span></p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-gray-900/50 p-3 rounded-lg">
          <Activity className="text-blue-400" size={24} />
          <div>
            <p className="text-xs text-gray-400">BP</p>
            <p className="text-xl font-mono font-bold text-gray-200">{data.systolic_bp}/{data.diastolic_bp}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-gray-900/50 p-3 rounded-lg">
          <Wind className="text-cyan-400" size={24} />
          <div>
            <p className="text-xs text-gray-400">SpO2</p>
            <p className="text-xl font-mono font-bold text-gray-200">{data.sp_o2}%</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-gray-900/50 p-3 rounded-lg">
          <Thermometer className="text-yellow-400" size={24} />
          <div>
            <p className="text-xs text-gray-400">Temp</p>
            <p className="text-xl font-mono font-bold text-gray-200">{data.temperature}°C</p>
          </div>
        </div>
      </div>

      {/* Alerts & Interventions */}
      {(isHigh || isCritical) && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-start space-x-2 text-red-300 bg-red-900/20 p-3 rounded-lg border border-red-900/50">
            <AlertTriangle className="shrink-0 mt-1" size={18} />
            <p className="text-sm font-semibold">{data.alert_message}</p>
          </div>
          
          {data.suggested_interventions.length > 0 && (
            <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-900/30">
              <p className="text-xs text-blue-400 uppercase tracking-widest font-bold mb-2">Suggested Actions</p>
              <ul className="list-disc pl-4 space-y-1">
                {data.suggested_interventions.map((action, i) => (
                  <li key={i} className="text-sm text-blue-200">{action}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientCard;

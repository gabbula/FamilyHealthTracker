import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useHealth } from '../contexts/HealthContext';
import { calculateBMI, formatWeight, formatHeight, getBMICategory } from '../utils/conversions';
import type { Gender, Ethnicity } from '../types';

// Mock reference data
const getReferenceData = (_age: number, gender: Gender, _ethnicity: Ethnicity) => {
  // This is mock data - in production, this would come from an API
  const baseWeight = gender === 'male' ? 75 : 65;
  const baseHeight = gender === 'male' ? 175 : 165;
  
  return {
    averageWeight: baseWeight,
    averageHeight: baseHeight,
    averageBMI: calculateBMI(baseWeight, baseHeight),
    healthyWeightRange: { min: baseWeight - 15, max: baseWeight + 15 },
    healthyBMIRange: { min: 18.5, max: 24.9 },
  };
};

export const ProfileDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profiles, healthRecords, unitSystem, deleteProfile } = useHealth();
  const [showReferenceData, setShowReferenceData] = useState(false);

  const profile = profiles.find(p => p.id === id);
  const records = useMemo(() => 
    healthRecords
      .filter(r => r.profileId === id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [healthRecords, id]
  );

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const referenceData = getReferenceData(profile.age, profile.gender, profile.ethnicity);
  const latestRecord = records[0];

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${profile.name}'s profile?`)) {
      deleteProfile(profile.id);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Profile
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-600 mt-1">
                {profile.age} years old • {profile.gender} • {profile.ethnicity}
              </p>
            </div>
            <button
              onClick={() => setShowReferenceData(!showReferenceData)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {showReferenceData ? 'Hide' : 'Show'} Reference Data
            </button>
          </div>
        </div>

        {/* Reference Data */}
        {showReferenceData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              Average Health Data for {profile.gender} • {profile.age} years • {profile.ethnicity}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Average Weight</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatWeight(referenceData.averageWeight, unitSystem === 'metric' ? 'kg' : 'lbs')}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Average Height</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatHeight(referenceData.averageHeight, unitSystem === 'metric' ? 'cm' : 'ft')}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Average BMI</p>
                <p className="text-2xl font-bold text-gray-900">
                  {referenceData.averageBMI.toFixed(1)}
                </p>
              </div>
            </div>
            <div className="mt-4 bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Healthy Ranges</p>
              <p className="text-gray-900">
                Weight: {formatWeight(referenceData.healthyWeightRange.min, unitSystem === 'metric' ? 'kg' : 'lbs')} - {formatWeight(referenceData.healthyWeightRange.max, unitSystem === 'metric' ? 'kg' : 'lbs')}
              </p>
              <p className="text-gray-900">
                BMI: {referenceData.healthyBMIRange.min} - {referenceData.healthyBMIRange.max}
              </p>
            </div>
          </div>
        )}

        {/* Latest Stats */}
        {latestRecord && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Latest Measurements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Weight</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatWeight(latestRecord.weight, latestRecord.weightUnit)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Height</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatHeight(latestRecord.height, latestRecord.heightUnit)}
                </p>
              </div>
              {latestRecord.bmi && (
                <div>
                  <p className="text-sm text-gray-600">BMI</p>
                  <p className="text-xl font-bold text-gray-900">{latestRecord.bmi.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">{getBMICategory(latestRecord.bmi)}</p>
                </div>
              )}
              {latestRecord.glucose && (
                <div>
                  <p className="text-sm text-gray-600">Glucose</p>
                  <p className="text-xl font-bold text-gray-900">
                    {latestRecord.glucose} {latestRecord.glucoseUnit}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Health Records History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Health Records History</h2>
          {records.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No health records yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Height</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">BMI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Glucose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map(record => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatWeight(record.weight, record.weightUnit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatHeight(record.height, record.heightUnit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.bmi ? record.bmi.toFixed(1) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.glucose ? `${record.glucose} ${record.glucoseUnit}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {record.notes || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

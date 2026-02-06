import { useNavigate } from 'react-router-dom';
import type { Profile } from '../types';
import { useHealth } from '../contexts/HealthContext';
import { formatWeight, formatHeight } from '../utils/conversions';

interface ProfileCardProps {
  profile: Profile;
  onAddRecord: (profile: Profile) => void;
}

export const ProfileCard = ({ profile, onAddRecord }: ProfileCardProps) => {
  const navigate = useNavigate();
  const { healthRecords } = useHealth();
  
  const records = healthRecords.filter(r => r.profileId === profile.id);
  const latestRecord = records.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
            <p className="text-sm text-gray-600">{profile.age} years old</p>
          </div>
        </div>
      </div>

      {latestRecord ? (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Weight:</span>
            <span className="font-medium text-gray-900">
              {formatWeight(latestRecord.weight, latestRecord.weightUnit)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Height:</span>
            <span className="font-medium text-gray-900">
              {formatHeight(latestRecord.height, latestRecord.heightUnit)}
            </span>
          </div>
          {latestRecord.bmi && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">BMI:</span>
              <span className="font-medium text-gray-900">
                {latestRecord.bmi.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-sm mb-4">No health records yet</p>
      )}

      <div className="flex space-x-2">
        <button
          onClick={() => navigate(`/profile/${profile.id}`)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
        <button
          onClick={() => onAddRecord(profile)}
          className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
        >
          Add Record
        </button>
      </div>
    </div>
  );
};

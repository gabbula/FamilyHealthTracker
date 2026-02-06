import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useHealth } from '../contexts/HealthContext';
import { ProfileCard } from '../components/ProfileCard';
import { AddProfileModal } from '../components/AddProfileModal';
import { HealthRecordModal } from '../components/HealthRecordModal';
import type { Profile } from '../types';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { profiles, unitSystem, setUnitSystem } = useHealth();
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [showHealthRecord, setShowHealthRecord] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [show2FASetup, setShow2FASetup] = useState(false);

  const handleAddHealthRecord = (profile: Profile) => {
    setSelectedProfile(profile);
    setShowHealthRecord(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Family Health Tracker</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={unitSystem}
                onChange={(e) => setUnitSystem(e.target.value as 'metric' | 'imperial')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="metric">Metric (kg, cm)</option>
                <option value="imperial">Imperial (lbs, ft/in)</option>
              </select>
              <button
                onClick={() => setShow2FASetup(true)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                {user?.twoFactorEnabled ? '2FA Enabled ✓' : 'Enable 2FA'}
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Profile Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddProfile(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md"
          >
            + Add Family Member
          </button>
        </div>

        {/* Profiles Grid */}
        {profiles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No family members yet</h3>
            <p className="text-gray-600 mb-6">Add your first family member to start tracking health data</p>
            <button
              onClick={() => setShowAddProfile(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Family Member
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map(profile => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onAddRecord={handleAddHealthRecord}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddProfile && (
        <AddProfileModal onClose={() => setShowAddProfile(false)} />
      )}

      {showHealthRecord && selectedProfile && (
        <HealthRecordModal
          profile={selectedProfile}
          onClose={() => {
            setShowHealthRecord(false);
            setSelectedProfile(null);
          }}
        />
      )}

      {show2FASetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Two-Factor Authentication</h3>
            <p className="text-gray-600 mb-4">
              {user?.twoFactorEnabled 
                ? '2FA is already enabled for your account.' 
                : 'Enable 2FA to add an extra layer of security to your account. In a production environment, this would generate a QR code for your authenticator app.'}
            </p>
            <button
              onClick={() => setShow2FASetup(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

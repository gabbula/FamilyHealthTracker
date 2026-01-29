import { useState } from 'react';
import { useHealth } from '../contexts/HealthContext';
import type { Profile } from '../types';
import { calculateBMI, lbsToKg, feetToCm } from '../utils/conversions';

interface HealthRecordModalProps {
  profile: Profile;
  onClose: () => void;
}

export const HealthRecordModal = ({ profile, onClose }: HealthRecordModalProps) => {
  const { addHealthRecord, unitSystem } = useHealth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [heightValue, setHeightValue] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [glucose, setGlucose] = useState('');
  const [bloodPressureSystolic, setBloodPressureSystolic] = useState('');
  const [bloodPressureDiastolic, setBloodPressureDiastolic] = useState('');
  const [notes, setNotes] = useState('');
  const [customFieldName, setCustomFieldName] = useState('');
  const [customFieldValue, setCustomFieldValue] = useState('');
  const [customFields, setCustomFields] = useState<Record<string, string>>({});

  const addCustomField = () => {
    if (customFieldName && customFieldValue) {
      setCustomFields({ ...customFields, [customFieldName]: customFieldValue });
      setCustomFieldName('');
      setCustomFieldValue('');
    }
  };

  const removeCustomField = (key: string) => {
    const newFields = { ...customFields };
    delete newFields[key];
    setCustomFields(newFields);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const weightKg = unitSystem === 'metric' ? parseFloat(weight) : lbsToKg(parseFloat(weight));
    let heightCm: number;
    
    if (unitSystem === 'metric') {
      heightCm = parseFloat(heightValue);
    } else {
      heightCm = feetToCm(parseInt(heightFeet), parseInt(heightInches));
    }

    const bmi = calculateBMI(weightKg, heightCm);

    addHealthRecord({
      profileId: profile.id,
      date: new Date(date),
      weight: parseFloat(weight),
      weightUnit: unitSystem === 'metric' ? 'kg' : 'lbs',
      height: unitSystem === 'metric' ? parseFloat(heightValue) : heightCm,
      heightUnit: unitSystem === 'metric' ? 'cm' : 'ft',
      glucose: glucose ? parseFloat(glucose) : undefined,
      glucoseUnit: 'mg/dL',
      bmi,
      bloodPressureSystolic: bloodPressureSystolic ? parseInt(bloodPressureSystolic) : undefined,
      bloodPressureDiastolic: bloodPressureDiastolic ? parseInt(bloodPressureDiastolic) : undefined,
      notes: notes || undefined,
      customFields: Object.keys(customFields).length > 0 ? customFields : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Add Health Record for {profile.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {unitSystem === 'metric' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={heightValue}
                  onChange={(e) => setHeightValue(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (feet)
                  </label>
                  <input
                    type="number"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (inches)
                  </label>
                  <input
                    type="number"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Glucose (mg/dL) - Optional
              </label>
              <input
                type="number"
                step="0.1"
                value={glucose}
                onChange={(e) => setGlucose(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Pressure (Systolic/Diastolic) - Optional
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="120"
                  value={bloodPressureSystolic}
                  onChange={(e) => setBloodPressureSystolic(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="flex items-center text-gray-600">/</span>
                <input
                  type="number"
                  placeholder="80"
                  value={bloodPressureDiastolic}
                  onChange={(e) => setBloodPressureDiastolic(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes - Optional
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Custom Fields */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Custom Fields (Optional)</h3>
            
            {Object.entries(customFields).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2 mb-2">
                <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                  <strong>{key}:</strong> {value}
                </span>
                <button
                  type="button"
                  onClick={() => removeCustomField(key)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
              <input
                type="text"
                placeholder="Field name (e.g., Cholesterol)"
                value={customFieldName}
                onChange={(e) => setCustomFieldName(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Value (e.g., 180 mg/dL)"
                value={customFieldValue}
                onChange={(e) => setCustomFieldValue(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addCustomField}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Field
              </button>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

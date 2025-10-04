import React from 'react';
import { OrganizationFeatures } from '@/constants/features';

const OrganizationFeatureSelector = ({ selectedFeatures, onChange }) => {
  const handleFeatureClick = (feature) => {
    if (selectedFeatures.includes(feature)) {
      onChange(selectedFeatures.filter(f => f !== feature));
    } else {
      onChange([...selectedFeatures, feature]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Assign Permissions</h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.values(OrganizationFeatures).map((feature) => (
          <div key={feature} className="flex items-center">
            <input
              type="checkbox"
              id={feature}
              checked={selectedFeatures.includes(feature)}
              onChange={() => handleFeatureClick(feature)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor={feature} className="ml-2 text-sm text-gray-700">
              {feature}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizationFeatureSelector;
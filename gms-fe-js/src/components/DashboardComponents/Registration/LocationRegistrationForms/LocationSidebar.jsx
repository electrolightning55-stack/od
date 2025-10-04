'use client';
import React from 'react';

const LocationSidebar = ({ currentStep, onStepChange, completedSteps = [] }) => {
    const steps = [
        { id: 'location-info', label: 'Location Information', step: 1 },
        { id: 'guard-details', label: 'Guards Requirement', step: 2 },
        { id: 'charges-breakup', label: 'Salary/ Charges Breakup for Office Use', step: 3 },
        { id: 'setup-invoice', label: 'Setup Location Invoice', step: 4 }
    ];

    const handleStepClick = (stepId) => {
        if (onStepChange) {
            onStepChange(stepId);
        }
    };

    return (
        <div className="w-72 bg-white border-r border-gray-200 rounded-xl h-full overflow-y-auto">
            <div className="p-3 mt-4">
                {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = completedSteps.includes(step.id);

                    return (
                        <div key={step.id} className="mb-3">
                            <button
                                onClick={() => handleStepClick(step.id)}
                                className={`w-full text-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive
                                    ? 'bg-themeYellow text-black shadow-md'
                                    : isCompleted
                                        ? 'bg-green-50 text-green-800 border border-green-200'
                                        : ' bg-[#cfd3d4] text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className="flex-1 text-[13px] text-center">{step.label}</span>
                                    {isCompleted && (
                                        <span className="ml-2 flex-shrink-0">
                                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LocationSidebar;
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const PayrollSidebar = ({ currentStep, onStepChange, completedSteps = [], onNext, onPrevious, showNavigation = true }) => {
    const router = useRouter();

    const steps = [
        { id: 'location-attendance-sheet', label: 'Location Attendance Sheet', step: 1, route: '/dashboard/payroll/location-attendance-sheet' },
        { id: 'set-guard-allowance', label: 'Set Guard Allowance', step: 2, route: '/dashboard/payroll/set-guard-allowance' },
        { id: 'location-gross-salary', label: 'Location Gross Salary', step: 3, route: '/dashboard/payroll/location-gross-salary' },
        { id: 'advances-deductions', label: 'Advances & Deductions', step: 4, route: '/dashboard/payroll/advances-deductions' },
        { id: 'location-payroll', label: 'Location Payroll (Net Payable)', step: 5, route: '/dashboard/payroll/location-payroll' },
        { id: 'payroll-process-transfer', label: 'Process Bank Transfer', step: 6, route: '/dashboard/payroll/payroll-process-transfer' },
    ];

    const currentStepIndex = steps.findIndex(step => step.id === currentStep);

    const handleStepClick = (stepId) => {
        const step = steps.find(s => s.id === stepId);
        if (step && step.route) {
            router.push(step.route);
        }
        if (onStepChange) {
            onStepChange(stepId);
        }
    };

    const handleNextClick = () => {
        if (currentStepIndex < steps.length - 1) {
            const nextStep = steps[currentStepIndex + 1];
            router.push(nextStep.route);
            if (onNext) {
                onNext();
            }
        }
    };

    const handlePreviousClick = () => {
        if (currentStepIndex > 0) {
            const prevStep = steps[currentStepIndex - 1];
            router.push(prevStep.route);
            if (onPrevious) {
                onPrevious();
            }
        }
    };

    return (
        <div className="w-56 bg-white border-r border-gray-200 rounded-xl h-full overflow-y-auto">
            <div className="p-2 mt-4">
                {steps.map((step) => {
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
                                    <span className="flex-1 text-[12px] text-center">{step.label}</span>
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

                {/* Navigation Buttons */}
                {showNavigation && (
                    <div className="p-2 border-t border-gray-200 mt-4">
                        <div className="flex gap-3">
                            <button
                                onClick={handlePreviousClick}
                                disabled={currentStepIndex === 0}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${currentStepIndex === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span className="text-[11px]">Previous</span>
                                </div>
                            </button>

                            <button
                                onClick={handleNextClick}
                                disabled={currentStepIndex === steps.length - 1}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${currentStepIndex === steps.length - 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-themeYellow text-black hover:bg-yellow-400'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-[11px]">Next</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        </div>

                        {/* Step indicator */}
                        <div className="mt-3 text-center">
                            <span className="text-xs text-gray-500">
                                Step {currentStepIndex + 1} of {steps.length}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayrollSidebar; 
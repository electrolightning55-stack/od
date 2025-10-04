'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { userRequest } from '@/lib/RequestMethods';
import LocationSidebar from '@/components/DashboardComponents/Registration/LocationRegistrationForms/LocationSidebar';
import LocationInformation from '@/components/DashboardComponents/Registration/LocationRegistrationForms/LocationInformation';
import LocationGuardsRequirement from '@/components/DashboardComponents/Registration/LocationRegistrationForms/LocationGuardsRequirement';
import LocationSalaryCharges from '@/components/DashboardComponents/Registration/LocationRegistrationForms/LocationSalaryCharges';
import LocationSetupInvoice from '@/components/DashboardComponents/Registration/LocationRegistrationForms/LocationSetupInvoice';


const LocationRegistrationPage = () => {
    const [currentStep, setCurrentStep] = useState('location-info');
    const [completedSteps, setCompletedSteps] = useState([]);
    const [formData, setFormData] = useState({});

    const steps = [
        { id: 'location-info', component: LocationInformation, label: 'Location Information' },
        { id: 'guard-details', component: LocationGuardsRequirement, label: 'Details of Guards/ Employees Requested' },
        { id: 'charges-breakup', component: LocationSalaryCharges, label: 'Salary/ Charges Breakup for Office Use' },
        { id: 'setup-invoice', component: LocationSetupInvoice, label: 'Setup Location Invoice' }
    ];

    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    const CurrentStepComponent = steps[currentStepIndex]?.component;

    const handleStepChange = (stepId) => {
        setCurrentStep(stepId);
    };

    const handleNext = (data = {}) => {
        // Save current step data
        setFormData(prev => ({
            ...prev,
            [currentStep]: data
        }));
        console.log(formData)
        // Mark current step as completed
        if (!completedSteps.includes(currentStep)) {
            setCompletedSteps(prev => [...prev, currentStep]);
        }

        // Move to next step
        if (currentStepIndex < steps.length - 1) {
            setCurrentStep(steps[currentStepIndex + 1].id);
        }
    };

    const handlePrevious = () => {
        const currentIndex = steps.findIndex(step => step.id === currentStep);
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1].id);
        }
    };

    const handleAutoSave = (data) => {
        setFormData(prev => ({
            ...prev,
            [currentStep]: { ...prev[currentStep], ...data }
        }));
    };


    const handleComplete = async (data = {}) => {
        // Save the latest data for the current step
        setFormData(prev => {
            const updatedFormData = {
                ...prev,
                [currentStep]: data
            };

            // Mark current step as completed
            if (!completedSteps.includes(currentStep)) {
                setCompletedSteps(prevSteps => [...prevSteps, currentStep]);
            }

            // Use a callback to ensure the latest formData is used after setFormData
            setTimeout(async () => {
                const payload = buildPayloadWithData(updatedFormData);
                console.log("Final Payload:", payload)
                try {
                    // console.log('Final Registration Payload:', payload);

                    const res = await userRequest.post('/location', payload);
                    if (res) {

                        toast.success('Location Registration Successful');

                        // Reset form after successful submission
                        setFormData({});
                        setCompletedSteps([]);
                        setCurrentStep('location-info');
                    }
                } catch (error) {
                    console.error('Registration failed:', error);
                    const errorMessage = "Location Registration failed";
                    const errorCause = error?.response?.data?.cause;
                    toast.error(`${errorMessage}${errorCause ? `: ${errorCause}` : ""}`);
                }
            }, 0);

            return updatedFormData;
        });
    };

    // Helper to build payload from provided data
    const buildPayloadWithData = (data) => {
        const locationInfo = data['location-info'] || {};
        const guards = (data['guard-details']?.guards || []);
        const salaryCharges = (data['charges-breakup']?.charges || []);
        const taxes = (data['setup-invoice']?.taxes || []);

        // Combine guards and salaryCharges by index
        const requestedGuards = guards.map((guard, idx) => {
            const salary = salaryCharges[idx] || {};
            return {
                guardCategoryId: guard.guardCategoryId || '',
                shiftId: guard.shiftId || '',
                quantity: Number(guard.quantity) || 0,
                gazettedHoliday: Number(guard.gazettedHoliday) || 0,
                chargesPerMonth: Number(guard.chargesPerMonth) || 0,
                overtimePerHour: Number(guard.overtimePerHour) || 0,
                allowance: Number(guard.allowance) || 0,
                finances: {
                    salaryPerMonth: Number(salary.finSalaryPerMonth) || 0,
                    gazettedHoliday: Number(salary.finGazettedHoliday) || 0,
                    overtimePerHour: Number(salary.finOvertimePerHour) || 0,
                    allowance: Number(salary.finAllowance) || 0,
                }
            }
        });

        // Build base payload
        const payload = {
            clientId: locationInfo.clientId || "",
            officeId: locationInfo.officeId || "",
            locationName: locationInfo.locationName || "",
            address: locationInfo.address || "",
            city: locationInfo.city || "",
            provinceState: locationInfo.provinceState || "",
            country: locationInfo.country || "",
            authorizedPersonName: locationInfo.authorizedPersonName || "",
            authorizedPersonNumber: locationInfo.authorizedPersonNumber || "",
            authorizedPersonDesignation: locationInfo.authorizedPersonDesignation || "",
            taxes: taxes,
            requestedGuards: requestedGuards
        };

        // Add optional fields only if they have values
        if (locationInfo.GPScoordinate && locationInfo.GPScoordinate.trim() !== "") {
            payload.GPScoordinate = locationInfo.GPScoordinate;
        }

        if (locationInfo.locationTypeId && locationInfo.locationTypeId.trim() !== "") {
            payload.locationTypeId = locationInfo.locationTypeId;
        }

        return payload;
    };

    return (
        <div className="min-h-screen bg-formBGBlue">
            <div className='px-4 pt-4'>
                <aside className="bg-white border-b rounded-xl border-gray-200">
                    <div className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>Dashboard</span>
                            <span>&gt;</span>
                            <span>Registration</span>
                            <span>&gt;</span>
                            <span className="text-gray-900 font-medium">Location Registration</span>
                        </div>
                    </div>
                </aside>
            </div>

            <div className="flex h-[calc(100vh-73px)] p-4 gap-5">
                <LocationSidebar
                    currentStep={currentStep}
                    onStepChange={handleStepChange}
                    completedSteps={completedSteps}
                />

                <div className="flex-1 overflow-y-auto rounded-xl">
                    {CurrentStepComponent && (
                        <CurrentStepComponent
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                            onComplete={handleComplete}
                            onSave={handleAutoSave}
                            initialData={formData[currentStep] || {}}
                            guardsData={formData['guard-details']?.guards || []} // Pass guards data to all steps, only used by LocationSalaryCharges
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocationRegistrationPage; 
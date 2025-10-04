'use client';
import React, { useState } from 'react';
import EmployeeSidebar from '@/components/DashboardComponents/Registration/EmployeeRegistrationForm/EmployeeSidebar';
import EmployeePersonalInformation from '@/components/DashboardComponents/Registration/EmployeeRegistrationForm/EmployeePersonalInformation';
import EmployeeNextOfKin from '@/components/DashboardComponents/Registration/EmployeeRegistrationForm/EmployeeNextOfKin';
import EmployeeAcademics from '@/components/DashboardComponents/Registration/EmployeeRegistrationForm/EmployeeAcademics';
import EmployeeExperience from '@/components/DashboardComponents/Registration/EmployeeRegistrationForm/EmployeeExperience';
import EmployeeBankAccount from '@/components/DashboardComponents/Registration/EmployeeRegistrationForm/EmployeeBankAccount';
import EmployeeReferences from '@/components/DashboardComponents/Registration/EmployeeRegistrationForm/EmployeeReferences';
import EmployeeDocuments from '@/components/DashboardComponents/Registration/EmployeeRegistrationForm/EmployeeDocuments';
import EmployeeBioMetric from '@/components/DashboardComponents/Registration/EmployeeRegistrationForm/EmployeeBioMetric';
import toast from 'react-hot-toast';
import { userRequest } from '@/lib/RequestMethods';

const EmployeeRegistrationPage = () => {
    const [currentStep, setCurrentStep] = useState('personal-info');
    const [completedSteps, setCompletedSteps] = useState([]);
    const [formData, setFormData] = useState({});

    const steps = [
        { id: 'personal-info', component: EmployeePersonalInformation, label: 'Personal Information' },
        { id: 'next-of-kin', component: EmployeeNextOfKin, label: 'Next of Kin/ Emergency Contact' },
        { id: 'academics', component: EmployeeAcademics, label: 'Academics & Licenses' },
        { id: 'experience', component: EmployeeExperience, label: 'Experience' },
        { id: 'bank-account', component: EmployeeBankAccount, label: 'Add Bank Account' },
        { id: 'references', component: EmployeeReferences, label: 'References / Guarantors' },
        { id: 'documents', component: EmployeeDocuments, label: 'Upload Employee Documents' },
        { id: 'bio-metric', component: EmployeeBioMetric, label: 'Bio-Metric' }
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
        if (currentStepIndex > 0) {
            setCurrentStep(steps[currentStepIndex - 1].id);
        }
    };

    // Handle auto-save for documents without navigation
    const handleAutoSave = (data) => {
        // Save the data to formData state without moving to next step
        setFormData(prev => ({
            ...prev,
            [currentStep]: data
        }));

    };

    // Utility to recursively clean payload by removing empty, null, or undefined values
    const cleanPayload = (obj) => {
        if (Array.isArray(obj)) {
            return obj
                .map(cleanPayload)
                .filter(item => !(item == null || (typeof item === 'object' && Object.keys(item).length === 0)));
        } else if (typeof obj === 'object' && obj !== null) {
            const cleaned = {};
            Object.entries(obj).forEach(([key, value]) => {
                if (
                    value !== null &&
                    value !== undefined &&
                    value !== '' &&
                    !(Array.isArray(value) && value.length === 0) &&
                    !(typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
                ) {
                    cleaned[key] = cleanPayload(value);
                }
            });
            return cleaned;
        }
        return obj;
    };

    const handleComplete = async () => {
        // Mark current step as completed
        if (!completedSteps.includes(currentStep)) {
            setCompletedSteps(prev => [...prev, currentStep]);
        }



        // Structure data according to API format
        const personalInfo = formData['personal-info'] || {};
        const nextOfKin = formData['next-of-kin'] || {};
        const academics = formData['academics'] || {};
        const experience = formData['experience'] || {};
        const bankAccount = formData['bank-account'] || {};
        const references = formData['references'] || {};
        const employeeDocuments = formData['documents'] || {};
        const biometric = formData['bio-metric'] || {};

        const formatDateToISO = (dateValue) => {
            if (!dateValue || dateValue === '') return null;

            try {
                const date = new Date(dateValue);
                if (isNaN(date.getTime())) return null;
                return date.toISOString(); // Returns full ISO timestamp like 2024-03-15T10:30:00.000Z
            } catch (error) {
                console.warn('Invalid date format:', dateValue);
                return null;
            }
        };

        const apiPayload = {
            // Personal Information fields
            registrationDate: formatDateToISO(personalInfo.registrationDate),
            fullName: personalInfo.fullName || null,
            fatherName: personalInfo.fatherName || null,
            dateOfBirth: formatDateToISO(personalInfo.dateOfBirth),
            cnicNumber: personalInfo.cnicNumber || null,
            cnicIssueDate: formatDateToISO(personalInfo.cnicIssueDate),
            cnicExpiryDate: formatDateToISO(personalInfo.cnicExpiryDate),
            currentAddress: personalInfo.currentAddress || null,
            permanentAddress: personalInfo.permanentAddress || null,
            religion: personalInfo.religion || null,
            religionSect: personalInfo.religionSect || null,
            weight: personalInfo.weight ? parseInt(personalInfo.weight) : null,
            height: personalInfo.height ? parseInt(personalInfo.height) : null,
            bloodGroup: personalInfo.bloodGroup || null,
            bloodPressure: personalInfo.bloodPressure || null,
            heartBeat: personalInfo.heartBeat || null,
            eyeColor: personalInfo.eyeColor || null,
            contactNumber: personalInfo.contactNumber || null,
            disability: personalInfo.disability || null,
            eobiNumber: personalInfo.eobiNumber || null,
            sessiNumber: personalInfo.sessiNumber || null,

            // Next of Kin fields
            kinName: nextOfKin.kinName || null,
            kinFatherName: nextOfKin.kinFatherName || null,
            kinRelation: nextOfKin.kinRelation || null,
            kinCNIC: nextOfKin.kinCNIC || null,
            kinContactNumber: nextOfKin.kinContactNumber || null,

            // Academic object
            academic: {
                lastEducation: academics.lastEducation || null,
                institute: academics.institute || null,
                hasDrivingLicense: academics.hasDrivingLicense || false
            },

            // Driving License object (only if has driving license)
            drivingLicense: academics.hasDrivingLicense ? {
                drivingLicenseNo: academics.drivingLicenseNo || null,
                drivingLicenseIssueDate: formatDateToISO(academics.drivingLicenseIssueDate),
                drivingLicenseExpiryDate: formatDateToISO(academics.drivingLicenseExpiryDate),
                licenseIssueCity: academics.licenseIssueCity || null
            } : null,

            // Employee Experience array
            employeeExperience: experience.experiences ? experience.experiences.map(exp => ({
                totalYears: exp.totalYears ? parseInt(exp.totalYears) : null,
                placeOfDuty: exp.placeOfDuty || null,
                recentCivilEmployment: exp.recentCivilEmployment || null
            })) : [],

            // References array
            references: references.references ? references.references.map(ref => ({
                fullName: ref.fullName || null,
                fatherName: ref.fatherName || null,
                cnicNumber: ref.cnicNumber || null,
                cnicFront: ref.cnicFront || null,
                cnicBack: ref.cnicBack || null,
                contactNumber: ref.contactNumber || null,
                relationship: ref.relationship || null,
                currentAddress: ref.currentAddress || null,
                permanentAddress: ref.permanentAddress || null
            })) : [],

            // Bank Account object
            bankAccount: {
                bankName: bankAccount.bankName || null,
                bankCode: bankAccount.bankCode || null,
                accountNumber: bankAccount.accountNumber || null,
                IBAN: bankAccount.IBAN || null,
                branchCode: bankAccount.branchCode || null,
                branch: bankAccount.branch || null
            },

            // Employee Documents object
            employeeDocuments: {
                picture: employeeDocuments.employeeDocuments?.picture || "",
                cnicFront: employeeDocuments.employeeDocuments?.cnicFront || "",
                cnicBack: employeeDocuments.employeeDocuments?.cnicBack || "",
                licenseFront: employeeDocuments.employeeDocuments?.licenseFront || "",
                licenseBack: employeeDocuments.employeeDocuments?.licenseBack || ""
            },

            // Biometric object
            biometric: {
                rightThumb: biometric.biometric?.rightThumb || "",
                rightMiddleFinger: biometric.biometric?.rightMiddleFinger || "",
                rightLittleFinger: biometric.biometric?.rightLittleFinger || "",
                leftThumb: biometric.biometric?.leftThumb || "",
                leftMiddleFinger: biometric.biometric?.leftMiddleFinger || "",
                leftLittleFinger: biometric.biometric?.leftLittleFinger || "",
                rightForeFinger: biometric.biometric?.rightForeFinger || "",
                rightRingFinger: biometric.biometric?.rightRingFinger || "",
                rightFourFinger: biometric.biometric?.rightFourFinger || "",
                leftFourFinger: biometric.biometric?.leftFourFinger || "",
                leftRingFinger: biometric.biometric?.leftRingFinger || "",
                leftForeFinger: biometric.biometric?.leftForeFinger || ""
            }
        };

        // Clean the payload by removing empty, null, or undefined values
        const cleanedPayload = cleanPayload(apiPayload);
        console.log("Final Cleaned Payload:", cleanedPayload);

        try {
            const res = await userRequest.post('/employee', cleanedPayload);

            if (res) {
                console.log('Employee Registration successful:', res.data);
                toast.success('Employee Registration Successful');

                // Reset form
                setFormData({});
                setCompletedSteps([]);
                setCurrentStep('personal-info');
            }
        } catch (error) {
            console.error('Employee Registration failed:', error);
            toast.error("Failed to register employee: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="min-h-screen bg-formBGBlue">
            {/* Header */}
            <div className='px-4 pt-4'>
                <aside className="bg-white border-b rounded-xl border-gray-200 ">
                    <div className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>Dashboard</span>
                            <span>&gt;</span>
                            <span>Registration</span>
                            <span>&gt;</span>
                            <span className="text-gray-900 font-medium">Employee Registration</span>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Main Content */}
            <div className="flex h-[calc(100vh-73px)] p-4 gap-5">
                {/* Sidebar */}
                <EmployeeSidebar
                    currentStep={currentStep}
                    onStepChange={handleStepChange}
                    completedSteps={completedSteps}
                />

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto rounded-xl">
                    {CurrentStepComponent && (
                        <CurrentStepComponent
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                            onComplete={handleComplete}
                            onSave={handleAutoSave}
                            initialData={formData[currentStep] || {}}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeRegistrationPage; 
'use client';
import React, { useState } from 'react';
import GuardsSidebar from '@/components/DashboardComponents/Registration/GuardRegistrationForms/GuardsSidebar';
import GuardPersonalInformation from '@/components/DashboardComponents/Registration/GuardRegistrationForms/GuardPersonalInformation';
import GuardNextOfKin from '@/components/DashboardComponents/Registration/GuardRegistrationForms/GuardNextOfKin';
import GuardAcademics from '@/components/DashboardComponents/Registration/GuardRegistrationForms/GuardAcademics';
import GuardExperience from '@/components/DashboardComponents/Registration/GuardRegistrationForms/GuardExperience';
import GuardBankAccount from '@/components/DashboardComponents/Registration/GuardRegistrationForms/GuardBankAccount';
import GuardReferences from '@/components/DashboardComponents/Registration/GuardRegistrationForms/GuardReferences';
import GuardDocuments from '@/components/DashboardComponents/Registration/GuardRegistrationForms/GuardDocuments';
import GuardBioMetric from '@/components/DashboardComponents/Registration/GuardRegistrationForms/GuardBioMetric';
import toast from 'react-hot-toast';
import { userRequest } from '@/lib/RequestMethods';

const GuardsRegistrationPage = () => {
    const [currentStep, setCurrentStep] = useState('personal-info');
    const [completedSteps, setCompletedSteps] = useState([]);
    const [formData, setFormData] = useState({});

    const steps = [
        { id: 'personal-info', component: GuardPersonalInformation, label: 'Personal Information' },
        { id: 'next-of-kin', component: GuardNextOfKin, label: 'Next of Kin/ Emergency Contact' },
        { id: 'academics', component: GuardAcademics, label: 'Academics & Licenses' },
        { id: 'experience', component: GuardExperience, label: 'Experience' },
        { id: 'bank-account', component: GuardBankAccount, label: 'Add Bank Account' },
        { id: 'references', component: GuardReferences, label: 'References / Guarantors' },
        { id: 'documents', component: GuardDocuments, label: 'Upload Employee Documents' },
        { id: 'bio-metric', component: GuardBioMetric, label: 'Bio-Metric' }
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
        console.log('Auto-saved:', currentStep, data);
    };

    // Utility to recursively clean payload
    function cleanPayload(obj) {
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
    }

    const handleComplete = async () => {
        // Mark current step as completed
        if (!completedSteps.includes(currentStep)) {
            setCompletedSteps(prev => [...prev, currentStep]);
        }

        // Comprehensive validation of all required fields
        const validationErrors = [];

        // 1. Personal Information validation
        const personalData = formData['personal-info'] || {};
        if (!personalData.officeId) validationErrors.push('Branch/Office selection');
        if (!personalData.serviceNumber) validationErrors.push('Service Number');
        if (!personalData.fullName) validationErrors.push('Full Name');
        if (!personalData.cnicNumber) validationErrors.push('CNIC Number');
        if (!personalData.dateOfBirth) validationErrors.push('Date of Birth');
        if (!personalData.cnicIssueDate) validationErrors.push('CNIC Issue Date');
        if (!personalData.cnicExpiryDate) validationErrors.push('CNIC Expiry Date');
        if (!personalData.contactNumber) validationErrors.push('Contact Number');
        if (!personalData.height || personalData.height < 5.6) validationErrors.push('Height (minimum 5.6 ft)');

        // 2. Documents validation
        const documentsData = formData['documents']?.guardDocuments || {};
        if (!documentsData.picture) validationErrors.push('Picture');
        if (!documentsData.cnicFront) validationErrors.push('CNIC Front');
        if (!documentsData.cnicBack) validationErrors.push('CNIC Back');
        if (typeof documentsData.originalCNICSubmitted !== 'boolean') {
            validationErrors.push('Original CNIC Submitted (Yes/No)');
        }

        // 3. Check if user has completed all steps
        const requiredSteps = ['personal-info', 'documents'];
        const missingSteps = requiredSteps.filter(step => !formData[step]);

        if (missingSteps.length > 0) {
            const stepNames = missingSteps.map(step => {
                switch (step) {
                    case 'personal-info': return 'Personal Information';
                    case 'documents': return 'Documents Upload';
                    default: return step;
                }
            }).join(', ');
            validationErrors.push(`Complete the following steps: ${stepNames}`);
        }

        // Show validation errors if any
        if (validationErrors.length > 0) {
            const errorMessage = validationErrors.length === 1
                ? `Please fill in: ${validationErrors[0]}`
                : `Please fill in the following required fields:\n• ${validationErrors.join('\n• ')}`;

            toast.error(errorMessage);
            return;
        }

        // Structure data according to API format
        const personalInfo = formData['personal-info'] || {};
        const nextOfKin = formData['next-of-kin'] || {};
        const academics = formData['academics'] || {};
        const experience = formData['experience'] || {};
        const bankAccount = formData['bank-account'] || {};
        const references = formData['references'] || {};
        const guardDocuments = formData['documents'] || {};
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
            officeId: personalInfo.officeId || null,
            registrationDate: formatDateToISO(personalInfo.registrationDate),
            serviceNumber: personalInfo.serviceNumber ? parseInt(personalInfo.serviceNumber) : null,
            dateOfBirth: formatDateToISO(personalInfo.dateOfBirth),
            fullName: personalInfo.fullName || null,
            fatherName: personalInfo.fatherName || null,
            cnicNumber: personalInfo.cnicNumber || null,
            cnicIssueDate: formatDateToISO(personalInfo.cnicIssueDate),
            cnicExpiryDate: formatDateToISO(personalInfo.cnicExpiryDate),
            contactNumber: personalInfo.contactNumber || null,
            currentAddress: personalInfo.currentAddress || null,
            permanentAddress: personalInfo.permanentAddress || null,
            currentAreaPoliceStation: personalInfo.currentAreaPoliceStation || null,
            currentAreaPoliceContact: personalInfo.currentAreaPoliceContact || null,
            permanentAreaPoliceStation: personalInfo.permanentAreaPoliceStation || null,
            permanentAreaPoliceContact: personalInfo.permanentAreaPoliceContact || null,
            religion: personalInfo.religion || null,
            religionSect: personalInfo.religionSect || null,
            weight: personalInfo.weight ? parseInt(personalInfo.weight) : null,
            height: personalInfo.height ? parseInt(personalInfo.height) : null,
            bloodGroup: personalInfo.bloodGroup || null,
            bloodPressure: personalInfo.bloodPressure || null,
            heartBeat: personalInfo.heartBeat || null,
            eyeColor: personalInfo.eyeColor || null,
            disability: personalInfo.disability || null,
            eobiNumber: personalInfo.eobiNumber || null,
            sessiNumber: personalInfo.sessiNumber || null,

            // Next of Kin fields
            kinName: nextOfKin.kinName || null,
            kinFatherName: nextOfKin.kinFatherName || null,
            kinRelation: nextOfKin.kinRelation || null,
            kinCNIC: nextOfKin.kinCNIC || null,
            kinContactNumber: nextOfKin.kinContactNumber || null,

            // Academic and Driving License objects
            academic: {
                lastEducation: academics.academic?.lastEducation || null,
                institute: academics.academic?.institute || null,
                hasDrivingLicense: academics.academic?.hasDrivingLicense || false
            },
            drivingLicense: {
                drivingLicenseNo: academics.drivingLicense?.drivingLicenseNo || null,
                drivingLicenseIssueDate: formatDateToISO(academics.drivingLicense?.drivingLicenseIssueDate),
                drivingLicenseExpiryDate: formatDateToISO(academics.drivingLicense?.drivingLicenseExpiryDate),
                licenseIssueCity: academics.drivingLicense?.licenseIssueCity || null
            },

            // Guard Experience array
            guardExperience: experience.guardExperience && experience.guardExperience.length > 0
                ? experience.guardExperience.map(exp => ({
                    isExServiceMen: exp.isExServiceMen || false,
                    rankName: exp.rankName || null,
                    armyNumber: exp.armyNumber || null,
                    unit: exp.unit || null,
                    exServiceDischargeNumber: exp.exServiceDischargeNumber || null,
                    branch: exp.branch || null,
                    serviceYears: exp.serviceYears ? parseInt(exp.serviceYears) : null,
                    serviceMonths: exp.serviceMonths ? parseInt(exp.serviceMonths) : null,
                    securityYears: exp.securityYears ? parseInt(exp.securityYears) : null,
                    place: exp.place || null,
                    recentCivilEmployment: exp.recentCivilEmployment || null
                }))
                : [{
                    isExServiceMen: false,
                    rankName: null,
                    armyNumber: null,
                    unit: null,
                    exServiceDischargeNumber: null,
                    branch: null,
                    serviceYears: null,
                    serviceMonths: null,
                    securityYears: null,
                    place: null,
                    recentCivilEmployment: null
                }],

            // References array
            references: references.references && references.references.length > 0
                ? references.references.map(ref => ({
                    fullName: ref.fullName || null,
                    fatherName: ref.fatherName || null,
                    cnicNumber: ref.cnicNumber || null,
                    cnicFront: ref.cnicFront || null,
                    cnicBack: ref.cnicFront || null,
                    contactNumber: ref.contactNumber || null,
                    relationship: ref.relationship || null,
                    currentAddress: ref.currentAddress || null,
                    permanentAddress: ref.permanentAddress || null
                }))
                : [{
                    fullName: null,
                    fatherName: null,
                    cnicNumber: null,
                    cnicFront: null,
                    cnicBack: null,
                    contactNumber: null,
                    relationship: null,
                    currentAddress: null,
                    permanentAddress: null
                }],

            // Bank Account object
            bankAccount: {
                bankName: bankAccount.bankAccount?.bankName || null,
                bankCode: bankAccount.bankAccount?.bankCode || null,
                accountTitle: bankAccount.bankAccount?.accountTitle || null,
                accountNumber: bankAccount.bankAccount?.accountNumber || null,
                IBAN: bankAccount.bankAccount?.IBAN || null,
                branchCode: bankAccount.bankAccount?.branchCode || null,
                branch: bankAccount.bankAccount?.branch || null
            },

            // Guard Documents object
            guardDocuments: {
                picture: guardDocuments.guardDocuments?.picture || "",
                cnicFront: guardDocuments.guardDocuments?.cnicFront || "",
                cnicBack: guardDocuments.guardDocuments?.cnicBack || "",
                licenseFront: guardDocuments.guardDocuments?.licenseFront || "",
                licenseBack: guardDocuments.guardDocuments?.licenseBack || "",
                policeVerification: guardDocuments.guardDocuments?.policeVerification || "",
                specialBranchVerification: guardDocuments.guardDocuments?.specialBranchVerification || "",
                dischargeBook: guardDocuments.guardDocuments?.dischargeBook || "",
                NadraVeriSys: guardDocuments.guardDocuments?.NadraVeriSys || "",
                NadraVeriSysRef1: guardDocuments.guardDocuments?.NadraVeriSysRef1 || "",
                NadraVeriSysRef2: guardDocuments.guardDocuments?.NadraVeriSysRef2 || "",
                healthCertificate: guardDocuments.guardDocuments?.healthCertificate || "",
                medicalDocument: guardDocuments.guardDocuments?.medicalDocument || "",
                DDCDriving: guardDocuments.guardDocuments?.DDCDriving || "",
                educationCertificate: guardDocuments.guardDocuments?.educationCertificate || "",
                APSAATrainingCertificate: guardDocuments.guardDocuments?.APSAATrainingCertificate || "",
                misc1: guardDocuments.guardDocuments?.misc1 || "",
                misc2: guardDocuments.guardDocuments?.misc2 || "",
                originalCNICSubmitted: guardDocuments.guardDocuments?.originalCNICSubmitted || false
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

        const cleanedPayload = cleanPayload(apiPayload);
        console.log("final Payload", cleanedPayload)
        try {
            const res = await userRequest.post('/guards', cleanedPayload);

            if (res) {
                console.log('Registration successful:', res.data);
                toast.success('Guard Registration Successful');

                setFormData({});
                setCompletedSteps([]);
                setCurrentStep('personal-info');
            }
        } catch (error) {
            console.error('Registration failed:', error);

            const errorMessage = "Registration failed";
            const errorCause = error?.response?.data?.cause;

            toast.error(`${errorMessage}${errorCause ? `: ${errorCause}` : ""}`);
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
                            <span className="text-gray-900 font-medium">Guards Registration</span>
                        </div>
                    </div>
                </aside>
            </div>


            <div className="flex h-[calc(100vh-73px)] p-4 gap-5">
                {/* Sidebar */}
                <GuardsSidebar
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
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuardsRegistrationPage; 
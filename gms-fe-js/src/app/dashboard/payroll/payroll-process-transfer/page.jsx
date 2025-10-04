
import React from 'react'
import ProcessBankTransfer from '@/components/DashboardComponents/Payroll/ProcessBankTransfer'
import PayrollSidebar from '@/components/DashboardComponents/Payroll/PayrollSidebar'

const PayrollProcessTransferPage = () => {
    return (
        <div className='min-h-screen bg-formBGBlue flex flex-col w-full'>
            <div className="flex h-[calc(100vh-73px)] p-4 gap-5">
                {/* Sidebar */}
                <PayrollSidebar
                    currentStep="payroll-process-transfer"
                    completedSteps={[]}
                    showNavigation={true}
                />

                <div className="flex-1 overflow-y-auto rounded-xl">
                    <ProcessBankTransfer />
                </div>
            </div>
        </div>
    )
}

export default PayrollProcessTransferPage
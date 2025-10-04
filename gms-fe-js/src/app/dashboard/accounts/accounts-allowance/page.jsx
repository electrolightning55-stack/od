"use client"
import React from 'react'
import Breadcrumbs from '@/common/DashboardCommon/Breadcrumbs'
import AccountsAllowance from '@/components/DashboardComponents/Accounts/AccountsAllowances/AccountsAllowance'

const AccountsAllowanceDeductions = () => {
    return (
        <div className="min-h-screen bg-formBGBlue flex flex-col w-full px-4 pt-4">
            <Breadcrumbs breadcrumbs={[{ label: 'Dashboard' }, { label: 'Accounts' }, { label: 'Allowance & Deductions' }]} />

            <AccountsAllowance />
        </div>
    )
}

export default AccountsAllowanceDeductions
import React from 'react'
import Breadcrumbs from '@/common/DashboardCommon/Breadcrumbs'
import AccountsGeneralLedger from '@/components/DashboardComponents/Accounts/AccountsGeneralLedger/AccountsGeneralLedger'

const AccountsGeneralLedgerPage = () => {
    return (
        <div className="min-h-screen bg-formBGBlue flex flex-col w-full px-4 pt-4">
            <Breadcrumbs breadcrumbs={[{ label: 'Dashboard' }, { label: 'Accounts' }, { label: 'General Ledger' }]} />

            <AccountsGeneralLedger />
        </div>
    )
}

export default AccountsGeneralLedgerPage    
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Building2, Plus } from 'lucide-react';
import React from 'react';

// --- Type Definitions ---

// Defines the structure for a single bank account object.
interface BankAccount {
    id: number;
    name: string;
    balance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    gradient: string;
    icon: string;
    description: string;
}

// --- Breadcrumbs Configuration ---
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Accounts', href: '/accounts' }
];

export default function Accounts() {
    // --- Component State & Data ---
    const totalBalance = 16_456_400;
    const totalBalanceExcluded = 265_426_400;

    // Helper function to format currency
    const formatCurrency = (val: number): string => `${val.toLocaleString('id-ID', { minimumFractionDigits: 2 })} IDR`;

    // Data for bank accounts, typed as an array of BankAccount objects.
    const bankAccounts: BankAccount[] = [
        {
            id: 1,
            name: 'Bank Jago',
            balance: 9_950_000,
            monthlyIncome: 10_000_000,
            monthlyExpenses: 50_000,
            gradient: 'from-purple-600 to-purple-700', // Jago's purple theme
            icon: '🏦',
            description: 'Primary Banking Account'
        },
        {
            id: 2,
            name: 'BCA',
            balance: 248_970_000,
            monthlyIncome: 248_970_000,
            monthlyExpenses: 0,
            gradient: 'from-blue-600 to-blue-700', // BCA's blue theme
            icon: '💳', // Corrected Icon
            description: 'Savings & Investment'
        },
        {
            id: 3,
            name: 'Gopay',
            balance: 1_000_000,
            monthlyIncome: 1_000_000,
            monthlyExpenses: 0,
            gradient: 'from-green-500 to-green-600', // Gopay's green theme
            icon: '📱',
            description: 'Digital Wallet'
        },
        {
            id: 4,
            name: 'Bank Mandiri',
            balance: 5_506_400,
            monthlyIncome: 5_506_400,
            monthlyExpenses: 0,
            gradient: 'from-yellow-500 to-orange-500', // Mandiri's gold/yellow theme
            icon: '🏛️',
            description: 'Business Account'
        }
    ];

    // --- Render ---
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accounts" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Accounts
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400 mt-1">
                                    Manage your financial accounts
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {bankAccounts.length} Active Accounts
                            </span>
                        </div>
                    </div>

                    {/* Balance Summary Cards */}
                    <div className="grid gap-6 lg:grid-cols-2 mb-8">
                        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden group bg-white dark:bg-slate-800">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10"></div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/20 rounded-full -translate-y-16 translate-x-16"></div>
                            <CardContent className="p-8 text-center relative z-10">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <div className="text-2xl">💰</div>
                                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                                        Total Balance
                                    </h3>
                                </div>
                                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                                    {formatCurrency(totalBalance)}
                                </div>
                                <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                    Active Accounts
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden group bg-white dark:bg-slate-800">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/20 rounded-full -translate-y-16 translate-x-16"></div>
                            <CardContent className="p-8 text-center relative z-10">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <div className="text-2xl">📊</div>
                                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                                        Total Balance (excluded)
                                    </h3>
                                </div>
                                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    {formatCurrency(totalBalanceExcluded)}
                                </div>
                                <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                                    All Accounts
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Bank Account Cards List */}
                    <div className="space-y-4">
                        {bankAccounts.map((account) => (
                            <Card 
                                key={account.id} 
                                className={`border-0 shadow-lg bg-gradient-to-br ${account.gradient} text-white hover:shadow-xl transition-all duration-300 hover:scale-[1.01] rounded-2xl`}
                            >
                                <CardContent className="p-6">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">{account.name}</h3>
                                            <div className="text-3xl font-bold">
                                                {formatCurrency(account.balance)}
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right space-y-2">
                                            <div className="text-sm opacity-90">
                                                Income: {formatCurrency(account.monthlyIncome)}
                                            </div>
                                            <div className="text-sm opacity-90">
                                                Expenses: {formatCurrency(account.monthlyExpenses)}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Add Account Button */}
                    <div className="mt-12 flex justify-center">
                        <button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <div className="relative flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-lg group-hover:rotate-180 transition-transform duration-300">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <span className="text-lg">Add New Account</span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white/20 rounded-full animate-pulse"></div>
                            <div className="absolute -top-2 -left-2 w-4 h-4 bg-white/30 rounded-full animate-bounce"></div>
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

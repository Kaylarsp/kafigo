import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, DollarSign, PieChart, BarChart3, Calendar } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

// Definisikan tipe data untuk semua props yang diterima dari Laravel
interface DashboardProps {
    totalBalance: number;
    income: number;
    outcome: number;
}

// Terima 'totalBalance', 'income', dan 'outcome' sebagai props
export default function Dashboard({ totalBalance, income, outcome }: DashboardProps) {
    // cashflow sekarang dihitung secara dinamis berdasarkan props
    const cashflow = income - outcome;

    // Fungsi bantuan untuk memformat mata uang
    const formatCurrency = (val: number) => `IDR ${(val / 1_000_000).toFixed(2)}m`;
    const formatFullCurrency = (val: number) => `IDR ${val.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`;

    // Mock data untuk chart (bisa dibuat dinamis pada tahap selanjutnya)
    const monthlyData = [
        { month: 'Jan', income: 180, outcome: 120 },
        { month: 'Feb', income: 220, outcome: 150 },
        { month: 'Mar', income: 265, outcome: 0 },
    ];

    const categories = [
        { name: 'Business Revenue', amount: 180_000_000, color: 'bg-blue-500', percentage: 68 },
        { name: 'Investments', amount: 65_000_000, color: 'bg-green-500', percentage: 24 },
        { name: 'Other Income', amount: 20_480_000, color: 'bg-purple-500', percentage: 8 },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <div className="flex flex-col gap-6 p-6">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Hi, Budiws 👋
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Welcome back! Here's your financial overview.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Calendar className="w-4 h-4" />
                            {new Date().toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>

                    {/* Top Cards - Sekarang menampilkan data dinamis */}
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Total Balance Card */}
                        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                            <CardHeader className="pb-2 relative z-10">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium opacity-90">Total Balance</CardTitle>
                                    <Wallet className="w-5 h-5 opacity-80" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-3xl font-bold mb-2">{formatCurrency(totalBalance)}</div>
                                <div className="flex items-center text-sm opacity-90">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span>+12.5% from last month</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Income Card */}
                        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-600 to-green-700 text-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                            <CardHeader className="pb-2 relative z-10">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium opacity-90">Income (This Month)</CardTitle>
                                    <ArrowUpRight className="w-5 h-5 opacity-80" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-3xl font-bold mb-2">{formatCurrency(income)}</div>
                                <div className="flex items-center text-sm opacity-90">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span>+8.2% this month</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Outcome Card */}
                        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-slate-600 to-slate-700 text-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                            <CardHeader className="pb-2 relative z-10">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium opacity-90">Outcome (This Month)</CardTitle>
                                    <ArrowDownRight className="w-5 h-5 opacity-80" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-3xl font-bold mb-2">{formatCurrency(outcome)}</div>
                                <div className="flex items-center text-sm opacity-90">
                                    <TrendingDown className="w-4 h-4 mr-1" />
                                    <span>-2.1% this month</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Cashflow Banner */}
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-l-4 border-l-emerald-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Monthly Cashflow</h3>
                                    <p className="text-slate-600 dark:text-slate-400">Your financial performance this month</p>
                                </div>
                                <div className="text-right">
                                    <div className={`text-3xl font-bold ${cashflow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {cashflow >= 0 ? '+' : ''}{formatCurrency(cashflow)}
                                    </div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                        {formatFullCurrency(cashflow)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Charts Section */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Income Breakdown */}
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <PieChart className="w-5 h-5 text-blue-600" />
                                        Income Breakdown
                                    </CardTitle>
                                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                        View Details
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {categories.map((category, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {category.name}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                    {formatCurrency(category.amount)}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {category.percentage}%
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Monthly Trend */}
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-green-600" />
                                        Monthly Trend
                                    </CardTitle>
                                    <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                                        View Report
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {monthlyData.map((data, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                    {data.month} 2024
                                                </span>
                                                <span className="text-slate-500">
                                                    {formatCurrency(data.income * 1_000_000)}
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${(data.income / 300) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-purple-600" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-4">
                                <button className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all duration-200 group">
                                    <div className="text-blue-600 group-hover:text-blue-700 font-medium">Add Income</div>
                                    <div className="text-xs text-blue-500 mt-1">Record new income</div>
                                </button>
                                <button className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg border border-red-200 dark:border-red-800 hover:shadow-md transition-all duration-200 group">
                                    <div className="text-red-600 group-hover:text-red-700 font-medium">Add Expense</div>
                                    <div className="text-xs text-red-500 mt-1">Record new expense</div>
                                </button>
                                <button className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-200 group">
                                    <div className="text-green-600 group-hover:text-green-700 font-medium">View Reports</div>
                                    <div className="text-xs text-green-500 mt-1">Financial analytics</div>
                                </button>
                                <button className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all duration-200 group">
                                    <div className="text-purple-600 group-hover:text-purple-700 font-medium">Settings</div>
                                    <div className="text-xs text-purple-500 mt-1">Manage preferences</div>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

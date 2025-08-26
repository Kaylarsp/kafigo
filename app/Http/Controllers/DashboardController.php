<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transaction; // Import the Transaction model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon; // Import Carbon for date handling

class DashboardController extends Controller
{
    /**
     * Display the dashboard with financial summaries.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = Auth::user();
        $now = Carbon::now();

        // 1. Calculate Total Balance from all user accounts
        // This sums the 'balance' column from the accounts table for the logged-in user.
        $totalBalance = (float) Account::where('user_id', $user->id)->sum('balance');

        // 2. Calculate Total Income for the Current Month
        // This sums the 'amount' from transactions where the type is 'income'
        // and the transaction_date is within the current month.
        $income = (float) Transaction::where('user_id', $user->id)
            ->where('type', 'income')
            ->whereBetween('transaction_date', [
                $now->startOfMonth()->copy(),
                $now->endOfMonth()->copy()
            ])
            ->sum('amount');

        // 3. Calculate Total Outcome for the Current Month
        // This sums the 'amount' from transactions where the type is 'outcome'
        // and the transaction_date is within the current month.
        $outcome = (float) Transaction::where('user_id', $user->id)
            ->where('type', 'outcome')
            ->whereBetween('transaction_date', [
                $now->startOfMonth()->copy(),
                $now->endOfMonth()->copy()
            ])
            ->sum('amount');

        // 4. Pass the calculated data as props to the React component
        return Inertia::render('dashboard/index', [
            'totalBalance' => $totalBalance,
            'income' => $income,
            'outcome' => $outcome,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Account;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with('account')->get();
        $accounts = Account::select('id', 'name')->get();

        return Inertia::render('transaction/index', [
            'transactions' => $transactions,
            'accounts' => $accounts,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'amount' => 'required|numeric',
            'type' => 'required|in:income,expense,transfer',
            'description' => 'nullable|string',
            'transaction_date' => 'required|date',
            'title' => 'nullable|string',
        ]);

        Transaction::create($data);

        return redirect()->back()->with('success', 'Transaction created');
    }

    public function update(Request $request, Transaction $transaction)
    {
        $data = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'amount' => 'required|numeric',
            'type' => 'required|in:income,expense,transfer',
            'description' => 'nullable|string',
            'transaction_date' => 'required|date',
            'title' => 'nullable|string',
        ]);

        $transaction->update($data);

        return redirect()->back()->with('success', 'Transaction updated');
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();

        return redirect()->back()->with('success', 'Transaction deleted');
    }
}
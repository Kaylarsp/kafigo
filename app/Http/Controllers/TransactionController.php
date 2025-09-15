<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Account;
use App\Models\Category;
use App\Models\Currency;
use App\Models\Tag;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with('account')->get();
        $accounts = Account::select('id', 'name')->get();
        $categories = Category::select('id', 'name')->get();
        $tags = Tag::select('id', 'name')->get();
        $currencies = Currency::select('id', 'code', 'name')->get();

        return Inertia::render('transaction/index', [
            'transactions' => $transactions,
            'accounts' => $accounts,
            'categories' => $categories,
            'tags' => $tags,
            'currencies' => $currencies
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'nullable|string',
            'account_id' => 'required|exists:accounts,id',
            'amount' => 'required|numeric',
            'type' => 'required|in:income,outcome,transfer',
            'transaction_date' => 'required|date',
            'description' => 'nullable|string',
            'category_id' => ['nullable', 'exists:categories,id'],
            'tags' => ['nullable', 'string'],

            'to_account_id' => [
                'nullable',                      // Boleh kosong jika bukan transfer
                'required_if:type,transfer',     // Wajib diisi jika tipenya 'transfer'
                'exists:accounts,id',            // Pastikan ID akunnya valid
                'different:account_id'           // Pastikan tidak transfer ke akun yang sama
            ],
        ]);

        $data['user_id'] = Auth::id();

        $this->updateAccountAmount($data['type'], $data['account_id'], $data['amount'], $data['to_account_id']);
        Transaction::create($data);

        return redirect()->back()->with('success', 'Transaction created');
    }

    public function update(Request $request, Transaction $transaction)
    {
        $data = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'to_account_id' => 'nullable|exists:accounts,id',
            'amount' => 'required|numeric',
            'type' => 'required|in:income,outcome,transfer',
            'description' => 'nullable|string',
            'transaction_date' => 'required|date',
            'title' => 'nullable|string',
        ]);

        $this->updateAccountAmount($data['type'], $data['account_id'], $data['amount'], $data['to_account_id']);

        $transaction->update($data);

        return redirect()->back()->with('success', 'Transaction updated');
    }

    public function updateAccountAmount($type, $account_id, $balance, $to_account_id = null)
    {
        $oldAccount = Account::find($account_id);
        if ($type == 'income') {
            $oldAccount->balance += $balance;
            $oldAccount->save();
        } else if ($type == 'outcome') {
            $oldAccount->balance -= $balance;
            $oldAccount->save();
        } else if($type == 'transfer' && $to_account_id != null) {
            $fromAccount = Account::find($account_id);
            $toAccount = Account::find($to_account_id);
            $fromAccount->balance -= $balance;
            $fromAccount->save();
            $toAccount->balance += $balance;
            $toAccount->save();
        }
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();

        return redirect()->back()->with('success', 'Transaction deleted');
    }
}

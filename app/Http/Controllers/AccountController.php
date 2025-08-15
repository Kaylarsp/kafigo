<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Currency;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index()
    {
        $accounts = Account::with('currency')->orderBy('order', 'asc')->get();
        $currencies = Currency::select('id', 'code', 'name')->get();
        return Inertia::render('account/index', [
            'accounts' => $accounts,
            'currencies' => $currencies
        ]);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:accounts,id',
            'direction' => 'required|in:up,down',
        ]);

        $account = Account::findOrFail($request->id);
        $direction = $request->direction;

        $swapWith = Account::where('user_id', $account->user_id)
            ->where('id', '!=', $account->id)
            ->orderBy('order', $direction === 'up' ? 'desc' : 'asc')
            ->get()
            ->first(function ($item) use ($account, $direction) {
                return $direction === 'up'
                    ? $item->order < $account->order
                    : $item->order > $account->order;
            });

        if ($swapWith) {
            $tempOrder = $account->order;
            $account->order = $swapWith->order;
            $swapWith->order = $tempOrder;

            $account->save();
            $swapWith->save();
        }

        return back();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'balance' => 'required|numeric',
            'currency_id' => 'required|exists:currencies,id',
            'color' => 'required|string',
        ]);

        $maxOrder = Account::max('order') ?? 0;

        Account::create([
            'name' => $request->name,
            'balance' => $request->balance,
            'currency_id' => $request->currency_id,
            'color' => $request->color,
            'user_id' => auth()->id(),
            'order' => $maxOrder + 1,
        ]);

        return redirect()->route('accounts.index');
    }

    public function edit($id)
    {
        $account = Account::findOrFail($id);
        return response()->json(['data' => $account]);
    }


    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'balance' => 'required|numeric',
            'currency_id' => 'required|exists:currencies,id',
            'color' => 'required|string',
        ]);

        $account = Account::findOrFail($id);
        $account->update([
            'name' => $request->name,
            'balance' => $request->balance,
            'currency_id' => $request->currency_id,
            'color' => $request->color
        ]);

        return redirect()->route('accounts.index');
    }

    public function destroy($id)
    {
        $account = Account::findOrFail($id);
        $account->delete();

        return redirect()->route('accounts.index');
    }
}

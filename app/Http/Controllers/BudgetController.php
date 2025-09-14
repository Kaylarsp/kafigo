<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Account;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BudgetController extends Controller
{
    public function index()
    {
        $budgets = Budget::with(['account', 'category'])
            ->orderBy('start_date', 'desc')
            ->get();

        $accounts = Account::select('id', 'name')->get();
        $categories = Category::select('id', 'name')->get();

        return Inertia::render('budget/index', [
            'budgets' => $budgets->map(function ($budget) {
                return [
                    'id'        => $budget->id,
                    'nama'      => $budget->nama,
                    'start_date'=> $budget->start_date->toDateString(),
                    'end_date'  => $budget->end_date->toDateString(),
                    'amount'    => $budget->amount,
                    'spent'     => $budget->spent_amount,
                    'remaining' => $budget->remaining_amount,
                    'account'   => $budget->account,
                    'category'  => $budget->category,
                ];
            }),
            'accounts'   => $accounts,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after_or_equal:start_date',
            'amount'      => 'required|numeric|min:0',
            'account_id'  => 'required|exists:accounts,id',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        Budget::create([
            'nama'        => $request->nama,
            'start_date'  => $request->start_date,
            'end_date'    => $request->end_date,
            'amount'      => $request->amount,
            'account_id'  => $request->account_id,
            'category_id' => $request->category_id,
        ]);

        return redirect()->route('budgets.index');
    }

    public function edit($id)
    {
        $budget = Budget::with(['account', 'category'])->findOrFail($id);
        return response()->json(['data' => $budget]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama'        => 'required|string|max:255',
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after_or_equal:start_date',
            'amount'      => 'required|numeric|min:0',
            'account_id'  => 'required|exists:accounts,id',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $budget = Budget::findOrFail($id);
        $budget->update([
            'nama'        => $request->nama,
            'start_date'  => $request->start_date,
            'end_date'    => $request->end_date,
            'amount'      => $request->amount,
            'account_id'  => $request->account_id,
            'category_id' => $request->category_id,
        ]);

        return redirect()->route('budgets.index');
    }

    public function destroy($id)
    {
        $budget = Budget::findOrFail($id);
        $budget->delete();

        return redirect()->route('budgets.index');
    }

    // Optional: summary singkat (kayak Ivy Wallet "Left to Spend")
    public function summary($id)
    {
        $budget = Budget::findOrFail($id);

        return response()->json([
            'budget_id'  => $budget->id,
            'amount'     => $budget->amount,
            'spent'      => $budget->spent_amount,
            'remaining'  => $budget->remaining_amount,
        ]);
    }
}

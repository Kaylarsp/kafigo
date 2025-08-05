<?php

namespace App\Http\Controllers;

use App\Models\Currency;
use Inertia\Inertia;

class CurrencyController extends Controller
{
    public function select()
    {
        $currencies = Currency::all();
        return $currencies;
    }
}

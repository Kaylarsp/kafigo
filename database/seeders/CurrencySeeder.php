<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class CurrencySeeder extends Seeder
{
    public function run(): void
    {
        $json = File::get(database_path('seeders/currencies.json'));
        $data = json_decode($json, true);

        $currencies = [];

        foreach ($data as $code => $currency) {
            $currencies[] = [
                'code' => $code,
                'name' => $currency['name'],
                'symbol' => $currency['symbol'] ?? null,
                'country' => $currency['entity'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('currencies')->insert($currencies);
    }
}

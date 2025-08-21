<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Scopes\UserOwnedScope;

class Transaction extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2'
    ];

    // Relasi ke Account
    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    // Relasi ke Category (opsional)
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    protected static function booted(): void
    {
        static::addGlobalScope(new UserOwnedScope);
    }
}

<?php

namespace App\Models;

use App\Scopes\UserOwnedScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected static function booted(): void
    {
        static::addGlobalScope(new UserOwnedScope);

        // otomatis set user_id saat create
        static::creating(function ($budget) {
            if (auth()->check() && !$budget->user_id) {
                $budget->user_id = auth()->id();
            }
        });
    }
    protected $casts = [
        'amount'     => 'decimal:2',
        'start_date' => 'date',
        'end_date'   => 'date',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // aksesors tambahan
    public function getSpentAmountAttribute()
    {
        return $this->transactions()->sum('amount');
    }

    public function getRemainingAmountAttribute()
    {
        return $this->amount - $this->spent_amount;
    }
}

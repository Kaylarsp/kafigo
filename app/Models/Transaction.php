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
        'amount' => 'decimal:2',
        'tags' => 'array'
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new UserOwnedScope);
    }

    public function getTagsDataAttribute(): \Illuminate\Database\Eloquent\Collection
    {
        if (empty($this->tags)) {
            return (new Tag)->newCollection();
        }

        return Tag::whereIn('id', $this->tags)->get();
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}

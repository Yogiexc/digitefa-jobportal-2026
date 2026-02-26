<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class AboutPage extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'about_pages';
    protected $fillable = ['title', 'image', 'description', 'short_description'];

    public function subsections(): HasMany
    {
        return $this->hasMany(AboutPageSubsection::class, 'about_page_id');
    }
}

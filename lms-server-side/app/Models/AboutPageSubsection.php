<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class AboutPageSubsection extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'about_page_subsections';
    protected $fillable = ['about_page_id', 'subtitle', 'description'];

    public function aboutPage(): BelongsTo
    {
        return $this->belongsTo(AboutPage::class, 'about_page_id');
    }
}

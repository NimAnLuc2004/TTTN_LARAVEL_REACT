<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsComment extends Model
{
    use HasFactory;
    protected $table = 'news_comments';
    protected $fillable = [
        'user_id', 
        'news_id',
        'comment',
        'created_at',
        'updated_at'
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function reactions()
    {
        return $this->hasMany(NewsCommentReaction::class, 'comment_id');
    }
}

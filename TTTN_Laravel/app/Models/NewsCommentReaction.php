<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsCommentReaction extends Model
{
    use HasFactory;
    protected $table = 'news_comment_reactions';
    protected $fillable = [
        'user_id',
        'comment_id',
        'reaction',
        'created_at',
        'updated_at'
    ];
}

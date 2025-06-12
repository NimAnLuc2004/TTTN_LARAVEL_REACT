<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsTopic  extends Model
{
    use HasFactory;
    protected $table ='news_topics';
    public function news()
    {
        return $this->hasMany(News::class, 'topic_id');
    }

}

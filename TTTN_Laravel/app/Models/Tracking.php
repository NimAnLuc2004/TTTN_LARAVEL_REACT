<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tracking extends Model
{
    use HasFactory;
    protected $table ='tracking';
    protected $fillable = ['order_id', 'status', 'last_updated', 'carrier', 'tracking_number'];
}

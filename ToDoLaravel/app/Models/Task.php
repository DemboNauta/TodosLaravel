<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $title
 * @property string $description
 * @property DateTime $start_date
 * @property DateTime $due_date
 */
class Task extends Model
{
    //
    protected $table = 'tasks';

    protected $fillable = [
        'title',
        'description',
        'start_date',
        'due_date',
    ];

}

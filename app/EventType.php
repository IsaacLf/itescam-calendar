<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\User;

class EventType extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
      'name', 'color'
    ];

    protected $hidden = [
      'created_at', 'updated_at', 'classification_id'
    ];

    protected $with = [ 'classification' ];

    public function classification(){
      return $this->belongsTo('App\Classification');
    }

    public static function byUser() {

      $user = Auth::user();
      $conditions = [];

      $oficial = false;
      $area = false;
      $academico = false;

      foreach($user->role->tasks as $task) {
        if($task->id == 1) { $oficial = true; }
        if($task->id == 2) { $area = true; }
        if($task->id == 3) { $academico = true; }
      }

      if($oficial)
        array_push($conditions, 1);
      if($area)
        array_push($conditions, 2);
      if($academico)
        array_push($conditions, 3);

      $eventTypes = EventType::whereIn('classification_id', $conditions)->get();

      return $eventTypes;
    }

    public static function getOnlyOfficials() {
      return EventType::where('classification_id', '=' , 1)->get();
    }
}

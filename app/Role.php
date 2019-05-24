<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{

  protected $hidden = [ 'created_at', 'updated_at' ];

  protected $with = [ 'tasks' ];

  /**
   * Get all the tasks of the role
   */
  public function tasks(){
    return $this->belongsToMany('App\Task', 'role_task');
  }
}

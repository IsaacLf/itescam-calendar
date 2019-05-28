<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'username' , 'email', 'password', 'role_id'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'created_at', 'updated_at', 'role_id'
    ];

    protected $with = [ 'role' ];

    public function role() {
      return $this->belongsTo('App\Role');
    }

    public static function default(){

      $default = new User([
        'username'  => 'admin',
        'name'      => 'victor',
        'email'     => 'papitrunks@gmail.com',
        'password'  => 'empty',
        'role_id'   => 1
      ]);

      return $default;
    }
}

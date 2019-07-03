<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{

  use SoftDeletes;

  /**
   * The attributes that should be mutated to dates.
   *
   * @var array
   */
  protected $dates = ['deleted_at'];

  protected $hidden = [
    'created_at', 'updated_at'
  ];


  public function scopeOfficial($query) {

    $eventTypes = EventType::getOnlyOfficials();
    $eventTypesIds = [];
    foreach($eventTypes as $evtype){
      array_push($eventTypesIds, $evtype->id);
    }

    return $query->whereIn('typeId',$eventTypesIds);

  }

  public function scopeByUser($query) {

    $eventTypes = EventType::byUser();
    $eventTypesIds = [];
    foreach($eventTypes as $evtype){
      array_push($eventTypesIds, $evtype->id);
    }

    return $query->whereIn('typeId',$eventTypesIds);

  }

  public function scopePublished($query) {
    return $query->where('status', 3);
  }

}

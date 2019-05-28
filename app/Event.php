<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
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

}

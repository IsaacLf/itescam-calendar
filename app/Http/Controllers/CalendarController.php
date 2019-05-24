<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Configuration;

class CalendarController extends Controller
{
  public function __admin(){
    return view('calendar.calendar', [
      'isAdmin' => 1 ,
      'currentPeriod' => Configuration::all()[0]->activeCalendar
    ]);
  }

  public function getView() {
    return view('calendar.calendar', [
      'isAdmin' => 0,
      'currentPeriod' => Configuration::all()[0]->activeCalendar
    ]);
  }
}

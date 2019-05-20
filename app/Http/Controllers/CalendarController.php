<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CalendarController extends Controller
{
  public function __admin(){
    return view('calendar.calendar', [ 'isAdmin' => true ]);
  }

  public function getView() {
    return view('calendar.calendar', [ 'isAdmin' => false ]);
  }
}

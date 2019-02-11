<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CalendarController extends Controller
{
    public function __admin(){
      return view('calendar.admin');
    }
}

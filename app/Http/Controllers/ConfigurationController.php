<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Configuration;

class ConfigurationController extends Controller
{
  public function getPublishedPeriod(){
    return Configuration::firstOrFail();
  }

  public function update(Request $request) {
    $config = Configuration::firstOrFail();
    $config->activeCalendar = $request->activeCalendar;
    if($config->save()) {
      return response()->json([
        'activeCalendar' => $config->activeCalendar,
        'status' => 200
      ]);
    }
    return response()->json([
      'status' => 500
    ]);
  }
}

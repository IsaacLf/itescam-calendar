<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
// Auth::routes();

Route::get('/', function () {
    return view('welcome');
});

Route::get('/calendario/admin', 'CalendarController@__admin');

Route::get('/calendario', 'CalendarController@getView');

Route::get('/login', function() {
  return view('auth.login');
});

Route::post('/login', function(Request $request){
  if (Auth::attempt(['username' => $request->username, 'password' => $request->password])) {
    return redirect()->intended('/calendario/admin');
  }
});

Route::post('/logout', function() {
  Auth::logout();
  return redirect('/calendario');
});

Route::get('/byUser', function() {
  return App\EventType::byUser();
});

Route::resource('eventType', 'EventTypeController', ['except' => [
  'create', 'show', 'edit'
]]);
Route::resource('event', 'EventApiController', ['except' => [
  'create', 'show', 'edit'
]]);

Route::post('/events/getEvents', 'EventApiController@getEventsByDate');

Route::post('/events/getPublished', 'EventApiController@getPublishedByDate');

Route::post('/events/publishEvents', 'EventApiController@publishEvents');

Route::post('/configuration/getPublishedPeriod', 'ConfigurationController@getPublishedPeriod');

Route::post('/configuration/activateCalendar', 'ConfigurationController@update');

Route::get('/user/{id}', function($id) {
  return App\User::findOrFail($id)->toJson();
});
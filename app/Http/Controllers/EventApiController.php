<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Event as Event;
use App\EventType as EventType;

class EventApiController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Event::all();
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $event = new Event();
        $event->typeId = $request->typeId;
        $event->name = $request->name;
        $event->description = $request->description;
        $event->startDate = $request->startDate;
        $event->endDate = $request->endDate;
        $event->status = $request->status;
        $event->created_by = $request->username;
        $event->updated_by = $request->username;
        if($event->save()){
          return response()->json([
            'status' => 200,
            'message' => 'Guardado exitosamente'
          ]);
        }
        return response()->json([
          'status' => 500,
          'message' => 'No se pudo guardar'
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
      $event = Event::find($id);
      $event->typeId = $request->typeId;
      $event->name = $request->name;
      $event->description = $request->description;
      $event->startDate = $request->startDate;
      $event->endDate = $request->endDate;
      $event->status = $request->status;
      $event->updated_by = $request->username;
      if($event->save()){
        return response()->json([
          'status' => 200,
          'message' => 'Guardado exitosamente'
        ]);
      }
      return response()->json([
        'status' => 500,
        'message' => 'No se pudo guardar'
      ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
      $event = Event::findOrFail($id);
      $event->updated_by = $request->username;
      $event->save();
      if($event->delete()){
        return response()->json([
          'status' => 200,
          'message' => 'Eliminado exitosamente'
        ]);
      }
      return response()->json([
        'status' => 500,
        'message' => 'No se pudo eliminar'
      ]);
    }

    /* Other requests in here */

    public function getEventsByDate(Request $request){

      $startDate = $request->startDate;
      $endDate = $request->endDate;

      if(Auth::check())
        $events = Event::where([
          ['startDate','>=', $startDate],
          ['endDate','<=', $endDate]
        ])->byUser()->get();
      else
        $events = Event::where([
          ['startDate','>=', $startDate],
          ['endDate','<=', $endDate]
        ])->official()->get();

      return response()->json($events);

    }

    public function getPublishedByDate(Request $request) {

      $startDate = $request->startDate;
      $endDate = $request->endDate;
      $events = Event::where([
        ['startDate','>=', $startDate],
        ['endDate','<=', $endDate]
      ])->official()->published()->get();

      return response()->json($events);

    }


    public function publishEvents(Request $request) {
      $ids = $request->events;
      Event::whereIn('id', $ids)->update([ 'status' => 3 ]);
      return response()->json([
        'status' => 200,
        'message' => 'Publicados exitosamente: ['.count($ids).']'
      ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Event as Event;

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
        $event->visible = $request->visible;
        $event->startDate = $request->startDate;
        $event->endDate = $request->endDate;
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}

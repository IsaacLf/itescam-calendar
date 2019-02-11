<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\EventType as EventType;

class EventTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return EventType::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        // NON USED SINCE ITS FOR API
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $eventT = new EventType();
        $eventT->name = $request->name;
        $eventT->color = $request->color;
        if($eventT->save()){
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
        // NON USED SINCE ITS FOR API
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        // NON USED SINCE ITS FOR API
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
        $eventT = EventType::findOrFail($id);
        $eventT->name = $request->name;
        $eventT->color = $request->color;
        if($eventT->save()){
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
    public function destroy($id)
    {
      $eventT = EventType::findOrFail($id);
      if($eventT->delete()){
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
}

@extends('layouts.master')

@section('title')
  @if($isAdmin)
    Administrador
  @else
    Calendario
  @endif
@endsection

@section('styles')
<link rel="stylesheet" href="{{ asset('css/calendar.css') }}">
@endsection

@section('content')
<!-- v-bind:events="{{ App\Event::all() }}" -->
<app
  v-bind:eventstype="{{ App\EventType::all() }}"
  v-bind:currentperiod="'{{ App\Configuration::all()[0]->activeCalendar }}'"
></app>
@endsection

@section('scripts')
  @if($isAdmin)
    <script src="{{ asset('js/backend.js') }}"></script>
  @else
    <script src="{{ asset('js/frontend.js') }}"></script>
  @endif
@endsection
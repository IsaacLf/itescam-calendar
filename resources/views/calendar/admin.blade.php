@extends('layouts.master')

@section('title', 'Administrador')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/calendar.css') }}">
<link rel="stylesheet" href="{{ asset('css/admin-calendar.css') }}">
@endsection

@section('content')
<!-- v-bind:events="{{ App\Event::all() }}" -->
<app
  v-bind:eventstype="{{ App\EventType::all() }}"
  v-bind:currentperiod="'{{ App\Configuration::all()[0]->activeCalendar }}'"
></app>
@endsection

@section('scripts')
  <script src="{{ asset('js/calendario.js') }}"></script>
@endsection
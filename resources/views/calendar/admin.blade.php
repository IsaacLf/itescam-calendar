@extends('layouts.master')

@section('title', 'Administrador')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/calendar.css') }}">
<link rel="stylesheet" href="{{ asset('css/admin-calendar.css') }}">
@endsection

@section('content')
<app
  v-bind:eventstype="{{ App\EventType::all() }}"
  v-bind:events="{{ App\Event::all() }}"
></app>
@endsection

@section('scripts')
  <script src="{{ asset('js/calendario.js') }}"></script>
@endsection
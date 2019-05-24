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

@php
  $eventtypes = [];
  $hasuser = 0;
  $userid = 1;
  if(Auth::check()) {
    $eventtypes = App\EventType::byUser();
    $hasuser = 1;
    $userid = Auth::id();
  }
  else {
    $eventtypes = App\EventType::getOnlyOfficials();
    $hasuser = 0;
  }
@endphp

@section('content')
@if($hasuser)
<form action="{{ url('logout') }}" method="post">
  {{ csrf_field() }}
  <button type="submit">LOGOUT</button>
</form>
@endif
<app
  v-bind:eventstype="{{ $eventtypes }}"
  v-bind:classifs="{{ App\Classification::all() }}"
  v-bind:currentperiod="'{{ $currentPeriod }}'"
  v-bind:published="'{{ $currentPeriod }}'"
  v-bind:isadmin="{{ $hasuser }}"
  v-bind:userid="{{ $userid }}"
></app>
@endsection

@section('scripts')
  @if($isAdmin)
    <script src="{{ asset('js/backend.js') }}"></script>
  @else
    <script src="{{ asset('js/frontend.js') }}"></script>
  @endif
@endsection
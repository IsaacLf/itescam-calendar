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
    $user = App\User::default();
  }
  else {
    $eventtypes = App\EventType::getOnlyOfficials();
    $hasuser = 0;
  }
@endphp

@section('content')
@if($hasuser)

@endif
<app
  v-bind:eventstype="{{ $eventtypes }}"
  v-bind:classifs="{{ App\Classification::all() }}"
  v-bind:currentperiod="'{{ $currentPeriod }}'"
  v-bind:published="'{{ $currentPeriod }}'"
  v-bind:hasuser="{{ $hasuser }}"
  v-bind:uuser=" {{ $hasuser ? App\User::find($userid) : '{ email: ``, id: 0, name: `noone`, role: { id: 0, name: `noone`, tasks: [] } }' }} "
></app>
@endsection

@section('scripts')
  @if($isAdmin)
    <script src="{{ asset('js/backend.js') }}"></script>
  @else
    <script src="{{ asset('js/frontend.js') }}"></script>
  @endif
@endsection
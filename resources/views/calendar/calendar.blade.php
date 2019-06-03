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
  $eventtypes = App\EventType::getOnlyOfficials();
  $hasuser = $isAdmin;
  $email = 'example@domain.com';
  $username = 'noone';
  $name = "user";
  $tasks = App\Task::all();
@endphp

@section('content')
<app
  v-bind:eventstype="{{ $eventtypes }}"
  v-bind:classifs="{{ App\Classification::all() }}"
  v-bind:currentperiod="'{{ $currentPeriod }}'"
  v-bind:published="'{{ $currentPeriod }}'"
  v-bind:hasuser="{{ $hasuser }}"
  v-bind:uuser=" {{ '{
                        id: 0,
                        email: `'.$email.'`,
                        username: `'.$username.'` ,
                        name: `'.$name.'`,
                        role: {
                          id: 0,
                          name: `administrador`,
                          tasks: '.$tasks.'
                        }
                    }'
                }}"
></app>
@endsection

@section('scripts')
  @if($isAdmin)
    <script src="{{ asset('js/backend.js') }}"></script>
  @else
    <script src="{{ asset('js/frontend.js') }}"></script>
  @endif
@endsection
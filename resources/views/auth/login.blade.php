@extends('layouts.master')

@section('title', 'Login')
@section('styles')
<link rel="stylesheet" href="{{asset('css/auth/style.css')}}">
@endsection

@section('content')
<div class="container-fluid">
  <div align="center">
    <legend align="center">Inicio de sesión</legend>
    <form id="signin" action="{{ url('login') }}" method="POST" class="form-horizontal" role="form">
      {{ csrf_field() }}
      <div class="form-group">
        <label for="exampleInputEmail1">Usuario</label>
        <input type="text" class="form-control" id="name" name="name" placeholder="Escriba su usuario">
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Contraseña</label>
        <input type="password" class="form-control" id="password" name="password" placeholder="Contraseña">
      </div>
      <div class="form-group">
        <div class="col-sm-10 col-sm-offset-2">
          <button type="submit" class="btn btn-primary">Ingresar</button>
        </div>
      </div>
    </form>
  </div>
</div>
@endsection

@section('scripts')

@endsection
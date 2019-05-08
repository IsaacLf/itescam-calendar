<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>ITESCAM | @yield('title')</title>
  <link rel="stylesheet" href="{{ asset('css/app.css') }}">
  @yield('styles')
</head>
<body>
  <main id="app">
    @yield('content')
  </main>
  <script src="{{ asset('js/app.js') }}"></script>
  @yield('scripts')
</body>
</html>
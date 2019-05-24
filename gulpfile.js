const elixir = require('laravel-elixir');

require('laravel-elixir-vue-2');
require('laravel-elixir-typescript');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application as well as publishing vendor resources.
 |
 */

elixir((mix) => {
    mix.sass('app.scss')
       .sass('calendar.scss')
       .styles('./node_modules/bootstrap-vue/dist/bootstrap-vue', 'public/css/calendar.css')
       .typescript('./resources/assets/ts/calendar.ts', './resources/assets/js', null, { 'lib': ['es6', 'dom', 'es2017'] })
       .webpack('app.js')
       .webpack('calendario.js')
       .webpack('frontend.js')
       .webpack('backend.js')
       ;
});

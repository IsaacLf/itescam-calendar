<?php

use Faker\Generator as Faker;

$factory->define(App\EventType::class, function (Faker $faker) {
    return [
        'name' => $faker->bothify('Evento ?###'), 
        'color'=> $faker->hexcolor()
    ];
});

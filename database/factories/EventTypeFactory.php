<?php

use Faker\Generator as Faker;

$factory->define(App\EventType::class, function (Faker $faker) {
  return [
    'name' => $faker->bothify('Evento ?###'),
    'color'=> $faker->hexcolor(),
    'classification_id' => $faker->randomElement([1]),
    'required' => $faker->randomElement([true, false]),
    'count_required' => $faker->numberBetween(0,5)
  ];
});

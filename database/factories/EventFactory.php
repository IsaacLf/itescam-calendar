<?php

use Faker\Generator as Faker;

$factory->define(App\Event::class, function (Faker $faker) {
    $year = $faker->randomElement(['2018','2019','2020']);
    $month = $faker->numberBetween($min = 1, $max = 6);
    $day = $faker->numberBetween($min = 1, $max = 28);
    $start = $year.'-'.$month.'-'.$day;
    $add = $faker->numberBetween($min = 1, $max = 14);
    $day = (floor($day + $add/2) > 28 ) ? floor($day+$add/4) : floor($day + $add/2);
    $end = $year.'-'.$month.'-'.$day;
    return [
      'name' => $faker->bothify('Evento ####'),
      'typeId'=> $faker->numberBetween($min = 1, $max = 8),
      'startDate' => $start,
      'endDate' => $end,
      'description' => $faker->realText($maxNbChars = 30, $indexSize = 2),
      'status' => $faker->randomElement([1,2,3]),
      'useSaturday' => $faker->randomElement([true, false])
    ];
});

<?php

use Illuminate\Database\Seeder;

class ClassificationTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      DB::table('classifications')->insert([
        ['id' => 1, 'name' => 'oficial'],
        ['id' => 2, 'name' => 'área'],
        ['id' => 3, 'name' => 'académico'],
      ]);
    }
}

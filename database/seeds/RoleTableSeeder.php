<?php

use Illuminate\Database\Seeder;

class RoleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      /**
       * Roles:
       * 1: Admin
       * 2: Director
       * 3: Profesor
       * 4: General
       */
      DB::table('roles')->insert([
        ['id' => 1, 'name' => 'administrador'],
        ['id' => 2, 'name' => 'director'],
        ['id' => 3, 'name' => 'profesor'],
        ['id' => 4, 'name' => 'general']
      ]);
    }
}

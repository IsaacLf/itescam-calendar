<?php

use Illuminate\Database\Seeder;

class RoleTaskTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      for($i = 1; $i <= 9; $i++){
        DB::table('role_task')->insert([
          'role_id' => 1, //Administrador
          'task_id' => $i //Tiene todos los privilegios
        ]);
      }
    }
}

<?php

use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      DB::table('users')->insert([
        'id' => 1,
        'name' => 'admin',
        'email' => 'papitrunks@gmail.com',
        'password' => bcrypt('admin2019'),
        'role_id' => 1
      ]);
    }
}

<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $this->call(EventTypeTableSeeder::class);
      $this->call(EventTableSeeder::class);
      $this->call(ConfigurationTableSeeder::class);
      $this->call(RoleTableSeeder::class);
      $this->call(TaskTableSeeder::class);
      $this->call(UserTableSeeder::class);
      $this->call(RoleTaskTableSeeder::class);
      $this->call(ClassificationTableSeeder::class);
    }
}

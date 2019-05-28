<?php

use Illuminate\Database\Seeder;

class TaskTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      /* Tareas:
       * 1: Crear eventos oficiales
       * 2: Crear eventos de área
       * 3: Crear eventos académicos
       * 4: Eliminar eventos
       * 5: Aprobar eventos
       * 6: Publicar
       */
      DB::table('tasks')->insert([
        ['id' => 1,   'description' => 'Crear eventos oficiales'],
        ['id' => 2,   'description' => 'Crear tipos de eventos'],
        ['id' => 3,   'description' => 'Editar tipos eventos'],
        ['id' => 4,   'description' => 'Eliminar tipos de eventos'],
        ['id' => 5,   'description' => 'Editar eventos'],
        ['id' => 6,   'description' => 'Eliminar eventos'],
        ['id' => 7,   'description' => 'Aprobar eventos'],
        ['id' => 8,   'description' => 'Desaprobar eventos'],
        ['id' => 9,   'description' => 'Publicar'],
      ]);
    }
}

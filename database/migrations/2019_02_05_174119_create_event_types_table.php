<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEventTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('event_types', function (Blueprint $table) {
        $table->increments('id');
        $table->string("name");
        $table->string("color");
        $table->integer('classification_id')->default(1);
        $table->boolean("required")->default(false);
        $table->integer("count_required")->default(0);
        $table->timestamps();
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::dropIfExists('event_types');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function getTasks(){
        return Task::all();
    }

    public function getTask($id){
        return Task::where('id', $id)->first();
    }

    public function createTask(Request $request){
        $task = new Task();
        $task->title = $request->input('title');
        $task->description = $request->input('description');
        $task->start_date = now();
        $task->save();
        return $task;
    }

    public function deleteTask(Request $request, $id)
    {
        $task = Task::destroy($id);

        return response()->json([
            'message' => 'Tarea eliminada correctamente',
            'task'    => $task,
            'id'      => $id
        ], 200);
    }

    public function updateTask(Request $request, $id){
        $task = Task::where('id', $id)->first();
        $task->due_date = now();
        $task->save();
        return $task;
    }


}

<?php

use App\Http\Controllers\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/tasks', [TaskController::class, 'getTasks']);
Route::get('/tasks/{id}', [TaskController::class, 'getTask']);
Route::delete('/tasks/{id}', [TaskController::class, 'deleteTask']);
Route::put('/tasks/{id}', [TaskController::class, 'updateTask']);
Route::post('/tasks', [TaskController::class, 'createTask']);

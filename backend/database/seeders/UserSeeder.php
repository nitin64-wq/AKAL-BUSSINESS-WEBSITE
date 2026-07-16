<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Seed default Admin
        User::create([
            'name' => 'ABS Director & Admin',
            'email' => 'director_abs@auts.ac.in',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Seed an Editor
        User::create([
            'name' => 'ABS Content Editor',
            'email' => 'editor@auts.ac.in',
            'password' => Hash::make('editor123'),
            'role' => 'editor',
            'is_active' => true,
        ]);

        // Seed a Viewer
        User::create([
            'name' => 'ABS Staff Viewer',
            'email' => 'viewer@auts.ac.in',
            'password' => Hash::make('viewer123'),
            'role' => 'viewer',
            'is_active' => true,
        ]);
    }
}

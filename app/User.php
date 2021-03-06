<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'firstname','lastname', 'email', 'password'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password','remember_token','created_at','updated_at'
    ];

    public static function allOrderedByLastname()
    {
        return User::orderBy('lastname', 'ASC')->get();
    }

    public static function findByEmail($email)
    {
        return User::where('email', $email)->first();
    }
}

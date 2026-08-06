<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LegalController extends Controller
{
    public function privacy(): Response
    {
        return Inertia::render('Legal/Privacy');
    }

    public function cookies(): Response
    {
        return Inertia::render('Legal/Cookies');
    }

    public function rights(): Response
    {
        return Inertia::render('Legal/Rights');
    }
}

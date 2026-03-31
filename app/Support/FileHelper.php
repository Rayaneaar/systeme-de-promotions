<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class FileHelper
{
    public static function buildStoredName(UploadedFile $file): string
    {
        return now()->format('YmdHis').'_'.Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
    }

    public static function extensionFromName(string $name): string
    {
        return strtolower(pathinfo($name, PATHINFO_EXTENSION));
    }
}

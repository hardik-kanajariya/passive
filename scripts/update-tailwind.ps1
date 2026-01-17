# Update all HTML files to use production Tailwind CSS

$basePath = "d:\works\passive"
$files = Get-ChildItem -Path $basePath -Filter "index.html" -Recurse

$updated = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if file has cdn.tailwindcss.com but not the jsdelivr fallback
    if ($content -match 'cdn\.tailwindcss\.com' -and $content -notmatch 'jsdelivr\.net/npm/tailwindcss') {
        
        # Replace the CDN script with production version + fallback
        $newContent = $content -replace '(<script src="https://cdn\.tailwindcss\.com"></script>)', @"
<!-- Tailwind CSS - Production -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    `$1
    <link href="/css/tailwind-fallback.css" rel="stylesheet">
"@
        
        Set-Content $file.FullName $newContent -NoNewline -Encoding UTF8
        $updated++
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "`nTotal updated: $updated out of $($files.Count) files"

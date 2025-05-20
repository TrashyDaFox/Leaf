$output = if ($args.Count -gt 0) { $args[0] } else { "./leaf.mcaddon" }

$data = Get-Content -Path "lp.json" -Raw | ConvertFrom-Json

$sevenZipPath = "C:\Program Files\7-Zip\7z.exe"

# Make sure temp and staging folders exist
if (!(Test-Path "./temp")) { New-Item -ItemType Directory -Path "./temp" | Out-Null }
if (!(Test-Path "./staging")) { New-Item -ItemType Directory -Path "./staging" | Out-Null }

foreach ($path in $data.paths) {
    Write-Host -ForegroundColor Yellow "Packaging " -NoNewline
    Write-Host -ForegroundColor Blue $path.name

    $files = Get-ChildItem -Path $path.path -Recurse -File

    if ($path.whitelist) {
        $filteredFiles = $files | Where-Object {
            $relativePath = $_.FullName.Substring($path.path.Length).TrimStart('\','/')
            ($path.whitelist | Where-Object {
                $relativePath -like ("$_*")
            } | Measure-Object).Count -gt 0
        }
    }
    else {
        $filteredFiles = $files
    }

    # Create staging folder for this pack
    $stagingDir = Join-Path "./staging" $path.name
    if (Test-Path $stagingDir) { Remove-Item $stagingDir -Recurse -Force }
    New-Item -ItemType Directory -Path $stagingDir | Out-Null

    # Copy filtered files to staging, preserving folder structure
    foreach ($file in $filteredFiles) {
        $relPath = $file.FullName.Substring($path.path.Length).TrimStart('\','/')
        $destPath = Join-Path $stagingDir $relPath
        $destDir = Split-Path $destPath
        if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
        Copy-Item $file.FullName -Destination $destPath
    }

    $tempZip = Join-Path "./temp" $path.tempOut
    if (Test-Path $tempZip) { Remove-Item $tempZip }

    # Zip the entire staging folder content with 7z
    & $sevenZipPath a -tzip $tempZip "$stagingDir\*" | Out-Null

    # Clean up staging folder
    Remove-Item $stagingDir -Recurse -Force
}

$tempFiles = Get-ChildItem -Path "./temp" -File

if ($tempFiles.Count -gt 0) {
    if (Test-Path $output) { Remove-Item $output }

    # Zip all temp files into final output archive
    & $sevenZipPath a -tzip $output "./temp/*" | Out-Null

    Write-Host -ForegroundColor Green "Final package created: $output"
}
else {
    Write-Host -ForegroundColor Red "No files found in temp folder to zip!"
}

$f = 'e:\myshop\client\src\pages\Shop.jsx'
$lines = [System.IO.File]::ReadAllLines($f)
# line index 146 = style={{ transition: "opacity 0.25s ease" }}
# line index 147 = />
# Merge: replace line 146 with /> and remove line 147
$lines[146] = '          />'
$newLines = for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($i -eq 147) { continue }
    $lines[$i]
}
[System.IO.File]::WriteAllLines($f, $newLines)
Write-Host "Done"

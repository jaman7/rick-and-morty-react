$folderPath = "."  # Bieżący katalog
$outputFile = "./wynik.txt"

$excludedFolders = @(
    "node_modules",
    ".git",
    ".next",
    "public",
    ".vscode",
    "coverage",
    "__snapshots__",
	".husky",
	"__generated__",
	"__snapshots__"
)

$excludedSubfolders = @(
    "\\src\\stories"
)

$excludedFiles = @(
    "package-lock.json",
    "wynik.txt",
    "skrypt.ps1",
    "README.md",
    "snipsnap.code-snippets",
    ".npmrc",
    ".nvmrc",
	 ".env",
    ".prettierignore",
    ".stylelintrc",
    ".gitignore",
    ".editorconfig",
	"tina-lock.json"
)

$excludedExtensions = @(
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".ico",
    ".mdx",
    ".ps1",
    ".avif",
    ".woff"
)

# Tworzymy (lub zastępujemy) plik wynikowy
if (Test-Path $outputFile) { Remove-Item $outputFile }
New-Item -Path $outputFile -ItemType File -Force

# Iterujemy przez wszystkie pliki
Get-ChildItem -Path $folderPath -Recurse -File -Force | ForEach-Object {
    $relativePath = $_.FullName.Substring((Get-Location).Path.Length + 1)

    # Debug: wypisz wszystkie pliki z nawiasami
    if ($_.Name -like "[[]*[]]*") {
        Write-Output "ZNALEZIONO ASTRO: $relativePath"
    }

    # Sprawdź, czy znajduje się w wykluczonym folderze
    $isExcludedFolder = $false
    foreach ($folder in $excludedFolders) {
        if ($relativePath -match [Regex]::Escape($folder)) {
            $isExcludedFolder = $true
            break
        }
    }

    # Sprawdź, czy znajduje się w wykluczonym podfolderze
    $isExcludedSubfolder = $false
    foreach ($subfolder in $excludedSubfolders) {
        if ($relativePath -match [Regex]::Escape($subfolder)) {
            $isExcludedSubfolder = $true
            break
        }
    }

    $isExcludedFile = $excludedFiles -contains $_.Name

    # Poprawne pobieranie rozszerzenia (działa także dla plików z nawiasami, np. [...slug].astro)
    $ext = [System.IO.Path]::GetExtension($_.Name)
    $isExcludedExtension = $excludedExtensions -contains $ext

    if (-not $isExcludedFolder -and -not $isExcludedSubfolder -and -not $isExcludedFile -and -not $isExcludedExtension) {
      $fileName = $_.FullName
      if (Test-Path -LiteralPath $fileName) {
          $fileContent = Get-Content -LiteralPath $fileName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
          if ($fileContent -ne $null) {
            Add-Content -Path $outputFile -Value "$relativePath"
            Add-Content -Path $outputFile -Value $fileContent
            Add-Content -Path $outputFile -Value ""  # przerwa
            Write-Output "Zapisano: $relativePath (rozmiar: $($fileContent.Length))"
          } else {
            Write-Output "Pusty lub nieczytelny plik: $fileName"
          }
        }
    }
}

exit

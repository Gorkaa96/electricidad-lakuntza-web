<#
Electricidad Lakuntza - copia local cifrada (sin servicios de pago).
REQUISITOS: Windows PowerShell, Supabase CLI, Docker Desktop, 7-Zip CLI.
Se ejecuta desde un clon local YA vinculado con:
  supabase login
  supabase link --project-ref yvrjrvropgouvzltwwvm
Antes de lanzarlo, descargar los objetos privados desde Supabase Storage
al directorio especificado y conservar sus nombres/rutas relativos.

NO exporta los usuarios de Auth gestionados por Supabase ni su configuracion.
NO acredita recuperacion hasta efectuar una restauracion en entorno aislado.
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)]
  [string] $StorageFolder,

  [string] $OutputFolder = (Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'ElectricidadLakuntza\CopiasCifradas'),

  [ValidateRange(0,1000000)]
  [int] $ExpectedStorageFiles = 2
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$ProjectRef = 'yvrjrvropgouvzltwwvm'
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$Stage = Join-Path ([IO.Path]::GetTempPath()) ('EL-Backup-' + [Guid]::NewGuid().ToString('N'))
$Archive = $null
$Complete = $false

function Assert-ExternalCommand([string] $Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Falta $Name. Instala el requisito antes de continuar."
  }
}

function Invoke-SupabaseDump([string[]] $Params) {
  & supabase @Params
  if ($LASTEXITCODE -ne 0) {
    throw ('Fallo en supabase ' + ($Params -join ' ') + '. No se ha realizado una copia valida.')
  }
}

try {
  Assert-ExternalCommand 'supabase'
  Assert-ExternalCommand 'docker'
  $SevenZipCmd = Get-Command '7z.exe' -ErrorAction SilentlyContinue
  if (-not $SevenZipCmd) {
    $KnownPath = Join-Path $env:ProgramFiles '7-Zip\7z.exe'
    if (Test-Path -LiteralPath $KnownPath) {
      $SevenZipExe = $KnownPath
    } else {
      throw 'No se encuentra 7z.exe. Instala 7-Zip y comprueba la ruta.'
    }
  } else {
    $SevenZipExe = $SevenZipCmd.Source
  }

  if (-not (Test-Path -LiteralPath $StorageFolder -PathType Container)) {
    throw 'La carpeta de Storage descargado no existe.'
  }
  $StorageFolder = (Resolve-Path -LiteralPath $StorageFolder).Path
  $Files = @(Get-ChildItem -LiteralPath $StorageFolder -Recurse -File -Force)
  $Links = @(Get-ChildItem -LiteralPath $StorageFolder -Recurse -Force | Where-Object { $_.Attributes -band [IO.FileAttributes]::ReparsePoint })
  if ($Links.Count -gt 0) { throw 'La carpeta de Storage contiene enlaces o puntos de union; revisala manualmente.' }
  if ($Files.Count -ne $ExpectedStorageFiles) {
    throw "Storage contiene $($Files.Count) archivos; se esperaban $ExpectedStorageFiles. Revisa los documentos antes de hacer el respaldo."
  }

  $RefFile = Join-Path $ProjectRoot 'supabase\.temp\project-ref'
  if (-not (Test-Path -LiteralPath $RefFile -PathType Leaf)) {
    throw "Proyecto sin vincular. Desde la raiz del repositorio ejecuta: supabase link --project-ref $ProjectRef"
  }
  $ActualRef = (Get-Content -LiteralPath $RefFile -Raw).Trim()
  if ($ActualRef -ne $ProjectRef) {
    throw "Proyecto vinculado inesperado ($ActualRef). Solo se permite $ProjectRef."
  }

  & docker info *> $null
  if ($LASTEXITCODE -ne 0) { throw 'Docker Desktop no esta iniciado.' }

  New-Item -ItemType Directory -Force -Path $OutputFolder | Out-Null
  $OutputFolder = (Resolve-Path -LiteralPath $OutputFolder).Path
  New-Item -ItemType Directory -Path $Stage | Out-Null
  $StorageDest = Join-Path $Stage 'storage\invoice-files'
  New-Item -ItemType Directory -Force -Path $StorageDest | Out-Null

  foreach ($SourceFile in $Files) {
    $Relative = $SourceFile.FullName.Substring($StorageFolder.Length).TrimStart([char[]]'\/')
    $Destination = Join-Path $StorageDest $Relative
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Destination) | Out-Null
    Copy-Item -LiteralPath $SourceFile.FullName -Destination $Destination -ErrorAction Stop
  }

  Push-Location $ProjectRoot
  try {
    Invoke-SupabaseDump -Params @('db','dump','--remote','--role-only','-f',(Join-Path $Stage 'roles.sql'))
    Invoke-SupabaseDump -Params @('db','dump','--remote','-f',(Join-Path $Stage 'schema.sql'))
    Invoke-SupabaseDump -Params @('db','dump','--remote','--data-only','--use-copy','-f',(Join-Path $Stage 'data.sql'))
  } finally { Pop-Location }

  foreach ($Filename in @('roles.sql','schema.sql','data.sql')) {
    $Entry = Get-Item -LiteralPath (Join-Path $Stage $Filename)
    if ($Entry.Length -eq 0) { throw "$Filename ha quedado vacio. Detenida la copia." }
  }

  $Checksums = @(
    Get-ChildItem -LiteralPath $Stage -File -Recurse | ForEach-Object {
      [pscustomobject]@{
        path = $_.FullName.Substring($Stage.Length).TrimStart([char[]]'\/')
        bytes = $_.Length
        sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
      }
    }
  )
  $Manifest = [ordered]@{
    project_ref = $ProjectRef
    created_utc = (Get-Date).ToUniversalTime().ToString('o')
    expected_storage_files = $ExpectedStorageFiles
    storage_files = $Files.Count
    completeness = 'Partial logical DB dump plus downloaded storage. Auth managed schema and Supabase project settings excluded.'
    files = $Checksums
  }
  $Manifest | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $Stage 'manifest.json') -Encoding UTF8

  $Stamp = (Get-Date).ToUniversalTime().ToString('yyyyMMdd-HHmmss')
  $Archive = Join-Path $OutputFolder ("ElectricidadLakuntza-$Stamp.7z")
  Write-Host 'Se pedira una contrasena robusta para cifrar el respaldo. No la escribas como argumento ni la compartas.'
  Push-Location $Stage
  try {
    & $SevenZipExe a -t7z -mx=7 -mhe=on -p $Archive 'roles.sql' 'schema.sql' 'data.sql' 'manifest.json' 'storage'
    if ($LASTEXITCODE -ne 0) { throw 'Error al cifrar la copia.' }
    if (-not (Test-Path -LiteralPath $Archive -PathType Leaf)) { throw 'No se genero el archivo cifrado.' }
    Write-Host '7-Zip pedira la contrasena de nuevo para comprobar la integridad del archivo.'
    # Testing an encrypted archive with bare -p did not prompt in 7-Zip 26.06
    # on Windows and instead reported Wrong password. Omit -p so 7-Zip
    # prompts to unlock the encrypted headers interactively.
    & $SevenZipExe t $Archive
    if ($LASTEXITCODE -ne 0) { throw 'Fallo la validacion del archivo cifrado.' }
  } finally { Pop-Location }

  $ArchiveHash = (Get-FileHash -LiteralPath $Archive -Algorithm SHA256).Hash.ToLowerInvariant()
  $Complete = $true
  Write-Host "COPIA CIFRADA VALIDADA: $Archive"
  Write-Host "SHA256: $ArchiveHash"
  Write-Host 'IMPORTANTE: guarda una segunda copia cifrada fuera del ordenador y conserva la contrasena separada.'
  Write-Host 'PENDIENTE: demostrar restauracion de aplicacion, Auth y documentos en entorno aislado.'
} finally {
  # Elimina solo temporales creados por ESTE proceso; nunca toca la fuente en Supabase
  # ni las descargas originales del usuario.
  if (Test-Path -LiteralPath $Stage -PathType Container) {
    Remove-Item -LiteralPath $Stage -Recurse -Force -ErrorAction SilentlyContinue
  }
  if (-not $Complete) {
    Write-Warning 'No existe una copia verificada de esta ejecucion. Revisa tambien que no haya quedado un archivo .7z parcial.'
  }
}

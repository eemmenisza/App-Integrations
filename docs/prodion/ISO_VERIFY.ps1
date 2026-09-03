$iso = "D:\proxmox-ve_9.2-1.iso"
$expect = "4E88FE416DF9B527624A175F24C9AA07C714D3332AFB1EE3DBF3879573EF2C6C"
if (-not (Test-Path $iso)) { Write-Error "Missing $iso"; exit 1 }
$item = Get-Item $iso
$hash = (Get-FileHash $iso -Algorithm SHA256).Hash
Write-Output ("Path={0}" -f $item.FullName)
Write-Output ("Bytes={0}" -f $item.Length)
Write-Output ("SHA256={0}" -f $hash)
if ($hash -ne $expect) { Write-Error "HASH MISMATCH — delete and re-download"; exit 2 }
Write-Output "HASH OK — write USB with Rufus DD or Etcher. Do not install over Windows."

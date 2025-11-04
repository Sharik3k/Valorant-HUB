$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Content-Type", 'application/json')

$body = '{
  "message": "test"
}'

try {
    $response = Invoke-RestMethod 'https://valoranthub-devs-github-speckit-2vq0k7d30.vercel.app/api/chat' -Method 'POST' -Headers $headers -Body $body
    Write-Output ($response | ConvertTo-Json)
} catch {
    Write-Host "Error making request:"
    Write-Host $_.Exception.Message
    $errorResponse = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errorResponse)
    $reader.BaseStream.Position = 0
    $errorBody = $reader.ReadToEnd()
    Write-Host "Response Body:"
    Write-Host $errorBody
}

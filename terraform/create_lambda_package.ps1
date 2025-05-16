# Create a temporary directory for packaging
$tempDir = ".\temp_package"
New-Item -ItemType Directory -Force -Path $tempDir

# Copy the Lambda function files
Write-Host "Copying Lambda function files..."
Copy-Item "..\summary\*" -Destination $tempDir -Recurse
Copy-Item "..\common\*" -Destination $tempDir -Recurse

# Create the zip file
Write-Host "Creating deployment package..."
Compress-Archive -Path "$tempDir\*" -DestinationPath "summary.zip" -Force

# Clean up
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "Lambda package created: summary.zip"
Write-Host "Package size: $((Get-Item summary.zip).Length / 1MB) MB" 
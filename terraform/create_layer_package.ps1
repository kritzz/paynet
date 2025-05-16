# Create a temporary directory for packaging
$tempDir = ".\temp_layer"
New-Item -ItemType Directory -Force -Path $tempDir

# Create the Python package directory structure
$pythonDir = "$tempDir\python"
New-Item -ItemType Directory -Force -Path $pythonDir

# Create a temporary requirements file
$requirements = @"
pandas==2.0.3
numpy==1.24.3
"@
$requirements | Out-File -FilePath "$tempDir\requirements.txt" -Encoding utf8

# Install dependencies into the package directory
Write-Host "Installing dependencies..."
try {
    # First, ensure pip is up to date
    python -m pip install --upgrade pip
    
    # Install dependencies
    python -m pip install -r "$tempDir\requirements.txt" --target $pythonDir --platform manylinux2014_x86_64 --only-binary=:all: --implementation cp --python-version 3.9 --no-deps
    
    # Verify pandas is installed
    if (-not (Test-Path "$pythonDir\pandas")) {
        throw "pandas was not installed correctly"
    }
    
    Write-Host "Dependencies installed successfully"
} catch {
    Write-Error "Failed to install dependencies: $_"
    exit 1
}

# Create the zip file
Write-Host "Creating layer package..."
Compress-Archive -Path "$pythonDir\*" -DestinationPath "python_layer.zip" -Force

# Clean up
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "Layer package created: python_layer.zip"
Write-Host "Package size: $((Get-Item python_layer.zip).Length / 1MB) MB" 
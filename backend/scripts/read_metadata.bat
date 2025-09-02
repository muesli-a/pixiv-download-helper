@echo off

REM Change the current directory to the project root.
REM %~dp0 expands to the drive and path of this script.
cd /d "%~dp0.."

REM Now, execute the Python script using the project's uv environment.
uv run python -m pixiv_download_helper_backend.interactive_metadata_viewer

pause

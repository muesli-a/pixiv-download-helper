@echo off

cd /d "%~dp0.."

uv run python -m pixiv_download_helper_backend.run

pause

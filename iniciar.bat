@echo off
title L'Atelier Vernis - Servidor Local
echo =====================================================
echo    L'Atelier Vernis - Haute Beaute ^& Studio
echo =====================================================
echo.
echo Iniciando servidor de desarrollo...
echo Tu aplicacion estara disponible en: http://localhost:3000
echo.
start http://localhost:3000
npm run dev
pause

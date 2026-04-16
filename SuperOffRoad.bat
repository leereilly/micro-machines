@echo off
cls
color 0f
echo -------------------------------------------------------------------------------
echo.
echo  Amiga Games Loader prepared by GamesNostalgia.com
echo.
echo  If you like what we do, support us with a donation:
echo.
echo  ***   https://gamesnostalgia.com/donate   ***
echo.
echo -------------------------------------------------------------------------------
echo.
echo  Player 1: Cursor Keys     FIRE: Right Ctrl
echo  Player 2: W,A,S,D         FIRE: Left Ctrl
echo.
echo  Use F12 to PAUSE, Change or Save the state
echo.
echo  Alt+F4 to quit the Game and the Emulator
echo. 
echo -------------------------------------------------------------------------------
echo.
echo  Thanks to FS-UAE http://fs-uae.net/ for the emulator.
echo.
echo  Please go to https://gamesnostalgia.com for more retrogames
echo.
echo.
pause
cd fsuae
fs-uae.exe Default.fs-uae
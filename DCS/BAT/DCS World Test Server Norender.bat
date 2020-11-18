@ECHO off
::SETLOCAL EnableDelayedExpansion
set sweverPath="D:\Games\Eagle Dynamics\DCS World OpenBeta\bin\DCS.exe"
@REM set title=DCS_Server
set title=DCS_World_Test_Server_Norender
set parameter= --server --norender --webgui -w %title%
REM ECHO "WINDOWTITLE eq %title%"
REM set parameter= --webgui -w DCS
TITLE DCS World Test Server Norender管理工具
COLOR 0a
CLS
:MENU
ECHO.
ECHO.=====DCS World Test Server Norender 管理工具=====
ECHO.
ECHO.  1  检查运行状态
ECHO.
ECHO.  2  启动
ECHO.
ECHO.  3  重启
ECHO.
ECHO.  4  结束
ECHO.
ECHO.  5  自动重启
ECHO.
ECHO.  0  退出
ECHO.
ECHO.=====DCS World Test Server Norender 管理工具=====
ECHO.
set /p  ID=请输入选择项目的序号：
ECHO.
IF  "%ID%"=="1"  GOTO checkDCS
IF  "%ID%"=="2"  GOTO startDCS
IF  "%ID%"=="3"  GOTO restartDCS
IF  "%ID%"=="4"  GOTO closeDCS
IF  "%ID%"=="5"  GOTO autoRestart
IF  "%ID%"=="0"  EXIT
IF  %errorlevel%==0  ECHO 输入有误,请重新输入
GOTO MENU

:checkDCS
ECHO 正在检查%title%运行状况
TASKLIST /FI "WINDOWTITLE eq %title%" 2>NUL | find /I /N "DCS.exe">NUL
IF  %errorlevel%==0 (
  ECHO %title%正在运行
  GOTO MENU
)  ELSE (
  ECHO %title%尚未运行
  GOTO MENU
)

:startDCS
TASKLIST /FI "WINDOWTITLE eq %title%" 2>NUL | find /I /N "DCS.exe">NUL
IF  %errorlevel%==0 (
  ECHO %title%正在运行
  GOTO MENU
)  ELSE (
  ECHO 正在启动%title%请稍等...
  START "" %sweverPath%%parameter%
  set flag=0
  GOTO MENU
)

:closeDCS
TASKKILL /F /FI "WINDOWTITLE eq %title%"
ECHO %title%已结束
GOTO MENU

:restartDCS
TASKKILL /F /FI "WINDOWTITLE eq %title%"
ECHO 正在重启%title%请稍等...
START "" %sweverPath%%parameter%
ECHO %title%已重启
GOTO MENU

:autoRestart
ECHO 检查%title%运行
TASKLIST /FI "WINDOWTITLE eq %title%" 2>NUL | find /I /N "DCS.exe">NUL
IF NOT %ERRORLEVEL%==0 GOTO autoStartDCS
ECHO %title%已在运行,30秒后再次检查.
timeout /t 30 /nobreak > NUL
GOTO autoRestart

:autoStartDCS
ECHO %title%没有运行,正在启动...
START "" %sweverPath%%parameter%
timeout /t 30 /nobreak
GOTO autoRestart


REM :Confirm
REM set /p confirm=确认重启?(y or n):
REM set confirm=y
REM if /i "%confirm%"=="y" GOTO CheckDCS
REM if /i "%confirm%"=="n" GOTO :Quit
REM GOTO Confirm
REM :Quit
REM ECHO 你选择了不运行！按回车退出
REM pause>nul
REM exit

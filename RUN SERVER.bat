@ECHO off
SETLOCAL EnableDelayedExpansion
TITLE DCS World Lua调试器
COLOR 0a
CLS
ECHO =================================== DCS World Lua调试器 ===================================
:START
IF EXIST %~dp0node_modules ( GOTO RUN ) ELSE (
  ECHO.
  ECHO. 依赖未安装,正在安装依赖...
  ECHO.
  GOTO INSTALL
)

:INSTALL
CALL npm i -g pnpm
CALL pnpm install
GOTO START

:RUN
 CALL pnpm dev

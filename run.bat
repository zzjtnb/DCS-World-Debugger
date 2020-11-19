@ECHO off 
SETLOCAL EnableDelayedExpansion 
TITLE DCS World Lua调试器
COLOR 0a
CLS
:START
IF EXIST %~dp0node_modules (
  CALL npm run dev
) ELSE (
  CALL npm install  
)
GOTO START
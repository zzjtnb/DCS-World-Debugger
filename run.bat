@ECHO off
SETLOCAL EnableDelayedExpansion
TITLE DCS World Lua������
COLOR 0a
CLS
ECHO =================================== DCS World Lua������ ===================================
:START
IF EXIST %~dp0node_modules (
  GOTO RUN
) ELSE (
  ECHO.
  ECHO. ����δ��װ,���ڰ�װ����...
  ECHO.
  GOTO INSTALL
)
:INSTALL
CALL npm install
GOTO START
:RUN
 CALL npm run dev
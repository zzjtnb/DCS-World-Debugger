@ECHO off 
SETLOCAL EnableDelayedExpansion 
TITLE DCS World Lua�ű�������
COLOR 0a
CLS
if exist %~dp0node_modules (
  call npm run dev
) else (
  call npm install
  npm run dev
)
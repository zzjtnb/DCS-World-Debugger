@ECHO off 
SETLOCAL EnableDelayedExpansion 
TITLE DCS World Lua½Å±¾µ÷ÊÔÆ÷
COLOR 0a
CLS
if exist %~dp0node_modules (
  call npm run dev
) else (
  call npm install
  npm run dev
)
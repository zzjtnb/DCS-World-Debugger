@ECHO off
::SETLOCAL EnableDelayedExpansion
TITLE  DCS_TEST_SERVER������
COLOR 0a
CLS
set sweverPath="E:\Eagle Dynamics\DCS World OpenBeta\bin\DCS.exe"
set title=DCS_TEST_SERVER
set parameter= --server --norender --webgui -w %title%
REM ECHO "WINDOWTITLE eq %title%"
REM set parameter= --webgui -w DCS
:MENU
ECHO.
ECHO.=====DCS_TEST_SERVER������=====
ECHO.
ECHO.  1  �������״̬
ECHO.
ECHO.  2  ����
ECHO.
ECHO.  3  ����
ECHO.
ECHO.  4  ����
ECHO.
ECHO.  5  �Զ�����
ECHO.
ECHO.  0  �˳�
ECHO.
ECHO.=====DCS_TEST_SERVER������=====
ECHO.
set /p  ID=������ѡ����Ŀ����ţ�
ECHO.
IF  "%ID%"=="1"  GOTO checkDCS
IF  "%ID%"=="2"  GOTO startDCS
IF  "%ID%"=="3"  GOTO restartDCS
IF  "%ID%"=="4"  GOTO closeDCS
IF  "%ID%"=="5"  GOTO autoRestart
IF  "%ID%"=="0"  EXIT
IF  %errorlevel%==0  ECHO ��������,����������
GOTO MENU

:checkDCS
ECHO ���ڼ��DCS_TEST_SERVER����״��
TASKLIST /FI "WINDOWTITLE eq %title%" 2>NUL | find /I /N "DCS.exe">NUL
IF  %errorlevel%==0 (
  ECHO DCS_TEST_SERVER��������
  GOTO MENU
)  ELSE (
  ECHO DCSδ����
  GOTO MENU
)

:startDCS
TASKLIST /FI "WINDOWTITLE eq %title%" 2>NUL | find /I /N "DCS.exe">NUL
IF  %errorlevel%==0 (
  ECHO DCS_TEST_SERVER��������
  GOTO MENU
)  ELSE (
  ECHO �����������Ե�...
  START "" %sweverPath%%parameter%
  set flag=0
  GOTO MENU
)

:closeDCS
TASKKILL /F /FI "WINDOWTITLE eq %title%"
ECHO DCS_TEST_SERVER�ѽ���
GOTO MENU

:restartDCS
TASKKILL /F /FI "WINDOWTITLE eq %title%"
ECHO �����������Ե�...
START "" %sweverPath%%parameter%
ECHO DCS_TEST_SERVER������
GOTO MENU

:autoRestart
ECHO ���DCS����
TASKLIST /FI "WINDOWTITLE eq %title%" 2>NUL | find /I /N "DCS.exe">NUL
IF NOT %ERRORLEVEL%==0 GOTO autoStartDCS
ECHO DCS��������,30����ٴμ��.
timeout /t 30 /nobreak > NUL
GOTO autoRestart

:autoStartDCS
ECHO DCSû�����У���������...
START "" %sweverPath%%parameter%
timeout /t 30 /nobreak
GOTO autoRestart


REM :Confirm
REM set /p confirm=ȷ������?(y or n):
REM set confirm=y
REM if /i "%confirm%"=="y" GOTO CheckDCS
REM if /i "%confirm%"=="n" GOTO :Quit
REM GOTO Confirm
REM :Quit
REM ECHO ��ѡ���˲����У����س��˳�
REM pause>nul
REM exit
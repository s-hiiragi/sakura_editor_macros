@echo off

echo -- rmdir
if exist out     (rmdir /s /q out     || exit /b 1)
if exist out.src (rmdir /s /q out.src || exit /b 1)

echo -- mkdir
mkdir out.src || exit /b 1

echo -- xcopy
xcopy /e src out.src || exit /b 1

echo -- nkf
for /r out.src %%a in (*.js) do @(
    echo %%a
    nkf -w8 --in-place %%a
)

REM なぜか以下のコマンドが実行されないため、バッチファイルの外で実行する
REM echo -- jsdoc
REM npx jsdoc -r out.src -c jsdoc_conf.json

echo -- finish

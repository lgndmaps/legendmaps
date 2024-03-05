@echo off

setlocal enabledelayedexpansion

echo [ > powerups_all.json

set "first=true"

for %%f in (powerup_*.json) do (
    if not "%%f"=="powerups_all.json" (
        if not "!first!"=="true" (
            echo , >> powerups_all.json
        )
        type "%%f" >> powerups_all.json
        set "first=false"
    )
)

echo ] >> powerups_all.json
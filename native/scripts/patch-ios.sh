#!/bin/sh
# Permessi e modalità in background per iPhone (dopo "npx cap add ios")
set -e
PL=ios/App/App/Info.plist
B=/usr/libexec/PlistBuddy
set_str() { $B -c "Delete :$1" "$PL" 2>/dev/null || true; $B -c "Add :$1 string $2" "$PL"; }
set_str NSLocationWhenInUseUsageDescription "Maxora usa la tua posizione per avvisarti di incidenti, lavori, radar e controlli sulla strada che hai davanti."
set_str NSLocationAlwaysAndWhenInUseUsageDescription "Così Maxora può avvisarti anche a schermo spento o mentre usi un'altra app di navigazione. Il tuo percorso non viene salvato."
set_str NSLocationAlwaysUsageDescription "Così Maxora può avvisarti anche a schermo spento o mentre usi un'altra app di navigazione. Il tuo percorso non viene salvato."
$B -c "Delete :UIBackgroundModes" "$PL" 2>/dev/null || true
$B -c "Add :UIBackgroundModes array" "$PL"
$B -c "Add :UIBackgroundModes:0 string location" "$PL"
$B -c "Add :UIBackgroundModes:1 string remote-notification" "$PL"
$B -c "Add :UIBackgroundModes:2 string audio" "$PL"
$B -c "Delete :ITSAppUsesNonExemptEncryption" "$PL" 2>/dev/null || true
$B -c "Add :ITSAppUsesNonExemptEncryption bool false" "$PL"
echo "Info.plist pronto"

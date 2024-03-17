# kaplank
En enkel Kanban-app bygget i React, med Firebase for database og autentisering.

Du kan teste appen her: https://cardplank.web.app/

Du kan lage konto og logge inn for å spare på tavlene du lager, eller så kan du teste funksjonaliteten uten å logge inn, med en ren javascript-versjon av tavlen her: https://cardplank.web.app/Demo

Appen er først og fremst noe jeg har laget for å lære meg React og Firebase – men jeg bruker den selv, fordi jeg har inkludert litt småting som gjør at den fungerer bedre til mine formål enn andre kanban-apper. Appen kan brukes på mobil, men fungerer best på desktop.

# Features: UX

- brede og romslige kort som gir litt bedre lesbarhet hvis du har få kort med mer tekst
- klikk rett på teksten for å redigere, kortene oppfører seg akkurat som vanlige tekstfelt
- kjapp og responsiv brukeropplevelse med optimistiske oppdateringer
- enkel og intuitiv drag-and-drop funksjonalitet, implementert med react-beautiful-dnd
- demotavle i ren javascript, som lar brukeren teste funksjonaliteten uten å logge inn eller lage konto

# Features: DX

- alle funksjonene som skriver og leser fra databasen er samlet i én velorganisert fil. I et så lite prosjekt, var det en grei måte å hindre vendor lock-in. Hvis man vil bruke noe annet enn Firebase, er det bare å skrive om funksjonene og endre én import i Planke.js - kombinert med optimistiske updateringer, så gjorde dette det trivielt å lage Demotavlen jeg nevner over

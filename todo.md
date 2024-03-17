

mot slutten:

sett opp dev/production .env jf webdevsimplified, chat med gippidien underveis
fiks tilganger, slik at brukere ikke kan gjore mer enn de ma kunne



nice to have:
- funksjonalitet for å legge brukere til boards
- Mulighet for å lage whitelist eller blacklist med brukere for individuelle boards?
- advarsel om at board-sletting ikke kan undoes, animasjon for board-sletting
- bruke Coloris til a velge farge med hsl, autogenerere en passende kontrastfarge og lag theme til boardet!

Kommentere kort
Historie-tooltip som viser endringshistorien til kort
Ulike rettigheter for ulike brukere
Rik teksteditor for board-notatet
featured-bilde til kortene



Firebase:

en collection som heter «users»

en collection som heter boards

- board-documentet kan så ha listene som subcollections: navn og rekkefølge på listene

---- liste-subcollectionen har så et dokument per kort: hvor er det i rekkefølgen (oi! Hvordan gjør jeg det?), 

Each board doc has a collection named lists, and a collection named cards

Each card doc has a unique ID __name__

Each list doc has an array of these unique ID's, representing the order of the cards within the list

With react-beautiful-dnd, I want to make it so that dragging a card over to a certain position on another list, removes the ID from the array of the list it was dragged from, and adds it in the correct position of the list it was dropped in -- then I'll trigger a rerender, and the card will show up in the right place
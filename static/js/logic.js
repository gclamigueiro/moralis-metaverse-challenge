
// map management constants
const tiles = 12; // in pixels
const plots = 9 * tiles;
const roads = 2 * tiles;
const initialOffsets = plots + roads;
const plotViewOffsets = plots + (2 * roads);

//  canvas and context
const mainCanvas = document.getElementById('mainCanvas');
const mainCtx = mainCanvas.getContext('2d');
const plotCanvas = document.getElementById('plotCanvas');
const plotCtx = plotCanvas.getContext('2d');
const worldImage = new Image();

// state
const mapView = { mapOffsetX: -1 * initialOffsets, mapOffsetY: -1 * initialOffsets };
const plotView = { plotId: "", plotX: 0, plotY: 0, locationX: 0, locationY: 0 };


// canvas drawing function
function drawCanvas() {
    mainCanvas.width = 3 * plots; + 4 * roads;
    mainCanvas.height = 3 * plots; + 4 * roads;
    plotCanvas.width = plots;
    plotCanvas.height = plots;

    worldImage.src = 'static/img/Moraland.png';
    worldImage.onload = function () {
        initializeMap();
    }

}

function initializeMap() {
    updatePlotLocation();
    drawMapSection(mainCtx, mapView.mapOffsetX, mapView.mapOffsetY);
    drawCursor(plotViewOffsets, plotViewOffsets);
    drawMapSection(plotCtx, -1 * plotView.locationX,  -1 * plotView.locationY);
}

function drawMapSection(ctx, originX, originY) {
    ctx.drawImage(worldImage, originX, originY);
}

function drawCursor(x, y) {
    mainCtx.strokeRect(x, y, plots, plots);
}

function updatePlotLocation() {
    plotView.locationX = -1 * mapView.mapOffsetX + plotViewOffsets;
    plotView.locationY = -1 * mapView.mapOffsetY + plotViewOffsets;
}


function move(direction){
    const validMove = validateMove(direction);

    if(validMove) {
        updateView(direction);

        updatePlotLocation();
        drawMapSection(mainCtx,mapView.mapOffsetX,mapView.mapOffsetY);
        drawCursor(plotViewOffsets,plotViewOffsets);
        drawMapSection(plotCtx,-1 * plotView.locationX,-1 *plotView.locationY);
    }
}

function validateMove(direction){
    switch (direction) {
        case 'ArrowRight': return !(plotView.plotX == 5);
        case 'ArrowUp': return !(plotView.plotY == 0);
        case 'ArrowLeft': return !(plotView.plotX == 0);
        case 'ArrowDown': return !(plotView.plotY == 5);
    }
}

function updateView(direction) {
    switch(direction){
        case 'ArrowRight': 
            plotView.plotX += 1;
            mapView.mapOffsetX -= plots + roads;
            break
        case 'ArrowDown': 
            plotView.plotY += 1;
            mapView.mapOffsetY -= plots + roads;
            break
        case 'ArrowLeft': 
            plotView.plotX -= 1;
            mapView.mapOffsetX += plots + roads;
            break
        case 'ArrowUp': 
            plotView.plotY -= 1;
            mapView.mapOffsetY += plots + roads;
            break
    }
}


drawCanvas();
window.addEventListener('keydown', function (event) {
    move(event.key);
});
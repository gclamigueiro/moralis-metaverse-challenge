
// map management constants
const tiles = 12; // in pixels
const plots = 9 * tiles;
const roads = 2 * tiles;
const initialOffsets = plots + roads;
const plotViewOffsets = plots + (2 * roads);
const unassignables = [
    "0xf3ce3e48667649091ed7c33c9edd3bdf6683b101e4c6df4d847c7f9f038e4434",
    "0x2f92fa629f7a5735c83956c713b51ec868ddf8f0eaa650a5652873554a3c4725",
    "0x8b50d3acf3113e6275d60a4fa70cc23cdd1d1a39a0ba1994286b38c07d302ad9",
    "0x97255074fdd7e3d3325b2f2c1dce9f1097696f6b4947ca410e90a2b7f6eb6f04",
    
    "0x760a8a1da896267c45023b0d1c17a5bc42b81d12ab49a4bf1ccfec74c1ebe8ae",
    "0xad2572137374014c87d7abe24a591d3d65aee5cdc781ae15c727a971c5637aa7",
    "0xc2c26eb9355dec9ceae980da9bb626c7b583fe9af9c779333ea6e19309c2f3a6",
    "0xbf8142b3eb80adcbdb8a1c1a146995728a859ab1a1dbf29dcf15ebeb32f4a468",
    "0x3c02bccec034096f69ebbaacc075adbf352d2309a6de6b632d7b18b10b60180c",
    "0xfaf95d6bec5226ee145a021be8bda12c1062f7817ba6340499023b26d7e7a3f0",
    "0x98ce6651c1676f0d20fc0553d96755f2162f97c874ec668be5ebc68c3b2b7b41"
]


// web3 constants
const ethers = Moralis.web3Library

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
    drawMapSection(plotCtx, -1 * plotView.locationX, -1 * plotView.locationY);
    setPlotData();
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


function move(direction) {
    const validMove = validateMove(direction);

    if (validMove) {
        updateView(direction);
        updatePlotLocation();
        drawMapSection(mainCtx, mapView.mapOffsetX, mapView.mapOffsetY);
        drawCursor(plotViewOffsets, plotViewOffsets);
        drawMapSection(plotCtx, -1 * plotView.locationX, -1 * plotView.locationY);
        setPlotData()
    }
}

function validateMove(direction) {
    switch (direction) {
        case 'ArrowRight': return !(plotView.plotX == 5);
        case 'ArrowUp': return !(plotView.plotY == 0);
        case 'ArrowLeft': return !(plotView.plotX == 0);
        case 'ArrowDown': return !(plotView.plotY == 5);
    }
}

function updateView(direction) {
    switch (direction) {
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

function setPlotData() {
    console.log(plotView)
    const plotID = ethers.utils.id(JSON.stringify(plotView));
    document.getElementById("plotX").value = plotView.plotX
    document.getElementById("plotY").value = plotView.plotY
    document.getElementById("locationX").value = plotView.locationX
    document.getElementById("locationY").value = plotView.locationY
    document.getElementById("plotID").value = plotID;
    isPlotAssignable(plotID);
}

function isPlotAssignable(plotID) {
    const _unassignable = unassignables.includes(plotID);
    if (_unassignable) {
        document.getElementById("claimButton").setAttribute("disabled", null);
    }
    else {
        document.getElementById("claimButton").removeAttribute("disabled");
    }
}


drawCanvas();
window.addEventListener('keydown', function (event) {
    move(event.key);
});
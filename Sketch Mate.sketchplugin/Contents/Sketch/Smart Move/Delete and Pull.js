// (cmd ⌫)

/**
 * This plugin deletes the selected layer and pulls all layers below up
 */

var onRun = function (context) {

    // old school variable
    doc = context.document;
    selection = context.selection;


    // the selection
    var selected = selection[0];

    // get the parent group, or if it is an artboard, use the selected layer
    var parent = selected.parentGroup();


    // top edge
    var bottomEdge = selected.frame().y() + selected.frame().height();

    var layersToBeMoved = [];
    var shift = true;

    // top positions
    var topPositions = [];

    // offset
    var offset = selected.frame().height();

    // Remove layer
    parent.removeLayer(selected);

    // loop through all layers on the same level as the parent group
    var layers = parent.layers().array().objectEnumerator();
    while (layer = layers.nextObject()) {
        if (layer != parent && selected != layer.parentGroup()) {

            // get the top position of the current layer
            currentTop = layer.frame().y();

            // push all layers below the selected one down
            if (currentTop > bottomEdge) {

                // add the layer to the potentially shifted layers
                layersToBeMoved.push(layer);
                topPositions.push(parseInt(layer.frame().y()));

            } else if (currentTop == bottomEdge) {

                // if there is a layer at the bottom edge, there will be not shift
                layersToBeMoved = [];
                shift = false;
            }
        }
    }

    topPositions.sort(sortNumber);

    // add the margin between the selected and the nearest layer
    offset += topPositions[0] - bottomEdge;



    // only shift layers if the shift variable is set to true

    if (shift == true) shiftLayers(layersToBeMoved);

}

function shiftLayers(layersToBeMoved) {
    var layer = null;

    for (var i = 0; i < layersToBeMoved.length; i++) {
        layer = layersToBeMoved[i];
        layer.frame().setY(layer.frame().y() - offset);
    }
}

// Sorts numbers. By default, sort would handle numbers as strings and thus not sort them as intended.
function sortNumber(a,b) {
    return a - b;
}
/**
 *
 * Template code for visualizing Cytoscape.js JSON data files.
 *
 */

/* global $ */


$(function () {
    'use strict';

    var NETWORK_FILE = 'data/network1.json';
    var VISUAL_STYLE_FILE = 'data/vs.json';

    console.log('Network rendering start...');

    // Basic settings for the Cytoscape window
    var options = {

        showOverlay: false,
        minZoom: 0.01,
        maxZoom: 200,

        layout: {
            name: 'preset'
        },

        ready: function () {
            var cy = this;
            cy.load(networkData.elements);
            // Apply Visual Style CSS
            var targetStyleName = 'gal1';
            var title = '';
            var visualStyle;
            for(var i=0; i<vs.length; i++) {
                visualStyle = vs[i];
                title = visualStyle.title;
                if(title === targetStyleName) {
                    break;
                }
            }
            cy.style().fromJson(visualStyle.style).update();
        }
    };

    var networkData = {};
    var vs = {};

    // Load data files.
    $.getJSON(VISUAL_STYLE_FILE, function(visualStyle) {
        vs = visualStyle;
        $.getJSON(NETWORK_FILE, function(network) {
            networkData = network;
            $('.network').cytoscape(options);
        });
    });
})();

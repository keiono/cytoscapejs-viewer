/**
 *
 * Template code for visualizing Cytoscape.js JSON data files.
 *
 */

/* global $ */


$(function () {
    'use strict';

    var NETWORK_FILE = 'data/gal1.cyjs';
    var VISUAL_STYLE_FILE = 'data/galvs.json';

    var DEFAULT_VISUAL_STYLE = 'default';

    console.log('Network rendering start...');

    var visualStyles = {};

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
            setVisualStyleCombobox(cy);
            setNetworkComboBox(cy);
        }
    };


    function setNetworkComboBox(cy) {
        var network;
        var networkSelector = $('#networks');
        for(var i=0; i<5; i++) {
            networkSelector.append('<option>Network ' + i + '</option>');
        }

        networkSelector.on('change', function(event) {
            var selectedNetworkName = $(this).val();
            console.log(selectedNetworkName);
        });
    }

    function setVisualStyleCombobox(cy) {
        var visualStyle;
        var visualStyleSelector = $('#vs');
        for(var i=0; i<vs.length; i++) {
            visualStyle = vs[i];
            var title = visualStyle.title;
            visualStyles[title] = visualStyle;
            visualStyleSelector.append('<option>' + title + '</option>');
        }
        cy.style().fromJson(visualStyles[DEFAULT_VISUAL_STYLE].style).update();

        visualStyleSelector.val(DEFAULT_VISUAL_STYLE);
        visualStyleSelector.on('change', function(event) {
            var selectedVisualStyleName = $(this).val();
            console.log(selectedVisualStyleName);
            cy.style().fromJson(visualStyles[selectedVisualStyleName].style).update();
        });
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
});

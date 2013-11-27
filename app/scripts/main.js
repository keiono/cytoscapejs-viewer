/**
 *
 * Template code for visualizing Cytoscape.js JSON data files.
 *
 */

/* global $ */


$(function () {
    'use strict';

    var NETWORK_FILE = 'data/sample1.cyjs';
    var VISUAL_STYLE_FILE = 'data/sample1vs.json';

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

            updateNetworkData(cy);
        }
    };

    function updateNetworkData(cy) {
        var dropZone = $('.network');
        dropZone.on('dragenter', function (e)
        {
            e.stopPropagation();
            e.preventDefault();
        });

        dropZone.on('dragover', function (e)
        {
            e.stopPropagation();
            e.preventDefault();
        });
        dropZone.on('drop', function (e)
        {
            e.preventDefault();
            var files = e.originalEvent.dataTransfer.files;
            var networkFile = files[0];
            var reader = new FileReader();
            reader.onload = function(evt) {
              var network = JSON.parse(evt.target.result);
              cy.load(network.elements);
            };
            reader.readAsText(networkFile);
        });
    }

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
    }

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

    // For D3.js
    function renderD3() {
        var width = 300,
            height = 300;

        var color = d3.scale.category20();

        var force = d3.layout.force()
            .charge(-20)
            .linkDistance(20)
            .size([width, height]);

        var svg = d3.select(".d3view").append("svg");

        d3.json("data/data.json", function(error, graph) {
            force
                .nodes(graph.nodes)
                .links(graph.links)
                .start();

            var link = svg.selectAll(".link")
                .data(graph.links)
                .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", 1)
                .style("stroke", "#656565");

            var node = svg.selectAll(".node")
                .data(graph.nodes)
                .enter().append("circle")
                .attr("class", "node")
                .attr("r", 4)
                .style("fill", "#FF5E19")
                .call(force.drag);

            node.append("title")
                .text(function(d) { return d.name; });

            force.on("tick", function() {
                link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
            });
        });
    }

});

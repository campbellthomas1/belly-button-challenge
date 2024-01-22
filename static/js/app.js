//used https://plotly.com/javascript/ throughout code

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
let loadedData;

//tried to load data to shorten code but was having trouble
function loadDataAndInit() {
    d3.json(url).then(function(data) {
        loadedData = data;
        init();
    });
};

d3.json(url).then(function(data) {
  console.log(data);
});

function init() {
    let dropdownMenu = d3.select("#selDataset");
    d3.json(url).then((data) => {
        let names = data.names;

        names.forEach((id) => {

            dropdownMenu.append("option")
            .text(id).property("value");
        });

        chartvalues(names[0]);
        metadata(names[0]);

    });
};

function optionChanged(newvalue){
    chartvalues(newvalue);
    metadata(newvalue);
};

function chartvalues(newvalue){
    d3.json(url).then(function(data){
        let samples = data.samples;
        let id = samples.filter(take=>take.id == newvalue);
        let sample_values = id[0].sample_values;
        let otu_ids = id[0].otu_ids;
        let otu_labels = id[0].otu_labels;
        
        charts(sample_values, otu_ids, otu_labels);

    });
};

//bar and bubble chart displays
function charts(sample_values, otu_ids, otu_labels) {
    d3.json(url).then(data => {
        //looked up how to use const/reversedSlice/arr: https://www.w3schools.com/js/js_const.asp
        const reversedSlice = arr => arr.slice(0, 10).reverse();
        const otuLabelsReversed = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();

        const bar_data = [{
            type: 'bar',
            x: reversedSlice(sample_values),
            y: otuLabelsReversed,
            text: otu_labels,
            orientation: 'h'
        }];

        const bubble_data = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                colorscale: 'heatmap',
                size: sample_values
            }
        }];

        const bubble_layout = { title: 'bubble chart', height: 500, width: 800 };
        const bar_layout = { title: 'bar chart', height: 500, width: 500 };

        Plotly.newPlot('bar', bar_data, bar_layout);
        Plotly.newPlot('bubble', bubble_data, bubble_layout);
    });
};

function metadata(newvalue){
    d3.json(url).then(function(data){
        let samples = data.metadata;
        let id = samples.filter(take=>take.id == newvalue);
        let metadata2 = d3.select('#sample-metadata').html('');

        Object.entries(id[0]).forEach(([key, value]) => {
            metadata2.append("h5").text(`${key}: ${value}`);
        });
    });
};

init();
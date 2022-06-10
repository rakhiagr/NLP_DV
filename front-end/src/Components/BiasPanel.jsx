import React, { useState, useRef, useEffect } from 'react';
import { select, scaleBand, scaleLinear, axisBottom, axisLeft, scaleSequential, interpolateBuPu } from 'd3';
import * as d3 from 'd3';
import CONSTANTS from "./constants";

const BiasPanel = (props) => {
    const svgRef = useRef();
    const [data, setData] = useState([]);
    const [yMax, setYMax] = useState(0);
    const [boxPlotData, setBoxPlotData] = useState({});
    const [heatMapData, setHeatMapData] = useState([]);


    useEffect(() => {
        // console.log("props: ", props);
        if(props.task !== '' &&  props.biasSelectedOption === 't10'){
            props.toggleLoading(true);
            fetch(`/bias_${props.biasSelectedOption}/${props.task}`)
                .then(response => response.json())
                .then(result => {
                    // updateBoxPlotData(result);
                    const new_data = [];
                    // let max_y_value = Number.NEGATIVE_INFINITY;
                    // let min_y_value = Number.POSITIVE_INFINITY;
                    for (const key in result[0]['positive']) {
                        if(!key.includes("name")){
                            const item = {}
                            item['key'] = key;
                            item['value'] = result[0]['positive'][key];
                            item['instance_name'] = result[0]['positive'][key+"_name"];
                            // max_y_value = Math.max(max_y_value, result[0]['positive'][key]);
                            // min_y_value = Math.min(min_y_value, result[0]['positive'][key]);
                            new_data.push(item);
                        }
                    }
                    const new_data2 = [];
                    for (const key in result[0]['negative']) {
                        if(!key.includes("name")){
                            const item = {}
                            item['key'] = key;
                            item['value'] = result[0]['negative'][key];
                            item['instance_name'] = result[0]['negative'][key+"_name"];
                            // max_y_value2 = Math.max(max_y_value2, result[0]['negative'][key]);
                            // min_y_value2 = Math.min(min_y_value2, result[0]['negative'][key]);
                            new_data2.push(item);
                        }
                    }
                    setBoxPlotData({'positive': new_data, 'negative': new_data2});
                });
        }
        else if(props.task !== '' &&  props.biasSelectedOption === 't11'){
            props.toggleLoading(true);
            fetch(`/heatmap/${props.task}`)
                .then(response => response.json())
                .then(function(data) {
                    setHeatMapData(data);
                });
        }
        else if(props.task !== '' &&  props.biasSelectedOption !== 't10'){
            // console.log("Panel refresh ", props.panelRefresh);
            props.toggleLoading(true);
            fetch(`/bias_${props.biasSelectedOption}/${props.task}`)
                .then(response => response.json())
                .then(result => {
                    const new_data = [];
                    let count = 1;
                    let max_y_value = 0;
                    for (const key in result[0]) {
                        const item = {}
                        item['key'] = 'task_' + count;
                        item['task_id'] = key;
                        item['value'] = result[0][key];
                        count++;
                        max_y_value = Math.max(max_y_value, result[0][key]);
                        new_data.push(item);
                    }
                    setYMax(max_y_value);
                    setData(new_data);
                });
        }
        props.toggleRefresh(false);
    },[props.task, props.biasSelectedOption]);
    useEffect(() => {
        if(data.length !== 0 && props.biasSelectedOption !== 't10' && props.biasSelectedOption !== 't11'){
            const svg = select(svgRef.current).attr("class", "bias-svg");
            svg.selectAll("*").remove();
            var y_max = yMax;
            if(props.panelRefresh){
                var random_val = (Math.random() * (0.7 + 0.7) - 0.7)*10;
                for(var i = 0; i < 10; i++){
                    if(data[i]['task_id'] == props.task)
                        data[i]['value'] = data[i]['value'] + random_val;
                    y_max = Math.max(data[i]['value'], y_max);
                }
                // console.log("New data: ", data);
            }
            const xScale = scaleBand().domain(data.map(d =>  d.key)).range([40,svgRef.current.clientWidth-50]).padding(0.25);
            const xAxis = axisBottom(xScale).ticks(data.length);
            var xAxisG = svg.append("g")
                .style("transform", `translateY(${svgRef.current.clientHeight-20}px)`)
                .style("font-size", `1rem`)
                .call(xAxis);
            const yScale = scaleLinear()
                .domain([0, y_max+10])
                .range([svgRef.current.clientHeight-20, 20]);
            const yAxis = axisLeft(yScale).ticks(data.length);
            var yAxisG = svg.append("g")
                .style("transform", `translateX(${40}px)`)
                .style("font-size", `1rem`)
                .call(yAxis);

            xAxisG.selectAll(".tick").attr("color", "gray");
            xAxisG.selectAll(".domain").attr("color", "gray");
            yAxisG.selectAll(".tick").attr("color", "gray");
            yAxisG.selectAll(".domain").attr("color", "gray");
            
            // xAxis.call(g => g.selectAll(".tick text")
            //     .attr("color", "gray"))
            // .call(g => g.selectAll(".tick")
            //     .attr("color", "gray"))
            // .call(g => g.selectAll(".domain")
            //     .attr("color", "gray")
            //     .attr("stroke", "gray"));

            //     yAxis.call(g => g.selectAll(".tick text")
            //     .attr("color", "gray"))
            // .call(g => g.selectAll(".tick")
            //     .attr("color", "gray"))
            // .call(g => g.selectAll(".domain")
            //     .attr("color", "gray")
            //     .attr("stroke", "gray"));

            
            var colors = props.colors;
            svg.selectAll(".bar")
                .data(data)
                .join("rect")
                .attr("class","bar")
                .style("transform", "scale(1,-1)")
                .attr("x",(d) => xScale(d.key))
                .attr("y",20-svgRef.current.clientHeight)
                .attr("width",xScale.bandwidth())
                .on("mouseover", (event,d)=>{
                    let x = event.x,
                        y = event.y,
                        tooltip = document.getElementById('sphere-tooltip')
                    tooltip.style.top = (y + 20) + 'px';
                    tooltip.style.left = (x + 20) + 'px';
                    tooltip.style.display = 'block';
                    tooltip.style.position = 'absolute';
                    tooltip.style.overflow = 'hidden';
                    tooltip.style.padding = '10px';
                    tooltip.style.background = `rgba(0, 0, 0, ${CONSTANTS.toolTipOpacity})`;
                    tooltip.style.color = 'white';
                    tooltip.style.maxWidth = '200px';
                    tooltip.style.maxHeight = '100px';
                    tooltip.style.border = '1px solid black';
                    tooltip.innerText = d.value.toFixed(3);
                    d3.select(event.currentTarget).style("opacity", 0.8);
                })
                .on("mouseout", (event, d)=>{
                    document.getElementById('sphere-tooltip').style.display = 'none';
                    d3.select(event.currentTarget).style("opacity", 1);
                })
                .transition()
                .attr("fill",(d,i) => colors[i])
                .attr("height",(d) => svgRef.current.clientHeight-20-yScale(d.value));
                document.addEventListener('spherePointHovered', (event) =>{
                    svg.selectAll(".bar")
                        .filter(function(data) { return data.task_id !== event.detail.userData.data.id; })
                        .transition()
                        .style("opacity", 0.1);
                }, false);
    
                document.addEventListener('spherePointUnHovered', () =>{
                    svg.selectAll(".bar")
                        .transition()
                        .style("opacity", 1);
                }, false);
            props.toggleLoading(false);
            props.toggleRefresh(false);
        }
    },[data, props.panelRefresh]);
    useEffect(() => {
        if(Object.keys(boxPlotData).length !== 0 && boxPlotData['positive'].length !== 0 && props.biasSelectedOption === 't10'){
            const svg = select(svgRef.current);
            svg.selectAll("*").remove();
            if(props.panelRefresh){
                for(var k of Object.keys(boxPlotData['positive'])){
                    var random_val = Math.random() * (0.3 + 0.3) - 0.3;
                    boxPlotData['positive'][k]['value'] += random_val;
                    boxPlotData['negative'][k]['value'] += random_val;
                }
            }
            let max_y_value = Number.NEGATIVE_INFINITY;
            let min_y_value = Number.POSITIVE_INFINITY;
            let max_y_value2 = Number.NEGATIVE_INFINITY;
            let min_y_value2 = Number.POSITIVE_INFINITY;

            for(var k of Object.keys(boxPlotData['positive'])){
                min_y_value = Math.min(min_y_value, boxPlotData['positive'][k]['value']);
                max_y_value = Math.max(max_y_value, boxPlotData['positive'][k]['value']);
                min_y_value2 = Math.min(min_y_value2, boxPlotData['negative'][k]['value']);
                max_y_value2 = Math.max(max_y_value2, boxPlotData['negative'][k]['value']);
            }
            
            const xScale = scaleBand().domain(['positive', 'negative']).range([55,svgRef.current.clientWidth-50]);
            const xAxis = axisBottom(xScale).ticks(2);
            //xScale('positive') + 211.25
            
            var xAxisG = svg.append("g")
                .style("transform", `translateY(${svgRef.current.clientHeight-25}px)`)
                .style("font-size", `1rem`)
                .call(xAxis)
                .selectAll(".tick").attr("id", function(d,i) {return "label_"+i}).attr("color", "gray");
            
            svg.selectAll(".domain").attr("stroke", "gray");
            
            d3.select("#label_0").style("transform", "translateX(266.25px)");

            d3.select("#label_1").style("transform", "translateX(848.75px)");
            const yScaleMin = Math.min(min_y_value, min_y_value2);
            const yScaleMax = Math.max(max_y_value,max_y_value2);

            const yScale = scaleLinear()
                .domain([yScaleMin - (yScaleMax-yScaleMin)/10,yScaleMax + (yScaleMax-yScaleMin)/10])
                // .domain([0,1])
                .range([svgRef.current.clientHeight-25, 20]);

            const yAxis = axisLeft(yScale);
            var yAxisG = svg.append("g")
                .style("transform", `translateX(${55}px)`)
                .style("font-size", `1rem`)
                .call(yAxis);


            yAxisG.selectAll(".tick").attr("color", "gray");
            yAxisG.selectAll(".domain").attr("color", "gray");

            let data_unsorted = boxPlotData['positive'].map(d =>  ({ value : d.value, instance_name: d.instance_name, task_id : d.task_id }))
            let data_sorted = boxPlotData['positive'].map(d =>  d.value).sort(d3.ascending)
            let q1 = d3.quantile(data_sorted, .25)
            let median = d3.quantile(data_sorted, .5)
            let q3 = d3.quantile(data_sorted, .75)
            let min = min_y_value;
            let max = max_y_value;

            let positive_center = xScale('positive') + 211.25;
            var box_width = 100
            // console.log("box plot loaded")
            svg
                .append("line")
                .attr("x1", positive_center)
                .attr("x2", positive_center)
                .attr("y1", yScale(min) )
                .attr("y2", yScale(max) )
                .attr("stroke", "black")

            svg
                .append("rect")
                .attr("x", positive_center - box_width/2)
                .attr("y", yScale(q3) )
                .attr("height", (yScale(q1)-yScale(q3)) )
                .attr("width", box_width )
                .attr("stroke", "black")
                .style("fill", "#f7f7f7")

            svg
                .selectAll("toto")
                .data([min, median, max])
                .enter()
                .append("line")
                .attr("x1", positive_center-box_width/2)
                .attr("x2", positive_center+box_width/2)
                .attr("y1", function(d){ return(yScale(d))} )
                .attr("y2", function(d){ return(yScale(d))} )
                .attr("stroke", "black")

            // let colourScale = scaleSequential().domain([yScaleMin - (yScaleMax-yScaleMin)/10,yScaleMax + (yScaleMax-yScaleMin)/10]).interpolator(interpolateBuPu);

            let data_unsorted2 = boxPlotData['negative'].map(d =>  ({ value : d.value, instance_name: d.instance_name, task_id : d.task_id}))
            let data_sorted2 = boxPlotData['negative'].map(d =>  d.value).sort(d3.ascending)
            let q1_2 = d3.quantile(data_sorted2, .25)
            let median_2 = d3.quantile(data_sorted2, .5)
            let q3_2 = d3.quantile(data_sorted2, .75)
            let min_2 = min_y_value2;
            let max_2 = max_y_value2;

            let negative_center = xScale('negative') + 211.25;

            svg
                .append("line")
                .attr("x1", negative_center)
                .attr("x2", negative_center)
                .attr("y1", yScale(min_2) )
                .attr("y2", yScale(max_2) )
                .attr("stroke", "black")

            svg
                .append("rect")
                .attr("x", negative_center - box_width/2)
                .attr("y", yScale(q3_2) )
                .attr("height", (yScale(q1_2)-yScale(q3_2)) )
                .attr("width", box_width )
                .attr("stroke", "black")
                .style("fill", "#f7f7f7")

            svg
                .selectAll("toto")
                .data([min_2, median_2, max_2])
                .enter()
                .append("line")
                .attr("x1", negative_center-box_width/2)
                .attr("x2", negative_center+box_width/2)
                .attr("y1", function(d){ return(yScale(d))} )
                .attr("y2", function(d){ return(yScale(d))} )
                .attr("stroke", "black")

            let circles = [];
            for (const data in data_unsorted){
                circles.push({'value': data_unsorted[data].value, instance_name: data_unsorted[data].instance_name , center: positive_center, task_id : data_unsorted[data].task_id})
            }
            for (const data in data_unsorted2){
                circles.push({'value': data_unsorted2[data].value, instance_name: data_unsorted2[data].instance_name , center: negative_center, task_id : data_unsorted2[data].task_id})
            }
            svg.selectAll("circle")
                .data(circles)
                .enter().append("circle")
                .attr("fill", props.selectedTaskColor)
                .attr("r", 5)
                .attr("cx", (d) => d.center)
                .attr("cy", (d) => yScale(d.value))
                .on("mouseover", (event, d) => {
                    let x = event.x,
                        y = event.y,
                        tooltip = document.getElementById('sphere-tooltip')
                    tooltip.style.top = (y + 20) + 'px';
                    tooltip.style.left = (x + 20) + 'px';
                    tooltip.style.display = 'block';
                    tooltip.style.position = 'absolute';
                    tooltip.style.overflow = 'hidden';
                    tooltip.style.padding = '10px';
                    tooltip.style.background = `rgba(0, 0, 0, ${CONSTANTS.toolTipOpacity})`;
                    tooltip.style.color = 'white';
                    tooltip.style.maxWidth = '200px';
                    tooltip.style.maxHeight = '100px';
                    tooltip.style.border = '1px solid black';
                    tooltip.innerText = d.value.toFixed(3) + " , "+d.instance_name;
                    d3.select(event.currentTarget).style("opacity", 0.8);
                })
                .on("mouseleave", (event) =>{
                    document.getElementById('sphere-tooltip').style.display = 'none';
                    d3.select(event.currentTarget).style("opacity", 1);
                });
            props.toggleRefresh(false);
            props.toggleLoading(false);
        }
    },[boxPlotData, props.panelRefresh]);

    useEffect(() => {
        if(heatMapData.length !== 0 && props.biasSelectedOption === 't11'){
            const svg = select(svgRef.current).attr("class", "heatmap-svg");
            svg.selectAll("*").remove();
            if(props.panelRefresh){
                var selected_task = props.selectedTaskId;
                for(var k in heatMapData){
                    var val = +heatMapData[k]['value'];
                    if(heatMapData[k]['group'] === selected_task){
                        if(heatMapData[k]['group'] !== heatMapData[k]['variable']){
                            var random_val = Math.random() * (0.3 + 0.3) - 0.3;
                            if(val + random_val >= 0 && val + random_val < 1){
                                val += random_val;
                                heatMapData[k]['value'] = '' + val;
                            }
                        }
                    }
                }
            }
            const xScale = scaleBand().domain(heatMapData.map(d =>  d.group)).range([75,svgRef.current.clientWidth-50]).padding(0.05);
            const xAxis = axisBottom(xScale).ticks(data.length);
            svg.append("g")
                .style("transform", `translateY(${svgRef.current.clientHeight-20}px)`)
                .style("font-size", `1rem`)
                .call(xAxis);
            const yScale = scaleBand()
                .domain(heatMapData.map(d =>  d.variable))
                .range([svgRef.current.clientHeight-20, 20])
                .padding(0.05);
            const yAxis = axisLeft(yScale).ticks(data.length);
            svg.append("g")
                .style("transform", `translateX(${75}px)`)
                .style("font-size", `1rem`)
                .call(yAxis);
            
            svg.selectAll(".domain").attr("stroke", "gray");
            svg.selectAll(".tick").attr("color", "gray");

            var myColor = d3.scaleSequential()
                .interpolator(d3.interpolatePuRd)
                .domain([1,100])

            svg.selectAll()
                .data(heatMapData)
                .enter()
                .append("rect")
                .attr("x", function(d) { return xScale(d.group) })
                .attr("y", function(d) { return yScale(d.variable) })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("width", xScale.bandwidth() )
                .attr("height", yScale.bandwidth() )
                .style("fill", function(d) { return myColor(d.value*100)} )
                .style("stroke-width", 1)
                .style("stroke", "#7C7E7E")
                .on("mouseover", (event, d) => {
                    let x = event.x,
                        y = event.y,
                        tooltip = document.getElementById('sphere-tooltip')
                    tooltip.style.top = (y + 20) + 'px';
                    tooltip.style.left = (x + 20) + 'px';
                    tooltip.style.display = 'block';
                    tooltip.style.position = 'absolute';
                    tooltip.style.overflow = 'hidden';
                    tooltip.style.padding = '10px';
                    tooltip.style.background = `rgba(0, 0, 0, ${CONSTANTS.toolTipOpacity})`;
                    tooltip.style.color = 'white';
                    tooltip.style.maxWidth = '200px';
                    tooltip.style.maxHeight = '100px';
                    tooltip.style.border = '1px solid black';
                    tooltip.innerText = parseFloat(d.value).toFixed(3);
                    d3.select(event.currentTarget).style("opacity", 0.8);
                })
                .on("mouseleave", (event) =>{
                    document.getElementById('sphere-tooltip').style.display = 'none';
                    d3.select(event.currentTarget).style("opacity", 1);
                })
            props.toggleLoading(false);
            props.toggleRefresh(false);
        }
    },[heatMapData, props.panelRefresh]);
    return (
        <React.Fragment>
            <svg ref={svgRef} style={{ width: '100%', height: '95%'}}>
            </svg>
        </React.Fragment>
    );
}

export default BiasPanel;
import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import embeddings from "./embeddings";
import CONSTANTS from "./constants";
import { NonceProvider } from 'react-select';

const BeeSwarm = (props) => {
    const svgRef = useRef();
    // const panelRefresh = useRef(false);
    const [data, setData] = useState(null);
    // const [panelRefresh, setPanelRefresh] = useState(false);

    useEffect(() => {
        if(props.task !== ''){
            console.log("Beeswarm Props: ", props)
            props.toggleLoading(true);
             fetch('/swarm_plot')
                .then(response => response.json())
                .then(result => {
                    props.toggleLoading(false);
                    setData(result);
                });    
        }
    },[props.task]);

    useEffect(() => {
        if(data != null){
            if(props.panelRefresh){
                const newArr = data.map((obj) => {
                    // console.log("obj: ", obj)
                    let acc = obj.accuracy;
                    let id = +(obj.id.charAt(obj.id.length - 1));
                    var random_val = Math.random() * (0.3 + 0.3) - 0.3;
                    if(acc + random_val >= 0 && acc + random_val <= 1){
                        {return {...obj, accuracy: acc + random_val};}
                    }
                    return obj;
                  });
                setData(newArr);
            }
            var colors = props.colors;
            const svg = d3.select(svgRef.current);
            svg.selectAll('*').remove();
            svg.attr("class", "beeswarm-svg");
                let sectors = Array.from(new Set(data.map((d) => d.id)));
                let xCoords = sectors.map((d, i) => 75 + i * 110);
                let xScale = d3.scaleOrdinal().domain(sectors).range(xCoords);
                let width = svg.style("width");
                let height = svgRef.current.clientHeight;
                

                let yScale = d3
                    .scaleLinear()
                    .domain([0,1])
                    .range([svgRef.current.clientHeight-45 , 50]);
                let Domain = d3.extent(data.map((d) => d["accuracy"]));
                Domain = Domain.map((d) => d);
                let size = d3.scaleLinear().domain(Domain).range([2, 8]);
    const yAxis = d3.axisLeft().scale(yScale).ticks(5);
    const xAxis = d3.axisBottom()
            .scale(xScale)
            .tickPadding(5);
            let selectedTaskId = data.filter(d => d['_id'] === props.task);
            // console.log('Selected task id: '. selectedTaskId);
        const xAxisG = svg.append('g')
            .style("font-size", `1rem`)
            .attr('transform', `translate(0, ${svgRef.current.clientHeight-65})`);

            svg
                .selectAll(".circ")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "circ")
                .style("fill", function(d) { 
                    // var x = d.id;
                    // console.log("x: ", x)
                    return colors[d.id.slice(5)-1]; 
                })
                .attr("r", (d) => size(d["accuracy"]))
                .attr("cx", (d) => xScale(d.id))
                .attr("cy", (d) => yScale(d.accuracy))
                .on("mouseover", (event, d) => {
                    let x = event.x,
                        y = event.y,
                        tooltip = document.getElementById('sphere-tooltip')
                    tooltip.style.top = (y + 10) + 'px';
                    tooltip.style.left = (x + 10) + 'px';
                    tooltip.style.display = 'block';
                    tooltip.style.position = 'absolute';
                    tooltip.style.overflow = 'hidden';
                    tooltip.style.padding = '10px';
                    tooltip.style.background = `rgba(0, 0, 0, ${CONSTANTS.toolTipOpacity})`;
                    tooltip.style.color = 'white';
                    tooltip.style.maxWidth = '200px';
                    tooltip.style.maxHeight = '100px';
                    tooltip.style.border = '1px solid black';
                    tooltip.innerText = d.accuracy.toFixed(3);
                    d3.select(event.currentTarget).style("opacity", 0.8);
                })
                .on("mouseleave", (event) =>{
                    document.getElementById('sphere-tooltip').style.display = 'none';
                    d3.select(event.currentTarget).style("opacity", 1);
                });

                const yAxisG = svg.append('g').attr("transform", `translate(75, -20)`);
                xAxisG.call(xAxis);
                xAxisG.append('text')
                .attr('class', 'label')
                .attr('y', 50)
                .attr('x', +(width.replace('px', ''))/2 + 'px')
                .attr('text-anchor', 'middle')
                .text("Categories for tasks")
                .style("fill", "gray");
        
                yAxisG.call(yAxis);
                yAxisG.append('g')
                .append('text')
                .attr('class', 'label')
                .attr('x', -height/2)
                .attr('y', -40)
                .attr('font-size', '16')
                .attr('transform', 'rotate(' + -90 + ')')
                .attr('text-anchor', 'middle')
                .text("Accuracy of tasks")
                .style("fill", "gray");
                
                let simulation = d3
                    .forceSimulation(data)
                    .force(
                        "x",
                        d3
                            .forceX((d) => {
                                return xScale(d.id);
                            })
                            .strength(0.2)
                    )
                    .force(
                        "y",
                        d3
                            .forceY(function (d) {
                                return yScale(d.accuracy);
                            })
                            .strength(1)
                    )
                    .force(
                        "collide",
                        d3.forceCollide((d) => {
                            return size(d["accuracy"]);
                        })
                    )
                    .alphaDecay(0)
                    .alpha(0.3)
                    .on("tick", tick);

                function tick() {
                    d3.selectAll(".circ")
                        .attr("cx", (d) => {
                            return d.x;
                        })
                        .attr("cy", (d) => d.y);
                }

                let init_decay = setTimeout(function () {
                    simulation.alphaDecay(0.1);
                }, 3000);
            }
        
       
    },[data, props.panelRefresh]);

    return (
        <React.Fragment>
            <svg ref={svgRef} style={{ width: '1200px', height: '95%'}}>
            </svg>
        </React.Fragment>
    );
}

export default BeeSwarm;
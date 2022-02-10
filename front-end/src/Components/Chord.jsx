import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import embeddings from "./embeddings";
import CONSTANTS from "./constants";

const Chord = (props) => {
    const svgRef = useRef();
    const [data, setData] = useState([]);


    useEffect(() => {
        if(props.task !== '' ){
            props.toggleLoading(true);
            
            fetch(`/chord/${props.task}`)
                .then(response => response.json())
                .then(result => {
                    props.toggleLoading(false);
                    setData(result);
                    
                });
        }
    },[props.task]);
    
    useEffect(() => {
        if(data.length !== 0 ){
            const category_mapper = {};
            for ( let i = 0; i < embeddings.length; i ++ ) {
                if(props.taskNeighbours.map(d => Object.keys(d)[0]).includes(embeddings[i].id)){
                    category_mapper[embeddings[i].id] = embeddings[i].category;
                }
            }
            
            let id = Object.keys(data);
            
            for(const key in id){
                const item = data[id[key]];
                for(var i = 0; i<10; i++){
                    if(data[id[key]][i] < 0.24)
                    data[id[key]][i] = 0;
                }
            }
            
            d3.select(svgRef.current).selectAll("*").remove(); ///

            const index_task_id_map = {}
            const matrix = []
            let count = 0;
            for(const key in data){
                index_task_id_map[count] = key;
                count = count +1;
                matrix.push(data[key]);
            }

            const outerRadius = (svgRef.current.clientWidth/2) - 170;
            const innerRadius = outerRadius - 35;
            const color = d3.scaleSequential().domain([0,matrix.length])
                .interpolator(d3.interpolate('#A3E4D7', '#264653'));
            const opacityDefault = 0.8;

            const chord = d3.chord()
                .padAngle(0.09);
            const arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
            const ribbonPath = d3.ribbon()
                .radius(innerRadius);

            const svg = d3.select(svgRef.current).attr("class", "chord-svg")
                .append("g")
                .attr("transform", `translate(${svgRef.current.clientWidth/2},${svgRef.current.clientHeight/2})`)
                .datum(chord(matrix));

            const outerCircle = svg.selectAll("g.group")
                .data(function(chords) { return chords.groups; })
                .enter().append("g")
                .attr("class", "group")
                .on("mouseover", fade(.1, true))
                .on("mouseleave", (event) =>{
                    document.getElementById('sphere-tooltip').style.display = 'none';
                    d3.select(event.currentTarget).style("opacity", 1).style("stroke", 'none');
                })
                .on("mouseout", fade(opacityDefault, false))
                .on("mouseout", mouseoutChord);

        var path = outerCircle.append("path")
                .style("fill", function(d) { return color(d.index); })
                .attr("id", function(d, i) { return "group" + d.index; })
                .attr("d", arc);

        var groupText = outerCircle.append("text").attr("class","task_text")
            .attr("dy", (outerRadius - innerRadius) / 2 + 4)
            .attr("text-anchor", "middle");

          var groupTextPath = groupText
            .append("textPath")
            .attr("xlink:href", function(d) {
              return "#group" + d.index;
            })
            .attr("startOffset", function(d) {
              var length = path.nodes()[d.index].getTotalLength();
              return (25-(50 *outerRadius)/length+(50 *innerRadius)/length) + "%";
            })
            .text(function(d) {
              return "t_" + (d.index+1);
            }).style("font-size", "15px").style("fill", "#273746").style("font-weight", "500");

            svg.selectAll("path.chord")
                .data(function(chords) { return chords; })
                .enter().append("path")
                .attr("class", "chord")
                .style("fill", function(d) { return color(d.source.index); })
                .style("opacity", opacityDefault)
                .attr("d", ribbonPath).on("mouseover", (event, d) => {
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
                    tooltip.innerText = d.source.value;
                    d3.select(event.currentTarget).style("opacity", 0.8).style("stroke", 'black');
                })
                
                .on("mouseleave", (event) =>{
                    document.getElementById('sphere-tooltip').style.display = 'none';
                    d3.select(event.currentTarget).style("opacity", 1).style("stroke", 'none');
                });

            function fade(opacity, flag) {
                return function(event,d) {
                    svg.selectAll("path.chord")
                        .filter(function(data) { return data.source.index !== d.index && data.target.index !== d.index; })
                        .transition()
                        .style("opacity", opacity);
                        if(flag === true){
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
                            //console.log(category_mapper[Object.keys(props.taskNeighbours[d.index])]);
                            tooltip.innerText = category_mapper[Object.keys(props.taskNeighbours[d.index])];
                            d3.select(event.currentTarget).style("opacity", 0.8);
                        }
                        else{
                            document.getElementById('sphere-tooltip').style.display = 'none';
                            d3.select(event.currentTarget).style("opacity", 1).style("stroke", 'none');
                        }
                        
                };
            }
            function mouseoverChord(event,d,i) {
                svg.selectAll("path.chord")
                    .transition()
                    .style("opacity", 0.1);

                d3.select(this)
                    .transition()
                    .style("opacity", 1);
            }

            function mouseoutChord(event,d,i) {
                svg.selectAll("path.chord")
                    .transition()
                    .style("opacity", opacityDefault);
            }

        }
    },[data]);

    return (
        <React.Fragment>
            <svg ref={svgRef} style={{ width: '100%', height: '95%'}}>
            </svg>
        </React.Fragment>
    );
}

export default Chord;





// outerCircle.append("text")
            // .attr("class", "titles")
            //     .attr("x", 9)
            //     .attr("dy", -20)
            //     .append("textPath")
            //     .attr("xlink:href", function(d) { return "#group" + d.index; })
            //     .text(function(chords, i){
            //         let l = category_mapper[Object.keys(props.taskNeighbours[i])[0]];
            //         return l.split(" ")[0];
            //     })
            //     .append("tspan")
            //         .attr("x", 9)
            //         .attr("dy", 13)
            //         .text(function(chords, i) {
            //             return category_mapper[Object.keys(props.taskNeighbours[i])[0]].split(" ")[1];
            //         })
            //     .style("fill", "black")
            //     .style("font-size", "10px")
            //     .style("font-weight", "14");



 // svg.selectAll('.group').append("text")
                // .attr("class", "titles")
                //     .attr("x",)
                //     .attr("dy", -20)
                //     .append("textPath")
                //     .attr("xlink:href", function(d) { return "#group" + d.index; })
                //     .text(function(d) { 
                //         console.log(d);
                //         return "t_" + (d.index+1); })
                //     .style("fill", "black")
                // .style("font-size", "15px")
                // .style("font-weight", 400);


// outerCircle.append("text")
            //     .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
            //     .attr("dy", ".35em")
            //     .attr("class", "titles")
            //     .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
            //     .attr("transform", function(d) {
            //       return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
            //       + "translate(" + (outerRadius + 4) + ")"
            //       + (d.angle > Math.PI ? "rotate(180)" : "");
            //     })
            //     .text(function(chords, i){
            //         return category_mapper[Object.keys(props.taskNeighbours[i])[0]].split(" ").join("\n");
            //     })
            //     .style("font-size", 10);


// outerCircle.append("text")
            //     .attr("x", )
            //     .attr("dy", 13)
            //     .append("textPath")
            //     .attr("xlink:href", function(d) { return "#group" + d.index; })
            // //    .text(function(chords, i){return names[i];})
            //     .text(function(d) { 
            //             // console.log(d);
            //             return "t_" + (d.index+1); })
            //    .style("fill", "black")
            //     .style("font-size", "15px")
            //     .style("font-weight", 500);

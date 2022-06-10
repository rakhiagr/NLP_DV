import React, { useState, useRef, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import * as d3 from 'd3';

const NetworkGraph = (props) => {
    const svgRef = useRef();
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const [selectedTaskDefinition, setSelectedTaskDefinition] = useState('');
    const [focusedTaskDefinition, setFocusedTaskDefinition] = useState('');
    const [selectedTaskID, setSelectedTaskID] = useState('1');
    const [focussedTaskID, setFocussedTaskID] = useState('');
    const [description, setDescription] = useState(<Col xs={6} lg={6} xl={6} style={{ padding: 0 }}></Col>);

    useEffect(() => {
        if(props.task !== ''){
            fetch(`/definition/${props.task}`)
                .then(response => response.json())
                .then(result => {

                    setSelectedTaskDefinition(result[0]['definition']);
                    setFocusedTaskDefinition('');
                })
        }
    }, [props.task])

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        let sum = 0;
        for (let n in props.taskNeighbours) {
            sum += n[Object.keys(n)[0]];
        }
        let threshold = sum * 0.6;
        let nodes = props.taskNeighbours.map(n => ({ 'id': Object.keys(n)[0], 'level': Object.keys(n)[0] === props.task ? 1 : 2,
    'similarity': Object.keys(n)[0] === props.task ? 1 : n[Object.keys(n)[0]]}));

        var neighbourSimilarity = new Array();
        for (let n of nodes) {
            fetch(`/neighbours/${n.id}`)
                .then(response => response.json())
                .then(result => {
                    var obj = {};
                    obj[n.id] = result[Object.keys(result)[0]]['neighbours'];
                    neighbourSimilarity.push(obj);
                })
        }
        

        let neighbourList = props.taskNeighbours.filter(d => Object.keys(d)[0] != props.task);
        

        let links = props.taskNeighbours.map(n => ({ 'target': props.task, 'source': Object.keys(n)[0], 'strength': n[Object.keys(n)[0]] }))
        const reverse_index_task_id_map = {}
        let count = 0;
        for(const key in nodes){
            reverse_index_task_id_map[nodes[key].id] = count;
            count = count +1;
        }

        let min = 1;
        let max = 0;
        for (let l of links) {
            let sim = l['strength'];
            if (min > sim) min = sim;
            if(max < sim) max = sim;
        }


        var colorScale = d3.scaleSequential(d3.interpolate('#A3E4D7', '#264653'))
                            .domain([min, max]);

        let adjlist = [];
        links.forEach(function(d) {
            adjlist[d.source.index + "-" + d.target.index] = true;
            adjlist[d.target.index + "-" + d.source.index] = true;
        });
        const neigh = (a, b) => a === b || adjlist[a + "-" + b];

        var selectedTask = nodes.findIndex(d => d.id == props.task);
        setSelectedTaskID((selectedTask + 1).toString());

        let simulation = d3.forceSimulation(nodes)
                             .force("charge", d3.forceManyBody().strength(-700))
                             .force("center", d3.forceCenter(svgRef.current.clientWidth / 2, svgRef.current.clientHeight / 2))
                             .force("x", d3.forceX(svgRef.current.clientWidth / 2).strength(1))
                             .force("y", d3.forceY(svgRef.current.clientHeight / 2).strength(1))
                             .force("link", d3.forceLink(links).id(function(d) {return d.id; }).distance(function (link) { return link.strength*300 }).strength(1));


        let linkElements = svg.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(links)
          .enter()
          .append("line")
          .attr("stroke-width", (d) => {return d.similarity == 0 ? 0 : 1})
          .attr("stroke", "black")


        let nodeElements = svg.append("g")
          .attr("class", "nodes")
          .selectAll("circle")
          .data(nodes)
          .enter().append("circle")
            .attr("r", 10)
            .attr("fill", function(d, i) {
                if(d.id === props.task){
                    props.setSelectedTaskColor(props.colors[i]);
                    props.setSelectedTaskId("task_"+ (i+1));
                }
                return props.colors[i];})
            .attr("node-type", (d) => {
                return d.id === props.task ? 'selected' : 'neighbour';});
        const focus = (event, d) => {
            fetch(`/definition/${d.id}`)
                .then(response => response.json())
                .then(result => {
                    const focussed= {}
                    focussed['strength'] = linkElements._groups[0].map(d => d.__data__).map(d =>  ({ source : d.source.id, strength : d.strength } )).filter(e => e.source === d.id)[0].strength;
                    focussed['definition'] = result[0]['definition'];
                    setFocusedTaskDefinition(focussed);
                    setFocussedTaskID(focussed['id']);
                })

            var index = d3.select(event.target).datum().index;
            nodeElements.style("opacity", function(o) {
                if (o.id == props.task) {return 0.8;}
                return neigh(index, o.index) ? 1 : 0.3;
            });
            linkElements.style("opacity", function(o) {
                return o.source.index === index || o.target.index === index ? 1 : 0.1;
            });
            var source_node = nodeElements.filter(function(d) {return d3.select(this).attr("node-type") == 'selected'}).nodes();
            
            props.focusGroup('task_'+(index+1), 'task_'+(source_node[0].__data__.index+1));
            props.focusGroup_chord((index), (source_node[0].__data__.index));
            props.focusGroup_bias('task_'+(index+1), 'task_'+(source_node[0].__data__.index+1));
        }

        const focus2 = (reverse_index_task_id_map) => {
            return (event) => {
                if(Object.keys(reverse_index_task_id_map).length !== 0 && reverse_index_task_id_map[event.detail.userData.data.id] !== undefined){
                    fetch(`/definition/${event.detail.userData.data.id}`)
                        .then(response => response.json())
                        .then(result => {
                            const focussed= {}
                            focussed['strength'] = linkElements._groups[0].map(d => d.__data__).map(d =>  ({ source : d.source.id, strength : d.strength } )).filter(e => e.source === event.detail.userData.data.id)[0].strength;
                            focussed['definition'] = result[0]['definition'];
                            setFocusedTaskDefinition(focussed);
                        })

                    var index = reverse_index_task_id_map[event.detail.userData.data.id];
                    nodeElements.style("opacity", function(o) {
                        return neigh(index, o.index) ? 1 : 0.1;
                    });
                    linkElements.style("opacity", function(o) {
                        return o.source.index === index || o.target.index === index ? 1 : 0.1;
                    });
                }
            }
        }

        const unfocus = () => {
           nodeElements.style("opacity", 1);
           linkElements.style("opacity", 1);
           props.unfocusGroup();
           props.unfocusGroup_chord();
           props.unfocusGroup_bias();
           setFocusedTaskDefinition('');
        }

        nodeElements.on("mouseover", focus).on("mouseout", unfocus);
        document.addEventListener('spherePointHovered', focus2(reverse_index_task_id_map), false);
        document.addEventListener('spherePointUnHovered', unfocus, false);

        simulation.nodes(nodes).on('tick', () => {

            nodeElements
            .attr('cx', function (node) { return node.x })
            .attr('cy', function (node) { return node.y })

            linkElements
            .attr('x1', function (link) { return link.source.x })
            .attr('y1', function (link) { return link.source.y })
            .attr('x2', function (link) { return link.target.x })
            .attr('y2', function (link) { return link.target.y })
        })
        simulation.force("link").links(links)
    },[props.taskNeighbours]);

    useEffect(() => {
        
        if(selectedTaskDefinition !== '' && focusedTaskDefinition !== ''){
            setDescription(<Col xs={6} lg={6} xl={6} style={{ padding: 0 }}>
                <label><b> Selected Task : Task {selectedTaskID} </b></label>
                <br/>
                <label style={{textAlign: 'justify', width: '80%'}}>
                    {selectedTaskDefinition}
                </label>
                <br/><br/><br/>
                <label style={{width: '80%'}}><b> Focused Task : {focussedTaskID} {focusedTaskDefinition.strength.toFixed(3)} </b>  ( Sentence Similarity Score ) </label>
                <br/>
                <br/>
                <label style={{textAlign: 'justify', width: '80%'}}>
                    {focusedTaskDefinition.definition}
                </label>
            </Col>);
        }else if(selectedTaskDefinition !== '' && focusedTaskDefinition === ''){
            setDescription(<Col xs={6} lg={6} xl={6} style={{ padding: 0 }}>
                <label><b> Selected Task : Task {selectedTaskID} </b></label>
                <br/>
                <br/>
                <label style={{textAlign: 'justify', width: '80%'}}>
                    {selectedTaskDefinition}
                </label>
            </Col>);
        }
    }, [selectedTaskDefinition, focusedTaskDefinition])
    return (
        <React.Fragment>
            <Row style={{ height: '100%' }}>
                <svg ref={svgRef} style={{ width: '50%', height: '95%'}}>
                </svg>
                {description}
            </Row>
        </React.Fragment>
    );
}

export default NetworkGraph;
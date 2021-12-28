import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import { AiOutlineExpandAlt, AiOutlineUndo } from "react-icons/ai";
import ClipLoader from "react-spinners/ClipLoader";
import { SiCrowdsource } from "react-icons/si";
import { MdCategory } from "react-icons/md";
import { RiQuestionnaireLine } from "react-icons/ri";
import THREEx from "./threex.domevents";
import embeddings from "./embeddings";
import * as THREE from 'three';
import * as d3 from 'd3';
import BiasPanel from "./BiasPanel";
import NetworkGraph from "./NetworkGraph";
import BeeSwarm from "./BeeSwarm";
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Chord from "./Chord";

const PanelLayout = () => {

    const [panelOrder, setPanelOrder] = useState({one: 0,two: 1,three: 2,four: 3,five: 4});
    const [panelSpan, setPanelSpan] = useState({one: 4,two: 4,three: 4,four: 8,five: 4});
    const [biasloading, setBiasLoading] = useState(false);
    const [biasRefresh, setBiasRefresh] = useState(false);
    const [netWorkloading, setNetWorkLoading] = useState(false);
    const [beeSwarmloading, setBeeSwarmloading] = useState(false);
    const [chordloading, setChordloading] = useState(false);
    const [currentScene, setCurrentScene] = useState(new THREE.Scene());
    const [allCategoryMaterials, setAllCategoryMaterials] = useState([]);
    const [allSourceMaterials, setAllSourceMaterials] = useState([]);
    const [icon, setIcon] = useState('category');
    const [task, setTask] = useState('');
    const [taskNeighbours, setTaskNeighbours] = useState([]);
    const [biasSelectedOption, setBiasSelectedOption] = useState('t2');
    const [biasSelectOptions, setBiasSelectOptions] = useState([
        { value: 't1', label: 'Unique Vocabulary' },
        { value: 't2', label: 'Sentence Lengths' },
        { value: 't3', label: 'Word Frequency' },
        { value: 't4', label: 'Adjectives' },
        { value: 't5', label: 'Adverbs' },
        { value: 't6', label: 'Verbs' },
        { value: 't7', label: 'Nouns' },
        { value: 't8', label: 'Bigrams' },
        { value: 't9', label: 'Trigrams' },
        { value: 't10', label: 'Examples Correlation' },
        { value: 't11', label: 'Word Overlap' },
        ]
    );
    const [show, setShow] = useState(false);
    const [instance, setInstance] = useState('');

    const handleClose = () => setShow(false);
    const handleSubmit = () => {
        fetch(`/instance/${task}`, {
            method: 'POST',
            headers: {'Accept': 'application/json',
                'Content-Type': 'application/json'},
            body: JSON.stringify({instance: instance})
        });
        setShow(false);
        setBiasRefresh(true);
    };


    const customStyles = {
        menu: (provided, state) => ({
            ...provided,
            color: 'purple',
        })
    }
    const handleBiasSelectChange = (event) => {
        setBiasSelectedOption(event.value);
    }

    const openUserPrompt = (event) => {
        setShow(true);
    }

    let camera, renderer, canvas, material, sourceMaterial, scene = '', focusMaterial, blurMaterial, neighbours=[];
    let inside_button;

    const showTooltip = (event ) => {
        let x = event.origDomEvent.clientX,
            y = event.origDomEvent.clientY,
            tooltip = document.getElementById('sphere-tooltip')
        tooltip.style.top = (y + 20) + 'px';
        tooltip.style.left = (x + 20) + 'px';
        tooltip.style.display = 'block';
        if(document.getElementById('icon-value').innerText === 'category'){
            tooltip.innerText = event.target.userData.data.category;
        }else{
            tooltip.innerText = event.target.userData.data.source;
        }
    }
    const init = () => {
            canvas = document.querySelector("#sphere");
            let aspect_ratio = window.innerWidth/ window.innerHeight;
            focusMaterial = new THREE.PointsMaterial( { size: 5, map: createCircleTexture('#0000ff', 256), transparent: true, depthWrite: false})
            blurMaterial = new THREE.PointsMaterial( { size: 5, map: createCircleTexture('#d3d3d3', 256), transparent: true, depthWrite: false})
            if(canvas !== null) {
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
                canvas.addEventListener( 'keydown',  onkeydown);
            }
            if(scene === ''){
                aspect_ratio = canvas.clientWidth / canvas.clientHeight;
                camera = new THREE.PerspectiveCamera( 80, aspect_ratio, 1, 3000 );
                camera.updateProjectionMatrix();
                camera.position.z = 320;
                scene = new THREE.Scene();
                scene.background = new THREE.Color( 0xf7f7f7 );
                let category_colour = d3.scaleSequential().domain([1,115])
                    .interpolator(d3.interpolateRainbow);
                let source_colour = d3.scaleSequential().domain([1,414])
                    .interpolator(d3.interpolateRainbow);
                renderer = new THREE.WebGLRenderer( { canvas, antialias: true } );
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( canvas.width, canvas.height );
                const domEvents	= new THREEx.DomEvents(camera, renderer.domElement)
                material = []
                sourceMaterial = []
                for ( let i = 0; i < embeddings.length; i ++ ) {
                    material.push(new THREE.PointsMaterial( { size: 5, map: createCircleTexture(category_colour(embeddings[i]["category_number"]), 256), transparent: true, depthWrite: false}));
                    sourceMaterial.push(new THREE.PointsMaterial( { size: 5, map: createCircleTexture(source_colour(embeddings[i]["source_number"]), 256), transparent: true, depthWrite: false}));
                    const geometry = new THREE.BufferGeometry();
                    const vertices = [];
                    const vertex = new THREE.Vector3();
                    vertex.x = embeddings[i]["x"];
                    vertex.y = embeddings[i]["y"];
                    vertex.z = embeddings[i]["z"];
                    vertex.normalize();
                    vertex.multiplyScalar( 400 );
                    vertices.push( vertex.x, vertex.y, vertex.z );
                    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
                    let point;
                    if(icon === 'category'){
                        point = new THREE.Points( geometry, material[i] );
                    }else{
                        point = new THREE.Points( geometry, sourceMaterial[i] );
                    }
                    point.scale.x = point.scale.y = point.scale.z = 0.5;
                    point.userData.data = embeddings[i];
                    point.updateMatrix();
                    scene.add(point);
                    domEvents.addEventListener(point, 'mouseover', (event) => {
                        if(neighbours.length !== 0){
                            if(neighbours.includes(point.userData.data.id)){
                                event.target.material.size = 10
                                showTooltip(event);
                            }
                        }else{
                            event.target.material.size = 10
                            showTooltip(event);
                        }
                    }, false)
                    domEvents.addEventListener(point, 'mouseout', (event) => {
                        setTimeout(function (){
                            event.target.material.size = 5
                        }, 1000)
                        setTimeout(function (){
                            document.getElementById('sphere-tooltip').style.display = 'none';
                        }, 2000)
                    }, false)
                    domEvents.addEventListener(point, 'click', async (event) => {
                        showTooltip(event);
                        const api_call = await fetch('/neighbours/'+ point.userData.data.id);
                        const json = await api_call.json();
                        setTask(point.userData.data.id);
                        neighbours = json[0].neighbours;
                        setTaskNeighbours(neighbours);
                        neighbours = neighbours.map(n => Object.keys(n)).map(n => n[0]);
                        neighbours.push(point.userData.data.id)
                        for(let k=0;k<scene.children.length;k++){
                            if(neighbours.includes(scene.children[k].userData.data.id)){
                                scene.children[k].material = focusMaterial;
                            }else{
                                scene.children[k].material = blurMaterial;
                            }
                        }
                        setTimeout(function (){
                            document.getElementById('sphere-tooltip').style.display = 'none';
                        }, 1500)
                    }, false)
                }
                setCurrentScene(scene);
                setAllCategoryMaterials(material);
                setAllSourceMaterials(sourceMaterial);
            }
        }
    const onkeydown = (event) => {
        if(event.key === 'a'){
            camera.position.x += 10
        }else if (event.key === 'd'){
            camera.position.x -= 10
        }
        else if(event.key === 'w'){
            camera.position.y += 10
        }else if (event.key === 's'){
            camera.position.y -= 10
        } else if(event.key === 'q'){
            camera.position.z += 10
        }else if (event.key === 'e'){
            camera.position.z -= 10
        }
        camera.lookAt( scene.position );
        renderer.render( scene, camera );
      };
    const animate = () => {
          if(scene !== '' ){
              requestAnimationFrame( animate );
              renderer.render( scene, camera );
          }
      }
    const createCircleTexture = (color, size) => {
        var matCanvas = document.createElement('canvas');
        matCanvas.width = matCanvas.height = size;
        var matContext = matCanvas.getContext('2d');
        var texture = new THREE.Texture(matCanvas);
        var center = size / 2;
        matContext.beginPath();
        matContext.arc(center, center, size/2, 0, 2 * Math.PI, false);
        matContext.closePath();
        matContext.fillStyle = color;
        matContext.fill();
        texture.needsUpdate = true;
        return texture;
      }
    document.addEventListener('DOMContentLoaded', function() {
        init();
        animate();
        let tooltip = document.getElementById('sphere-tooltip');
        tooltip.style.display = 'none';
        tooltip.style.position = 'absolute';
        tooltip.style.overflow = 'hidden';
        tooltip.style.padding = '10px';
        tooltip.style.background = 'rgba(0, 0, 0, 0.35)';
        tooltip.style.color = 'white';
        tooltip.style.maxWidth = '200px';
        tooltip.style.maxHeight = '100px';
        tooltip.style.border = '1px solid black';
    }, false);
    const clearSphereSelection = (icon) => {
        if(icon === 'category'){
            for ( let i = 0; i < allCategoryMaterials.length; i ++ ) {
                allCategoryMaterials[i].size = 5;
            }
            for ( let i = 0; i < embeddings.length; i ++ ) {
                currentScene.children[i].material = allCategoryMaterials[i];
            }
        }else{
            for ( let i = 0; i < allSourceMaterials.length; i ++ ) {
                allSourceMaterials[i].size = 5;
            }
            for ( let i = 0; i < embeddings.length; i ++ ) {
                currentScene.children[i].material = allSourceMaterials[i];
            }
        }

    }
    const toggleSourceCategory = () => {
        if(icon === 'source'){
            document.getElementById('sphere-tooltip').innerText = 'Grouped By CATEGORY';
            setIcon('category');
            clearSphereSelection('category');
        }else{
            document.getElementById('sphere-tooltip').innerText = 'Grouped By SOURCE';
            setIcon('source');
            clearSphereSelection('source');
        }
    }
    const expandPanelClickHandler = (panel) => {
      let newPanelSpan = {one: 4,two: 4,three: 4,four: 8,five: 4};
      if(panelSpan[panel] === 4 || panelSpan[panel] === 8 )  {
          newPanelSpan[panel] = 12;
      }
      setPanelSpan(newPanelSpan);
      if(panel === 'two' && panelSpan[panel] === 4){
        setPanelOrder({one: 1,two: 0,three: 2,four: 3,five: 4,six: 5});
      }
      if(panel === 'two' && panelSpan[panel] === 12){
        setPanelOrder({one: 0,two: 1,three: 2,four: 3,five: 4,six: 5});
      }
      if(panel === 'three' && panelSpan[panel] === 4){
        setPanelOrder({one: 1,two: 2,three: 0,four: 3,five: 4,six: 5});
      }
      if(panel === 'three' && panelSpan[panel] === 12){
        setPanelOrder({one: 0,two: 1,three: 2,four: 3,five: 4,six: 5});
      }
      if(panel === 'five' && panelSpan[panel] === 4){
        setPanelOrder({one: 0,two: 1,three: 2,four: 4,five: 3,six: 5});
      }
      if(panel === 'five' && panelSpan[panel] === 12){
        setPanelOrder({one: 0,two: 1,three: 2,four: 3,five: 4,six: 5});
      }
  }
    const onSphereButtonMouseEnter = (event) => {
        let x = event.clientX,
            y = event.clientY,
            tooltip = document.getElementById('sphere-tooltip')
        tooltip.style.top = (y + 20) + 'px';
        tooltip.style.left = (x + 20) + 'px';
        tooltip.style.display = 'block';
        tooltip.innerText = 'Grouped By ' + icon.toUpperCase();
    }
    const onUserPromptButtonMouseLeave = () => {
        document.getElementById('sphere-tooltip').style.display = 'none';
    }
    const onUserPromptButtonMouseEnter = (event) => {
        let x = event.clientX,
            y = event.clientY,
            tooltip = document.getElementById('sphere-tooltip')
        tooltip.style.top = (y + 20) + 'px';
        tooltip.style.left = (x + 20) + 'px';
        tooltip.style.display = 'block';
        tooltip.innerText = 'Test new prompt instance';
    }
    const onSphereButtonMouseLeave = () => {
        document.getElementById('sphere-tooltip').style.display = 'none';
    }
    if(icon === 'source'){
        inside_button = <SiCrowdsource style={{ fontSize: "2rem" }}></SiCrowdsource>;
    }else{
        inside_button = <MdCategory style={{ fontSize: "2rem" }}></MdCategory>;
    }
    return (
        <Container fluid>
            <Row>
                <Col
                    xs ={{ span: panelSpan['one'], order: panelOrder['one'] }}
                    sm ={{ span: panelSpan['one'], order: panelOrder['one'] }}
                    md ={{ span: panelSpan['one'], order: panelOrder['one'] }}
                    lg ={{ span: panelSpan['one'], order: panelOrder['one'] }}
                    xl ={{ span: panelSpan['one'], order: panelOrder['one'] }}
                    xxl={{ span: panelSpan['one'], order: panelOrder['one'] }}
                    style={{ minHeight: "50vh", backgroundColor: "#f7f7f7", border: "1px solid" }} >
                    <Row>
                        <Col xs={10} lg={10} xl={10} style={{ padding: 0 }}>
                            <h1>Sphere</h1>

                        </Col>
                        <Col xs={1} lg={1} xl={1} style={{ padding: 0 }}>
                            <Button id="toggle" variant="light" style={{ padding: 0 }}
                                    onMouseEnter={(event) => onSphereButtonMouseEnter(event)}
                                    onMouseLeave={(event) => onSphereButtonMouseLeave(event)}
                                    onClick={() => toggleSourceCategory()} >
                                {inside_button}
                                <p id="icon-value" style={{display: 'none'}}>{icon}</p>
                            </Button>
                        </Col>
                        <Col xs={1} lg={1} xl={1} style={{ padding: 0 }}>
                            <Button variant="light" style={{ padding: 0 }} onClick={() => clearSphereSelection(icon)} >
                                <AiOutlineUndo style={{ fontSize: "2rem" }}></AiOutlineUndo>
                            </Button>
                        </Col>
                        <div id="canvas_holder" style={{paddingLeft: "0px",paddingRight: "0px"}}>
                            <canvas  tabIndex="0" id="sphere" style={{minHeight: "50vh"}}>
                            </canvas>
                        </div>
                    </Row>
                </Col>
                <Col
                    xs ={{ span: panelSpan['two'], order: panelOrder['two'] }}
                    sm ={{ span: panelSpan['two'], order: panelOrder['two'] }}
                    md ={{ span: panelSpan['two'], order: panelOrder['two'] }}
                    lg ={{ span: panelSpan['two'], order: panelOrder['two'] }}
                    xl ={{ span: panelSpan['two'], order: panelOrder['two'] }}
                    xxl={{ span: panelSpan['two'], order: panelOrder['two'] }}
                    style={{ minHeight: "50vh", backgroundColor: "#f7f7f7", border: "1px solid" }} >
                    <Row>
                        <Col xs={11} lg={11} xl={11} style={{ padding: 0 }}>
                            <h1>Network Graph <ClipLoader color={'#9013FE'} loading={netWorkloading} size={30} /></h1>
                        </Col>
                        <Col xs={1} lg={1} xl={1} style={{ padding: 0 }}>
                            <Button variant="light" style={{ padding: 0 }} onClick={() => expandPanelClickHandler('two')} >
                                <AiOutlineExpandAlt style={{ fontSize: "2rem" }}></AiOutlineExpandAlt>
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} lg={12} xl={12} style={{ padding: 0, height: '50vh' }}>
                            <NetworkGraph taskNeighbours={taskNeighbours} task={task} toggleLoading={setNetWorkLoading} />
                        </Col>
                    </Row>
                </Col>
                <Col
                    xs ={{ span: panelSpan['three'], order: panelOrder['three'] }}
                    sm ={{ span: panelSpan['three'], order: panelOrder['three'] }}
                    md ={{ span: panelSpan['three'], order: panelOrder['three'] }}
                    lg ={{ span: panelSpan['three'], order: panelOrder['three'] }}
                    xl ={{ span: panelSpan['three'], order: panelOrder['three'] }}
                    xxl={{ span: panelSpan['three'], order: panelOrder['three'] }}
                    style={{ minHeight: "50vh", backgroundColor: "#f7f7f7", border: "1px solid" }} >
                    <Row>
                        <Col xs={4} lg={4} xl={4} style={{ padding: 0 }}>
                            <h1>Bias <ClipLoader color={'#9013FE'} loading={biasloading} size={30} /> </h1>
                        </Col>
                        <Col xs={1} lg={1} xl={1} style={{ paddingTop : '10px' }}>
                            <Button variant="light" style={{ padding: 0 }}
                                    onMouseEnter={(event) => onUserPromptButtonMouseEnter(event)}
                                    onMouseLeave={(event) => onUserPromptButtonMouseLeave(event)}
                                    onClick={() => openUserPrompt()} >
                                <RiQuestionnaireLine style={{ fontSize: "2rem" }}></RiQuestionnaireLine>
                            </Button>
                        </Col>
                        <Col xs={6} lg={6} xl={6} style={{ paddingTop : '10px' }}>
                            <Select style={{width: '300px' }}
                                    value={biasSelectOptions.filter(option => option.value === biasSelectedOption)}
                                    styles={customStyles} options={biasSelectOptions} onChange={(event) => handleBiasSelectChange(event)}  />
                        </Col>
                        <Col xs={1} lg={1} xl={1} style={{ paddingTop : '10px' }}>
                            <Button variant="light" style={{ padding: 0 }} onClick={() => expandPanelClickHandler('three')} >
                                <AiOutlineExpandAlt style={{ fontSize: "2rem" }}></AiOutlineExpandAlt>
                            </Button>
                        </Col>

                    </Row>
                    <Row>
                        <Col xs={12} lg={12} xl={12} style={{ padding: 0, height: '50vh' }}>
                            <BiasPanel biasRefresh={biasRefresh} toggleRefresh={setBiasRefresh} biasSelectedOption = {biasSelectedOption} task={task} toggleLoading={setBiasLoading} />
                        </Col>
                    </Row>
                </Col>
                <Col
                    xs ={{ span: panelSpan['four'], order: panelOrder['four'] }}
                    sm ={{ span: panelSpan['four'], order: panelOrder['four'] }}
                    md ={{ span: panelSpan['four'], order: panelOrder['four'] }}
                    lg ={{ span: panelSpan['four'], order: panelOrder['four'] }}
                    xl ={{ span: panelSpan['four'], order: panelOrder['four'] }}
                    xxl={{ span: panelSpan['four'], order: panelOrder['four'] }}
                    style={{ minHeight: "50vh", backgroundColor: "#f7f7f7", border: "1px solid" }} >
                    <Row>
                        <Col xs={11} lg={11} xl={11} style={{ padding: 0 }}>
                            <h1>Bee Swarm <ClipLoader color={'#9013FE'} loading={beeSwarmloading} size={30} /></h1>
                        </Col>
                        <Col xs={1} lg={1} xl={1} style={{ padding: 0 }}>
                            <Button variant="light" style={{ padding: 0 }} onClick={() => expandPanelClickHandler('four')}>
                                <AiOutlineExpandAlt style={{ fontSize: "2rem" }}></AiOutlineExpandAlt>
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} lg={12} xl={12} style={{ padding: 0, height: '50vh' }}>
                            <BeeSwarm taskNeighbours={taskNeighbours} task={task} toggleLoading={setBeeSwarmloading} />
                        </Col>
                    </Row>
                </Col>
                <Col
                    xs ={{ span: panelSpan['five'], order: panelOrder['five'] }}
                    sm ={{ span: panelSpan['five'], order: panelOrder['five'] }}
                    md ={{ span: panelSpan['five'], order: panelOrder['five'] }}
                    lg ={{ span: panelSpan['five'], order: panelOrder['five'] }}
                    xl ={{ span: panelSpan['five'], order: panelOrder['five'] }}
                    xxl={{ span: panelSpan['five'], order: panelOrder['five'] }}
                    style={{ minHeight: "50vh", backgroundColor: "#f7f7f7", border: "1px solid" }} >
                    <Row>
                        <Col xs={11} lg={11} xl={11} style={{ padding: 0 }}>
                            <h1>Chord <ClipLoader color={'#9013FE'} loading={chordloading} size={30} /></h1>
                        </Col>
                        <Col xs={1} lg={1} xl={1} style={{ padding: 0 }}>
                            <Button variant="light" style={{ padding: 0 }} onClick={() => expandPanelClickHandler('five')}>
                                <AiOutlineExpandAlt style={{ fontSize: "2rem" }}></AiOutlineExpandAlt>
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} lg={12} xl={12} style={{ padding: 0, height: '50vh' }}>
                            <Chord taskNeighbours={taskNeighbours} task={task} toggleLoading={setChordloading} />
                        </Col>
                    </Row>
                </Col>
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>User Prompt</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Please provide an additional instance for the selected task
                        <InputGroup>
                            <InputGroup.Text>Instance</InputGroup.Text>
                            <FormControl as="textarea" value={instance} onChange={(e) => setInstance(e.target.value)}/>
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={(e) => handleSubmit(e)} >Submit</Button>
                    </Modal.Footer>
                </Modal>
            </Row>
        </Container>
    );
}

export default PanelLayout;
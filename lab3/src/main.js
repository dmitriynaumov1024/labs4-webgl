import * as THREE from "three"
import * as dat from "dat.gui"
import { TrackballControls } from "three/addons/controls/TrackballControls.js"

function makePiramida (width, height, segments, color) {
    var geometry = new THREE.ConeGeometry (width, height, segments)
    var material = new THREE.MeshPhongMaterial ({ 
        color: color, flatShading: true, transparent: true })
    return new THREE.Mesh (geometry, material)
}

function makeGroup (items) {
    var group = new THREE.Group()
    for (var item of items) group.add(item)
    return group
}

window.onload = () => {

    var tick = 0

    // create renderer
    var renderer = window.WebGLRenderingContext ? 
        new THREE.WebGLRenderer({antialias:true}) : new THREE.CanvasRenderer()
    renderer.setClearColor(new THREE.Color(0x101114))
    renderer.setSize(window.innerWidth, window.innerHeight)
    // renderer.shadowMapSoft = true
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.VSMShadowMap
    document.body.appendChild(renderer.domElement)

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera (45, 
        window.innerWidth / window.innerHeight, 0.1, 1000)

    camera.position.set(-70, 34, 0)
    camera.lookAt(0, 15, 0)

    // make trackball controls
    var controls = new TrackballControls(camera, renderer.domElement)
    controls.rotateSpeed = 3;

    // make plane
    var plane = new THREE.Mesh (
        new THREE.BoxGeometry(60, 1, 60),
        new THREE.MeshPhongMaterial({ color: 0xefefef, flatShading: true })
    )
    plane.castShadow = plane.receiveShadow = true
    plane.position.set(0, -2, 0)
    scene.add(plane)

    // make pyramids
    const cone1 = makePiramida(8, 12, 4, 0xef23ef)
    cone1.position.set(-10, 10, 8)
    cone1.castShadow = cone1.receiveShadow = true
    scene.add(cone1)

    const cone2 = makePiramida(8, 12, 4, 0x3476d7)
    cone2.position.set(-10, 10, -8)
    cone2.rotation.x = Math.PI
    cone2.castShadow = cone2.receiveShadow = true
    scene.add(cone2)

    // light
    const light = new THREE.AmbientLight(0xffffff, 0.2)
    scene.add(light)

    // dir. light
    const dlight = new THREE.DirectionalLight(0xffffff, 0.9)
    dlight.position.set(-40, 120, 50)

    // spot light
    const spotLight = new THREE.SpotLight(0xffde93, 1.0)
    spotLight.position.set(-30, 40, -20)
    spotLight.castShadow = true
    spotLight.shadowMapWidth = spotLight.shadowMapHeight = 256
    spotLight.shadow.camera.near = 3
    spotLight.shadow.camera.far = 200
    spotLight.shadow.radius = 4
    spotLight.shadow.blurSamples = 8
    spotLight.shadow.bias = -0.002

    // point light
    const pointLight = new THREE.PointLight(0xfffeb3, 1.3, 100, 1.1)
    pointLight.position.set(-20, 20, 6)

    // hemi light
    const hemisphereLight = new THREE.HemisphereLight(0xfefefe, 0.6)
    hemisphereLight.position.set(0, 100, 0)

    var tweaks = {
        axesHelper: false,
        arrowHelper: false,
        boxHelper: false,
        gridHelper: false,
        cameraHelper: false,
        directionalLightHelper: false,
        spotLightHelper: false,
        hemisphereLightHelper: false,
        pointLightHelper: false
    }

    var helpers = {
        axesHelper: new THREE.AxesHelper(20),
        arrowHelper: new THREE.ArrowHelper (new THREE.Vector3(0, 0.6, 0.8), 
                                            new THREE.Vector3(1, 15, 0), 20),
        boxHelper: new THREE.BoxHelper(cone1),
        gridHelper: new THREE.GridHelper(100, 10),
        cameraHelper: new THREE.CameraHelper (
                new THREE.PerspectiveCamera(90, 1.5, 1, 100)),
        directionalLightHelper: makeGroup([
            dlight,
            new THREE.DirectionalLightHelper(dlight, 50)
        ]),
        spotLightHelper: makeGroup([
            spotLight,
            new THREE.SpotLightHelper(spotLight, 8)
        ]),
        hemisphereLightHelper: makeGroup([
            hemisphereLight,
            new THREE.HemisphereLightHelper(hemisphereLight, 50, 100)
        ]),
        pointLightHelper: makeGroup([
            pointLight,
            new THREE.PointLightHelper(pointLight, 10)
        ])
    }

    var gui = new dat.GUI()

    for (var i in tweaks) {
        let key = i
        console.log(key)
        gui.add(tweaks, key).onChange ( value => {
            console.log(key)
            if (value) scene.add(helpers[key])
            else scene.remove(helpers[key])
        })
    }

    function renderScene () {
        tick = (tick + 1) % 1000

        // Rotate cones
        cone1.rotation.y += 0.005
        cone2.rotation.y += 0.005
            
        requestAnimationFrame(renderScene)
        controls.update()

        renderer.render(scene, camera)
    }   

    renderScene()

    // make it all resizable
    window.onresize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }
}

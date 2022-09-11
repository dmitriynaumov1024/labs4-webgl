import * as THREE from "three"
import * as dat from "dat.gui"
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

var textureLoader = new THREE.TextureLoader()

function makePiramida (width, height, segments, color) {
    var geometry = new THREE.ConeGeometry (width, height, segments)
    var material = new THREE.MeshStandardMaterial ({ 
        color: color, flatShading: true, transparent: true })
    return new THREE.Mesh (geometry, material)
}

function makePiramidaLines (width, height, segments, color) {
    return new THREE.LineSegments ( 
        new THREE.EdgesGeometry (new THREE.ConeGeometry(width+0.1, height+0.1, segments)),
        new THREE.LineBasicMaterial ({ color: color })
    )
}

function loadTexture (src, repeat = 1) {
    var texture = textureLoader.load(src)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(repeat, repeat)
    return texture
}

window.onload = () => {

    var tick = 0

    var textureLoader = new THREE.TextureLoader()

    // create renderer
    var renderer = window.WebGLRenderingContext ? 
        new THREE.WebGLRenderer({antialias:true}) 
        : new THREE.CanvasRenderer();
    renderer.setClearColor(new THREE.Color(0x101114))
    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

    camera.position.set(-70, 34, 0)
    camera.lookAt(0, 15, 0)

    // make trackball controls
    var controls = new TrackballControls(camera, renderer.domElement)
    controls.rotateSpeed = 3;
            
    // make axes      
    // var axes = new THREE.AxesHelper(20)
    // scene.add(axes)

    // make plane
    var plane = new THREE.Mesh (
        new THREE.PlaneGeometry(60, 60, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xefcf23, wireframe: true })
    );

    plane.rotation.x = - Math.PI / 2
    plane.position.set(0, 0, 0)
    scene.add(plane)

    // make pyramids
    const cone1 = makePiramida(8, 12, 4, 0xef23ef)
    cone1.position.set(-10, 10, 8)
    scene.add(cone1)
    const cone1w = makePiramidaLines(8, 12, 4, 0xf833f8)
    cone1w.position.set(-10, 10, 8)
    scene.add(cone1w)

    const cone2 = makePiramida(8, 12, 4, 0x3476d7)
    cone2.position.set(-10, 10, -8)
    cone2.rotation.x = Math.PI
    scene.add(cone2)
    const cone2w = makePiramidaLines(8, 12, 4, 0x5689e7)
    cone2w.position.set(-10, 10, -8)
    cone2w.rotation.x = Math.PI
    scene.add(cone2w)

    // light
    const light = new THREE.AmbientLight(0x303030)
    scene.add(light)
    const dlight = new THREE.DirectionalLight(0xffffff, 1.5)
    dlight.position.set(-1, 3, 2)
    scene.add(dlight)

    var tweaks = {
        rotationSpeed1: 0.005,
        rotationSpeed2: 0.005,
        opacity1: 1.0,
        opacity2: 1.0,
        lightIntensity: 1.5,
        material: "Initial",
        material2: "Initial",
        alphaTest: 0
    }

    var materials = {
        "Initial": cone1.material,
        "Basic": new THREE.MeshBasicMaterial({ color: 0x901090 }),
        "Lambert": new THREE.MeshLambertMaterial({ color: 0x901090 }),
        "Phong": new THREE.MeshPhongMaterial({ color: 0x901090 }),
        "Standard": new THREE.MeshStandardMaterial({ color: 0x901090 })
    }

    var materials2 = {
        "Initial": cone2.material,
        "One texture": new THREE.MeshPhongMaterial({
            map: textureLoader.load("./img/texture1.png"),
            overdraw: true
        }),
        "Many textures": [0,1,2,3,4].map ( i => new THREE.MeshPhongMaterial({
            map: loadTexture(`./img/side${i}.png`, 10),
            flatShading: true
        })),
        "With alpha map": new THREE.MeshPhongMaterial({
            transparent: true,
            alphaMap: loadTexture("./img/texture1.png", 2),
            color: 0xefdf34,
            side: THREE.DoubleSide
        })
    }

    var gui = new dat.GUI()
    gui.add(tweaks, "rotationSpeed1", 0.001, 0.05)
    gui.add(tweaks, "rotationSpeed2", 0.001, 0.05)

    gui.add(tweaks, "opacity1", 0.0, 1.0)
        .onChange(() => { cone1.material.opacity = tweaks.opacity1 })
    gui.add(tweaks, "opacity2", 0.0, 1.0)
        .onChange(() => { cone2.material.opacity = tweaks.opacity2 })

    gui.add(tweaks, "lightIntensity", 0.0, 4.0)

    gui.add(tweaks, "material", ["Initial", "Basic", "Lambert", "Phong", "Standard"])
        .name("Material of pink obj.")
        .onChange(() => { cone1.material = materials[tweaks.material] })
    gui.add(tweaks, "material2", ["Initial", "One texture", "Many textures", "With alpha map"])
        .name("Material of blue obj.")
        .onChange(() => { cone2.material = materials2[tweaks.material2] })

    gui.add(tweaks, "alphaTest", 0, 1.0)
        .onChange(() => { cone2.material.alphaTest = tweaks.alphaTest })

    function renderScene () {
        tick = (tick + 1) % 1000

        // Rotate cones
        cone1.rotation.y += tweaks.rotationSpeed1
        cone1w.rotation.y += tweaks.rotationSpeed1
        cone2.rotation.y += tweaks.rotationSpeed2
        cone2w.rotation.y += tweaks.rotationSpeed2

        if (tick % 10 == 0) {
            if (dlight.intensity != tweaks.lightIntensity) 
                dlight.intensity = tweaks.lightIntensity
        }
            
        requestAnimationFrame(renderScene)
        controls.update()

        renderer.render(scene, camera)
    }   

    renderScene()

    // make it all resizable!
    window.onresize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }
}

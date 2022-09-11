import * as THREE from "three"
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function makePiramida (width, height, segments, color) {
    var geometry = new THREE.ConeGeometry (width, height, segments)
    var material = new THREE.MeshStandardMaterial ({ color: color, flatShading: true })
    return new THREE.Mesh (geometry, material)
}

function makePiramidaLines (width, height, segments, color) {
    return new THREE.LineSegments ( 
        new THREE.EdgesGeometry (new THREE.ConeGeometry(width+0.1, height+0.1, segments)),
        new THREE.LineBasicMaterial ({ color: color })
    )
}

window.onload = () => {

    var tick = 0

    var theLoader = new GLTFLoader()

    // create renderer
    var renderer = window.WebGLRenderingContext ? 
        new THREE.WebGLRenderer({antialias:true}) 
        : new THREE.CanvasRenderer();
    renderer.setClearColor(new THREE.Color(0x101114));
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

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
        new THREE.MeshBasicMaterial({ color: 0xef23ef, wireframe: true })
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

    var shekel = undefined

    theLoader.load (
        "./assets/shekel1.glb",
        model => {
            shekel = model.scene.children[0]
            shekel.position.y = 24
            shekel.rotation.x = Math.PI / 2
            console.log(shekel)
            for (var mesh of shekel.children) 
                mesh.material = new THREE.MeshStandardMaterial({ color: 0xf3e420 })
            scene.add(shekel)
            renderScene()
        }
    )

    // light
    const light = new THREE.AmbientLight(0x404040)
    scene.add(light)
    const dlight = new THREE.DirectionalLight(0xffffff, 2)
    dlight.position.set(-1, 3, 2)
    scene.add(dlight)

    function renderScene () {
        tick = (tick + 1) % 1000

        // Rotate cones
        cone1.rotation.y += 0.005
        cone1w.rotation.y += 0.005
        cone2.rotation.y += 0.005
        cone2w.rotation.y += 0.005

        // Plane shaking
        // if (tick % 5 == 0) {
        //     plane.position.set (0.1 * Math.random(), 0, 0.1 * Math.random())
        // }

        // rotate shekel
        shekel.rotation.z += 0.004
            
        requestAnimationFrame(renderScene)
        controls.update()

        renderer.render(scene, camera)
    }   

    // make it all resizable!
    window.onresize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }
}

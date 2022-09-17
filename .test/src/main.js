import * as THREE from "three"
import { TrackballControls } from 'three/addons/controls/TrackballControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
// import { TextureLoader } from 'three/addons/loaders/TextureLoader.js'

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

function makeGroup (items) {
    var group = new THREE.Group()
    items.map(i => i).forEach(item => group.add(item))
    group.getChild = (name) => group.children.find(item => item.name == name)
    return group
}

window.onload = () => {

    var tick = 0

    var gltfLoader = new GLTFLoader()
    var textureLoader = new THREE.TextureLoader()

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

    // var shekel = undefined
    // gltfLoader.load (
    //     "./assets/shekel1.glb",
    //     model => {
    //         shekel = model.scene.children[0]
    //         shekel.position.y = 24
    //         shekel.rotation.x = Math.PI / 2
    //         console.log(shekel)
    //         for (var mesh of shekel.children) 
    //             mesh.material = new THREE.MeshStandardMaterial({ color: 0xf3e420 })
    //         scene.add(shekel)
    //         renderScene()
    //     }
    // )

    // var gaika = undefined
    // gltfLoader.load (
    //     "./assets/gaika.glb",
    //     model => {
    //         gaika = model.scene.children[0]
    //         let texture = textureLoader.load("./assets/gaika2.png") 
    //         texture.encoding = THREE.sRGBEncoding
    //         texture.flipY = false
    //         gaika.material.map = texture
    //         console.log(gaika)
    //         scene.add(gaika)
    //     }
    // )

    var calc = undefined
    gltfLoader.load (
        "./assets/calculator.glb",
        glb => {
            let buttonColors = {
                "Btn019": "#f02330",
                "Btn022": "#f02330",
                "Btn023": "#f02330",
                "Btn020": "#4545a0",
                "Btn021": "#4546a0",
                "Btn024": "#242426",
                "Btn025": "#242425",
                "default": "#f0f0f2",
            }
            calc = makeGroup(glb.scene.children)
            console.log(calc)
            for (let item of calc.children) {
                console.log(item.name)
                if (item.name.startsWith("Btn")) {
                    let color = buttonColors[item.name] || buttonColors["default"]
                    item.material = new THREE.MeshPhongMaterial({ color: color })
                }
                else if (item.name.startsWith("Body")) {
                    item.material = new THREE.MeshPhongMaterial({ color: "#232325" })
                }
                else if (item.name.startsWith("Digit")) {
                    item.material = new THREE.MeshPhongMaterial({ color: "#969d89" })
                }
            }
            scene.add(calc)
            calc.position.set(-30, 10, 0)
            calc.rotation.y = Math.PI
            calc.rotation.z = -0.3
            calc.scale.set(10, 10, 10)
        }
    )

    // light
    const light = new THREE.AmbientLight(0x808080)
    scene.add(light)
    const dlight = new THREE.DirectionalLight(0xffffff, 0.7)
    dlight.position.set(-10, 30, 20)
    scene.add(dlight)

    function renderScene () {
        tick = (tick + 1) % 1000

        // Rotate cones
        cone1.rotation.y += 0.005
        cone1w.rotation.y += 0.005
        cone2.rotation.y += 0.005
        cone2w.rotation.y += 0.005
            
        requestAnimationFrame(renderScene)
        controls.update()

        renderer.render(scene, camera)
    }   

    renderScene();

    // make it all resizable!
    window.onresize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }
}

function main () {
    var textureLoader = new THREE.TextureLoader()

    // create renderer
    var renderer = window.WebGLRenderingContext ? 
        new THREE.WebGLRenderer({antialias:true}) : new THREE.CanvasRenderer()
    renderer.setClearColor(new THREE.Color(0xe0e0e0))
    renderer.setSize(window.innerWidth, window.innerHeight)
    // renderer.shadowMap.enabled = true
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap
    document.body.appendChild(renderer.domElement)

    var scene = new THREE.Scene()
    var camera = new THREE.PerspectiveCamera (60, 
        window.innerWidth / window.innerHeight, 0.1, 1000)

    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, 0)

    // make controls
    var controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.rotateSpeed = -0.35
    controls.enablePan = false
    controls.enableZoom = false

    var tex = textureLoader.load("./img/pano4.jpg")

    var sphere = new THREE.Mesh (
        new THREE.SphereGeometry(100, 60, 40),
        new THREE.MeshBasicMaterial({ 
            map: tex, 
            side: THREE.BackSide 
        })
    )
    scene.add(sphere)

    function renderScene () {

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

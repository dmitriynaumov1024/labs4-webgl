function main () {
    // create renderer
    var renderer = window.WebGLRenderingContext ? 
        new THREE.WebGLRenderer({antialias:true}) : new THREE.CanvasRenderer()
    renderer.setClearColor(new THREE.Color(0xdfe4ef))
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    var scene = new THREE.Scene()
    var camera = new THREE.PerspectiveCamera (45, 
        window.innerWidth / window.innerHeight, 0.1, 1000)

    camera.position.set(20, 20, -20)
    camera.lookAt(0, 1, 0)

    // make controls
    var controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.rotateSpeed = 0.5

    // ambient light
    const light = new THREE.AmbientLight(0xdfe4ef, 0.4)
    scene.add(light)

    // directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
    dirLight.position.set(60, 100, -7)
    scene.add(dirLight)

    var material = new THREE.MeshPhongMaterial({ 
        color: 0xd079f9,
        // flatShading: true
    })

    var gridHelper = new THREE.GridHelper(10)
    scene.add(gridHelper)

    var axesHelper = new THREE.AxesHelper(20)
    scene.add(axesHelper)

    var obj = undefined

    var tweaks = {
        "h1": 2,
        "h2": 2.5,
        "h3": 1.5,
        "r1": 1,
        "r2": 2,
        "r3": 1.5
    }

    function buildObject () {
        const x0 = 0
        const z0 = 0
        const {h1, h2, h3, r1, r2, r3} = tweaks

        var result = new THREE.Group()

        var cylinder1 = new THREE.Mesh (
            new THREE.CylinderGeometry(r1, r1, h1, 36),
            material
        )
        cylinder1.position.set(x0, h1/2, z0)
        result.add(cylinder1)

        var cone1 = new THREE.Mesh (
            new THREE.ConeGeometry(r2, h2, 36),
            material
        )
        cone1.position.set(x0, h1+h2/2, z0)
        result.add(cone1)

        var cone2 = new THREE.Mesh (
            new THREE.CylinderGeometry(r3, r2/2, h3, 36),
            material
        )
        cone2.position.set(x0, h1+h2/2+h3/2, z0)
        result.add(cone2)

        return result
    }

    var shouldUpdate = true
    var useBooleanOps = false

    function updateObjects () {
        if (obj) scene.remove(obj)
        obj = buildObject()
        if (useBooleanOps) obj = obj.children.slice(1).reduce (
            (prev, item) => prev.union(new ThreeBSP(item)), 
            new ThreeBSP(obj.children[0])
        ).toMesh(material)
        scene.add(obj)
    }

    var gui = new dat.GUI()
    var guiParams = gui.addFolder("Parameters")
    guiParams.open()
    for (let key in tweaks) {
        guiParams.add(tweaks, key, 0.1, 5, 0.1)
            .onChange(_ => { shouldUpdate = true })
    }

    var guiView = gui.addFolder("Result")
    guiView.add({"use boolean ops": false}, "use boolean ops")
        .onChange(value => { useBooleanOps = value; shouldUpdate = true })
    guiView.add({"wireframe": false}, "wireframe")
        .onChange(value => { material.wireframe = value })
    guiView.open()

    var tick = 0

    function renderScene () {
        tick = (tick + 1) % 30
        
        if (tick == 0 && shouldUpdate) {
            updateObjects()
            shouldUpdate = false
        }

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

function makePiramida (width, height, segments, color) {
    var geometry = new THREE.ConeGeometry (width, height, segments)
    var material = new THREE.MeshPhongMaterial ({ 
        color: color, flatShading: true, transparent: true })
    return new THREE.Mesh (geometry, material)
}

function makeGroup (items) {
    var group = new THREE.Group()
    items.map(i => i).forEach(item => group.add(item))
    group.getChild = (name) => group.children.find(item => item.name == name)
    return group
}

function main () {
    var tick = 0

    // create renderer
    var renderer = window.WebGLRenderingContext ? 
        new THREE.WebGLRenderer({antialias:true}) : new THREE.CanvasRenderer()
    renderer.setClearColor(new THREE.Color(0x3f3f4f))
    renderer.setSize(window.innerWidth, window.innerHeight)
    // renderer.shadowMapSoft = true
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    document.body.appendChild(renderer.domElement)

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera (45, 
        window.innerWidth / window.innerHeight, 0.1, 1000)

    camera.position.set(-70, 34, 0)
    camera.lookAt(0, 15, 0)

    // make trackball controls
    var controls = new THREE.TrackballControls(camera, renderer.domElement)
    controls.rotateSpeed = 3;

    // make plane
    var plane = new THREE.Mesh (
        new THREE.BoxGeometry(60, 1, 60),
        new THREE.MeshPhongMaterial({ color: 0xc0c0c8, shininess: 0.2, flatShading: true })
    )
    plane.castShadow = plane.receiveShadow = true
    plane.position.set(0, -2, 0)
    scene.add(plane)

    // make pyramids
    const cone1 = makePiramida(8, 12, 4, 0xef23ef)
    cone1.position.set(-1, 8, 8)
    cone1.castShadow = cone1.receiveShadow = true
    scene.add(cone1)

    const cone2 = makePiramida(8, 12, 4, 0x3476d7)
    cone2.position.set(-1, 8, -8)
    cone2.rotation.x = Math.PI
    cone2.castShadow = cone2.receiveShadow = true
    scene.add(cone2)

    // ambient light
    const ambLight = new THREE.AmbientLight(0xa0b0f4, 0.5)
    scene.add(ambLight)

    // directional light
    const dirLight = new THREE.DirectionalLight(0xfef0f3, 1.0)
    dirLight.position.set(3, 10, 10)
    dirLight.castShadow = true
    dirLight.shadow.camera.near = 0.1
    dirLight.shadow.camera.far = 1000
    dirLight.shadow.camera.right = 100
    dirLight.shadow.camera.left = -100
    dirLight.shadow.camera.top  = 100
    dirLight.shadow.camera.bottom = -100
    dirLight.shadow.mapSize.width = 1024
    dirLight.shadow.mapSize.height = 1024 
    dirLight.shadow.radius = 3
    dirLight.shadow.bias = -0.0001

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
    pointLight.castShadow = true

    var tweaks = {
        "Amb. Light Color": "#a0b0f4",
        "Amb. Light Intensity": ambLight.intensity,
        "Directional Light": false,
        "Point Light": false,
        "Spot Light": false
    }

    var gui = new dat.GUI()
    gui.addColor(tweaks, "Amb. Light Color")
    .onChange(value => { 
        ambLight.color = new THREE.Color(value) 
    })
    gui.add(tweaks, "Amb. Light Intensity", 0.0, 1.0, 0.05)
    .onChange(value => { 
        ambLight.intensity = value 
    })
    gui.add(tweaks, "Directional Light")
    .onChange(value => { 
        if (value) scene.add(dirLight) 
        else scene.remove(dirLight) 
    })
    gui.add(tweaks, "Point Light")
    .onChange(value => { 
        if (value) scene.add(pointLight) 
        else scene.remove(pointLight) 
    })
    gui.add(tweaks, "Spot Light")
    .onChange(value => { 
        if (value) scene.add(spotLight) 
        else scene.remove(spotLight) 
    })

    function renderScene () {
        tick = (tick + 1) % 600

        // Rotate cones
        cone1.rotation.y += 0.003
        cone2.rotation.y += 0.003

        if (tweaks["Spot Light"]) {
            let angle = tick * Math.PI / 300
            spotLight.position.x = Math.cos(angle) * 40
            spotLight.position.z = Math.sin(angle) * 40
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

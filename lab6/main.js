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

    camera.position.set(50, 34, -10)
    camera.lookAt(0, 15, 0)

    // make trackball controls
    var controls = new THREE.TrackballControls(camera, renderer.domElement)
    controls.rotateSpeed = 3;

    // make plane
    var plane = new THREE.Mesh (
        new THREE.BoxGeometry(60, 1, 60),
        new THREE.MeshPhongMaterial({ 
            color: 0xc0c0c8, 
            shininess: 0.2, 
            flatShading: true 
        })
    )
    plane.castShadow = plane.receiveShadow = true
    plane.position.set(0, -2, 0)
    scene.add(plane)

    // load video texture
    var vid = document.createElement("video")
    vid.loop = "loop"
    vid.src = "./assets/bird.mp4"
    vid.muted = true
    vid.play()
    var birdTexture = new THREE.Texture(vid)
    birdTexture.minFilter = THREE.LinearFilter
    birdTexture.magFilter = THREE.LinearFilter
    birdTexture.format = THREE.RGBFormat
    birdTexture.generateMipmaps = false
    var materials = [
        new THREE.MeshPhongMaterial({ color: 0xd0d0d0, flatShading: true }),
        new THREE.MeshPhongMaterial({ color: 0xd0d0d0, flatShading: true }),
        new THREE.MeshBasicMaterial({ map: birdTexture })
    ]

    // make pyramids
    var cone1 = new THREE.Mesh (
        new THREE.ConeGeometry(8, 12, 4),
        materials
    )
    cone1.position.set(-1, 8, 8)
    cone1.rotation.x = -Math.PI * 1.5
    cone1.castShadow = cone1.receiveShadow = true
    scene.add(cone1)

    var cone2 = new THREE.Mesh (
        new THREE.ConeGeometry(8, 12, 4),
        materials
    )
    cone2.position.set(-1, 8, -8)
    cone2.rotation.z = Math.PI * -0.7
    cone2.castShadow = cone2.receiveShadow = true
    scene.add(cone2)

    // ambient light
    var ambiLight = new THREE.AmbientLight(0xa0b0f4, 0.5)
    scene.add(ambiLight)

    // point light
    var pointLight = new THREE.PointLight(0xffcea3)
    pointLight.position.set(40, 30, 0)
    pointLight.castShadow = true
    scene.add(pointLight)

    var tweaks = {
        "play video": true
    }

    var gui = new dat.GUI()
    gui.add(tweaks, "play video").onChange(value => {
        if (value) vid.play()
        else vid.pause()
    })

    function renderScene () {
        tick = (tick + 1) % 600

        // Rotate cones
        cone1.rotation.y += 0.003
        cone1.rotation.z += 0.004
        cone2.rotation.y += 0.003

        birdTexture.needsUpdate = true

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

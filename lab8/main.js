function main () {
    var textureLoader = new THREE.TextureLoader()

    // create renderer
    var renderer = window.WebGLRenderingContext ? 
        new THREE.WebGLRenderer({antialias:true}) : new THREE.CanvasRenderer()
    renderer.setClearColor(new THREE.Color(0x090909))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    document.body.appendChild(renderer.domElement)

    var scene = new THREE.Scene()
    var camera = new THREE.PerspectiveCamera (45, 
        window.innerWidth / window.innerHeight, 0.1, 1000)

    camera.position.set(0, 34, -90)
    camera.lookAt(0, 15, 0)

    // make controls
    var controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.rotateSpeed = 0.5

    // make basic plane
    var plane = new THREE.Mesh (
        new THREE.BoxGeometry(200, 1, 200),
        new THREE.MeshPhongMaterial({ color: 0x78747b, shininess: 0.25, flatShading: true })
    )
    plane.castShadow = plane.receiveShadow = true
    plane.position.set(0, -0.5, 10)
    scene.add(plane)

    // ambient light
    const light = new THREE.AmbientLight(0xa0b9de, 0.25)
    scene.add(light)

    // directional light
    const dirLight = new THREE.DirectionalLight(0xfe8050, 0.15)
    dirLight.position.set(50, 10, -70)
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
    scene.add(dirLight)

    var tweaks = {
        colorPeriodS: 1,
        colorPeriodTicks: 60,
        material: new THREE.MeshPhongMaterial({ 
            color: 0xd0d0d0,
            flatShading: true
        }),
        material2: new THREE.LineBasicMaterial({ 
            color: 0x292930
        }),
        material3: new THREE.LineBasicMaterial({
            color: 0x676767
        })
    }

    var b = new THREE.Group()
    /* build the cathedral */ {
        // front
        var front = new THREE.Mesh (
            new THREE.BoxGeometry (8, 15, 3),
            tweaks.material
        )
        front.position.set(0, 7.5, 0.5)
        b.add(front)

        // big towers of front
        var tower1 = new THREE.Mesh (
            new THREE.BoxGeometry (4, 20, 4),
            tweaks.material
        )
        tower1.position.set(-6, 10, 0)
        b.add(tower1)

        var tower2 = new THREE.Mesh (
            new THREE.BoxGeometry (4, 20, 4),
            tweaks.material
        )
        tower2.position.set(6, 10, 0)
        b.add(tower2)

        // small towers of front 
        var tower01 = new THREE.Mesh (
            new THREE.BoxGeometry (2, 12, 2.5),
            tweaks.material
        )
        tower01.position.set(-9, 6, 0)
        b.add(tower01)

        var tower02 = new THREE.Mesh (
            new THREE.BoxGeometry (2, 12, 2.5),
            tweaks.material
        )
        tower02.position.set(9, 6, 0)
        b.add(tower02)

        // big towers of 2nd body
        var tower3 = new THREE.Mesh (
            new THREE.BoxGeometry (2.5, 10, 2.5),
            tweaks.material
        )
        tower3.position.set(-9, 5, 7.5)
        b.add(tower3)

        var tower4 = new THREE.Mesh (
            new THREE.BoxGeometry (2.5, 10, 2.5),
            tweaks.material
        )
        tower4.position.set(-9, 5, 16.5)
        b.add(tower4)

        var tower5 = new THREE.Mesh (
            new THREE.BoxGeometry (2.5, 10, 2.5),
            tweaks.material
        )
        tower5.position.set(9, 5, 7.5)
        b.add(tower5)

        var tower6 = new THREE.Mesh (
            new THREE.BoxGeometry (2.5, 10, 2.5),
            tweaks.material
        )
        tower6.position.set(9, 5, 16.5)
        b.add(tower6)

        // small towers of 1st body
        var tower11 = new THREE.Mesh (
            new THREE.BoxGeometry (1.5, 8, 1.5),
            tweaks.material
        )
        tower11.position.set(-5.75, 4, 2.75)
        b.add(tower11)

        var tower12 = new THREE.Mesh (
            new THREE.BoxGeometry (1.5, 8, 1.5),
            tweaks.material
        )
        tower12.position.set(5.75, 4, 2.75)
        b.add(tower12)

        var tower13 = new THREE.Mesh (
            new THREE.BoxGeometry (1.5, 8, 1.5),
            tweaks.material
        )
        tower13.position.set(-5.75, 4, 20.75)
        b.add(tower13)

        var tower14 = new THREE.Mesh (
            new THREE.BoxGeometry (1.5, 8, 1.5),
            tweaks.material
        )
        tower14.position.set(5.75, 4, 20.75)
        b.add(tower14)

        var body1 = new THREE.Mesh (
            new THREE.BoxGeometry (10, 8, 20),
            tweaks.material
        )
        body1.position.set(0, 4, 12)
        b.add(body1)

        var body2 = new THREE.Mesh (
            new THREE.BoxGeometry (20, 8, 10),
            tweaks.material
        )
        body2.position.set(0, 4, 12)
        b.add(body2)

        var body1Roof = new THREE.Mesh (
            new THREE.CylinderGeometry (5.5, 5.5, 20, 4),
            tweaks.material
        )
        body1Roof.position.set(0, 8, 11.9)
        body1Roof.rotation.x = Math.PI / 2
        b.add(body1Roof)

        var body2Roof = new THREE.Mesh (
            new THREE.CylinderGeometry (5.5, 5.5, 19.9, 4),
            tweaks.material
        )
        body2Roof.position.set(0, 8, 12)
        body2Roof.rotation.z = Math.PI / 2
        b.add(body2Roof)

        var alter = new THREE.Mesh (
            new THREE.CylinderGeometry (3, 3, 7, 16),
            tweaks.material
        )
        alter.position.set(0, 3.5, 22)
        b.add(alter)

        var alterRoof = new THREE.Mesh (
            new THREE.ConeGeometry (3.2, 3.2, 16),
            tweaks.material
        )
        alterRoof.position.set(0, 8.6, 22)
        b.add(alterRoof)

        var body1RoofRidge = new THREE.Mesh (
            new THREE.BoxGeometry(0.25, 0.25, 20.5),
            tweaks.material
        )
        body1RoofRidge.position.set(0, 13.4, 12)
        b.add(body1RoofRidge)

        var body2RoofRidge = new THREE.Mesh (
            new THREE.BoxGeometry(20.5, 0.25, 0.25),
            tweaks.material
        )
        body2RoofRidge.position.set(0, 13.4, 12)
        b.add(body2RoofRidge)
    }
    
    var g = new THREE.Group()

    // Apply shading to every part of building
    b.children.forEach(obj => {
        if (obj.type == "Mesh") {
            obj.castShadow = obj.receiveShadow = true
            let line = new THREE.LineSegments(new THREE.EdgesGeometry(obj.geometry, 60), tweaks.material2)
            line.position.set(obj.position.x, obj.position.y, obj.position.z)
            line.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z)
            g.add(line)
        }
    })

    var spire = new THREE.Mesh (
        new THREE.CylinderGeometry(0.25, 2, 16, 4),
        tweaks.material
    )
    spire.receiveShadow = true
    spire.position.set(0, 18, 12)
    spire.rotation.y = Math.PI / 4
    b.add(spire)

    // point light
    const pointLight = new THREE.PointLight(0x7879e1, 0.5, 40, 1.5)
    pointLight.castShadow = true
    pointLight.position.set(0, 26.25, 12)
    scene.add(pointLight)

    var spireLight = new THREE.Mesh (
        new THREE.CylinderGeometry(0.16, 0.26, 1, 4),
        tweaks.material3
    )
    spireLight.position.set(0, 26.5, 12)
    spireLight.rotation.y = Math.PI / 4
    scene.add(spireLight)

    var spireLight2 = new THREE.LineSegments (
        new THREE.EdgesGeometry(spire.geometry),
        tweaks.material3
    )
    spireLight2.position.set(0, 18, 12)
    spireLight2.rotation.y = Math.PI / 4
    scene.add(spireLight2)

    var gui = new dat.GUI()
    gui.add(tweaks, "colorPeriodS", 0.1, 10, 0.1).name("Color period, s")

    scene.add(b)
    scene.add(g)

    var clock = new THREE.Clock()
    clock.start()

    function renderScene () {
        var t = clock.getElapsedTime() - tweaks.colorPeriodS
        if (t >= 0) {
            pointLight.color = new THREE.Color (
                Math.random(), 
                Math.random(), 
                Math.random()
            )
            tweaks.material3.color = pointLight.color
            clock.elapsedTime = t
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

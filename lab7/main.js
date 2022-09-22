THREE.Texture.prototype.use = function (callback) {
    callback(this)
    return this
} 

function main () {

    var fontLoader = new THREE.FontLoader()
    var textureLoader = new THREE.TextureLoader()

    // create renderer
    var renderer = window.WebGLRenderingContext ? 
        new THREE.WebGLRenderer({antialias:true}) : new THREE.CanvasRenderer()
    renderer.setClearColor(new THREE.Color(0x565656))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    document.body.appendChild(renderer.domElement)

    var scene = new THREE.Scene()
    var camera = new THREE.PerspectiveCamera (45, 
        window.innerWidth / window.innerHeight, 0.1, 1000)

    camera.position.set(0, 34, 90)
    camera.lookAt(0, 15, 0)

    // make trackball controls
    var controls = new THREE.TrackballControls(camera, renderer.domElement)
    controls.rotateSpeed = 2

    // make plane
    var plane = new THREE.Mesh (
        new THREE.BoxGeometry(60, 1, 60),
        new THREE.MeshPhongMaterial({ color: 0xc0c0c8, shininess: 0.2, flatShading: true })
    )
    plane.castShadow = plane.receiveShadow = true
    plane.position.set(0, -2, 0)
    scene.add(plane)

    // 3d text
    var text3d1 = undefined
    var text3d2 = undefined
    fontLoader.load("./fonts/Spectral_Regular.json", font => {
        text3d1 = new THREE.Mesh (
            new THREE.TextGeometry("Three.js", {
                size: 12, 
                height: 2,
                curveSegments: 6,
                material: 0, 
                extrudeMaterial: 1,
                font: font
            }),
            new THREE.MeshPhongMaterial({ 
                color: 0xfe34fe,
                flatShading: true
            })
        )
        text3d2 = new THREE.Mesh (
            new THREE.TextGeometry("naumov1024@gmail.com", {
                size: 4, 
                height: 2,
                curveSegments: 6,
                material: 0, 
                extrudeMaterial: 1,
                font: font
            }),
            new THREE.MeshPhongMaterial({ 
                color: 0xfe34fe,
                flatShading: true
            })
        )
        text3d1.geometry.center()
        text3d1.position.set(0, 16, 0)
        text3d1.castShadow = text3d1.receiveShadow = true
        text3d2.geometry.center()
        text3d2.position.set(0, 5, 0)
        text3d2.castShadow = text3d2.receiveShadow = true
        scene.add(text3d1)
        scene.add(text3d2)
    })

    // light
    const light = new THREE.AmbientLight(0xa0b0f4, 0.2)
    scene.add(light)

    // directional light
    const dirLight = new THREE.DirectionalLight(0xfef0f3, 0.7)
    dirLight.position.set(30, 100, 80)
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

    var materials = {
        "initial": new THREE.MeshPhongMaterial({ 
            color: 0xfe34fe,
            flatShading: true
        }),
        "1 texture": new THREE.MeshPhongMaterial({
            map: textureLoader.load("./img/texture0.png")
                    .use(tex => { tex.wrapS = tex.wrapT = THREE.RepeatWrapping }),
            flatShading: true
        }),
        "2 textures": [1, 2].map(i => new THREE.MeshPhongMaterial({
            map: textureLoader.load(`./img/texture${i}.png`)
                    .use(tex => { tex.wrapS = tex.wrapT = THREE.RepeatWrapping }),
            flatShading: true
        }))
    }

    var gui = new dat.GUI()
    gui.add({ "material": "initial" }, "material", ["initial", "1 texture", "2 textures"])
    .onChange(value => {
        text3d1.material = materials[value]
        text3d2.material = materials[value]
    })
    gui.add({ "text size 1": 12 }, "text size 1", 2, 20, 0.5)
    .onChange (value => {
        text3d1.scale.set(value / 12, value / 12, value / 12)
    })
    gui.add({ "text size 2": 4 }, "text size 2", 2, 20, 0.5)
    .onChange (value => {
        text3d2.scale.set(value / 4, value / 4, value / 4)
    })

    function renderScene () {
        // if (text3d) {
        //     text3d.rotation.y += 0.002
        // }
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

/* 
 *  Завдання
 *
 *  1. Відобразіть логотип факультету за допомогою анімації 
 *     (використовувати функцію плавності).
 *
 *  2. Відобразіть назву кафедри за допомогою анімації.
 *
 *  3. Відобразіть будь-який геометричний об'єкт (текстура 
 *     довільний відеофільм), який обертається по колу.
 */

function main() {

    var fontLoader = new THREE.FontLoader()
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

    camera.position.set(0, 58, 90)
    camera.lookAt(0, 10, 0)

    // make controls
    var controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.rotateSpeed = 0.35
    controls.minPolarAngle = 0.05*Math.PI
    controls.maxPolarAngle = 0.48*Math.PI

    // make basic plane
    var plane = new THREE.Mesh (
        new THREE.BoxGeometry(50, 1, 50),
        new THREE.MeshPhongMaterial({ color: 0x78747b, shininess: 0.25, flatShading: true })
    )
    plane.castShadow = plane.receiveShadow = true
    plane.position.set(0, -0.5, -8)
    plane.rotation.y = Math.PI/3
    scene.add(plane)

    // ambient light
    const light = new THREE.AmbientLight(0xa0b9de, 0.25)
    scene.add(light)

    // directional light
    const dirLight = new THREE.DirectionalLight(0xfed0c0, 0.5)
    dirLight.position.set(30, 40, 50)
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

    // logo
    var logo = new THREE.Mesh (
        new THREE.CylinderGeometry(4, 4, 0.4, 36), [
            new THREE.MeshPhongMaterial({ color: 0xffffff }),
            new THREE.MeshPhongMaterial({ map: textureLoader.load("./assets/logo.jpg") }),
            new THREE.MeshPhongMaterial({ map: textureLoader.load("./assets/logo.jpg") })
        ]
    )
    logo.position.set(-4, 6, 0)
    logo.rotation.z = -Math.PI/2
    logo.castShadow = true
    scene.add(logo)

    // animation for logo
    var logoParams = { y: logo.position.y, rY: -0.5*Math.PI }
    var logoTarget = { y: logo.position.y + 12, rY: 3.5*Math.PI }
    new TWEEN.Tween(logoParams)
        .to(logoTarget, 3000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .repeat(Infinity)
        .yoyo(true)
        .start()
        .onUpdate(() => { 
            logo.position.y = logoParams.y
            logo.rotation.y = logoParams.rY 
        })

    // load video texture
    var vid = document.createElement("video")
    vid.loop = "loop"
    vid.src = "./assets/bird.mp4"
    vid.muted = true
    vid.play()
    var birdTexture = new THREE.Texture(vid)
    birdTexture.minFilter = THREE.LinearFilter
    birdTexture.magFilter = THREE.LinearFilter
    birdTexture.format = THREE.RGBAFormat
    birdTexture.generateMipmaps = false

    // "bird"
    var bird = new THREE.Mesh (
        new THREE.CylinderGeometry(4, 4, 6, 6), [
            new THREE.MeshPhongMaterial({ color: 0x010101, flatShading: true }),
            new THREE.MeshBasicMaterial({ map: birdTexture }),
            new THREE.MeshBasicMaterial({ map: birdTexture })
        ]
    )
    bird.position.set(6, 8, 0)
    bird.rotation.z = -Math.PI/2
    bird.castShadow = true
    scene.add(bird)

    // animation for bird
    var birdParams = { rY: 0 }
    var birdTarget = { rY: 2*Math.PI }
    new TWEEN.Tween(birdParams)
        .to(birdTarget, 2400)
        .repeat(Infinity)
        .start()
        .onUpdate(() => { 
            bird.rotation.y = birdParams.rY 
        })


    // 3d text
    var text3d = undefined
    fontLoader.load("./assets/Upheaval.json", font => {
        text3d = new THREE.Mesh (
            new THREE.TextGeometry("Кафедра програмної інженерії", {
                size: 4, 
                height: 0.2,
                curveSegments: 2,
                material: 0, 
                extrudeMaterial: 0,
                font: font
            }),
            new THREE.MeshBasicMaterial({ 
                color: 0xffd930,
                flatShading: true
            })
        )
        text3d.geometry.center()
        text3d.position.set(120, 20, 4)
        text3d.castShadow = true
        scene.add(text3d)

        // animation for 3d text
        var text3dParams = { x: 120 }
        var text3dTarget = { x: -120 }
        new TWEEN.Tween(text3dParams)
            .to(text3dTarget, 20000)
            .repeat(Infinity)
            .start()
            .onUpdate(() => { 
                text3d.position.x = text3dParams.x 
            })

        var text3dColorParams = { red: 0.8, green: 0.98 }
        var text3dColorTarget = { red: 0.99, green: 0.1 }
        new TWEEN.Tween(text3dColorParams)
            .to(text3dColorTarget, 7000)
            .repeat(Infinity)
            .yoyo(true)
            // stepper easing function
            .easing(k => Math.floor(k*6)/6)
            .start()
            .onUpdate(() => {
                text3d.material.color = new THREE.Color (
                    text3dColorParams.red, text3dColorParams.green, 0.17
                ) 
            })
    })

    function renderScene () {
        birdTexture.needsUpdate = true
        requestAnimationFrame(renderScene)
        controls.update()
        TWEEN.update()
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

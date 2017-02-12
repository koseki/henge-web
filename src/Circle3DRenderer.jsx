import * as THREE from 'three';
import OrbitControls from './ModifiedOrbitControls.jsx';

export default class Circle3DRenderer {
  constructor(words, w, h) {
    this.words = words;
    this.w = w;
    this.h = h;
    this.stage = document.getElementById('stage');
  }

  createRenderer() {
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.setSize(this.w, this.h);
    return renderer;
  }

  createCamera() {
    const viewAngle = 80;
    const near   = 1;
    const far    = 1000;
    const aspect = this.w / this.h;

    const camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
    camera.position.x = 0;
    camera.position.y = 60;
    camera.position.z = 60;
    // camera.rotation.x = - Math.PI / 2;

    return camera;
  }

  addLights(scene) {
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const light = new THREE.SpotLight( 0x999999, 1, 0, Math.PI / 2 );
    light.position.set( 0, 400, 0 );
    light.target.position.set( 0, 0, 0 );
    light.castShadow = true;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 30;
    light.shadow.bias = 0.01;
    scene.add(light);

    const lights = [];
    lights[0] = new THREE.PointLight(0x222222, 1, 0);
    lights[1] = new THREE.PointLight(0x555555, 1, 0);

    lights[0].position.set(0, 125, 0);
    lights[1].position.set(0, 60, 0);

    lights[0].castShadow = true;

    scene.add(lights[0]);
    scene.add(lights[1]);
  }

  addBoards(scene) {
    /*
    const xGeometry  = new THREE.CubeGeometry(1, 1, 1);
    const xMaterial  = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 60,
        wireframe: true,
        side: THREE.FrontSide,
        // side: THREE.DoubleSide,
        // map: boardTexture,
        // transparent: true
    });
    const xMesh = new THREE.Mesh(xGeometry, xMaterial);
    xMesh.position.set(0, 60, 0);
    scene.add(xMesh);
    */

    let boardSize = [
      [60, 45],
      [60, 45],
      [50, 37.5],
      [42, 31.5],
    ][this.words.length / 4 - 2];

    const boardGeometry  = new THREE.CubeGeometry(...boardSize, 1);
    const labelGeometry  = new THREE.PlaneBufferGeometry(80, 20);
    const boardMeshes = [];

    const unit = 360 / this.words.length;
    const r = 150;
    const rad = Math.PI * 2 / 360.0

    const labelGeometry2  = new THREE.PlaneBufferGeometry(800, 80);

    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 128;

    const ctx = canvas.getContext('2d');
    // const txt = 'abcdefghijklmnopqrstuvwxyz';
    const txt = 'pattern';
    // ctx.fillStyle = '#333333';
    ctx.fillStyle = '#3F4444';
    ctx.font = "60px sans-serif";
    ctx.textAlign = 'center';
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(txt, 400, 65);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const labelMaterial  = new THREE.MeshPhongMaterial({
      side: THREE.FrontSide,
      map: texture,
      transparent: true,
    });

    const label = new THREE.Mesh(labelGeometry2, labelMaterial);
    label.position.set(0, 200, 0);
    // label.scale.set(2,1,1)
    // label.rotation.x = - Math.PI / 2;

    scene.add(label);

    for (var i = 0; i < this.words.length; i++) {
      let color = 0xffffff;
      const word = this.words[i].word;

      // テクスチャを描画
      const canvas = document.createElement('canvas');
      canvas.width = 512; canvas.height = 128;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'black';
      ctx.font = "40px sans-serif";
      ctx.textAlign = 'center';
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillText(word, 256, 64);
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      const textureLoader = new THREE.TextureLoader();
      textureLoader.crossOrigin = '*';

      const boardMaterial  = new THREE.MeshPhongMaterial({
        color: color,
        shininess: 60,
        wireframe: false,
        side: THREE.FrontSide,
        // side: THREE.DoubleSide,
        // transparent: true
      });

      // let turl = 'https://farm1.staticflickr.com/426/32170591370_277d52267d_m_d.jpg';
      // let turl = null;
      if (this.words[i].imgExt !== null) {
        let turl = 'https://s3-ap-northeast-1.amazonaws.com/henge/words/' + word + '.' + this.words[i].imgExt;
        const boardTexture = textureLoader.load(turl, (texture) => {
          boardMaterial.map = boardTexture;
          boardMaterial.needsUpdate = true;
        });
      }

      const labelMaterial  = new THREE.MeshPhongMaterial({
        side: THREE.FrontSide,
        map: texture,
        transparent: true
      });

      const board = new THREE.Mesh(boardGeometry, boardMaterial);
      const label = new THREE.Mesh(labelGeometry, labelMaterial);

      const x = r * Math.cos((unit * i - 90) * rad);
      const z = r * Math.sin((unit * i - 90) * rad);

      board.position.set(x, 60, z);
      board.rotation.y = (360 - unit * i) * rad;
      board.castShadow = true;
      board.receiveShadow = true;

      label.position.set(x, 20, z);
      label.rotation.y = (360 - unit * i) * rad;
      // label.castShadow = true;
      // label.receiveShadow = true;

      scene.add(board);
      scene.add(label);
      boardMeshes.push(board);
    }
  }

  addRoom(scene) {
    // const wallColor = 0xcddbdd; // blue
    // const wallColor = 0xffffff; // white
    // const wallColor = 0xcccccc; // gray
    // const wallColor = 0x666666; // gray2
    const wallColor = 0x333333; // black

    // const floorColor = 0xa0adaf;
    // const floorColor = 0xffffff;
    const floorColor = 0xfceec7; // wood

    const floorGeometry = new THREE.PlaneBufferGeometry(900, 900);
    const floorMaterial  = new THREE.MeshPhongMaterial( { color: floorColor, shininess: 80, wireframe: false,  } );
    // const floorMaterial = new THREE.MeshBasicMaterial({ color : 0x333333 });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

    floorMesh.rotation.x = - Math.PI / 2;
    floorMesh.position.set(0, 0, 0);
    // floorMesh.scale.set( 100, 100, 100 );

    // floorMesh.castShadow = false;
    floorMesh.receiveShadow = true;

    scene.add(floorMesh);

    const ceilMesh = new THREE.Mesh(floorGeometry, floorMaterial);

    ceilMesh.rotation.x = Math.PI / 2;
    ceilMesh.position.set(0, 300, 0);
    // ceilMesh.receiveShadow = true;
    scene.add(ceilMesh);


    const group = new THREE.Group();

    const s = new THREE.Shape();
    s.moveTo(  0,   0)
    s.lineTo(  0, 300)
    s.lineTo(900, 300)
    s.lineTo(900,   0)

    const doorSize = [100, 180];

    s.lineTo(900 / 2 + doorSize[0] / 2,   0)
    s.lineTo(900 / 2 + doorSize[0] / 2,   doorSize[1])
    s.lineTo(900 / 2 - doorSize[0] / 2,   doorSize[1])
    s.lineTo(900 / 2 - doorSize[0] / 2,   0)

    s.lineTo(0,0);

    const wallMaterial  = new THREE.MeshPhongMaterial( { color: wallColor, shininess: 0, wireframe: false,  } );

    const wall = new THREE.ShapeGeometry(s);
    const wallMesh = new THREE.Mesh(wall, wallMaterial);
    wallMesh.position.set(-450,0,-450);

    // scene.add(wallMesh);
    group.add(wallMesh);

    let corridorGeometry = new THREE.PlaneBufferGeometry(doorSize[0], 900);
    let corridorMesh = new THREE.Mesh(corridorGeometry, floorMaterial);
    corridorMesh.position.set(0,0,-900);
    corridorMesh.rotation.x = - Math.PI / 2;
    group.add(corridorMesh);

    corridorMesh = new THREE.Mesh(corridorGeometry, floorMaterial);
    corridorMesh.position.set(0,doorSize[1],-900);
    corridorMesh.rotation.x = Math.PI / 2;
    group.add(corridorMesh);

    corridorGeometry = new THREE.PlaneBufferGeometry(doorSize[1], 900);
    corridorMesh = new THREE.Mesh(corridorGeometry, wallMaterial);
    corridorMesh.position.set(-doorSize[0] / 2, doorSize[1] / 2,-900);
    corridorMesh.rotation.x = Math.PI / 2;
    corridorMesh.rotation.y = Math.PI / 2;
    group.add(corridorMesh);

    corridorMesh = new THREE.Mesh(corridorGeometry, wallMaterial);
    corridorMesh.position.set(doorSize[0] / 2, doorSize[1] / 2,-900);
    corridorMesh.rotation.x = Math.PI / 2;
    corridorMesh.rotation.y = -Math.PI / 2;
    group.add(corridorMesh);

    scene.add(group);

    let g2 = group.clone();
    g2.position.set(0,0,0);
    g2.rotation.y = Math.PI / 2;
    scene.add(g2);

    g2 = group.clone();
    g2.position.set(0,0,0);
    g2.rotation.y = Math.PI;
    scene.add(g2);

    g2 = group.clone();
    g2.position.set(0,0,0);
    g2.rotation.y = - Math.PI / 2;
    scene.add(g2);
  }

  draw(renderer, scene, camera) {
    let controlsEnabled = true;
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let canJump = false;
    let prevTime = performance.now();
    let velocity = new THREE.Vector3();

    let clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      render();
    };

    const render = () => {
      // const delta = clock.getDelta();
      // controls.update( delta );

      const time = performance.now();
      const delta = ( time - prevTime ) / 150;

      const breakBase = 3.0;
      velocity.x -= velocity.x * breakBase * delta;
      velocity.z -= velocity.z * breakBase * delta;
      velocity.y -= 9.8 * 5.0 * delta; // 100.0 = mass
      const speedBase = 180.0

      if ( moveForward )  velocity.z  -= speedBase * delta;
      if ( moveBackward ) velocity.z  += speedBase * delta;
      if ( moveLeft )     velocity.x  -= speedBase * delta;
      if ( moveRight )    velocity.x  += speedBase * delta;

      /*
      if ( isOnObject === true ) {
        velocity.y = Math.max( 0, velocity.y );
        canJump = true;
      }
      */

      /*
      controls.getObject().translateX( velocity.x * delta );
      controls.getObject().translateY( velocity.y * delta );
      controls.getObject().translateZ( velocity.z * delta );

      if (controls.getObject().position.z < -520) {
        controls.getObject().position.z = 520;
      } else if (controls.getObject().position.z > 520) {
        controls.getObject().position.z = -520;
      } else if (controls.getObject().position.x < -520) {
        controls.getObject().position.x = 520;
      } else if (controls.getObject().position.x > 520) {
        controls.getObject().position.x = -520;
      }

      if ( controls.getObject().position.y < 10 ) {
        velocity.y = 0;
        controls.getObject().position.y = 10;
        canJump = true;
        }
      */
      prevTime = time;

      renderer.render(scene, camera);
    };

    animate();
  }

  drawOrbit(renderer, scene, camera) {
    const controls = new (OrbitControls(THREE))(camera);
    controls.minDistance = 1;
    controls.maxDistance = 250;
    controls.target.set(0, 60, 0);

    const render = () => {
      renderer.render(scene, camera);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      render();
    }

    controls.addEventListener('change', render);
    animate();
  }

  execute() {
    while (this.stage.firstChild) {
      this.stage.removeChild(this.stage.firstChild);
    }

    const renderer = this.createRenderer();
    this.stage.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xa000000, 0.15, 1500);

    const camera = this.createCamera();
    scene.add(camera);

    this.addLights(scene);
    this.addBoards(scene);
    this.addRoom(scene);

    // this.draw(renderer, scene, camera);
    this.drawOrbit(renderer, scene, camera);
  }
}
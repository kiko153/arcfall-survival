let scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// FPS adaptável
if (navigator.hardwareConcurrency <= 4) {
  renderer.setPixelRatio(0.7);
} else {
  renderer.setPixelRatio(window.devicePixelRatio);
}

// Luz
let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,10,5);
scene.add(light);

// Chão
let ground = new THREE.Mesh(
new THREE.PlaneGeometry(200,200),
new THREE.MeshStandardMaterial({color:0x1a3d1a})
);
ground.rotation.x = -Math.PI/2;
scene.add(ground);

// Player
let playerHP = 100;
let player = new THREE.Mesh(
new THREE.CapsuleGeometry(0.5,1,4,8),
new THREE.MeshStandardMaterial({color:0x00ffcc})
);
player.position.y = 1;
scene.add(player);

// ARC Enemy
let arcHP = 100;
let arc = new THREE.Mesh(
new THREE.BoxGeometry(1,1,1),
new THREE.MeshStandardMaterial({color:0xff0000})
);
arc.position.set(15,0.5,0);
scene.add(arc);

camera.position.set(0,4,8);

let fpsMode = false;
document.getElementById("camBtn").onclick = () => fpsMode = !fpsMode;

// Movimento
let move = {f:false,b:false,l:false,r:false};

document.getElementById("joystick").addEventListener("touchmove", e=>{
let t = e.touches[0];
let x = t.clientX - 70;
let y = t.clientY - (window.innerHeight-70);

move.f = y < -20;
move.b = y > 20;
move.l = x < -20;
move.r = x > 20;
});

document.getElementById("fireBtn").onclick = ()=>{
if(player.position.distanceTo(arc.position) < 20){
  arcHP -= 10;
  document.getElementById("enemyHp").innerText = "ARC: " + arcHP;
  if(arcHP <= 0){
    scene.remove(arc);
  }
}
};

function animate(){
requestAnimationFrame(animate);

// Movimento jogador
if(move.f) player.position.z -= 0.15;
if(move.b) player.position.z += 0.15;
if(move.l) player.position.x -= 0.15;
if(move.r) player.position.x += 0.15;

// IA inimigo
if(arcHP > 0 && player.position.distanceTo(arc.position) < 25){
arc.position.x += (player.position.x - arc.position.x)*0.01;
arc.position.z += (player.position.z - arc.position.z)*0.01;

if(player.position.distanceTo(arc.position) < 2){
  playerHP -= 0.2;
  document.getElementById("hp").innerText = "HP: " + Math.floor(playerHP);
}
}

// Câmera
if(fpsMode){
camera.position.copy(player.position);
camera.position.y += 1.5;
} else {
camera.position.set(player.position.x,4,player.position.z+8);
camera.lookAt(player.position);
}

renderer.render(scene,camera);
}

animate();
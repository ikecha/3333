// 基本設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 環境設定
scene.fog = new THREE.Fog(0x87ceeb, 10, 50); // 霧で遠くのオブジェクトを見えにくくする
scene.background = new THREE.Color(0x87ceeb);

// 光源の設定
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(10, 20, 10);
scene.add(ambientLight, sunLight);

// プレイヤー情報
let player = {
  health: 100,
  hunger: 100,
  position: { x: 0, y: 5, z: 0 },
};

// 地形生成関数
function generateTerrain(size) {
  const geometry = new THREE.PlaneGeometry(size, size, size, size);
  geometry.rotateX(-Math.PI / 2);
  const vertices = geometry.attributes.position.array;
  for (let i = 0; i < vertices.length; i += 3) {
    vertices[i + 1] = Math.random() * 2; // 地形の高さ
  }
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  const terrain = new THREE.Mesh(geometry, material);
  scene.add(terrain);
}
generateTerrain(50);

// ブロック生成
function createBlock(x, y, z, color = 0x8b4513) {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color });
  const block = new THREE.Mesh(geometry, material);
  block.position.set(x, y, z);
  scene.add(block);
  return block;
}

// サンプルブロック配置
for (let x = -5; x <= 5; x++) {
  for (let z = -5; z <= 5; z++) {
    createBlock(x, 0.5, z, Math.random() > 0.8 ? 0x2e8b57 : 0x8b4513); // 一部ブロックを草色に
  }
}

// カメラの初期位置
camera.position.set(player.position.x, player.position.y, player.position.z + 10);
camera.lookAt(player.position.x, player.position.y, player.position.z);

// ユーザー操作
const keys = {};
document.addEventListener("keydown", (event) => (keys[event.key] = true));
document.addEventListener("keyup", (event) => (keys[event.key] = false));

// プレイヤー移動
function handleMovement() {
  const speed = 0.1;
  if (keys["w"]) camera.position.z -= speed;
  if (keys["s"]) camera.position.z += speed;
  if (keys["a"]) camera.position.x -= speed;
  if (keys["d"]) camera.position.x += speed;
}

// ゲームループ
function update() {
  // プレイヤーの操作
  handleMovement();

  // サバイバル要素
  player.hunger -= 0.01;
  if (player.hunger <= 0) {
    player.health -= 0.05;
    player.hunger = 0;
  }

  // UI更新
  const ui = document.getElementById("ui");
  ui.textContent = `Health: ${Math.floor(player.health)} | Hunger: ${Math.floor(player.hunger)}`;

  // ゲームオーバー
  if (player.health <= 0) {
    alert("Game Over!");
    player.health = 100;
    player.hunger = 100;
    camera.position.set(0, 5, 10); // リセット
  }

  renderer.render(scene, camera);
  requestAnimationFrame(update);
}
update();

// ウィンドウリサイズ対応
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

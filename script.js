const canvas = document.getElementById('flowerCanvas');
const ctx = canvas.getContext('2d');
let width, height;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Función para dibujar una estrella
function drawStar(ctx, points, outerRadius, innerRadius, fillColor) {
  ctx.beginPath();
  ctx.moveTo(0, -outerRadius);
  for (let i = 0; i < points; i++) {
    ctx.rotate(Math.PI / points);
    ctx.lineTo(0, -innerRadius);
    ctx.rotate(Math.PI / points);
    ctx.lineTo(0, -outerRadius);
  }
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
}

// Clase Flower: cada objeto representa una flor animada
class Flower {
  constructor() {
    this.x = Math.random() * width;
    this.y = height + Math.random() * 100; // inician fuera de la pantalla (abajo)
    this.size = 10 + Math.random() * 20; // tamaño aleatorio
    this.speed = 0.5 + Math.random() * 1; // velocidad de ascenso
    this.angle = Math.random() * 2 * Math.PI; // ángulo inicial
    this.spin = (Math.random() - 0.5) * 0.02; // velocidad de rotación
    // Elige aleatoriamente entre tres formas: 'flower', 'bubble' y 'star'
    const forms = ['flower', 'bubble', 'star'];
    this.shape = forms[Math.floor(Math.random() * forms.length)];
    // Color fluorescente
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    // Para la forma "flower" definimos un número de pétalos
    this.petalCount = 5 + Math.floor(Math.random() * 3);
  }
  
  // Actualiza la posición y ángulo de la flor
  update() {
    this.y -= this.speed;
    this.angle += this.spin;
    if (this.y < -50) {
      // Si sale de la pantalla, se reinicia desde abajo
      this.y = height + 50;
      this.x = Math.random() * width;
    }
  }
  
  // Dibuja la flor según su forma
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    // Habilitar sombra para efecto fosforescente
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20;
    
    switch(this.shape) {
      case 'flower':
        // Dibuja pétalos
        for (let i = 0; i < this.petalCount; i++) {
          ctx.rotate((2 * Math.PI) / this.petalCount);
          ctx.beginPath();
          ctx.ellipse(0, -this.size, this.size / 2, this.size, 0, 0, 2 * Math.PI);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
        // Dibuja el centro
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
        break;
      case 'bubble':
        // Dibuja una burbuja luminosa
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        break;
      case 'star':
        // Dibuja una estrella de 5 puntos
        drawStar(ctx, 5, this.size, this.size / 2, this.color);
        break;
    }
    
    ctx.restore();
  }
}

// Generar un arreglo de flores
const flowers = [];
const totalFlowers = 30; // Puedes ajustar la cantidad

for (let i = 0; i < totalFlowers; i++) {
  flowers.push(new Flower());
}

// Función de animación: actualiza y redibuja las flores en cada frame
function animate() {
  // Fondo oscuro en cada frame
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  
  for (let flower of flowers) {
    flower.update();
    flower.draw(ctx);
  }
  
  requestAnimationFrame(animate);
}
animate();


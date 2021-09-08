var canvas;
var ctx;

var fpsJuego = 30;
var fpsEditor = 60;
var fps = fpsJuego;

var canvasX = 500;
var canvasY = 500;

var tileX;
var tileY;

//Variables relacionadas con el tablero de juego
var tablero;
var filas = 50;
var columnas = 50;

var blanco = '#FFFFFF';
var negro = '#000000';
var rojo = '#FF0000';

var pausa = true;

var ratonX = 0;
var ratonY = 0;

var posX;
var posY;

var patron = [
	[
	[0,1,0,0,1],
	[1,0,0,0,0],
	[1,0,0,0,1],
	[1,1,1,1,0],
	[0,0,0,0,0]
	],
	
	[
	[0,1,1,0,0],
	[1,1,0,0,0],
	[0,1,0,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0]
	],
	
	[
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0],
	[0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	],
	
	[
	[1,0,0,1,0],
	[0,0,0,0,1],
	[1,0,0,0,1],
	[0,1,1,1,1],
	[0,0,0,0,0]
	],
	

	[
	[0,0,0,0,1],
	[1,0,0,0,1],
	[0,1,1,1,1],
	[0,0,0,0,0]
	],
	
	[
	[0,1,0,0,0],
	[0,0,1,0,0],
	[1,1,1,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0]
	],
	
	[
	[1,1,1,0,0],
	[1,0,0,0,0],
	[0,1,0,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0]
	]
];

function crearArray2D(f, c){
    var obj = new Array(f);
    for(y = 0; y < f; y++){
        obj[y] = new Array(c);
    }
    return obj;
}

var Agente = function(x,y,estado){
    this.x = x;
    this.y = y;
    this.estado = estado;         //vivo = 1, muerto = 0
    this.estadoProx = this.estado;
    this.vecinos = [];

    this.cambiaEstado = function(){
        if(this.estado == true){
            this.estado = false;
        }else{
            this.estado = true;
        }
    }

    this.pintaEstado = function(est){
        this.estado = est;
    }

    this.addVecinos = function(){
        var xVecinos;
        var yVecinos;

        for(i = -1; i < 2; i++){
            for(j = -1; j < 2; j++){
                xVecinos = (this.x + j + columnas) % columnas;
                yVecinos = (this.y + i + filas) % filas;

                //Descartar agente actual
                if(i != 0 || j != 0){
                    this.vecinos.push(tablero[yVecinos][xVecinos]);
                }
            }
        }
    }

    this.dibuja = function(){
        var color;
        var img = new Image();
        if(this.estado == 1){
            img.src = "imagenes/celula.svg";
            color = blanco
        }else{
            img.src = "imagenes/tejido.svg";
            color = negro;
        }
        //ctx.fillStyle = color;
        //ctx.fillRect(this.x*tileX, this.y*tileY, tileX, tileY);

        ctx.drawImage(img,this.x*tileX, this.y*tileY, tileX, tileY);
    }

    //Leyes de Conway
    this.nuevoCiclo = function(){
        var suma = 0;
        //Vecinos vivos
        for(i = 0; i < this.vecinos.length; i++){
            //suma += this.vecinos[i].estado;
            if(this.vecinos[i].estado == 1){
                suma ++;
            }
        }
        this.estadoProx = this.estado;

        //Creación
        if(this.estado == 0 && suma == 3){
            this.estadoProx = 1;
        }

        //Muerte
        if(this.estado == 1 && (suma < 2 || suma > 3)){
            this.estadoProx = 0;
        }
    }

    this.mutacion = function(){
        this.estado = this.estadoProx;
    }
}


function iniciarTablero(obj, aleatoreo){
    var estado;

    for(y = 0; y < filas; y++){
        for(x = 0; x < columnas; x++){
            if(aleatoreo == true){
                estado = Math.floor(Math.random()*2);
            }else{
                estado = 0;
            }
            
            obj[y][x] = new Agente(x,y,estado); /////////////////////////////////////////////////////
        }
    }

    for(y = 0; y < filas; y++){
        for(x = 0; x < columnas; x++){
            obj[y][x].addVecinos();
        }
    }
    

}

function inicializar(){
    //Aosciación del canvas
    canvas = document.getElementById('pantalla');
    ctx = canvas.getContext('2d');

    //Ajuste del tamaño
    canvas.width = canvasX;
    canvas.height = canvasY;

    //Acciones del raton
    canvas.addEventListener('mousedown',clicRaton,false);
	canvas.addEventListener('mouseup',sueltaRaton,false);
	canvas.addEventListener('mousemove',posicionRaton,false);

    document.addEventListener('keyup', function(tecla){
        //Pausar es barra espaciadora
        if(tecla.keyCode == 32){
            controlPuasa();
        }
        //Reiniciar con r
        if(tecla.keyCode == 114){
            iniciarTablero(tablero, false);
        }
        //Reiniciar aleatoreo con t
        if(tecla.keyCode == 116){
            iniciarTablero(tablero, true);
        }
    });

    //Calculamos tamaño de tiles
    tileX = Math.floor(canvasX/filas);
    tileY = Math.floor(canvasY/columnas);

    //Creación del tablero
    tablero = crearArray2D(filas, columnas);
    //Inicialización
    iniciarTablero(tablero, false);

    //Ejecución del bucle principal
    setInterval(function(){principal();},1000/fps);
}


function clicRaton(e){
    console.log(ratonX + " - " + ratonY);
}
  
function sueltaRaton(e){
    console.log('raton soltado');
    raton();
}

function getMousePos(canvas, e){
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    }
}
  
function posicionRaton(e){
    var pos = getMousePos(canvas, e);
    //console.log(pos.x, pos.y);
    //ratonX = e.pageX;
    ratonX = pos.x;
    ratonY = pos.y;
    //ratonY = e.pageY;
}

function raton(){
    var figura = Math.floor(Math.random() * 6) + 1;
    var valor;
    try{
        for(py = 0; py < 9; py++){
            for(px = 0; px < 38; px++){
                valor = patron[figura][py][px];
                tablero[posY-1+py][posX-1+px].pintaEstado(valor);
            }
        }
    }catch(error){}
    
}

function dibujarTablero(obj){
    //Dibujo de los agentes
    for(y = 0; y < filas; y++){
        for(x = 0; x < columnas; x++){
            obj[y][x].dibuja();
        }
    }

    if(pausa == false){
        siguiente(obj);
    }
    //Puntero
    if(pausa == true){
        posX = Math.floor(ratonX/tileX);
		posY = Math.floor(ratonY/tileY);
		
		ctx.fillStyle = rojo;
		ctx.fillRect(posX*tileX,posY*tileY,tileX,tileY);
    }
}

function siguiente(obj){
    //Siguiente ciclo
    for(y = 0; y < filas; y++){
        for(x = 0; x < columnas; x++){
            obj[y][x].nuevoCiclo();
        }
    }
    //Mutacion
    for(y = 0; y < filas; y++){
        for(x = 0; x < columnas; x++){
            obj[y][x].mutacion();
        }
    }
}

function controlPuasa(){
    if(pausa == true){
		pausa = false;
		fps = fpsJuego;
	}
	else{
		pausa = true;
		fps = fpsEditor;
	}
}

function borrarCanvas(){
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}

function principal(){
    borrarCanvas();
    dibujarTablero(tablero);
}
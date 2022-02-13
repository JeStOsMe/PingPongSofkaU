//Declaración de la clase Board.
(function(){
    self.Board = function(width, height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }

    self.Board.prototype = {
        get elements(){
            //Se asigna como copia para no sobrecargar la memoria
            var elements = this.bars.map(function(el){ return el; });
            elements.push(this.ball); //Ya definida la clase Ball, podemos quitar el comentario
            return elements;
        }
    }
})();

//Declaración de la clase BoardView
(function(){
    self.BoardView = function(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

    self.BoardView.prototype = {
        //Cada acción limpia la animación anterior y dibuja la actual
        clean: function(){
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        },
        //Itera la lista de elementos y los dibuja a cada uno
        draw: function(){
            for (var i = this.board.elements.length - 1; i >= 0; i--){
                var el = this.board.elements[i];
                draw(this.ctx, el);
            }
        },
        play: function(){
            this.clean(); //Cada llamado a controller, limpia la pantalla
            this.draw(); //Cada llamado a controller, dibuja en pantalla
        }
    }
    function draw(ctx, element){
        switch(element.kind){ //Según el tipo de elemento que llegue, dibujará uno u otro.
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
                break;
        }
    }
})();

(function(){
    self.Ball = function(x, y, radius, board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.board = board;
        this.speed_y = 0;
        this.speed_x = 3;
        this.kind = "circle";

        board.ball = this;
    }
})();

//Declaración de la clase Bar
(function(){
    self.Bar = function(x, y, width, height, board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 10; //Velocidad de movimiento de las barras
    }
    //Para agregarle movimiento más adelante.
    self.Bar.prototype = {
        down: function(){
            this.y += this.speed;
        },
        up: function(){
            this.y -= this.speed;
        },
        toString: function(){
            return "X: " + this.x + " Y: " + this.y;
        }
    }
})();

//Declaración de los objetos con alcance global
var board = new Board(800, 400);
var barRight = new Bar(750, 100, 20, 100, board);
var barLeft = new Bar(20, 100, 20, 100, board);
var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas, board);
var ball = new Ball(400, 200, 10, board);


//Listener que captura las teclas presionadas.
document.addEventListener("keydown", function(ev){
    ev.preventDefault();
    switch(ev.keyCode){
        case 32: //Cada que se presione espacio, el juego se pausará o se reanudará
            ev.preventDefault();
            board.playing = !board.playing;
            break;
        case 38: //Si presiona flecha hacia arriba, la barra derecha se mueve hacia arriba
            ev.preventDefault();
            barRight.up();
            break;
        case 40: //Si presiona flecha hacia abajo, la barra derecha se mueve hacia abajo
            ev.preventDefault()
            barRight.down();
            break;
        case 83: //Si presiona tecla S, la barra izquierda se mueve hacia abajo
            ev.preventDefault();
            barLeft.down();
            break;
        case 87: //Si presiona la tecla W, la barra izquierda se mueve hacia arriba
            ev.preventDefault();
            barLeft.up();
            break;
    }
});

//Para que se refresque la pantalla a la velocidad de cada dispositivo
window.requestAnimationFrame(controller);

//Función desde la cual se desplegará todo lo necesario para ejecutar el juego.
function controller(){
    board_view.play();
    window.requestAnimationFrame(controller); //Inicia un bucle de refresqueo
}
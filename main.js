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
            elements.push(this.ball);
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
        //Itera la lista de elementos y los dibuja a cada uno
        draw: function(){
            for (var i = this.board.elements.length - 1; i >= 0; i--){
                var el = this.board.elements[i];
                draw(this.ctx, el);
            }
        }
    }
    function draw(ctx, element){
        if (element != null && element.hasOwnProperty("kind")){ //Evita errores en etapa temprana
            switch(element.kind){
                case "rectangle":
                    ctx.fillRect(element.x, element.y, element.width, element.height);
                    break;
            }
        }
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

//Listener que captura las teclas presionadas.
document.addEventListener("keydown", function(ev){
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


//Una vez se cargue la ventana, llama al método main
window.addEventListener("load", main);

//Función desde la cual se desplegará todo lo necesario para ejecutar el juego.
function main(){
    
    board_view.draw();
    
}
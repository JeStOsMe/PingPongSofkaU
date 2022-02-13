//"Declaración" de la clase Board.
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
            elements.push(ball);
            return elements;
        }
    }
})();

//"Declaración" de la clase BoardView
(function(){
    self.BoardView = function(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }
})();

//Una vez se cargue la ventana, llama al método main
window.addEventListener("load", main);

//Función desde la cual se desplegará todo lo necesario para ejecutar el juego.
function main(){
    var board = new Board(800, 400);
    var canvas = document.getElementById("canvas");
    var board_view = new BoardView(canvas, board);
    
}
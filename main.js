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
        check_collisions: function(){
            for (var i = this.board.bars.length - 1; i >= 0; i--){
                var bar = this.board.bars[i];
                if (hit(bar, this.board.ball)){
                    this.board.ball.collision(bar);
                }
            }
        },
        play: function(){
            if (this.board.playing){
                this.clean(); //Cada llamado a controller, limpia la pantalla
                this.draw(); //Cada llamado a controller, dibuja en pantalla
                this.check_collisions();
                this.board.ball.move(); //Inicia el movimiento de la pelota.
            }
        }
    }

    function hit(bar, ball){
        var hit = false;
        //Colisiones horizontales
        if (ball.x + ball.width >= bar.x && ball.x < bar.x + bar.width){
            //Colisiones verticales
            if (ball.y + ball.height >= bar.y && ball.y < bar.y + bar.height){
                hit = true;
            }
        }
         //Colision bar con ball
        if (ball.x <= bar.x && ball.x + ball.width >= bar.x + bar.width){
            if (ball.y <= bar.y && ball.y + ball.height >= bar.y + bar.height){
                hit = true;
            }
        }

        //Colision ball con bar
        if (bar.x <= ball.x && bar.x + bar.width >= ball.x + ball.width){
            if (bar.y <= ball.y && bar.y + bar.height >= ball.y + ball.height){
                hit = true;
            }
        }

        return hit;
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

//Declaración de la clase Ball
(function(){
    self.Ball = function(x, y, radius, board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.board = board;
        this.speed = 5;
        this.speed_y = 0;
        this.speed_x = 5;
        this.kind = "circle";
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;

        board.ball = this;
    }

    self.Ball.prototype = {
        move: function(){
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
        },
        collision: function(bar){
            var relative_intersect_y = (bar.y + (bar.height / 2)) - this.y;
            var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

            this.speed_y = this.speed * (-1*(Math.sin(this.bounce_angle)));
            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if (this.x > (this.board.width / 2)){
                this.direction = -1;
            } else{
                this.direction = 1;
            }
        },
        get width(){
            return this.radius * 2;
        },
        get height(){
            return this.radius * 2;
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
        this.speed = 15; //Velocidad de movimiento de las barras
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

board_view.draw(); //Para que no inicie en blanco la pantalla

//Para que se refresque la pantalla a la velocidad de cada dispositivo
window.requestAnimationFrame(controller);

//Función desde la cual se desplegará todo lo necesario para ejecutar el juego.
function controller(){
    board_view.play();
    window.requestAnimationFrame(controller); //Inicia un bucle de refresqueo
}
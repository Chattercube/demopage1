const pf = document.getElementById('pf');
const ctx = pf.getContext("2d");
const pause_button = document.getElementById("pause");
const reset_button = document.getElementById("reset-game")

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const MAX_STEP = 1;

const BALL_VELOCITY = 10;
const BALL_RADIUS = 10;
const MIN_DEF_ANGLE = -70;
const MAX_DEF_ANGLE = 70;



// Size of canvas = (1000,500)
function lerp(a, b, t){
    return a + (b-a) * t;
}

class Rect {
    x1; x2; y1; y2;
    constructor(x1, x2, y1, y2){
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }

    is_inside(p_x, p_y){
        return (this.x1 <= p_x && p_x <= this.x2) && (this.y1 <= p_y && p_y <= this.y2)
    }
}

const CANVAS_RECT = new Rect(0, 1000, 0, 500);

class Paddle {
    p_x; p_y;
    constructor(p_x, p_y){
        this.p_x = p_x;
        this.p_y = p_y;
    }
    get hitbox(){
        return new Rect(this.p_x - PADDLE_WIDTH/2, this.p_x + PADDLE_WIDTH/2, this.p_y - PADDLE_HEIGHT/2, this.p_y + PADDLE_HEIGHT/2)
    }
    move_p_y(p_y){
        this.p_y = p_y;
    }
}



class Ball {
    p_x; p_y; v_x; v_y; nv_x; nv_y;

    constructor(p_x, p_y, v_x, v_y){
        this.p_x = p_x;
        this.p_y = p_y;
        this.v_x = v_x;
        this.v_y = v_y;
        this.nv_x = v_x;
        this.nv_y = v_y;
    }

    if_collide_rebound(hitbox, factor, inverse = false){
        let re_x = false;
        let re_y = false;
        let np_x = this.p_x + this.v_x * factor;
        let np_y = this.p_y + this.v_y * factor;

        if((!inverse && hitbox.is_inside(np_x,this.p_y)) || (inverse && !hitbox.is_inside(np_x,this.p_y))){
            re_x = true;
        } else if ((!inverse && hitbox.is_inside(this.p_x,np_y)) || (inverse && !hitbox.is_inside(this.p_x,np_y))){
            re_y = true;
        } else if ((!inverse && hitbox.is_inside(np_x, np_y)) || (inverse && !hitbox.is_inside(np_x, np_y))){
            re_x = true; re_y = true;
        }

        if(re_x){this.nv_x = this.v_x * -1};
        if(re_y){this.nv_y = this.v_y * -1};

    }

    if_collide_paddle(paddle, factor){
        let re_x = false;
        let np_x = this.p_x + this.v_x * factor;

        if(paddle.hitbox.is_inside(np_x, this.p_y)){
            let deflection_angle = lerp(MIN_DEF_ANGLE,MAX_DEF_ANGLE,(this.p_y - (paddle.p_y - PADDLE_HEIGHT/2)) / PADDLE_HEIGHT);
            this.nv_x = Math.sign(this.v_x) * BALL_VELOCITY * Math.cos(deflection_angle * Math.PI / 180) * -1;
            this.nv_y = BALL_VELOCITY * Math.sin(deflection_angle * Math.PI / 180);
        }


        if(re_x){this.nv_x = this.v_x * -1};

    }

    deflect_in_respect_to_possiti

    

    move_by_velocity(factor){
        this.v_x = this.nv_x;
        this.v_y = this.nv_y;
        this.p_x += this.v_x * factor;
        this.p_y += this.v_y * factor;
    }

    move_ball(){
        let segments = Math.hypot(this.v_x, this.v_y) / MAX_STEP;
        for(let i = 0; i < segments; i++){
            let travelFactor = Math.min(segments - i, 1.0) / segments;
            this.move_by_velocity(travelFactor);
            this.if_collide_rebound(CANVAS_RECT, travelFactor, true);
            this.if_collide_paddle(paddle_1, travelFactor);
            this.if_collide_paddle(paddle_2, travelFactor);
            console.log(ball.p_x);
        }

    }


}

function clear_all(){
    ctx.clearRect(0, 0, pf.width, pf.height);
}

function draw_paddle(center_x, center_y){

    ctx.fillStyle = "black";
    ctx.fillRect(center_x - PADDLE_WIDTH/2, center_y - PADDLE_HEIGHT/2,PADDLE_WIDTH,PADDLE_HEIGHT);

}

function draw_ball(center_x, center_y){

    ctx.fillStyle = "black";
    ctx.fillRect(center_x - BALL_RADIUS/2, center_y - BALL_RADIUS/2,BALL_RADIUS,BALL_RADIUS);

}

function draw_score(){
    ctx.font = "50px Arial"
    ctx.fillStyle = "DarkGrey"
    ctx.fillText(score_1, 200, 50, 50, 100);
    ctx.fillText(score_2, 750, 50, 50, 100);
}


ball = new Ball(500,200,5,0);
paddle_1 = new Paddle(100,250);
paddle_2 = new Paddle(900,250);
score_1 = 0;
score_2 = 0;

function check_score(){

    if(ball.p_x <= 20){
        score_2++;
        ball.p_x = 500;
        ball.p_y = 250;
        ball.nv_x = -3;
        ball.nv_y = 0;
    }

    if(ball.p_x >= 980){
        score_1++;
        ball.p_x = 500;
        ball.p_y = 250;
        ball.nv_x = 3;
        ball.nv_y = 0;
    }
}


function mainloop(){
    ball.move_ball();
    check_score();
    clear_all();
    draw_score();
    draw_ball(ball.p_x, ball.p_y);
    draw_paddle(paddle_1.p_x, paddle_1.p_y);
    draw_paddle(paddle_2.p_x, paddle_2.p_y);
    console.log(ball.p_x, ball.p_y,ball.v_x,ball.v_y);
    if(Math.abs(paddle_2.p_y - ball.p_y) > 25 && Math.abs(paddle_2.p_x - ball.p_x) < 200 && paddle_2.p_y >= 0 && paddle_2.p_y <= CANVAS_RECT.y2 ){
        if(paddle_2.p_y > ball.p_y){
            paddle_2.p_y -= 12;
        }else{
            paddle_2.p_y += 12;
        }
    }

}

ml = null;

function pause_start(){
    if (ml) {
        clearInterval(ml);
        ml = null;
        pause_button.innerHTML = "Start"
    } else {
        ml = setInterval(mainloop,10);
        pause_button.innerHTML = "Pause"
    }
}

function reset_game(){
    score_1 = 0;
    score_2 = 0;
    ball.p_x = 500;
    ball.p_y = 250;
    ball.nv_x = 3;
    ball.nv_y = 0;
}

pf.addEventListener("mousemove", function(e){
    var cRect = pf.getBoundingClientRect();
    var canvasY = Math.round(e.clientY - cRect.top);
    paddle_1.move_p_y(canvasY);

})

function main(){
   mainloop();
}

pause_button.onclick = pause_start;
reset_button.onclick = reset_game;



main();



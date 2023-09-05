const pf = document.getElementById('pf');
const ctx = pf.getContext("2d");

function draw_ball(position, radius){

    ctx.beginPath();
    ctx.arc(position.x * 5, position.y * -5 + 500, radius*5, 0, 2 * Math.PI);
    ctx.stroke();

    // ctx.fillRect(position.x * 5, position.y * -5 + 500, 2, 2);

}

class Vector2{

    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    get mag(){
        return Math.hypot(this.x,this.y);
    }

    get unit(){
        return new Vector2(this.x/this.mag, this.y/this.mag);
    }

    add(addend, factor = 1){
        return new Vector2(this.x+addend.x*factor,this.y+addend.y*factor);
    }

    multi(multiplicand){
        return new Vector2(this.x*multiplicand, this.y*multiplicand);
    }

    dot(dotend){
        return this.x*dotend.x + this.y*dotend.y;
    }

    reflect(normal){
        return this.multi(normal.mag).add(normal, (Math.abs(this.dot(normal)) - this.dot(normal)) / normal.mag);
    }

}

class MatrixV2{

    constructor(u, v){
        this.u = u;
        this.v = v;
    }

    get det(){
        return this.u.x*this.v.y - this.v.x*this.u.y;
    }

    get inv(){
        let v1 = new Vector2(this.v.y / this.det, -1 * this.u.y / this.det);
        let v2 = new Vector2(-1 * this.v.x / this.det, this.u.x / this.det);
        return new MatrixV2(v1,v2);
    }

    apply(vector){
        return new Vector2(this.u.x * vector.x + this.v.x * vector.y, this.u.y * vector.x + this.v.y * vector.y);
    }
}

class Edge{

    constructor(left,right){
        this.left = left;
        this.right = right;

        // ax + by < c
        this.a = this.left.y - this.right.y;
        this.b = this.right.x - this.left.x;
        this.c = this.a * this.left.x + this.b * this.left.y;
    }

    get normal(){
        return new Vector2(this.left.y - this.right.y,this.right.x - this.left.x).unit;
    }

    intersected(origin, direction){
        // let basis_1 = this.left.add(origin,-1);
        // let basis_2 = this.right.add(origin,-1);

        // let trans_vec = new MatrixV2(basis_1,basis_2).inv.apply(direction);

        // return trans_vec.x <= 0 && trans_vec.y <= 0;
        let old_pos = origin.add(direction,-0.2);
        return !this.contains(old_pos) && this.contains(origin);
    }

    intersect(origin, direction){
        // let basis_1 = this.left.add(origin,-1);
        // let basis_2 = this.right.add(origin,-1);

        // let trans_vec = new MatrixV2(basis_1,basis_2).inv.apply(direction);

        // return trans_vec.x >= 0 && trans_vec.y >= 0;
        
    }

    contains(position, radius = 0){
        return (this.a * position.x + this.b * position.y) <= this.c + radius * Math.hypot(this.a,this.b);
    }
}

class Shape{

    // edges : edge[]
    constructor(edges, inner = true){
        this.edges = edges;
        this.inner = inner;
    }

    contains(position){
        if(this.inner) {return this.edges.every(edge => {return edge.contains(position);});}
        return this.edges.some(edge => {return edge.contains(position);});
    }

}

class Ball{

    constructor(position, velocity, radius){
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
    }

    move(delta = 1){
        this.position = this.position.add(this.velocity,delta);
    }

    if_collide_rebound(shape){
        let col_pos = this.position.add(this.velocity,this.radius);
        if(!shape.contains(col_pos)){return;}
        for(let edge of shape.edges){
            if (edge.intersected(col_pos, this.velocity)){
                this.velocity = this.velocity.reflect(edge.normal).unit;
                // console.log(ball.position.x, ball.position.y, ball.velocity.x, ball.velocity.y);
                this.move(0.2);
                return;
            }
        }
    }


}



let point_1 = new Vector2(0,100);
let point_2 = new Vector2(100,100);
let point_3 = new Vector2(100,0);
let point_4 = new Vector2(0,0);

let point_5 = new Vector2(20,20);
let point_6 = new Vector2(80,20);
let point_7 = new Vector2(80,80);
let point_8 = new Vector2(20,80);

let edge_1 = new Edge(point_2,point_1);
let edge_2 = new Edge(point_3,point_2);
let edge_3 = new Edge(point_4,point_3);
let edge_4 = new Edge(point_1,point_4);

let edge_5 = new Edge(point_6,point_5);
let edge_6 = new Edge(point_7,point_6);
let edge_7 = new Edge(point_8,point_7);
let edge_8 = new Edge(point_5,point_8);


let shape_1 = new Shape([edge_1]);
let shape_2 = new Shape([edge_2]);
let shape_3 = new Shape([edge_3]);
let shape_5 = new Shape([edge_5, edge_6, edge_7, edge_8])
let shape_4 = new Shape([edge_4]);

// let ball_speed = new Vector2(-1,7);
// let ball_position = new Vector2(90,80);

let balls = new Array();
for(let i = 0 ; i < 1000 ; i++){
    let ball_speed = new Vector2(Math.random() * -1 - 1, Math.random() * -1 - 1);
    let ball_position = new Vector2(Math.random() * 10 + 85, Math.random() * 10 + 85);
    balls.push(new Ball(ball_position,ball_speed, Math.random()*2))
}

let blocks = [shape_1, shape_2, shape_3, shape_4];
let blockpos = new Array();
for(let i = 0 ; i < 200 ; i++){
    let center_point = new Vector2(Math.random() * 80, Math.random() * 80);
    let height = Math.random()*2 + 1;
    let width = Math.random()*2 + 1;

    let point_1= new Vector2(center_point.x-width, center_point.y-height);
    let point_2= new Vector2(center_point.x+width, center_point.y-height);
    let point_3= new Vector2(center_point.x+width, center_point.y+height);
    let point_4= new Vector2(center_point.x-width, center_point.y+height);

    let edge_1 = new Edge(point_2,point_1);
    let edge_2 = new Edge(point_3,point_2);
    let edge_3 = new Edge(point_4,point_3);
    let edge_4 = new Edge(point_1,point_4);

    let block = new Shape([edge_4, edge_3, edge_2, edge_1]);
    blocks.push(block);
    blockpos.push([center_point.x-width, center_point.y+height, width*2, height*2]);

}

function mainloop(){
    //console.log(ball.position.x, ball.position.y);
    ctx.clearRect(0, 0, pf.width, pf.height);
    for(let p of blockpos){
        // console.log(p);
        ctx.fillRect(p[0]*5, p[1]*-5 + 500, p[2]*5, p[3]*5);
    }
    
    for(ball of balls){
        draw_ball(ball.position, ball.radius);
        for(let i = 0; i<10; i++){
            for(let shape of blocks){  
                ball.if_collide_rebound(shape);
            }
            ball.move(0.1);
        }
    }

}

setInterval(mainloop,20);

let some_matrix = new MatrixV2(new Vector2(1,3), new Vector2(9,7));
let inv_matrix = some_matrix.inv;

console.log(inv_matrix.u.x, inv_matrix.u.y, inv_matrix.v.x, inv_matrix.v.y);

// -0.35 0.15 0.45 -0.05
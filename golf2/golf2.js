const pf = document.getElementById('pf');
const ctx = pf.getContext("2d");

function canv_cord(vector){
    return new Vector2(vector.x * 5, vector.y * -5 + 500);
}

function draw_edge(edge){
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'Brown';
    let left_can = canv_cord(edge.left);
    let right_can = canv_cord(edge.right);
    ctx.beginPath();
    ctx.moveTo(left_can.x, left_can.y);
    ctx.lineTo(right_can.x, right_can.y);
    ctx.closePath();
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'Chocolate';
    ctx.beginPath();
    ctx.moveTo(left_can.x, left_can.y);
    ctx.lineTo(right_can.x, right_can.y);
    ctx.closePath();
    ctx.stroke();
    
}

function draw_ball(position, radius, stroke = true){

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'Black';
    ctx.beginPath();
    ctx.arc(position.x * 5, position.y * -5 + 500, radius*5, 0, 2 * Math.PI);
    ctx.closePath();
    if(stroke){ctx.stroke();}else{ctx.fill();}

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

        let old_pos = origin.add(direction,-0.1);
        return !this.contains(old_pos) && this.contains(origin);
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
        // return this.edges.some(edge => {return edge.contains(position);});
        return true;
    }

    addpoint(point){
        var new_edge = new Edge(this.edges[this.edges.length-1].right, point);
        this.edges.push(new_edge);
    }

    enclose(){
        var new_edge = new Edge(this.edges[this.edges.length-1].right, this.edges[0].left);
        this.edges.push(new_edge);
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
                this.velocity = this.velocity.reflect(edge.normal);
                // console.log(ball.position.x, ball.position.y, ball.velocity.x, ball.velocity.y);
                this.move(0.1);
                return;
            }
        }
    }


}



let point_1 = new Vector2(0,100);
let point_2 = new Vector2(100,100);
let point_3 = new Vector2(100,0);
let point_4 = new Vector2(0,0);

let golf0 = new Vector2(10,10);
let golf1 = new Vector2(40,10);
let golf2 = new Vector2(40,50);
let golf3 = new Vector2(50,60);
let golf4 = new Vector2(90,60);
let golf5 = new Vector2(90,90);
let golf6 = new Vector2(10,90);

// let golf_course = new Shape([new Edge(golf0,golf1)],false);
// golf_course.addpoint(golf2);
// golf_course.addpoint(golf3);
// golf_course.addpoint(golf4);
// golf_course.addpoint(golf5);
// golf_course.addpoint(golf6);
// golf_course.enclose();
// console.log(golf_course);


let edge_1 = new Edge(point_2,point_1);
let edge_2 = new Edge(point_3,point_2);
let edge_3 = new Edge(point_4,point_3);
let edge_4 = new Edge(point_1,point_4);

let g1 = new Shape([new Edge(golf0, golf1)]);
g1.addpoint(new Vector2(50,0));
g1.addpoint(new Vector2(0,0));
g1.enclose();

let g2 = new Shape([new Edge(golf1, golf2)])
g2.addpoint(golf3);
g2.addpoint(golf4);
g2.addpoint(new Vector2(100,50));
g2.addpoint(new Vector2(100,0));
g2.addpoint(new Vector2(50,0));
g1.enclose();

let g3 = new Shape([new Edge(golf4, golf5)]);
g3.addpoint(new Vector2(100,100));
g3.addpoint(new Vector2(100,50));
g3.enclose();

let g4 = new Shape([new Edge(golf5, golf6)]);
g4.addpoint(new Vector2(0,100));
g4.addpoint(new Vector2(100,100));
g4.enclose();

let g5= new Shape([new Edge(golf6, golf0)]);
g5.addpoint(new Vector2(0,0));
g5.addpoint(new Vector2(0,100));
g5.enclose();



let shape_1 = new Shape([edge_1]);
let shape_2 = new Shape([edge_2]);
let shape_3 = new Shape([edge_3]);
// let shape_5 = new Shape([edge_5, edge_6, edge_7, edge_8])
let shape_4 = new Shape([edge_4]);

let ball = new Ball(new Vector2(20,20), new Vector2(0,0), 1);

let blocks = [ g1,g2,g3,g4,g5];
let blockpos = new Array();
// for(let i = 0 ; i < 200 ; i++){
//     let center_point = new Vector2(Math.random() * 80, Math.random() * 80);
//     let height = Math.random()*2 + 1;
//     let width = Math.random()*2 + 1;

//     let point_1= new Vector2(center_point.x-width, center_point.y-height);
//     let point_2= new Vector2(center_point.x+width, center_point.y-height);
//     let point_3= new Vector2(center_point.x+width, center_point.y+height);
//     let point_4= new Vector2(center_point.x-width, center_point.y+height);

//     let edge_1 = new Edge(point_2,point_1);
//     let edge_2 = new Edge(point_3,point_2);
//     let edge_3 = new Edge(point_4,point_3);
//     let edge_4 = new Edge(point_1,point_4);

//     let block = new Shape([edge_4, edge_3, edge_2, edge_1]);
//     blocks.push(block);
//     blockpos.push([center_point.x-width, center_point.y+height, width*2, height*2]);

// }
var cursor_x = 0;
var cursor_y = 0;

function mainloop(){
    //console.log(ball.position.x, ball.position.y);
    ctx.clearRect(0, 0, pf.width, pf.height);
    draw_ball(ball.position, ball.radius, true);

    for(block of blocks){
        for(edge of block.edges){
            draw_edge(edge);
        }
    }

    let rel_pos = new Vector2(ball.position.x - cursor_x,ball.position.y - cursor_y);
    if(ball.velocity.mag <= 0.1 && rel_pos.mag < 5){
        let pre_1_pos = ball.position.add(rel_pos.unit,2 * rel_pos.mag);
        let pre_2_pos = ball.position.add(rel_pos.unit,4 * rel_pos.mag);
        let pre_3_pos = ball.position.add(rel_pos.unit,6 * rel_pos.mag);

        draw_ball(pre_1_pos,0.8,false);
        draw_ball(pre_2_pos,0.6,false);
        draw_ball(pre_3_pos,0.4,false);
    }

    for(let p of blockpos){
        // console.log(p);
        ctx.fillRect(p[0]*5, p[1]*-5 + 500, p[2]*5, p[3]*5);
    }
    
    
    for(let i = 0; i<10; i++){
        for(let shape of blocks){  
            ball.if_collide_rebound(shape);
        }
        ball.move(0.1);
    }

    if(ball.velocity.mag > 0){
        ball.velocity = ball.velocity.add(ball.velocity.unit, -0.01);
    }

    if(ball.velocity.mag < 0.02){
        ball.velocity = new Vector2(0,0);
    }


}

setInterval(mainloop,20);

function OnMouseMove(e){

    cursor_x = (e.clientX-5)/5;
    cursor_y = (e.clientY-5)/-5+ 100;
    console.log(cursor_x,cursor_y);

}

let debounce = false;

function OnMouseDown(e){
    let rel_pos = new Vector2(ball.position.x - cursor_x,ball.position.y - cursor_y);
    if(!debounce && ball.velocity.mag <= 0.1 && rel_pos.mag < 5){
        debounce = true;
        ball.velocity = new Vector2(ball.position.x - cursor_x,ball.position.y - cursor_y).multi(0.5);
        debounce = false;
    }

}

pf.addEventListener('mousemove',OnMouseMove);
pf.addEventListener('mousedown',OnMouseDown);

// -0.35 0.15 0.45 -0.05
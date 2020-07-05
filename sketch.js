/// <reference path="./p5.global-mode.d.ts" />
var col=30;
var row=30;
var grid=new Array(col);
var w=600/col;
var h=600/row;
var s;
var e;
var currentCell; 
var unvisitedQueue;
var started=false;
var processDone=false;

class cell{
  constructor(i,j){
    this.x=i;
    this.y=j;
    this.source=false;
    this.end=false;
    this.dist = Number.POSITIVE_INFINITY;
    this.prev = null; //previous node for tracing 
    this.partofQueue=false;  //part of priority queue
    this.inshortPath=false;
    this.active=true; //unvisited neighbor
    this.neighbor=this.createNeighbor();  //array of neighbor cells
    this.obstacle=false;
  }


  //construct grid
  show(){
    stroke(255);
    noFill();
    
    // if(this.partofQueue==true){
    //   fill(0,180,100);     //color of cell in priority queue
    // }
    if(this.obstacle){
      fill(255, 0, 132);   //color of obstacles
    }
    if(this.source){
      fill(100);    //color for source
    }
    if(this.end){
      fill(150);    //color for end
    }
    if(this.inshortPath){
      fill(0, 255, 255);  //color for shortest path
    }
    
    rect(this.x*w,this.y*h,w,h);
  }
   
  // create array of neighbor cells
  createNeighbor() {
    var arr = new Array()

	

    
    if (this.x < col - 1) {
      arr.push(grid[this.x + 1][this.y]);
    }
    if (this.x > 0) {
      arr.push(grid[this.x - 1][this.y]);
    }
    if (this.y < row - 1) {
      arr.push(grid[this.x][this.y + 1]);
    }
    if (this.y > 0) {
      arr.push(grid[this.x][this.y - 1]);
    }
    if (this.x > 0 && this.y > 0) {
      arr.push(grid[this.x - 1][this.y - 1]);
    }
    if (this.x < col - 1 && this.y > 0) {
      arr.push(grid[this.x + 1][this.y - 1]);
    }
    if (this.x > 0 && this.y < row - 1) {
      arr.push(grid[this.x - 1][this.y + 1]);
    }
    if (this.x < col - 1 && this.y < row - 1) {
      arr.push(grid[this.x + 1][this.y + 1]);
    }
		this.neighbor= arr;
  }

};

  
function setup() {
  createCanvas(600, 600);
   //2d array creation 
  for (let i = 0; i < col ; i++) {
           grid[i]=new Array(row);
  }    
   
  for (let i = 0; i < col; i++) { 
   for (let j = 0; j < row; j++) {
    grid[i][j]=new cell(i,j);
   }  
  } 
    
  s=grid[0][0] 
  s.source=true;
  s.dist=0;
  e=grid[col-1][row-1]
  e.end=true;

  
  // for (let i = 0; i < obstacleList.length; i++) {
  //   obstacleList[i].obstacle=true;
    
  // }
  // grid[2][2].obstacle=true;
  // grid[1][3].obstacle=true;
  // grid[3][3].obstacle=true;
  // grid[3][4].obstacle=true; 
   
  started=false;
} 

    
function mouseDragged() { 
  // if (started==false) {
     var xpos=Math.floor(mouseX/w); 
     var ypos=Math.floor(mouseY/h); 
     if(xpos!=0 && ypos!=0 && grid[xpos][ypos].obstacle==false)
      grid[xpos][ypos].obstacle=true; 
  // }
}  

function draw() {
  background(0); 
  for (let i = 0; i < col; i++) {
    for (let j = 0; j < row; j++) {
      grid[i][j].show();
      grid[i][j].createNeighbor();
    }
   }


  

  if(processDone){
    noLoop();
  }
}

 
//find cell in priority q with minimum dist
function minDistCell() {
  let min=Number.POSITIVE_INFINITY; 
  for (let i = 0; i < col; i++) {
    for (let j = 0; j < row; j++) {
      if (grid[i][j].obstacle==false && grid[i][j].partofQueue==true && grid[i][j].dist<=min) {
        min=grid[i][j];
      } 
    } 
   } 
  return min;
}
 
//backtacking the path

function backtracePath() {
  var  currentpathElement=e; 
  currentpathElement.inshortPath=true;
  while(currentpathElement.source==false){
    currentpathElement.prev.inshortPath=true;
    currentpathElement=currentpathElement.prev;
  }
  processDone=true;
} 

//shortest path finding algorithm   

function Daijkstra() {
  unvisitedQueue=activeQueue();
  started=true;
  while (unvisitedQueue.length>0) { 
    currentCell=minDistCell();
    currentCell.partofQueue=false;
    unvisitedQueue.pop(); 
    for (let i = 0; i < currentCell.neighbor.length; i++) {
      if(currentCell.neighbor[i].active && currentCell.neighbor[i].obstacle==false){
        var currentNeighbor=currentCell.neighbor[i];
        currentNeighbor.active=false;
        var tempDistance= currentCell.dist + 1;
        if(tempDistance < currentNeighbor.dist){
          currentNeighbor.dist=tempDistance;
          currentNeighbor.prev=currentCell;
        } 
      } 
             
    } 
  } 
  
} 
  
  
//queue of active element
function activeQueue() {
  var arr = new Array()
  for(i = 0; i<col; i++){
    for(j = 0; j<row; j++){
      if (grid[i][j].obstacle==false) {
         arr.push(grid[i][j]);
         grid[i][j].partofQueue=true;
      }
    }
  }

  return arr
}



function keyPressed(){
	
	//Space pressed
	if(keyCode == 32){
    Daijkstra();
    backtracePath();
  }

  //R key pressed
	if(keyCode == 82)
  setup()
		
}
  






  
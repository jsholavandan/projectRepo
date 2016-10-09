
let maze ={
  canvas : null,
  ctx:null,
  size: 60,
  tiles : [],
  playerX:8,
  playerY:8,
  player:null,
  food1:null,
  food2:null,
  food3:null,
  foodArray:[],
  height:40,
  width:45,
  button:null,
  winnerCount:0,

  init: function(){
    this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
    this.button = document.getElementById('newGame');
    this.ctx = this.canvas.getContext('2d');
    this.loadImages();

    window.addEventListener("load", this.drawBoard );

    window.addEventListener("keydown", this.handleKey);
    this.button.addEventListener('click', this.newGameHandler);
  },

  newGameHandler: function(){
    maze.tiles= [];
    maze.playerX = 8;
    maze.playerY = 8;
    maze.drawBoard();
    maze.winnerCount = 0;
  },

  loadImages: function(){
    this.player = new Image();
    this.player.src = "player.jpg";
    this.player.id = "player";

    for(let i=0;i<3;i++){
      let obj = new Image();
      obj.src = "food.jpg";
      obj.id = "food" + (i+1);
      this.foodArray.push(obj);
    }
    /*
    this.food1 = new Image();
    this.food1.src = "food.jpg";
    this.food1.id = "food1";
    this.food2 = new Image();
    this.food2.src = "food.jpg";
    this.food2.id = "food2";
    this.food3 = new Image();
    this.food3.src = "food.jpg";
    this.food3.id = "food3";  */
  },

  handleKey: function(e){
  //  console.log(e.target);
    let cell = maze.getCellObject(maze.playerY, maze.playerX);
    let x = 0;
    let y = 0;
    let newColumn = 0;
    let newRow = 0;
    let newCell = null;
    switch(e.keyCode){
      case 37:

              newColumn = cell.col - 1;
              if(newColumn >= 0){
                x = maze.playerX - maze.size;
                newCell = maze.getCellObject(maze.playerY, x);
                if(newCell.path){
                  maze.updateCount(newCell);
                  let newImageObj = cell.imgObject;
                  cell.imgObject = null;
                  maze.playerX = x;
                  newImageObj.x = x;
                  newCell.imgObject = newImageObj;

                }
              }


              break;
      case 39:
            newColumn = cell.col + 1;
            if(newColumn < 10 ){
              x = maze.playerX + maze.size
              newCell = maze.getCellObject(maze.playerY, x);
              if(newCell.path){
                maze.updateCount(newCell);
                maze.playerX = x;
              //  cell.imgObject.x = x;

                let newImageObj = cell.imgObject;
                cell.imgObject = null;
                newImageObj.x = x;
                newCell.imgObject = newImageObj;

              }
            }

        break;
      case 38:
              newRow = cell.row - 1;
              if(newRow >= 0){
                y = maze.playerY - maze.size;
                newCell = maze.getCellObject(y, maze.playerX);
                if(newCell.path){
                if(maze.updateCount(newCell)){
                  let newImageObj = cell.imgObject;
                  cell.imgObject = null;
                  maze.playerY = y;
                  newImageObj.y = y;
                  newCell.imgObject = newImageObj;
                  maze.endGame();
                }else{
                  let newImageObj = cell.imgObject;
                  cell.imgObject = null;
                  maze.playerY = y;
                  newImageObj.y = y;
                  newCell.imgObject = newImageObj;
                }

                //    maze.updateCount(newCell);
                }
              }

              break;
      case 40:
              newRow = cell.row + 1;
              if(newRow < 10){
                y = maze.playerY + maze.size;
                newCell = maze.getCellObject(y, maze.playerX);
                if(newCell.path){
                  maze.updateCount(newCell);
                  let newImageObj = cell.imgObject;
                //  console.log(newImageObj);
                  cell.imgObject = null;
                  maze.playerY = y;
                  newImageObj.y = y;
                  newCell.imgObject = newImageObj;
                //  maze.updateCount(newCell);
                }

              }

              break;
    }
    maze.redrawBoard();
  },
/*
  checkAndUpdateCell: function(oldCell, newCell){
        let newImageObj = oldCell.imgObject;
        oldCell.imgObject = null;
        maze.playerX = newCell.col;
        maze.playerY = newCell.row;
        newImageObj.x = maze.playerX;
        newImageObj.y = maze.playerY;
        newCell.imgObject = newImageObj;
  },
*/
  updateCount : function(cell){
    if(cell.imgObject !== null && typeof cell.imgObject.role !== 'undefined'){
      if(cell.imgObject.role === 'food'){
        maze.winnerCount += 1;
        if(maze.winnerCount === 3){
            return true;
        }else{
          return false;
        }
      }
      /*else if(cell.imgObject.role === 'zombie'){
        maze.endGame();
        return;
      } */
    }

  },

  endGame : function(){
    alert("You won the Game!!!");
    maze.newGameHandler();
  },

  getCellObject: function(row, col){
    row = (row === 8) ? 0 : Math.floor((row - 8)/this.size);
    col = (col === 8) ? 0 : Math.floor((col-8)/this.size);
  //  console.log(row +   "===" + col);
    return maze.tiles[row][col];
  },

  drawBoard : function(){
    console.log("in drawboard");
    for(let i=0;i<10;i++){
      maze.tiles[i] = [];
      for(let j=0;j<10;j++){
        maze.tiles[i].push(maze.createCellObj(i,j));
        maze.drawCell(j*maze.size, i*maze.size, maze.tiles[i][j]);
      }
    }
    maze.generateMaze();
  },

  generateMaze: function(){
    for(let i=0;i<10;i++){
     if(i>0 || (i%2) !== 0){
        let rand = this.generateRandomNumbers(3, false);
        for(let j=0;j<10;j++){
          if(rand.indexOf(j) !== -1){
              var cell = this.tiles[i][j];
              cell.path = true;
          }
        }
    }
   }
   this.placeFood();
   this.redrawBoard();

  },

  generateRandomNumbers : function(num, even){
    let temp = [];
    even = even || false;

    while(temp.length < num){
      let rnd = Math.floor(Math.random() * 10);
      if(even){
        if(rnd === 0 || (rnd % 2) === 0){
          if(rnd !== 0 && temp.indexOf(rnd) === -1){
            temp.push(rnd);
          }
        }
      }else{
        if(rnd !== 0 && temp.indexOf(rnd) === -1 && rnd !== 9){
          temp.push(rnd);
        }
      }
    }
    return temp;
  },



  placeFood : function(){
    let rowArray = this.generateRandomNumbers(3, true);
    let colArray = this.generateRandomNumbers(3, false);
  //  let imgArr = [this.food1, this.food2, this.food3];

    for(let i=0;i<this.foodArray.length;i++){
      var cell = this.tiles[rowArray[i]][colArray[i]];
      let img = {
        id: this.foodArray[i],
        x: colArray[i]*maze.size + 8,
        y: rowArray[i]*maze.size + 8,
        role:'food'
      }
      cell.imgObject = img;
   }
  },

  redrawBoard: function(){
  //  alert("in redrawBoard");
    this.clearBoard();
    var size = this.size;
    for(let i=0;i<10;i++){
      for(let j=0;j<10;j++){
        this.drawCell(j*size, i*size, this.tiles[i][j]);
      }
    }
    //console.log(this.tiles.toString());

  },

  clearBoard:function(row){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  drawCell: function(x, y, tile){
    let side = this.size;
    this.ctx.beginPath();
    if(!tile.path && tile.type !== 'even'){
      this.drawLine(x, y, x, y+side);
      this.drawLine(x+side, y, x+side, y+side);
      this.drawLine(x,y,x+side, y);
      this.drawLine(x, y+side, x+side, y+side);
    }

    if(tile.imgObject !== null){
      this.ctx.drawImage(tile.imgObject.id, tile.imgObject.x, tile.imgObject.y, this.width, this.height);
    }
    this.ctx.stroke();
  },

  drawLine:function(x,y,endX, endY){
    this.ctx.moveTo(x,y);
    this.ctx.lineTo(endX, endY);
  },

  createCellObj : function(row, col){
    let type, path;
    if(row < 1 || (row % 2) === 0){
      type = 'even';
      path = true;
    }else{
      type = "odd";
      path = false;
    }
    let img = null;

    if(row === 0 && col === 0){
      img = {
        id : maze.player,
        x : maze.playerX,
        y : maze.playerY,
        role:'player'
      };
    }

    let obj = {
      row:row,
      col:col,
      path:path,
      type:type,
      imgObject:img
    }
    return obj;
  }

};

maze.init();

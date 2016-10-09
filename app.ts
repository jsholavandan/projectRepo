

let board = {
  canvas : null,
  tiles : [],
  ctx:null,
  visitedCells :[],
  size: 75,
  init : function(){
    this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.drawBoard();
  },
  drawBoard: function(){
  //  let side = 75;
    for(let i=0;i<10;i++){
      this.tiles[i] = [];
      for(let j=0;j<10;j++){
        this.tiles[i].push(this.createCellObj(i,j));
        this.drawCell(j*this.size, i*this.size, this.tiles[i][j]);
      }
    }
    this.generateMaze(0,0);
  },

  redrawBoard : function(){
    console.log(" redraw");
    this.clearBoard();
    for(let i=0;i<10;i++){
      for(let j=0;j<10;j++){
        console.log(this.tiles[i][j]);
        this.drawCell(j*this.size, i*this.size, this.tiles[i][j]);
      }
    }

  },

  generateMaze: function(row, col){
    let currentCell = this.tiles[row][col];
    if(!currentCell.visited){
      currentCell.visited = true;
      this.visitedCells.push(currentCell);
    }

    // all the cells have been visited and checked
    if(this.visitedCells.length === 0){
      this.redrawBoard();
      return;
    }
    let neighborCell = this.findNeighbor(row, col);
    if(neighborCell !== undefined){
      //bottom cell
      if(neighborCell.row > currentCell.row){
        neighborCell.top = false;
        currentCell.bottom = false;
      }
      //top cell
      if(neighborCell.row < currentCell.row){
        currentCell.top = false;
        neighborCell.bottom = false;
      }
      //right cell
      if(neighborCell.col > currentCell.col){
        currentCell.right = false;
        neighborCell.left = false;
      }

      //left cell
      if(neighborCell.col < currentCell.col){
        currentCell.left = false;
        neighborCell.right = false;
      }
      currentCell = neighborCell;
    }else{
      // if no neighbors are found go back to the previous visited cell
      currentCell = this.visitedCells.pop();
    }
    this.generateMaze(currentCell.row, currentCell.col);
  },

  findNeighbor : function(row, col){
    let neighborArray = [];
    let selectedCell;

    // checking for left cell
    if(row >= 0 && col > 0){
      selectedCell = this.tiles[row][col-1];
      if(!selectedCell.visited){
        neighborArray.push(selectedCell);
      }
    }

    //checking for right currentCell
    if(row >= 0 && col < 9){
      selectedCell = this.tiles[row][col+1];
      if(!selectedCell.visited){
        neighborArray.push(selectedCell);
      }
    }
    //checking for the top row
    if(row > 0 && col >= 0){
      selectedCell = this.tiles[row-1][col];
      if(!selectedCell.visited){
        neighborArray.push(selectedCell);
      }
    }

    //checking for bottom row
    if(row < 9 && col>=0){
      selectedCell = this.tiles[row+1][col];
      if(!selectedCell.visited){
        neighborArray.push(selectedCell);
      }
    }

    if(neighborArray.length > 0){
      //choose a random neighbor
        var randNum = Math.floor(Math.random() * neighborArray.length);
        return neighborArray[randNum];
    }else{
      // No neighbor was found
      return undefined;
    }
  },

  drawCell: function(x, y, tile){
    let side = this.size;
    this.ctx.beginPath();
    if(tile.left){
      this.drawLine(x, y, x, y+side);
    }

    if(tile.right){
      this.drawLine(x+side, y, x+side, y+side);
    }

    if(tile.top){
      this.drawLine(x,y,x+side, y);
    }

    if(tile.bottom){
      this.drawLine(x, y+side, x+side, y+side);
    }    

    this.ctx.stroke();
  },

  drawLine:function(x,y,endX, endY){
    this.ctx.moveTo(x,y);
    this.ctx.lineTo(endX, endY);
  },
  createCellObj : function(row, col){
    let obj = {
      row:row,
      col:col,
      visited:false,
      left:true,
      right:true,
      top:true,
      bottom:true
    };
    return obj;
  },
  clearBoard: function(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

board.init();

var maze = {
    canvas: null,
    ctx: null,
    size: 60,
    tiles: [],
    playerX: 8,
    playerY: 8,
    player: null,
    food1: null,
    food2: null,
    food3: null,
    foodArray: [],
    height: 40,
    width: 45,
    button: null,
    winnerCount: 0,
    init: function () {
        this.canvas = document.getElementById('canvas');
        this.button = document.getElementById('newGame');
        this.ctx = this.canvas.getContext('2d');
        this.loadImages();
        window.addEventListener("load", this.drawBoard);
        window.addEventListener("keydown", this.handleKey);
        this.button.addEventListener('click', this.newGameHandler);
    },
    newGameHandler: function () {
        maze.tiles = [];
        maze.playerX = 8;
        maze.playerY = 8;
        maze.drawBoard();
        maze.winnerCount = 0;
    },
    loadImages: function () {
        this.player = new Image();
        this.player.src = "player.jpg";
        this.player.id = "player";
        for (var i = 0; i < 3; i++) {
            var obj = new Image();
            obj.src = "food.jpg";
            obj.id = "food" + (i + 1);
            this.foodArray.push(obj);
        }
    },
    handleKey: function (e) {
        var cell = maze.getCellObject(maze.playerY, maze.playerX);
        var x = 0;
        var y = 0;
        var newColumn = 0;
        var newRow = 0;
        var newCell = null;
        switch (e.keyCode) {
            case 37:
                newColumn = cell.col - 1;
                if (newColumn >= 0) {
                    x = maze.playerX - maze.size;
                    newCell = maze.getCellObject(maze.playerY, x);
                    if (newCell.path) {
                        maze.updateCount(newCell);
                        var newImageObj = cell.imgObject;
                        cell.imgObject = null;
                        maze.playerX = x;
                        newImageObj.x = x;
                        newCell.imgObject = newImageObj;
                    }
                }
                break;
            case 39:
                newColumn = cell.col + 1;
                if (newColumn < 10) {
                    x = maze.playerX + maze.size;
                    newCell = maze.getCellObject(maze.playerY, x);
                    if (newCell.path) {
                        maze.updateCount(newCell);
                        maze.playerX = x;
                        var newImageObj = cell.imgObject;
                        cell.imgObject = null;
                        newImageObj.x = x;
                        newCell.imgObject = newImageObj;
                    }
                }
                break;
            case 38:
                newRow = cell.row - 1;
                if (newRow >= 0) {
                    y = maze.playerY - maze.size;
                    newCell = maze.getCellObject(y, maze.playerX);
                    if (newCell.path) {
                        if (maze.updateCount(newCell)) {
                            var newImageObj = cell.imgObject;
                            cell.imgObject = null;
                            maze.playerY = y;
                            newImageObj.y = y;
                            newCell.imgObject = newImageObj;
                            maze.endGame();
                        }
                        else {
                            var newImageObj = cell.imgObject;
                            cell.imgObject = null;
                            maze.playerY = y;
                            newImageObj.y = y;
                            newCell.imgObject = newImageObj;
                        }
                    }
                }
                break;
            case 40:
                newRow = cell.row + 1;
                if (newRow < 10) {
                    y = maze.playerY + maze.size;
                    newCell = maze.getCellObject(y, maze.playerX);
                    if (newCell.path) {
                        maze.updateCount(newCell);
                        var newImageObj = cell.imgObject;
                        cell.imgObject = null;
                        maze.playerY = y;
                        newImageObj.y = y;
                        newCell.imgObject = newImageObj;
                    }
                }
                break;
        }
        maze.redrawBoard();
    },
    updateCount: function (cell) {
        if (cell.imgObject !== null && typeof cell.imgObject.role !== 'undefined') {
            if (cell.imgObject.role === 'food') {
                maze.winnerCount += 1;
                if (maze.winnerCount === 3) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    },
    endGame: function () {
        alert("You won the Game!!!");
        maze.newGameHandler();
    },
    getCellObject: function (row, col) {
        row = (row === 8) ? 0 : Math.floor((row - 8) / this.size);
        col = (col === 8) ? 0 : Math.floor((col - 8) / this.size);
        return maze.tiles[row][col];
    },
    drawBoard: function () {
        console.log("in drawboard");
        for (var i = 0; i < 10; i++) {
            maze.tiles[i] = [];
            for (var j = 0; j < 10; j++) {
                maze.tiles[i].push(maze.createCellObj(i, j));
                maze.drawCell(j * maze.size, i * maze.size, maze.tiles[i][j]);
            }
        }
        maze.generateMaze();
    },
    generateMaze: function () {
        for (var i = 0; i < 10; i++) {
            if (i > 0 || (i % 2) !== 0) {
                var rand = this.generateRandomNumbers(3, false);
                for (var j = 0; j < 10; j++) {
                    if (rand.indexOf(j) !== -1) {
                        var cell = this.tiles[i][j];
                        cell.path = true;
                    }
                }
            }
        }
        this.placeFood();
        this.redrawBoard();
    },
    generateRandomNumbers: function (num, even) {
        var temp = [];
        even = even || false;
        while (temp.length < num) {
            var rnd = Math.floor(Math.random() * 10);
            if (even) {
                if (rnd === 0 || (rnd % 2) === 0) {
                    if (rnd !== 0 && temp.indexOf(rnd) === -1) {
                        temp.push(rnd);
                    }
                }
            }
            else {
                if (rnd !== 0 && temp.indexOf(rnd) === -1 && rnd !== 9) {
                    temp.push(rnd);
                }
            }
        }
        return temp;
    },
    placeFood: function () {
        var rowArray = this.generateRandomNumbers(3, true);
        var colArray = this.generateRandomNumbers(3, false);
        for (var i = 0; i < this.foodArray.length; i++) {
            var cell = this.tiles[rowArray[i]][colArray[i]];
            var img = {
                id: this.foodArray[i],
                x: colArray[i] * maze.size + 8,
                y: rowArray[i] * maze.size + 8,
                role: 'food'
            };
            cell.imgObject = img;
        }
    },
    redrawBoard: function () {
        this.clearBoard();
        var size = this.size;
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                this.drawCell(j * size, i * size, this.tiles[i][j]);
            }
        }
    },
    clearBoard: function (row) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    drawCell: function (x, y, tile) {
        var side = this.size;
        this.ctx.beginPath();
        if (!tile.path && tile.type !== 'even') {
            this.drawLine(x, y, x, y + side);
            this.drawLine(x + side, y, x + side, y + side);
            this.drawLine(x, y, x + side, y);
            this.drawLine(x, y + side, x + side, y + side);
        }
        if (tile.imgObject !== null) {
            this.ctx.drawImage(tile.imgObject.id, tile.imgObject.x, tile.imgObject.y, this.width, this.height);
        }
        this.ctx.stroke();
    },
    drawLine: function (x, y, endX, endY) {
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(endX, endY);
    },
    createCellObj: function (row, col) {
        var type, path;
        if (row < 1 || (row % 2) === 0) {
            type = 'even';
            path = true;
        }
        else {
            type = "odd";
            path = false;
        }
        var img = null;
        if (row === 0 && col === 0) {
            img = {
                id: maze.player,
                x: maze.playerX,
                y: maze.playerY,
                role: 'player'
            };
        }
        var obj = {
            row: row,
            col: col,
            path: path,
            type: type,
            imgObject: img
        };
        return obj;
    }
};
maze.init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF6ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1hemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsSUFBSSxJQUFJLEdBQUU7SUFDUixNQUFNLEVBQUcsSUFBSTtJQUNiLEdBQUcsRUFBQyxJQUFJO0lBQ1IsSUFBSSxFQUFFLEVBQUU7SUFDUixLQUFLLEVBQUcsRUFBRTtJQUNWLE9BQU8sRUFBQyxDQUFDO0lBQ1QsT0FBTyxFQUFDLENBQUM7SUFDVCxNQUFNLEVBQUMsSUFBSTtJQUNYLEtBQUssRUFBQyxJQUFJO0lBQ1YsS0FBSyxFQUFDLElBQUk7SUFDVixLQUFLLEVBQUMsSUFBSTtJQUNWLFNBQVMsRUFBQyxFQUFFO0lBQ1osTUFBTSxFQUFDLEVBQUU7SUFDVCxLQUFLLEVBQUMsRUFBRTtJQUNSLE1BQU0sRUFBQyxJQUFJO0lBQ1gsV0FBVyxFQUFDLENBQUM7SUFFYixJQUFJLEVBQUU7UUFDSixJQUFJLENBQUMsTUFBTSxHQUFzQixRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUVsQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsQ0FBQztRQUVqRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELGNBQWMsRUFBRTtRQUNkLElBQUksQ0FBQyxLQUFLLEdBQUUs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QUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQztZQUNwQixHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUUsRUFBQyxDQUFDO2dCQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEQsQ0FBQztRQUNILENBQUM7SUFHSCxDQUFDO0lBRUQsVUFBVSxFQUFDLFVBQVMsR0FBRztRQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELFFBQVEsRUFBRSxVQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSTtRQUMzQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDckIsRUFBRSxDQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUEsQ0FBQztZQUNyQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFDLElBQUksRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUVELEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxDQUFDLENBQUEsQ0FBQztZQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyRyxDQUFDO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsUUFBUSxFQUFDLFVBQVMsQ0FBQyxFQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSTtRQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxhQUFhLEVBQUcsVUFBUyxHQUFHLEVBQUUsR0FBRztRQUMvQixJQUFJLElBQUksRUFBRSxJQUFJLENBQUM7UUFDZixFQUFFLENBQUEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBLENBQUM7WUFDN0IsSUFBSSxHQUFHLE1BQU0sQ0FBQztZQUNkLElBQUksR0FBRyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQUEsSUFBSSxDQUFBLENBQUM7WUFDSixJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ2IsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNmLENBQUM7UUFDRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFFZixFQUFFLENBQUEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQSxDQUFDO1lBQ3pCLEdBQUcsR0FBRztnQkFDSixFQUFFLEVBQUcsSUFBSSxDQUFDLE1BQU07Z0JBQ2hCLENBQUMsRUFBRyxJQUFJLENBQUMsT0FBTztnQkFDaEIsQ0FBQyxFQUFHLElBQUksQ0FBQyxPQUFPO2dCQUNoQixJQUFJLEVBQUMsUUFBUTthQUNkLENBQUM7UUFDSixDQUFDO1FBRUQsSUFBSSxHQUFHLEdBQUc7WUFDUixHQUFHLEVBQUMsR0FBRztZQUNQLEdBQUcsRUFBQyxHQUFHO1lBQ1AsSUFBSSxFQUFDLElBQUk7WUFDVCxJQUFJLEVBQUMsSUFBSTtZQUNULFNBQVMsRUFBQyxHQUFHO1NBQ2QsQ0FBQTtRQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDYixDQUFDO0NBRUYsQ0FBQztBQUVGLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5sZXQgbWF6ZSA9e1xyXG4gIGNhbnZhcyA6IG51bGwsXHJcbiAgY3R4Om51bGwsXHJcbiAgc2l6ZTogNjAsXHJcbiAgdGlsZXMgOiBbXSxcclxuICBwbGF5ZXJYOjgsXHJcbiAgcGxheWVyWTo4LFxyXG4gIHBsYXllcjpudWxsLFxyXG4gIGZvb2QxOm51bGwsXHJcbiAgZm9vZDI6bnVsbCxcclxuICBmb29kMzpudWxsLFxyXG4gIGZvb2RBcnJheTpbXSxcclxuICBoZWlnaHQ6NDAsXHJcbiAgd2lkdGg6NDUsXHJcbiAgYnV0dG9uOm51bGwsXHJcbiAgd2lubmVyQ291bnQ6MCxcclxuXHJcbiAgaW5pdDogZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuY2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcclxuICAgIHRoaXMuYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ld0dhbWUnKTtcclxuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIHRoaXMubG9hZEltYWdlcygpO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCB0aGlzLmRyYXdCb2FyZCApO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLmhhbmRsZUtleSk7XHJcbiAgICB0aGlzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMubmV3R2FtZUhhbmRsZXIpO1xyXG4gIH0sXHJcblxyXG4gIG5ld0dhbWVIYW5kbGVyOiBmdW5jdGlvbigpe1xyXG4gICAgbWF6ZS50aWxlcz0gW107XHJcbiAgICBtYXplLnBsYXllclggPSA4O1xyXG4gICAgbWF6ZS5wbGF5ZXJZID0gODtcclxuICAgIG1hemUuZHJhd0JvYXJkKCk7XHJcbiAgICBtYXplLndpbm5lckNvdW50ID0gMDtcclxuICB9LFxyXG5cclxuICBsb2FkSW1hZ2VzOiBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgSW1hZ2UoKTtcclxuICAgIHRoaXMucGxheWVyLnNyYyA9IFwicGxheWVyLmpwZ1wiO1xyXG4gICAgdGhpcy5wbGF5ZXIuaWQgPSBcInBsYXllclwiO1xyXG5cclxuICAgIGZvcihsZXQgaT0wO2k8MztpKyspe1xyXG4gICAgICBsZXQgb2JqID0gbmV3IEltYWdlKCk7XHJcbiAgICAgIG9iai5zcmMgPSBcImZvb2QuanBnXCI7XHJcbiAgICAgIG9iai5pZCA9IFwiZm9vZFwiICsgKGkrMSk7XHJcbiAgICAgIHRoaXMuZm9vZEFycmF5LnB1c2gob2JqKTtcclxuICAgIH1cclxuICAgIC8qXHJcbiAgICB0aGlzLmZvb2QxID0gbmV3IEltYWdlKCk7XHJcbiAgICB0aGlzLmZvb2QxLnNyYyA9IFwiZm9vZC5qcGdcIjtcclxuICAgIHRoaXMuZm9vZDEuaWQgPSBcImZvb2QxXCI7XHJcbiAgICB0aGlzLmZvb2QyID0gbmV3IEltYWdlKCk7XHJcbiAgICB0aGlzLmZvb2QyLnNyYyA9IFwiZm9vZC5qcGdcIjtcclxuICAgIHRoaXMuZm9vZDIuaWQgPSBcImZvb2QyXCI7XHJcbiAgICB0aGlzLmZvb2QzID0gbmV3IEltYWdlKCk7XHJcbiAgICB0aGlzLmZvb2QzLnNyYyA9IFwiZm9vZC5qcGdcIjtcclxuICAgIHRoaXMuZm9vZDMuaWQgPSBcImZvb2QzXCI7ICAqL1xyXG4gIH0sXHJcblxyXG4gIGhhbmRsZUtleTogZnVuY3Rpb24oZSl7XHJcbiAgLy8gIGNvbnNvbGUubG9nKGUudGFyZ2V0KTtcclxuICAgIGxldCBjZWxsID0gbWF6ZS5nZXRDZWxsT2JqZWN0KG1hemUucGxheWVyWSwgbWF6ZS5wbGF5ZXJYKTtcclxuICAgIGxldCB4ID0gMDtcclxuICAgIGxldCB5ID0gMDtcclxuICAgIGxldCBuZXdDb2x1bW4gPSAwO1xyXG4gICAgbGV0IG5ld1JvdyA9IDA7XHJcbiAgICBsZXQgbmV3Q2VsbCA9IG51bGw7XHJcbiAgICBzd2l0Y2goZS5rZXlDb2RlKXtcclxuICAgICAgY2FzZSAzNzpcclxuXHJcbiAgICAgICAgICAgICAgbmV3Q29sdW1uID0gY2VsbC5jb2wgLSAxO1xyXG4gICAgICAgICAgICAgIGlmKG5ld0NvbHVtbiA+PSAwKXtcclxuICAgICAgICAgICAgICAgIHggPSBtYXplLnBsYXllclggLSBtYXplLnNpemU7XHJcbiAgICAgICAgICAgICAgICBuZXdDZWxsID0gbWF6ZS5nZXRDZWxsT2JqZWN0KG1hemUucGxheWVyWSwgeCk7XHJcbiAgICAgICAgICAgICAgICBpZihuZXdDZWxsLnBhdGgpe1xyXG4gICAgICAgICAgICAgICAgICBtYXplLnVwZGF0ZUNvdW50KG5ld0NlbGwpO1xyXG4gICAgICAgICAgICAgICAgICBsZXQgbmV3SW1hZ2VPYmogPSBjZWxsLmltZ09iamVjdDtcclxuICAgICAgICAgICAgICAgICAgY2VsbC5pbWdPYmplY3QgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICBtYXplLnBsYXllclggPSB4O1xyXG4gICAgICAgICAgICAgICAgICBuZXdJbWFnZU9iai54ID0geDtcclxuICAgICAgICAgICAgICAgICAgbmV3Q2VsbC5pbWdPYmplY3QgPSBuZXdJbWFnZU9iajtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgMzk6XHJcbiAgICAgICAgICAgIG5ld0NvbHVtbiA9IGNlbGwuY29sICsgMTtcclxuICAgICAgICAgICAgaWYobmV3Q29sdW1uIDwgMTAgKXtcclxuICAgICAgICAgICAgICB4ID0gbWF6ZS5wbGF5ZXJYICsgbWF6ZS5zaXplXHJcbiAgICAgICAgICAgICAgbmV3Q2VsbCA9IG1hemUuZ2V0Q2VsbE9iamVjdChtYXplLnBsYXllclksIHgpO1xyXG4gICAgICAgICAgICAgIGlmKG5ld0NlbGwucGF0aCl7XHJcbiAgICAgICAgICAgICAgICBtYXplLnVwZGF0ZUNvdW50KG5ld0NlbGwpO1xyXG4gICAgICAgICAgICAgICAgbWF6ZS5wbGF5ZXJYID0geDtcclxuICAgICAgICAgICAgICAvLyAgY2VsbC5pbWdPYmplY3QueCA9IHg7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IG5ld0ltYWdlT2JqID0gY2VsbC5pbWdPYmplY3Q7XHJcbiAgICAgICAgICAgICAgICBjZWxsLmltZ09iamVjdCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBuZXdJbWFnZU9iai54ID0geDtcclxuICAgICAgICAgICAgICAgIG5ld0NlbGwuaW1nT2JqZWN0ID0gbmV3SW1hZ2VPYmo7XHJcblxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAzODpcclxuICAgICAgICAgICAgICBuZXdSb3cgPSBjZWxsLnJvdyAtIDE7XHJcbiAgICAgICAgICAgICAgaWYobmV3Um93ID49IDApe1xyXG4gICAgICAgICAgICAgICAgeSA9IG1hemUucGxheWVyWSAtIG1hemUuc2l6ZTtcclxuICAgICAgICAgICAgICAgIG5ld0NlbGwgPSBtYXplLmdldENlbGxPYmplY3QoeSwgbWF6ZS5wbGF5ZXJYKTtcclxuICAgICAgICAgICAgICAgIGlmKG5ld0NlbGwucGF0aCl7XHJcbiAgICAgICAgICAgICAgICBpZihtYXplLnVwZGF0ZUNvdW50KG5ld0NlbGwpKXtcclxuICAgICAgICAgICAgICAgICAgbGV0IG5ld0ltYWdlT2JqID0gY2VsbC5pbWdPYmplY3Q7XHJcbiAgICAgICAgICAgICAgICAgIGNlbGwuaW1nT2JqZWN0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgbWF6ZS5wbGF5ZXJZID0geTtcclxuICAgICAgICAgICAgICAgICAgbmV3SW1hZ2VPYmoueSA9IHk7XHJcbiAgICAgICAgICAgICAgICAgIG5ld0NlbGwuaW1nT2JqZWN0ID0gbmV3SW1hZ2VPYmo7XHJcbiAgICAgICAgICAgICAgICAgIG1hemUuZW5kR2FtZSgpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBuZXdJbWFnZU9iaiA9IGNlbGwuaW1nT2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgICBjZWxsLmltZ09iamVjdCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgIG1hemUucGxheWVyWSA9IHk7XHJcbiAgICAgICAgICAgICAgICAgIG5ld0ltYWdlT2JqLnkgPSB5O1xyXG4gICAgICAgICAgICAgICAgICBuZXdDZWxsLmltZ09iamVjdCA9IG5ld0ltYWdlT2JqO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vICAgIG1hemUudXBkYXRlQ291bnQobmV3Q2VsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSA0MDpcclxuICAgICAgICAgICAgICBuZXdSb3cgPSBjZWxsLnJvdyArIDE7XHJcbiAgICAgICAgICAgICAgaWYobmV3Um93IDwgMTApe1xyXG4gICAgICAgICAgICAgICAgeSA9IG1hemUucGxheWVyWSArIG1hemUuc2l6ZTtcclxuICAgICAgICAgICAgICAgIG5ld0NlbGwgPSBtYXplLmdldENlbGxPYmplY3QoeSwgbWF6ZS5wbGF5ZXJYKTtcclxuICAgICAgICAgICAgICAgIGlmKG5ld0NlbGwucGF0aCl7XHJcbiAgICAgICAgICAgICAgICAgIG1hemUudXBkYXRlQ291bnQobmV3Q2VsbCk7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBuZXdJbWFnZU9iaiA9IGNlbGwuaW1nT2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgLy8gIGNvbnNvbGUubG9nKG5ld0ltYWdlT2JqKTtcclxuICAgICAgICAgICAgICAgICAgY2VsbC5pbWdPYmplY3QgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICBtYXplLnBsYXllclkgPSB5O1xyXG4gICAgICAgICAgICAgICAgICBuZXdJbWFnZU9iai55ID0geTtcclxuICAgICAgICAgICAgICAgICAgbmV3Q2VsbC5pbWdPYmplY3QgPSBuZXdJbWFnZU9iajtcclxuICAgICAgICAgICAgICAgIC8vICBtYXplLnVwZGF0ZUNvdW50KG5ld0NlbGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgbWF6ZS5yZWRyYXdCb2FyZCgpO1xyXG4gIH0sXHJcbi8qXHJcbiAgY2hlY2tBbmRVcGRhdGVDZWxsOiBmdW5jdGlvbihvbGRDZWxsLCBuZXdDZWxsKXtcclxuICAgICAgICBsZXQgbmV3SW1hZ2VPYmogPSBvbGRDZWxsLmltZ09iamVjdDtcclxuICAgICAgICBvbGRDZWxsLmltZ09iamVjdCA9IG51bGw7XHJcbiAgICAgICAgbWF6ZS5wbGF5ZXJYID0gbmV3Q2VsbC5jb2w7XHJcbiAgICAgICAgbWF6ZS5wbGF5ZXJZID0gbmV3Q2VsbC5yb3c7XHJcbiAgICAgICAgbmV3SW1hZ2VPYmoueCA9IG1hemUucGxheWVyWDtcclxuICAgICAgICBuZXdJbWFnZU9iai55ID0gbWF6ZS5wbGF5ZXJZO1xyXG4gICAgICAgIG5ld0NlbGwuaW1nT2JqZWN0ID0gbmV3SW1hZ2VPYmo7XHJcbiAgfSxcclxuKi9cclxuICB1cGRhdGVDb3VudCA6IGZ1bmN0aW9uKGNlbGwpe1xyXG4gICAgaWYoY2VsbC5pbWdPYmplY3QgIT09IG51bGwgJiYgdHlwZW9mIGNlbGwuaW1nT2JqZWN0LnJvbGUgIT09ICd1bmRlZmluZWQnKXtcclxuICAgICAgaWYoY2VsbC5pbWdPYmplY3Qucm9sZSA9PT0gJ2Zvb2QnKXtcclxuICAgICAgICBtYXplLndpbm5lckNvdW50ICs9IDE7XHJcbiAgICAgICAgaWYobWF6ZS53aW5uZXJDb3VudCA9PT0gMyl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvKmVsc2UgaWYoY2VsbC5pbWdPYmplY3Qucm9sZSA9PT0gJ3pvbWJpZScpe1xyXG4gICAgICAgIG1hemUuZW5kR2FtZSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfSAqL1xyXG4gICAgfVxyXG5cclxuICB9LFxyXG5cclxuICBlbmRHYW1lIDogZnVuY3Rpb24oKXtcclxuICAgIGFsZXJ0KFwiWW91IHdvbiB0aGUgR2FtZSEhIVwiKTtcclxuICAgIG1hemUubmV3R2FtZUhhbmRsZXIoKTtcclxuICB9LFxyXG5cclxuICBnZXRDZWxsT2JqZWN0OiBmdW5jdGlvbihyb3csIGNvbCl7XHJcbiAgICByb3cgPSAocm93ID09PSA4KSA/IDAgOiBNYXRoLmZsb29yKChyb3cgLSA4KS90aGlzLnNpemUpO1xyXG4gICAgY29sID0gKGNvbCA9PT0gOCkgPyAwIDogTWF0aC5mbG9vcigoY29sLTgpL3RoaXMuc2l6ZSk7XHJcbiAgLy8gIGNvbnNvbGUubG9nKHJvdyArICAgXCI9PT1cIiArIGNvbCk7XHJcbiAgICByZXR1cm4gbWF6ZS50aWxlc1tyb3ddW2NvbF07XHJcbiAgfSxcclxuXHJcbiAgZHJhd0JvYXJkIDogZnVuY3Rpb24oKXtcclxuICAgIGNvbnNvbGUubG9nKFwiaW4gZHJhd2JvYXJkXCIpO1xyXG4gICAgZm9yKGxldCBpPTA7aTwxMDtpKyspe1xyXG4gICAgICBtYXplLnRpbGVzW2ldID0gW107XHJcbiAgICAgIGZvcihsZXQgaj0wO2o8MTA7aisrKXtcclxuICAgICAgICBtYXplLnRpbGVzW2ldLnB1c2gobWF6ZS5jcmVhdGVDZWxsT2JqKGksaikpO1xyXG4gICAgICAgIG1hemUuZHJhd0NlbGwoaiptYXplLnNpemUsIGkqbWF6ZS5zaXplLCBtYXplLnRpbGVzW2ldW2pdKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgbWF6ZS5nZW5lcmF0ZU1hemUoKTtcclxuICB9LFxyXG5cclxuICBnZW5lcmF0ZU1hemU6IGZ1bmN0aW9uKCl7XHJcbiAgICBmb3IobGV0IGk9MDtpPDEwO2krKyl7XHJcbiAgICAgaWYoaT4wIHx8IChpJTIpICE9PSAwKXtcclxuICAgICAgICBsZXQgcmFuZCA9IHRoaXMuZ2VuZXJhdGVSYW5kb21OdW1iZXJzKDMsIGZhbHNlKTtcclxuICAgICAgICBmb3IobGV0IGo9MDtqPDEwO2orKyl7XHJcbiAgICAgICAgICBpZihyYW5kLmluZGV4T2YoaikgIT09IC0xKXtcclxuICAgICAgICAgICAgICB2YXIgY2VsbCA9IHRoaXMudGlsZXNbaV1bal07XHJcbiAgICAgICAgICAgICAgY2VsbC5wYXRoID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgIH1cclxuICAgdGhpcy5wbGFjZUZvb2QoKTtcclxuICAgdGhpcy5yZWRyYXdCb2FyZCgpO1xyXG5cclxuICB9LFxyXG5cclxuICBnZW5lcmF0ZVJhbmRvbU51bWJlcnMgOiBmdW5jdGlvbihudW0sIGV2ZW4pe1xyXG4gICAgbGV0IHRlbXAgPSBbXTtcclxuICAgIGV2ZW4gPSBldmVuIHx8IGZhbHNlO1xyXG5cclxuICAgIHdoaWxlKHRlbXAubGVuZ3RoIDwgbnVtKXtcclxuICAgICAgbGV0IHJuZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcclxuICAgICAgaWYoZXZlbil7XHJcbiAgICAgICAgaWYocm5kID09PSAwIHx8IChybmQgJSAyKSA9PT0gMCl7XHJcbiAgICAgICAgICBpZihybmQgIT09IDAgJiYgdGVtcC5pbmRleE9mKHJuZCkgPT09IC0xKXtcclxuICAgICAgICAgICAgdGVtcC5wdXNoKHJuZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICBpZihybmQgIT09IDAgJiYgdGVtcC5pbmRleE9mKHJuZCkgPT09IC0xICYmIHJuZCAhPT0gOSl7XHJcbiAgICAgICAgICB0ZW1wLnB1c2gocm5kKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0ZW1wO1xyXG4gIH0sXHJcblxyXG5cclxuXHJcbiAgcGxhY2VGb29kIDogZnVuY3Rpb24oKXtcclxuICAgIGxldCByb3dBcnJheSA9IHRoaXMuZ2VuZXJhdGVSYW5kb21OdW1iZXJzKDMsIHRydWUpO1xyXG4gICAgbGV0IGNvbEFycmF5ID0gdGhpcy5nZW5lcmF0ZVJhbmRvbU51bWJlcnMoMywgZmFsc2UpO1xyXG4gIC8vICBsZXQgaW1nQXJyID0gW3RoaXMuZm9vZDEsIHRoaXMuZm9vZDIsIHRoaXMuZm9vZDNdO1xyXG5cclxuICAgIGZvcihsZXQgaT0wO2k8dGhpcy5mb29kQXJyYXkubGVuZ3RoO2krKyl7XHJcbiAgICAgIHZhciBjZWxsID0gdGhpcy50aWxlc1tyb3dBcnJheVtpXV1bY29sQXJyYXlbaV1dO1xyXG4gICAgICBsZXQgaW1nID0ge1xyXG4gICAgICAgIGlkOiB0aGlzLmZvb2RBcnJheVtpXSxcclxuICAgICAgICB4OiBjb2xBcnJheVtpXSptYXplLnNpemUgKyA4LFxyXG4gICAgICAgIHk6IHJvd0FycmF5W2ldKm1hemUuc2l6ZSArIDgsXHJcbiAgICAgICAgcm9sZTonZm9vZCdcclxuICAgICAgfVxyXG4gICAgICBjZWxsLmltZ09iamVjdCA9IGltZztcclxuICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlZHJhd0JvYXJkOiBmdW5jdGlvbigpe1xyXG4gIC8vICBhbGVydChcImluIHJlZHJhd0JvYXJkXCIpO1xyXG4gICAgdGhpcy5jbGVhckJvYXJkKCk7XHJcbiAgICB2YXIgc2l6ZSA9IHRoaXMuc2l6ZTtcclxuICAgIGZvcihsZXQgaT0wO2k8MTA7aSsrKXtcclxuICAgICAgZm9yKGxldCBqPTA7ajwxMDtqKyspe1xyXG4gICAgICAgIHRoaXMuZHJhd0NlbGwoaipzaXplLCBpKnNpemUsIHRoaXMudGlsZXNbaV1bal0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMudGlsZXMudG9TdHJpbmcoKSk7XHJcblxyXG4gIH0sXHJcblxyXG4gIGNsZWFyQm9hcmQ6ZnVuY3Rpb24ocm93KXtcclxuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICB9LFxyXG5cclxuICBkcmF3Q2VsbDogZnVuY3Rpb24oeCwgeSwgdGlsZSl7XHJcbiAgICBsZXQgc2lkZSA9IHRoaXMuc2l6ZTtcclxuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgaWYoIXRpbGUucGF0aCAmJiB0aWxlLnR5cGUgIT09ICdldmVuJyl7XHJcbiAgICAgIHRoaXMuZHJhd0xpbmUoeCwgeSwgeCwgeStzaWRlKTtcclxuICAgICAgdGhpcy5kcmF3TGluZSh4K3NpZGUsIHksIHgrc2lkZSwgeStzaWRlKTtcclxuICAgICAgdGhpcy5kcmF3TGluZSh4LHkseCtzaWRlLCB5KTtcclxuICAgICAgdGhpcy5kcmF3TGluZSh4LCB5K3NpZGUsIHgrc2lkZSwgeStzaWRlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZih0aWxlLmltZ09iamVjdCAhPT0gbnVsbCl7XHJcbiAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZSh0aWxlLmltZ09iamVjdC5pZCwgdGlsZS5pbWdPYmplY3QueCwgdGlsZS5pbWdPYmplY3QueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgfSxcclxuXHJcbiAgZHJhd0xpbmU6ZnVuY3Rpb24oeCx5LGVuZFgsIGVuZFkpe1xyXG4gICAgdGhpcy5jdHgubW92ZVRvKHgseSk7XHJcbiAgICB0aGlzLmN0eC5saW5lVG8oZW5kWCwgZW5kWSk7XHJcbiAgfSxcclxuXHJcbiAgY3JlYXRlQ2VsbE9iaiA6IGZ1bmN0aW9uKHJvdywgY29sKXtcclxuICAgIGxldCB0eXBlLCBwYXRoO1xyXG4gICAgaWYocm93IDwgMSB8fCAocm93ICUgMikgPT09IDApe1xyXG4gICAgICB0eXBlID0gJ2V2ZW4nO1xyXG4gICAgICBwYXRoID0gdHJ1ZTtcclxuICAgIH1lbHNle1xyXG4gICAgICB0eXBlID0gXCJvZGRcIjtcclxuICAgICAgcGF0aCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgbGV0IGltZyA9IG51bGw7XHJcblxyXG4gICAgaWYocm93ID09PSAwICYmIGNvbCA9PT0gMCl7XHJcbiAgICAgIGltZyA9IHtcclxuICAgICAgICBpZCA6IG1hemUucGxheWVyLFxyXG4gICAgICAgIHggOiBtYXplLnBsYXllclgsXHJcbiAgICAgICAgeSA6IG1hemUucGxheWVyWSxcclxuICAgICAgICByb2xlOidwbGF5ZXInXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG9iaiA9IHtcclxuICAgICAgcm93OnJvdyxcclxuICAgICAgY29sOmNvbCxcclxuICAgICAgcGF0aDpwYXRoLFxyXG4gICAgICB0eXBlOnR5cGUsXHJcbiAgICAgIGltZ09iamVjdDppbWdcclxuICAgIH1cclxuICAgIHJldHVybiBvYmo7XHJcbiAgfVxyXG5cclxufTtcclxuXHJcbm1hemUuaW5pdCgpO1xyXG4iXX0=
class Board{
    constructor(width=12,height=6,block_size=10){
        //width is with respect to block not position
        this.width = width;
        this.height = height;
        this.block_size = block_size
        this.grid = null;
    }
    get_height(){
        return this.height
    }
    get_width(){
        return this.width
    }

    init() {
        //board = "blank" or "path"  or "tower"
        //tower: tower object
        this.grid = new Array(this.height);
        for(let i=0;i<this.height;i++){
            this.grid[i] = new Array(this.width)
            for(let j=0;j<this.width;j++){
                this.grid[i][j] = {"blank":0}
            }
        }
        for(let i=0;i<this.height;i++){
            for(let j=0;j<this.width;j++){
                if(j%2==0){
                    this.grid[i][j] = {"path":1}
                }
            }
        }
        this.grid[5][1] = {"path":1};
        this.grid[5][5] = {"path":1};
        this.grid[5][9] = {"path":1};
        this.grid[0][3] = {"path":1};
        this.grid[0][7] = {"path":1};
        this.grid[0][11] = {"path":1};
        
    }

    add_tower(i,j,tower){
        //console.log(this.g[i][j]);
        if(this.grid[i][j]['blank']!=undefined){
            this.grid[i][j] = {"tower":tower}
        }
    }

    remove_tower(i,j){
        if(this.grid[i][j]['tower']!=undefined){
            this.grid[i][j] = {"blank":0}
        }
    }
}
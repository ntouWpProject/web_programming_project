
class Game{
    constructor(score=0,money=100,level=1,health=1000){
        this.health = health
        this.score = score
        this.money = money
        this.level = level
        this.start_time = Date.now()
        this.time = 0
        this.board = new Board()
        this.enemies = []

    }

    init(){
        this.board.init();
        this.init_enemy();
    }

    is_game_over(){
        if(this.health<=0){
            return true
        }else{
            return false
        }
    }

    init_enemy(){
        console.log("level:"+this.level)
        this.enemies = []
        for(let i=0;i<this.level*10;i++){
            this.enemies.push(new Enemy(this.level*50))
        }
    }
    update_time(){
        this.time = Date.now()-this.start_time
    }

    
    buy_tower(i,j,type){
        if(this.money>=10){
            this.money-=10
            this.board.add_tower(i,j,new Tower(type));
        }
    }
    
    sell_tower(i,j){
        if(this.is_tower(i,j)){
            let m = 0
            m+=this.get_tower(i,j).get_power()
            m+=this.get_tower(i,j).get_speed()
            m+=this.get_tower(i,j).get_range()
            m*=0.1
            this.money += parseInt(m)
            this.board.remove_tower(i,j)
        }
    }

    is_tower(i,j){
        if(this.board.grid[i][j]["tower"]!=undefined){
            return true
        }else{
            return false
        }
    }

    get_tower(i,j){
        if(this.is_tower(i,j)){
            return this.board.grid[i][j]["tower"];
        }else{
            console.log("not a tower!");
        }
    }

    upgrade_tower(i,j,type){
        
        if(this.is_tower(i,j)){
            if(this.money>this.get_tower(i,j).get_level()*5){
                this.money-=this.get_tower(i,j).get_level()*5
                if(type=="power"){
                    this.get_tower(i,j).power_up()
                }else if(type == "speed"){
                    this.get_tower(i,j).speed_up()
                }else if(type=="range"){
                    this.get_tower(i,j).range_up()
                }
            }else{
                console.log("not enough money!")
            }
        }else{
            console.log("not a tower!");
        }
    }

    is_in_range(tower_x,tower_y,range,enemy_x,enemy_y){
        return Math.sqrt((tower_x-enemy_x)*(tower_x-enemy_x)+(tower_y-enemy_y)*(tower_y-enemy_y))<range
    }

    all_tower_attack(){
        for(let index in this.enemies){//for all enemies
            for(let i=0;i<this.board.get_height();i++){//for all tower
                for(let j=0;j<this.board.get_width();j++){
                    if(this.is_tower(i,j)){
                        if(this.time%this.get_tower(i,j).get_speed()==0){//check if can attack(cool down)
                            if(this.get_tower(i,j).get_attackable()<0 || this.get_tower(i,j).get_attackable()>0){//check if already attacked
                                this.attack(i,j,this.enemies[index])
                                this.get_tower(i,j).decrease_attackable()
                            }
                        }
                    }
                }
            }
        }
        //process dead enemy
        let new_enemies = []
        for(let index in this.enemies){
            if(this.enemies[index].get_health()>0){
                new_enemies.push(this.enemies[index]);
            }else{
                //killed reward
                this.score+=10
                this.money+=1
            }
        }
        this.enemies = new_enemies;
        this.lost_health()//check if lost health

        if(this.enemies.length==0){//clear level
            this.level+=1
            this.init_enemy()
        }




        //restore attackable
        for(let i=0;i<this.board.get_height();i++){
            for(let j=0;j<this.board.get_width();j++){
                if(this.is_tower(i,j)){  
                    if(this.get_tower(i,j).get_attackable()==0){
                        this.get_tower(i,j).increase_attackable()
                    }
                }
            }
        }
    }

    lost_health(){
        let new_enemies=[]
        for(let i=0;i<this.enemies.length;i++){
            if(this.enemies[i].get_x()==55 && this.enemies[i].get_y()==5){
                this.health -= this.enemies[i].get_health();
            }else{
                new_enemies.push(this.enemies[i]);
            }
        }
        this.enemies = new_enemies;
    }

    //let grid(i,j) attack an enemy
    attack(i,j,enemy){
        if(this.is_tower(i,j)){
            if(this.is_in_range(j*10+5,i*10+5,this.get_tower(i,j).get_range(),enemy.get_x(),enemy.get_y())){
                enemy.set_health(enemy.get_health()-this.get_tower(i,j).get_power())
            }
        }
    }

    save_game(save_name){
        let jsonObj = JSON.stringify(this,null,'\t');
        //console.log(jsonObj);

        localStorage.setItem(save_name,jsonObj);

        console.log("Successfully saved!")
    }


    get_all_save_name(){
        return Object.keys(localStorage)
    }


    load_game(key){

        let data = JSON.parse(localStorage.getItem(key))
        this.health = data.health
        this.score = data.score
        this.money = data.money
        this.level = data.level
        this.start_time = data.start_time
        this.time = data.time
        this.board = data.board
        this.enemies = data.enemies
        console.log("Successfully loaded!")
        
    }

}

class Enemy{
    constructor(health=1000,x=5,y=5){
        this.health = health;
        this.x = x
        this.y = y
    }
    
    get_x(){
        return this.x
    }

    get_y(){
        return this.y
    }

    get_health(){
        return this.health
    }

    set_health(health){
        this.health = health
    }

    set_position(x,y){
        this.x = x
        this.y = y
    }
    

}


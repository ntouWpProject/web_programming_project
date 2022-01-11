
class Game {
    constructor() {
        this.health = 1000
        this.score = 0
        this.money = 100
        this.level = 1
        this.break = true
        this.editable = true
        this.start_time = Date.now()
        this.time = 0
        this.board = new Board()
        this.enemies = []

    }

    init() {
        this.board.init();
        this.init_enemy();
    }
    get_health() {
        return this.health
    }


    get_enemies() {
        return this.enemies
    }

    set_enemies(enemies) {
        this.enemies = enemies
    }

    start_round() {
        if (this.editable) {
            this.editable = false
        }
    }

    is_editable() {
        return this.editable
    }

    is_break() {
        return this.break
    }

    pause() {
        this.break = true
    }

    resume() {
        this.break = false
    }

    get_level() {
        return this.level
    }

    is_game_over() {
        if (this.health <= 0) {
            return true
        } else {
            return false
        }
    }

    init_enemy() {
        console.log("level:" + this.level)
        this.enemies = []
        for (let i = 0; i < this.level * 10; i++) {
            this.enemies.push(new Enemy(this.level * 50))
        }
    }

    update_time() {
        this.time = Date.now() - this.start_time
    }


    buy_tower(i, j, type) {
        if (this.money >= 10) {
            this.money -= 10
            this.board.add_tower(i, j, new Tower(type));
        } else {
            console.log("Not enough money!")
        }
    }

    sell_tower(i, j) {
        if (this.is_tower(i, j)) {
            let m = 0
            m += this.get_tower(i, j).get_power()
            m += this.get_tower(i, j).get_range()
            m *= 0.1
            this.money += parseInt(m)
            this.board.remove_tower(i, j)
        } else {
            console.log("This is not a tower!")
        }
    }

    is_tower(i, j) {
        if (this.board.grid[i][j]["tower"] != undefined) {
            return true
        } else {
            return false
        }
    }

    get_tower(i, j) {
        if (this.is_tower(i, j)) {
            return this.board.grid[i][j]["tower"];
        } else {
            console.log("not a tower!");
        }
    }

    upgrade_tower(i, j, type) {

        if (this.is_tower(i, j)) {
            if (this.money > this.get_tower(i, j).get_level() * 5) {
                this.money -= this.get_tower(i, j).get_level() * 5
                if (type == "power") {
                    this.get_tower(i, j).power_up()
                } else if (type == "range") {
                    this.get_tower(i, j).range_up()
                }
            } else {
                console.log("not enough money!")
            }
        } else {
            console.log("not a tower!");
        }
    }

    is_in_range(tower_x, tower_y, range, enemy_x, enemy_y) {
        return Math.sqrt((tower_x - enemy_x) * (tower_x - enemy_x) + (tower_y - enemy_y) * (tower_y - enemy_y)) <= range
    }

    all_tower_attack() {
        for (let index in this.enemies) {//for all enemies
            for (let i = 0; i < this.board.get_height(); i++) {//for all tower
                for (let j = 0; j < this.board.get_width(); j++) {
                    if (this.is_tower(i, j)) {
                        if (this.get_tower(i, j).get_attackable() < 0 || this.get_tower(i, j).get_attackable() > 0) {//check if already attacked
                            this.attack(i, j, this.enemies[index])
                            console.log("enemy "+index+" is attacked");
                            //tower of i,j attack one enemy

                            this.get_tower(i, j).decrease_attackable()
                        }
                    }
                }
            }
        }
        //process dead enemy
        let removed_enemies = [];
        let new_enemies = []
        for (let index in this.enemies) {
            if (this.enemies[index].get_health() > 0) {
                new_enemies.push(this.enemies[index]);
            } else {
                //enemy dead effect can be process here
                removed_enemies.push(this.enemies[index]);

                //killed reward
                this.score += 10
                this.money += 1
            }
        }
        this.enemies = new_enemies;
        removed_enemies.push(...this.lost_health())//check if lost health

        if (this.enemies.length == 0) {//clear level
            this.level += 1
            this.init_enemy()
            this.break = true
            this.editable = true
        }

        //restore attackable
        for (let i = 0; i < this.board.get_height(); i++) {
            for (let j = 0; j < this.board.get_width(); j++) {
                if (this.is_tower(i, j)) {
                    if (this.get_tower(i, j).get_attackable() == 0) {
                        this.get_tower(i, j).increase_attackable()
                    }
                }
            }
        }
        return removed_enemies;
    }

    lost_health() {
        //when enemy reaches the end...
        let new_enemies = []
        let remove = []
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].get_y() < 1 && this.enemies[i].get_x() > 11) {
                this.health -= this.enemies[i].get_health();
                console.log(this.enemies[i].get_health())
                remove.push(this.enemies[i])
            } else {
                new_enemies.push(this.enemies[i]);
            }
        }
        this.enemies = new_enemies;
        return remove
    }

    //let grid(i,j) attack an enemy
    attack(i, j, enemy) {
        if (this.is_tower(i, j)) {
            if (this.is_in_range(j, i, this.get_tower(i, j).get_range(), enemy.get_x(), enemy.get_y()) && enemy.is_visible()) {
                //console.log(enemy)
                //TODO
                //attack effect can be process here

                enemy.set_health(enemy.get_health() - this.get_tower(i, j).get_power())
            } 
        }
    }

    save_game(save_name) {
        let jsonObj = JSON.stringify(this, null, '\t');
        //console.log(jsonObj);

        localStorage.setItem(save_name, jsonObj);

        console.log("Successfully saved!")
    }


    get_all_save_name() {
        return Object.keys(localStorage)
    }


    load_game(key) {

        let data = JSON.parse(localStorage.getItem(key))
        this.health = data.health
        this.score = data.score
        this.money = data.money
        this.level = data.level
        this.start_time = data.start_time
        this.time = data.time
        this.board = data.board
        this.enemies = data.enemies
        this.editable = true
        this.break = true
        console.log("Successfully loaded!")

    }
}

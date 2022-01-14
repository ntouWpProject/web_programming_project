class Enemy {
    constructor(health = 50, x = 0, y = 0) {
        this.health = health;
        this.max_health = health
        this.x = x
        this.y = y
        this.visible = false
        this.is_start = false
        this.is_animation = false
        let geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
        let material = new THREE.MeshPhysicalMaterial({
            color: 0xaaaa22
        })
        this.obj = new THREE.Mesh(geometry, material)
        this.obj.position.set(-5, 0.75, -2)
        this.obj.castShadow = true
        this.obj.receiveShadow = true

    }

    get_max_health() {
        return this.max_health
    }


    is_visible() {
        return this.visible
    }

    get_x() {
        return this.x
    }

    get_y() {
        return this.y
    }

    get_health() {
        return this.health
    }

    set_health(health) {
        this.health = health
    }

    set_position(x, y) {
        this.x = x
        this.y = y
    }


}


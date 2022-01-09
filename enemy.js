class Enemy {
    constructor(health = 1000, x = 0, y = 0) {
        this.health = health;
        this.x = x
        this.y = y
        let geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
        let material = new THREE.MeshPhysicalMaterial({
            color: 0xaaaa22
        })
        this.obj = new THREE.Mesh(geometry, material)
        this.obj.position.set(-5, 0.75, -2)
        this.obj.castShadow = true
        this.obj.receiveShadow = true
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


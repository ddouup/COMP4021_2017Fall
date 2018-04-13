// The point and size class used in this program
function Point(x, y) {
    this.x = (x)? parseFloat(x) : 0.0;
    this.y = (y)? parseFloat(y) : 0.0;
}

function Size(w, h) {
    this.w = (w)? parseFloat(w) : 0.0;
    this.h = (h)? parseFloat(h) : 0.0;
}

// Helper function for checking intersection between two rectangles
function intersect(pos1, size1, pos2, size2) {
    return (pos1.x < pos2.x + size2.w && pos1.x + size1.w > pos2.x &&
            pos1.y < pos2.y + size2.h && pos1.y + size1.h > pos2.y);
}

// Helper function for checking overlapping between two rectangles
function overlap(pos1, size1, pos2, size2) {
    return (pos1.x >= pos2.x - 5 && pos1.x + size1.w <= pos2.x + size2.w + 5 &&
            pos1.y >= pos2.y - 5 && pos1.y + size1.h <= pos2.y + size2.h + 5);
}


// The player class used in this program
function Player() {
    this.node = svgdoc.getElementById("player");
    this.position = PLAYER_INIT_POS;
    this.motion = motionType.NONE;
    this.verticalSpeed = 0;
    this.towards = direction.RIGHT;
}

Player.prototype.isOnPlatform = function() {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        if (node.getAttribute("id") == "vertical_platform"){
            var towards = node.getAttribute("towards");
            if (towards == direction.RIGHT)
                y = y - PLATFORM_SPEED;
            if (towards == direction.LEFT)
                y = y + PLATFORM_SPEED;
        }
        
        if (((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
            ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
            (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
            this.position.y + PLAYER_SIZE.h == y) return true;
    }
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return true;

    return false;
}

Player.prototype.isOnDisappearPlatform = function() {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "line") continue;

        var x1 = parseFloat(node.getAttribute("x1"));
        var y = parseFloat(node.getAttribute("y1")) - 10;
        var x2 = parseFloat(node.getAttribute("x2"));

        if (((this.position.x + PLAYER_SIZE.w > x1 && this.position.x < x2) ||
            ((this.position.x + PLAYER_SIZE.w) == x1 && this.motion == motionType.RIGHT) ||
            (this.position.x == x2 && this.motion == motionType.LEFT)) &&
            this.position.y + PLAYER_SIZE.h == y) {
            if (parseFloat(node.style.getPropertyValue("opacity")) == 1) 
                startDisappear(node);
            return true;
        }

    }
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) {
        if (parseFloat(node.style.getPropertyValue("opacity")) == 1) 
            startDisappear(node);
        return true;
    }
    return false;
}

Player.prototype.collideVerticalPlatform = function(position) {
    var node = svgdoc.getElementById("vertical_platform");
    
    var x = parseFloat(node.getAttribute("x"));
    var y = parseFloat(node.getAttribute("y"));
    var w = parseFloat(node.getAttribute("width"));
    var h = parseFloat(node.getAttribute("height"));
    var towards = node.getAttribute("towards");
    var previous_y = y;
    if (towards == direction.RIGHT)
        previous_y = y - PLATFORM_SPEED;
    if (towards == direction.LEFT)
        previous_y = y + PLATFORM_SPEED;
    var pos = new Point(x, y);
    var size = new Size(w, h);

    if (intersect(position, PLAYER_SIZE, pos, size)) {
        //position.x = this.position.x;
        if (intersect(position, PLAYER_SIZE, pos, size)) {
            if (this.position.y >= previous_y + h)
                position.y = y + h;
            else
                position.y = y - PLAYER_SIZE.h;
            this.verticalSpeed = -3;
        }
    }
}

Player.prototype.collidePlatform = function(position) {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect" && node.nodeName != "line" || 
            node.getAttribute("id") == "vertical_platform") continue;

        if (node.nodeName == "rect"){
            var x = parseFloat(node.getAttribute("x"));
            var y = parseFloat(node.getAttribute("y"));
            var w = parseFloat(node.getAttribute("width"));
            var h = parseFloat(node.getAttribute("height"));
            
        }
        if (node.nodeName == "line"){
            var x = parseFloat(node.getAttribute("x1"));
            var y = parseFloat(node.getAttribute("y1")) - 10;
            var x2 = parseFloat(node.getAttribute("x2"));
            var h = 20;
            var w = x2 - x;
        }

        var pos = new Point(x, y);
        var size = new Size(w, h);

        if (intersect(position, PLAYER_SIZE, pos, size)) {
            position.x = this.position.x;
            if (intersect(position, PLAYER_SIZE, pos, size)) {
                if (this.position.y >= y + h)
                    position.y = y + h;
                else
                    position.y = y - PLAYER_SIZE.h;
                this.verticalSpeed = 0;
            }
        }
    }
}

Player.prototype.collideScreen = function(position) {
    if (position.x < 0) position.x = 0;
    if (position.x + PLAYER_SIZE.w > SCREEN_SIZE.w) position.x = SCREEN_SIZE.w - PLAYER_SIZE.w;
    if (position.y < 0) {
        position.y = 0;
        this.verticalSpeed = 0;
    }
    if (position.y + PLAYER_SIZE.h > SCREEN_SIZE.h) {
        position.y = SCREEN_SIZE.h - PLAYER_SIZE.h;
        this.verticalSpeed = 0;
    }
}


//
// Below are constants used in the game
//
var PLAYER_SIZE = new Size(40, 40);         // The size of the player
var SCREEN_SIZE = new Size(600, 560);       // The size of the game screen
var PLAYER_INIT_POS  = new Point(0, 500);   // The initial position of the player

var MOVE_DISPLACEMENT = 5;                  // The speed of the player in motion
var JUMP_SPEED = 15;                        // The speed of the player jumping
var VERTICAL_DISPLACEMENT = 1;              // The displacement of vertical speed

var GAME_INTERVAL = 25;                     // The time interval of running the game

var BULLET_QUANTITY = 8;                    // The number of bullets at the start of each level
var BULLET_SIZE = new Size(10, 10);         // The speed of a bullet
var BULLET_SPEED = 10.0;                    // The speed of a bullet
                                            //  = pixels it moves each game loop
var SHOOT_INTERVAL = 200.0;                 // The period when shooting is disabled
var MONSTERSHOOT_INTERVAL = 3000.0;

var MONSTER_SIZE = new Size(40, 40);        // The size of a monster
var MONSTER_SPEED = 2;                      // The speed of a monster

var CANDY_SIZE = new Size(20,20);

var PORTAL_SIZE = new Size(40, 40);
var EXIT_SIZE = new Size(40, 40);

var PLATFORM_SPEED = 2;

//
// Variables in the game
//
var motionType = {NONE:0, LEFT:1, RIGHT:2}; // Motion enum
var direction = {LEFT:0, RIGHT:1};

var NAME = null;

var Time = 60;                              //
var Level = 1;
var cheat_mode = false;

var canShoot = true;                        // A flag indicating whether the player can shoot a bullet
var canMonsterShoot = true;
var specialMonsterLive = false;

var svgdoc = null;                          // SVG root document node
var player = null;                          // The player object
var gameInterval = null;                    // The interval
var zoom = 1.0;                             // The zoom level of the screen
var score = 0;                              // The score of the game
var bullets_number = 8;                     // The left bullet
var candies_number = 8;
var monsters_number = 6;

//
// The load function for the SVG document
//
function load(evt) {
    // Set the root node to the global variable
    svgdoc = evt.target.ownerDocument;

    // Attach keyboard events
    svgdoc.documentElement.addEventListener("keydown", keydown, false);
    svgdoc.documentElement.addEventListener("keyup", keyup, false);

    // Remove text nodes in the 'platforms' group
    cleanUpGroup("platforms", true);

    // Create the player
    player = new Player();
    NAME = prompt("What is your name?", "");
    if (NAME == "" || NAME == null)
        NAME = "Anonymous";
    svgdoc.getElementById("nametxt").firstChild.data = NAME;

    svgdoc.getElementById("startingscreen").style.setProperty("visibility", "hidden", null);
    

    // Create the monsters
    createMonsters(monsters_number);

    // Create the candies
    createCandies(candies_number);

    svgdoc.getElementById("vertical_platform").setAttribute("towards", direction.RIGHT);

    BGM = new Audio('bgm.mp3');
    BGM.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    BGM.play();

    // Start the game interval
    timerInterval = setInterval("timeCount()", 1000);
    gameInterval = setInterval("gamePlay()", GAME_INTERVAL);
}

function reload() {
    var monsters = svgdoc.getElementById("monsters");
    for (var i = 0; i < monsters.childNodes.length; i++) {
        var node = monsters.childNodes.item(i);
        monsters.removeChild(node);
        i--;
    }

    svgdoc.getElementById("level").firstChild.data = Level;
    svgdoc.getElementById("score").firstChild.data = score;
    svgdoc.getElementById("timer").firstChild.data = Time;
    if(cheat_mode) svgdoc.getElementById("bullets_number").firstChild.data = "Infinite";
    else svgdoc.getElementById("bullets_number").firstChild.data = bullets_number;

    createDisapperPlatform(200, 70, 400, 70);
    createDisapperPlatform(0, 190, 120, 190);
    createDisapperPlatform(120, 350, 180, 350);
    // Create the monsters
    createMonsters(monsters_number);

    // Create the candies
    createCandies(candies_number);


    player.position = PLAYER_INIT_POS;
    player.motion = motionType.NONE;

    // Start the game interval
    timerInterval = setInterval("timeCount()", 1000);
    gameInterval = setInterval("gamePlay()", GAME_INTERVAL);
}

// Time function
// 
function timeCount() {
    Time--;
    svgdoc.getElementById("timer").firstChild.data = Time+"s";
    if (Time == 0) {
        timerInterval = clearInterval(timerInterval);
        gameover();
    }
}

//
// This function removes all/certain nodes under a group
//
function cleanUpGroup(id, textOnly) {
    var node, next;
    var group = svgdoc.getElementById(id);
    node = group.firstChild;
    while (node != null) {
        next = node.nextSibling;
        if (!textOnly || node.nodeType == 3) // A text node
            group.removeChild(node);
        node = next;
    }
}

function createDisapperPlatform(x1, y1, x2, y2) {
    var platforms = svgdoc.getElementById("platforms");

    // Create a new line element
    var newPlatform = svgdoc.createElementNS("http://www.w3.org/2000/svg", "line");

    // Set the various attributes of the line
    newPlatform.setAttribute("x1", x1);
    newPlatform.setAttribute("y1", y1);
    newPlatform.setAttribute("x2", x2);
    newPlatform.setAttribute("y2", y2);
    newPlatform.setAttribute("type", "disappearing");
    newPlatform.style.setProperty("opacity", 1, null);
    newPlatform.style.setProperty("stroke", "blue", null);
    newPlatform.style.setProperty("stroke-width", 20, null);

    // Add the new platform to the end of the group
    platforms.appendChild(newPlatform);
}
//
// This function creates the monsters in the game
//
function createMonsters(number){
    for (i = 0; i < number; i++){
        
        var x = Math.floor(Math.random() * 560 + 20);
        var y = Math.floor(Math.random() * 440);
        var distance = Math.floor(Math.random() * 460 + 100);
        createMonster(x, y, distance, i);
    }
}
function createMonster(x, y, distance, i) {
    var monster = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    monster.setAttribute("x", x);
    monster.setAttribute("y", y);
    monster.setAttribute("INIT_X", x);
    monster.setAttribute("distance", distance);
    monster.setAttribute("towards", direction.RIGHT);
    monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster");
    if (i == 0){
        monster.setAttribute("id", "SpecialMonster");
        specialMonsterLive = true;
    }
    svgdoc.getElementById("monsters").appendChild(monster);
}


//
// This function creates the candies in the game
//
function createCandies(number){
    for (i = 0; i < number; i++){
        x = Math.floor(Math.random() * 560 + 20);
        y = Math.floor(Math.random() * 520 + 20);
        if (!overlapPlatform(x, y))
            i--;
        else
            createCandy(x, y);
    }
}
function overlapPlatform(cx, cy){
    if (cx <= 100 && cy >= 400) 
        return false;
    if ((cx <= 60 || cx >= 540)&& cy <= 60) 
        return false;
    if (cx >= 540 && cy >= 520) 
        return false;
    position = new Point(cx, cy);
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect" && node.nodeName != "line") continue;

        if (node.nodeName == "rect"){
            var x = parseFloat(node.getAttribute("x"));
            var y = parseFloat(node.getAttribute("y"));
            var w = parseFloat(node.getAttribute("width"));
            var h = parseFloat(node.getAttribute("height"));
            
        }
        if (node.nodeName == "line"){
            var x = parseFloat(node.getAttribute("x1"));
            var y = parseFloat(node.getAttribute("y1")) - 10;
            var x2 = parseFloat(node.getAttribute("x2"));
            var h = 20;
            var w = x2 - x;
        }
        var pos = new Point(x, y);
        var size = new Size(w, h);
        if (intersect(position, CANDY_SIZE, pos, size))
            return false;
    }
    return true;
}
function createCandy(x, y) {
    var candy = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    candy.setAttribute("x", x);
    candy.setAttribute("y", y);
    candy.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#candy");
    svgdoc.getElementById("candies").appendChild(candy);
}


//
// This function shoots a bullet from the player
//
function shootBullet() {
    // Disable shooting for a short period of time
    if (!cheat_mode){
        bullets_number--;
        svgdoc.getElementById("bullets_number").firstChild.data = bullets_number;
    }
    
    canShoot = false;
    if (bullets_number > 0 || cheat_mode)
        setTimeout("canShoot = true", SHOOT_INTERVAL);

    var audio = new Audio('shoot.mp3');
    audio.play();

    // Create the bullet using the use node
    var bullet = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    bullet.setAttribute("x", player.position.x + PLAYER_SIZE.w / 2 - BULLET_SIZE.w / 2);
    bullet.setAttribute("y", player.position.y + PLAYER_SIZE.h / 2 - BULLET_SIZE.h / 2);
    bullet.setAttribute("towards", player.towards);
    bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");
    svgdoc.getElementById("bullets").appendChild(bullet);
}

function monsterShoot() {
    canMonsterShoot = false;

    setTimeout("canMonsterShoot = true", MONSTERSHOOT_INTERVAL);

    specialMonster = svgdoc.getElementById("SpecialMonster");
    var bullet = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    bullet.setAttribute("x", parseInt(specialMonster.getAttribute("x")) + MONSTER_SIZE.w / 2 - BULLET_SIZE.w / 2);
    bullet.setAttribute("y", parseInt(specialMonster.getAttribute("y")) + MONSTER_SIZE.h / 2 - BULLET_SIZE.h / 2);
    bullet.setAttribute("towards", specialMonster.getAttribute("towards"));
    bullet.setAttribute("id", "mbullet");
    bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");
    svgdoc.getElementById("monster_bullet").appendChild(bullet);
}


//
// This is the keydown handling function for the SVG document
//
function keydown(evt) {
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "N".charCodeAt(0):
            player.motion = motionType.LEFT;
            player.towards = direction.LEFT;
            break;

        case "M".charCodeAt(0):
            player.motion = motionType.RIGHT;
            player.towards = direction.RIGHT;
            break;
			
        case "Z".charCodeAt(0):
            if (player.isOnPlatform() || player.isOnDisappearPlatform()) {
                player.verticalSpeed = JUMP_SPEED;
            }
            break;

        case 32:
            if (canShoot) shootBullet();
            break;

        case "C".charCodeAt(0):
            cheat_mode = true;
            svgdoc.getElementById("bullets_number").firstChild.data = "Infinite";
            setTimeout("canShoot = true", SHOOT_INTERVAL);
            break;
        
        case "V".charCodeAt(0):
            cheat_mode = false;
            bullets_number = 8;
            svgdoc.getElementById("bullets_number").firstChild.data = bullets_number;
            break;
    }
}


//
// This is the keyup handling function for the SVG document
//
function keyup(evt) {
    // Get the key code
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "N".charCodeAt(0):
            if (player.motion == motionType.LEFT) player.motion = motionType.NONE;
            break;

        case "M".charCodeAt(0):
            if (player.motion == motionType.RIGHT) player.motion = motionType.NONE;
            break;
    }
}


//
// This function checks collision
//
function collisionDetection() {
    // Check whether the player collides with a monster if is not in cheat mode
    var monsters = svgdoc.getElementById("monsters");
    if (!cheat_mode){
        for (var i = 0; i < monsters.childNodes.length; i++) {
            var monster = monsters.childNodes.item(i);
            var x = parseInt(monster.getAttribute("x"));
            var y = parseInt(monster.getAttribute("y"));

            if (intersect(new Point(x, y), MONSTER_SIZE, player.position, PLAYER_SIZE))
                gameover();
        }
    }

    // Check whether the player collides with the monster bullet if is not in cheat mode
    if (!cheat_mode){
    var monster_bullet = svgdoc.getElementById("monster_bullet");
    for (var i = 0; i < monster_bullet.childNodes.length; i++) {
            var mbullet = monster_bullet.childNodes.item(i);
            var x = parseInt(mbullet.getAttribute("x"));
            var y = parseInt(mbullet.getAttribute("y"));

            if (intersect(new Point(x, y), BULLET_SIZE, player.position, PLAYER_SIZE))
                gameover();
        }
    }

    
    // Check whether a bullet hits a monster
    var bullets = svgdoc.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var bullet = bullets.childNodes.item(i);
        var x = parseInt(bullet.getAttribute("x"));
        var y = parseInt(bullet.getAttribute("y"));

        for (var j = 0; j < monsters.childNodes.length; j++) {
            var monster = monsters.childNodes.item(j);
            var mx = parseInt(monster.getAttribute("x"));
            var my = parseInt(monster.getAttribute("y"));

            if (intersect(new Point(x, y), BULLET_SIZE, new Point(mx, my), MONSTER_SIZE)) {
                var audio = new Audio('monster_die.mp3');
                audio.play();

                if (j == 0)
                    specialMonsterLive = false;
                monsters.removeChild(monster);
                j--;
                bullets.removeChild(bullet);
                i--;

                score += 20;
                svgdoc.getElementById("score").firstChild.data = score;
            }
        }
    }
}

//
// This function checks overlapping
// 
function overlappingDetection() {
    // Check whether the player overlaps with a candy
    var candies = svgdoc.getElementById("candies");
    for (var i = 0; i < candies.childNodes.length; i++) {
        var candy = candies.childNodes.item(i);
        var x = parseInt(candy.getAttribute("x"));
        var y = parseInt(candy.getAttribute("y"));

        if (intersect(new Point(x, y), CANDY_SIZE, player.position, PLAYER_SIZE)){
            candies.removeChild(candy);
            i--;
            candies_number--;

            score += 20;
            svgdoc.getElementById("score").firstChild.data = score;
        }
    }

    // Check whether the player overlaps with a portal
    var portal_1 = svgdoc.getElementById("portal_1");
    var x1 = parseInt(portal_1.getAttribute("x"));
    var y1 = parseInt(portal_1.getAttribute("y"));

    var portal_2 = svgdoc.getElementById("portal_2");
    var x2 = parseInt(portal_2.getAttribute("x"));
    var y2 = parseInt(portal_2.getAttribute("y"));

    if (overlap(player.position, PLAYER_SIZE, new Point(x1, y1), PORTAL_SIZE)){
        player.position = new Point(x2-10, y2);
    }

    if (overlap(player.position, PLAYER_SIZE, new Point(x2, y2), PORTAL_SIZE)){
        player.position = new Point(x1+10, y1);
    }


    // Check whether the player overlaps with the exit
    var exit = svgdoc.getElementById("exit");
    var ex = parseInt(exit.getAttribute("x"));
    var ey = parseInt(exit.getAttribute("y"));

    if (overlap(player.position, PLAYER_SIZE, new Point(ex, ey), EXIT_SIZE) && candies_number == 0){
        var audio = new Audio('levelup.mp3');
        audio.play();
        confirm("Congratulations! Level Up!");
        levelup();
    }

}
//
// This function updates disappearing platforms
// 
function startDisappear(platform) {
    var disappearInterval = setInterval(function (){disapperPlatform(platform, disappearInterval);}, 10)
}

function disapperPlatform(platform, disappearInterval){
        var platformOpacity = parseFloat(platform.style.getPropertyValue("opacity"));

        if (platformOpacity != 0){
            platformOpacity -= 0.05;
            platform.style.setProperty("opacity", platformOpacity, null);
        }

        if (platformOpacity == 0){
            clearInterval(disappearInterval);
            if (platform != null)
                platform.parentNode.removeChild(platform);
        }
}
//
// This function updates the position of the vertical platform
//
function movePlatform() {
    var vertical_platform = svgdoc.getElementById("vertical_platform");
    // Update the position of the vertical_platform
    var y = parseInt(vertical_platform.getAttribute("y"));
    var towards = vertical_platform.getAttribute("towards");
    if (towards == direction.RIGHT)
        vertical_platform.setAttribute("y", y + PLATFORM_SPEED);
    if (towards == direction.LEFT)
        vertical_platform.setAttribute("y", y - PLATFORM_SPEED);

    if (y <= 260)
        vertical_platform.setAttribute("towards", direction.RIGHT);
    if (y >= 340)
        vertical_platform.setAttribute("towards", direction.LEFT);
}

//
// This function updates the position of the monsters
//
function moveMonsters() {
    // Go through all monsters
    var monsters = svgdoc.getElementById("monsters");
    for (var i = 0; i < monsters.childNodes.length; i++) {
        var node = monsters.childNodes.item(i);
        
        // Update the position of the bullet
        var x = parseInt(node.getAttribute("x"));
        var y = parseInt(node.getAttribute("y"));
        var INIT_X = parseInt(node.getAttribute("INIT_X"));
        var distance = parseInt(node.getAttribute("distance"));
        var towards = node.getAttribute("towards");

        if (x <= 20 || x <= INIT_X - distance)
            node.setAttribute("towards", direction.RIGHT);
        if (x >= 540 || x >= INIT_X + distance)
            node.setAttribute("towards", direction.LEFT);

        if (towards == direction.RIGHT)
            node.setAttribute("x", x + MONSTER_SPEED);
            node.removeAttribute("transform");
        if (towards == direction.LEFT){
            node.setAttribute("x", x - MONSTER_SPEED);
            node.setAttribute("transform", "translate(" + (x + PLAYER_SIZE.w) + "," + y + ") scale(-1,1) translate(" + -x + "," + -y + ")");
        }
    }
}

//
// This function updates the position of the bullets
//
function moveBullets() {
    // Go through all bullets
    var bullets = svgdoc.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var node = bullets.childNodes.item(i);
        
        // Update the position of the bullet
        var x = parseInt(node.getAttribute("x"));
        var towards = node.getAttribute("towards");
        if (towards == direction.RIGHT)
            node.setAttribute("x", x + BULLET_SPEED);
        if (towards == direction.LEFT)
            node.setAttribute("x", x - BULLET_SPEED);

        // If the bullet is not inside the screen delete it from the group
        if (x > SCREEN_SIZE.w || x < 0) {
            bullets.removeChild(node);
            i--;
        }
    }
    var monster_bullet = svgdoc.getElementById("monster_bullet");
    for (var i = 0; i < monster_bullet.childNodes.length; i++) {
        var mbullet = monster_bullet.childNodes.item(i);
            
        // Update the position of the bullet
        var x = parseInt(mbullet.getAttribute("x"));
        var towards = mbullet.getAttribute("towards");
        if (towards == direction.RIGHT)
            mbullet.setAttribute("x", x + BULLET_SPEED);
        if (towards == direction.LEFT)
            mbullet.setAttribute("x", x - BULLET_SPEED);
        // If the bullet is not inside the screen delete it from the group
        if (x > SCREEN_SIZE.w || x < 0) {
            monster_bullet.removeChild(mbullet);
        }
    }
}
    
function levelup() {
    gameInterval = clearInterval(gameInterval);
    timerInterval = clearInterval(timerInterval);

    score = score + Level*100 + 2*Time;
    Time = 60;
    Level++;
    monsters_number = 2 + 4*Level;
    bullets_number = 8;
    candies_number = 8;

    reload();
}

function restart() {
    gameInterval = clearInterval(gameInterval);
    timerInterval = clearInterval(timerInterval);

    var candies = svgdoc.getElementById("candies");
    for (var i = 0; i < candies.childNodes.length; i++) {
        var node = candies.childNodes.item(i);
        candies.removeChild(node);
        i--;
    }

    score = 0;
    Time = 60;
    Level = 1;
    monsters_number = 2 + 4*Level;
    bullets_number = 8;
    candies_number = 8;

    NAME = prompt("What is your name?", NAME);
    if (NAME == "" || NAME == null)
        NAME = "Anonymous";
    svgdoc.getElementById("nametxt").firstChild.data = NAME;

    svgdoc.getElementById("highscoretable").style.setProperty("visibility", "hidden", null);

    reload();
}

function gameover() {
    // Clear the game interval
    clearInterval(gameInterval);
    clearInterval(timerInterval);

    var audio = new Audio('lose.mp3');
    audio.play();

    // Delete high score table in svg
    var highscoretext = svgdoc.getElementById("highscoretext");
    for (var i = 0; i < highscoretext.childNodes.length; i++) {
        var node = highscoretext.childNodes.item(i);
        highscoretext.removeChild(node);
        i--;
    }

    svgdoc.getElementById("yourscoretext").firstChild.data = score;
    // Get the high score table from cookies
    table = getHighScoreTable();

    confirm("Sorry you lose :(");
    var record = new ScoreRecord(NAME, score);

    // Insert the new score record
    var pos = table.length;
    for (var i = 0; i < table.length; i++) {
        if (record.score > table[i].score) {
            pos = i;
            break;
        }
    }
    table.splice(pos, 0, record);

    // Store the new high score table
    setHighScoreTable(table);

    // Show the high score table
    showHighScoreTable(table);

    return;
}
//
// This function updates the position and motion of the player in the system
//
function gamePlay() {
    // Check overlappings
    overlappingDetection();

    // Check collisions
    collisionDetection();

    // Check whether the player is on a platform
    var isOnPlatform = (player.isOnPlatform() || player.isOnDisappearPlatform());
    
    // Update player position
    var displacement = new Point();

    // Move left or right
    if (player.motion == motionType.LEFT)
        displacement.x = -MOVE_DISPLACEMENT;
    if (player.motion == motionType.RIGHT)
        displacement.x = MOVE_DISPLACEMENT;

    // Fall
    if (!isOnPlatform && player.verticalSpeed <= 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
    }

    // Jump
    if (player.verticalSpeed > 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
        if (player.verticalSpeed <= 0)
            player.verticalSpeed = 0;
    }

    // Get the new position of the player
    var position = new Point();
    position.x = player.position.x + displacement.x;
    position.y = player.position.y + displacement.y;

    // Check collision with platforms and screen
    player.collidePlatform(position);
    player.collideVerticalPlatform(position);
    player.collideScreen(position);

    // Set the location back to the player object (before update the screen)
    player.position = position;

    // Move the monsters
    moveMonsters();
    if (canMonsterShoot&&specialMonsterLive) monsterShoot();

    // Move the bullets
    moveBullets();

    // Move the platform
    movePlatform();
    
    updateScreen();
}


//
// This function updates the position of the player's SVG object and
// set the appropriate translation of the game screen relative to the
// the position of the player
//
function transformPlayer() {
    // Transform the player
    if (player.towards == direction.RIGHT)
        player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");
        svgdoc.getElementById("name").removeAttribute("transform");
    if (player.towards == direction.LEFT){
        player.node.setAttribute("transform", "translate(" + (player.position.x + PLAYER_SIZE.w) + "," + player.position.y + ") scale(-1,1)");
        svgdoc.getElementById("name").setAttribute("transform", "translate(" + PLAYER_SIZE.w + "," + "0) scale(-1,1)");
    }
}
function updateScreen() {
    transformPlayer();

    // Calculate the scaling and translation factors	
    var scale = new Point(zoom, zoom);
    var translate = new Point();
    
    translate.x = SCREEN_SIZE.w / 2.0 - (player.position.x + PLAYER_SIZE.w / 2) * scale.x;
    if (translate.x > 0) 
        translate.x = 0;
    else if (translate.x < SCREEN_SIZE.w - SCREEN_SIZE.w * scale.x)
        translate.x = SCREEN_SIZE.w - SCREEN_SIZE.w * scale.x;

    translate.y = SCREEN_SIZE.h / 2.0 - (player.position.y + PLAYER_SIZE.h / 2) * scale.y;
    if (translate.y > 0) 
        translate.y = 0;
    else if (translate.y < SCREEN_SIZE.h - SCREEN_SIZE.h * scale.y)
        translate.y = SCREEN_SIZE.h - SCREEN_SIZE.h * scale.y;
            
    // Transform the game area
    svgdoc.getElementById("gamearea").setAttribute("transform", "translate(" + translate.x + "," + translate.y + ") scale(" + scale.x + "," + scale.y + ")");	
}


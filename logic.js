//variable declaration and initialization
let board;
let score = 0;
let rows = 4;
let columns = 4;

//These variables will be used to monitor if the user already won in the value of 2048, 4096, or 8192
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

//declaring variable for touch input
let startX = 0;
let startY = 0;

//function to set the game board
function setGame(){

    //initializes the 4x4 game board with all tiles set to 0.
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for(let r=0; r<rows; r++){
        for(let c=0; c<columns; c++){

            //this is to create a tile through creating div elements
            let tile = document.createElement("div");

            //each tile will have an id based on its row position and column position.
            //Imagine students in a room who are given an id, but their id number is based on their set row and column position.
            tile.id = r.toString() + "-" + c.toString();

            //get the number of a tile from th backend board
            let num = board[r][c];

            //using the number to update the tile's appearance through updateTile() function
            updateTile(tile, num);

            //Add the created tile with id to the frontend game board.
            document.getElementById("board").append(tile);
        }
    }

    setTwo();
    setTwo();
}


//this function is used to update the appearance of the tile based on its number
function updateTile(tile, num){
    tile.innerText="";
    tile.classList.value="";

    tile.classList.add("tile");

    if(num > 0){
        // This will display the number of the tile 
        tile.innerText = num.toString();
           
        if (num <= 4096){
             tile.classList.add("x"+num.toString());
        } 
        else {
            // Then if the num value is greater than 4096, it will use class x8192 to color the tile
            tile.classList.add("x8192");
        }
    }

}

window.onload = function(){
    setGame();

}

function handleSlide(e){ 
    console.log(e.code); //prints out the key that is being pressed

    if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){
        if(e.code == "ArrowLeft"){
            slideLeft();
            setTwo();
        }
        else if(e.code == "ArrowRight"){
            slideRight();
            setTwo();
        }
        else if(e.code == "ArrowUp"){
            slideUp();
            setTwo();
        }
        else if(e.code == "ArrowDown"){
            slideDown();
            setTwo();
        }
    }

    document.getElementById("score").innerText = score;

    setTimeout(() => {
		checkWin();
	}, 2000);

    if(hasLost() == true){
        setTimeout(() => {
            alert("Game Over! Sayang lods 🥺. Better luck next time");
            restartGame();
            alert("Click any arrow key to restart");
        }, 100) //setTimeout is used to delay 
    }
}

document.addEventListener("keydown", handleSlide);

//This function removes the zeroes from the cols and rows
function filterZero(row){
    return row.filter(num => num != 0);
}

//slide function is the one merging the adjacent tiles
function slide(row){
    row = filterZero(row);

    for(let i = 0; i < row.length - 1; i++){
        if(row[i] == row[i+1]){ // checks if a tile is equal to its adjacent tile
            row[i] *= 2; //merge - doubles the first tile to merge
            row[i+1] = 0;

            //this adds the merged tiles into the scores
            score += row[i];
        }
    }
    row = filterZero(row);

    // Add zeroes on the back after merging
	while(row.length < columns){
		row.push(0); //[4, 0, 0, 0]
	}

	return row; //submits the updated row or cols
}

function slideLeft(){
    for(let r = 0; r < rows; r++){
        let row = board[r];
        
        //Line for animation
        let originalRow = row.slice();
        row = slide(row); //we use the slide function so that the slide function will merge the adjacent tiles.
        board[r] = row;
        
        //after merging, the position and value of the tiles might change, thus it follows that the id, number, color of the tile must be changed.
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            

            //Line for animation 
            if(originalRow[c] !== num && num !== 0){//if the original tile is not equal to the current tile, apply animation 
                tile.style.animation = "slide-from-right 0.3s";//applies animation

                //removes the animation class after the animation is complete
            	setTimeout(() => {

            		tile.style.animation = "";
            		
            	}, 300);
            }
            updateTile(tile, num);
        }
    }
}

function slideRight(){
    for(let r = 0; r < rows; r++){
        let row = board[r];

         //Line for animation
         //this documents the original position of the tile 
        let originalRow = row.slice();

        row.reverse();
        row = slide(row); //we use the slide function so that the slide function will merge the adjacent tiles.
        row.reverse();
        board[r] = row;
        
        //after merging, the position and value of the tiles might change, thus it follows that the id, number, color of the tile must be changed.
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            //Line for animation 
            if(originalRow[c] !== num && num !== 0){//if the original tile is not equal to the current tile, apply animation 
                tile.style.animation = "slide-from-left 0.3s";//applies animation

                //removes the animation class after the animation is complete
            	setTimeout(() => {

            		tile.style.animation = "";
            		
            	}, 300);
            }
            updateTile(tile, num);
        }
    }
}

function slideUp(){
    for(let c = 0; c < columns; c++){
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
       
        //Line for animation
        //this documents the original position of the tile 
        let originalCol = col.slice();

        col = slide(col);

        let changedIndices = [];
        for(let r = 0; r < rows; r++){
            if(originalCol[r] !== col[r]){
                changedIndices.push(r);
            }
        }

        //after merging, the position and value of the tiles might change, thus it follows that the id, number, color of the tile must be changed.
        for(let r = 0; r < rows; r++){
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

              //Line for animation 
              if(changedIndices.includes(r) && num !== 0){
                tile.style.animation = "slide-from-bottom 0.3s";//applies animation

                //removes the animation class after the animation is complete
            	setTimeout(() => {

            		tile.style.animation = "";
            		
            	}, 300);
            }
            updateTile(tile, num);
        }
    }
}

function slideDown(){
    for(let c = 0; c < columns; c++){
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

        //Line for animation
        //this documents the original position of the tile 
        let originalCol = col.slice();


        col.reverse();
        col = slide(col);
        col.reverse();

        let changedIndices = [];
        for(let r = 0; r < rows; r++){
            if(originalCol[r] !== col[r]){
                changedIndices.push(r);
            }
        }

        //after merging, the position and value of the tiles might change, thus it follows that the id, number, color of the tile must be changed.
        for(let r = 0; r < columns; r++){
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

              //Line for animation 
            if(changedIndices.includes(r) && num !== 0){
                tile.style.animation = "slide-from-top 0.3s";//applies animation

                //removes the animation class after the animation is complete
            	setTimeout(() => {

            		tile.style.animation = "";
            		
            	}, 300);
            }
            updateTile(tile, num);
        }
    }
}

function hasEmptytile(){
    for (let r=0; r<rows; r++){
        for(let c = 0; c < columns; c++){
            if(board[r][c] == 0){
                return true;
            }
        }
    }

    return false;
}

function setTwo(){
    if(hasEmptytile() == false){
        return
    }

    //these codes is for generating the random 2
    let found = false;

    while (found == false){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if(board[r][c] == 0){
            //generate new tile
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

//this function checks if we already have 2048, 4096, or 8192 in our tiles to prompt a window alert congratulating the player
function checkWin(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if(board[r][c] == 2048 & is2048Exist == false){
                alert("You win! You got 2048! Lopit mo idolz")
                is2048Exist = true;
            }
            else if(board[r][c] == 4096 & is4096Exist == false){
                alert("You win! You got 4096! Kaya lodi kita e!")
                is4096Exist = true;
            }
            else if(board[r][c] == 8192 & is8192Exist == false){
                alert("You win! You got 8192! ANGAS MO TALAGA LODSSSS!")
                is8192Exist = true;
            }
        }
    }
}

//this function will check if there is still an empty tile (meaning, there is still a possible move) and it will check if there are similar tile beside it. Meaning there is still a possible move
function hasLost(){

    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            
           //This function
            if(board[r][c] == 0){
                return false;
            }
            const currentTile = board[r][c];

             //This code will check if there are two adjacent tiles. 
            if(
                //check current tile if it has possible merge to its upper tile
                r > 0 && board[r-1][c] === currentTile || 

                //check current tile if it has possible merge to its lower tile
                r < rows - 1 && board[r + 1][c] === currentTile || 

                //check current tile if it has possible merge to its left
                c > 0 && board[r][c-1] === currentTile ||
                
                //check current tile if it has possible merge to its right
                c < rows - 1 && board[r][c + 1] === currentTile){ 
                
                //if we found an adjacent tile with the same value as the current tile, false, the title has not lost
                return false;
            }
        }
    } 
    
    //No empty tile and no possible moves left (meaning, true, the user already lost)
    return true;

}

function restartGame(){
    for(let r = 0; r< rows; r++){
        for(let c = 0; c < columns; c++){
            board[r][c] = 0;
        }
    }

    score = 0;
    setTwo();
}

//this code will listen when we touch the screen and assigns the x and y coordinates of that touch/event
// it inputs the x coordinate value to the startX and y corrdinate to startY value to startY
document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY
});

document.addEventListener('touchmove', (e) =>{
    if(!e.target.className.includes("tile")){
        return
    }

    //to disable scrolling feature
    e.preventDefault();
}, {passive: false}); //Use passive property to make sure that the preventDefault() will work


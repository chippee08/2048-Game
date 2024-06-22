//variable declaration and initialization
let board;
let score = 0;
let rows = 4;
let columns = 4;


//function to set the game board
function setGame(){

    //initializes the 4x4 game board with all tiles set to 0.
    board = [
        [0, 2, 2, 0],
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
        }
        else if(e.code == "ArrowRight"){
            slideRight();
        }
        else if(e.code == "ArrowUp"){
            slideUp();
        }
        else if(e.code == "ArrowDown"){
            slideDown();
        }
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
        row = slide(row); //we use the slide function so that the slide function will merge the adjacent tiles.
        board[r] = row;
        
        //after merging, the position and value of the tiles might change, thus it follows that the id, number, color of the tile must be changed.
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight(){
    for(let r = 0; r < rows; r++){
        let row = board[r];
        row.reverse();
        row = slide(row); //we use the slide function so that the slide function will merge the adjacent tiles.
        row.reverse();
        board[r] = row;
        
        //after merging, the position and value of the tiles might change, thus it follows that the id, number, color of the tile must be changed.
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

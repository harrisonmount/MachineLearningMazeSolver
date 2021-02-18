let table;

var cols, rows;
var mazesize = 20;
var blockAmt = 20;
var buffersize = 3;
var w = 400/mazesize; //cell width in pixels to build graphics and size of cells array
var grid = [];
var mostvisits = 0; //for calculating heatmap changes
var leastvisits = 0; //" "

var default_reward = 100;
var discount_factor = 0.25;
var win_reward = 1000;
var greedvalue = 0.25;
var completionreward = 1;

var randomspawn = false;

var stepcounter = 0;
var iterationcounter = 0;
var generations = 1500;

var endgame = false;

var current; //currently visted cell
var goalcell;//goalcell - ideally bottom right corner
var setupblock;//placeholder used to changed open cells into blocks or buffer

var run = [];//a stack of cells used to track an iterations path - used to place rewards when current reaches goal
var runset = []; //a set to get rid of repeat values in run[]
var rewardupdater; //used to cycle though a run and place rewards on each cell depending on visted amount

function setup()
{
  createCanvas(400,400);
  cols = floor(width / w);
  rows = floor(height / w);

  //frameRate(10);

  //initialize cell objects into grid array using row and column count
  for(var j = 0; j < rows; j++)
  {
    for (var i = 0; i < cols; i++)
    {
      var cell = new Cell(i,j);
      grid.push(cell);
    }
  }


  current = grid[0]//initialize current position at start of program

  goalcell = grid[(grid.length)-1];
  //goalcell = grid[(grid.length)-cols];
  //goalcell = grid[((grid.length)/2)-floor(mazesize/2)];
  //BUFFER BLOCKS
  //Setting the end tile
  //setupblock = grid[(grid.length)-1];
  //setupblock = grid[((grid.length)/2)-floor(mazesize/2)];
  goalcell.reward = win_reward;

  goalcell.buffer = true;
  goalcell.isend = true;

  //noLoop();

  //setting buffer for end section - this buffer extends two cells vertically and horizontally and 1 cell diagonally so no blocks can be placed
  for(var x = buffersize-1; x > 0; x--) // generates the random block positions using blockAmt
  {
    setupblock = grid[grid.length-1-x]; //horizontal spacing
    setupblock.buffer = true;

    setupblock = grid[grid.length-1-(x*rows)];//vertical spacing
    setupblock.buffer = true;
  }
  setupblock = grid[grid.length-2-rows];//spacing for diagonal block
  setupblock.buffer = true;
  //End setup end tile

  //Setting the start environment (giving it room to move) assuming top left
  for(var x = 0; x < buffersize; x++) // generates the random block positions using blockAmt
  {
    setupblock = grid[x]; //horizontal spacing
    setupblock.buffer=true;

    setupblock = grid[rows*x];//vertical spacing
    setupblock.buffer=true;
  }
  setupblock = grid[rows+1];
  setupblock.buffer=true;
  //END BUFFER BLOCKS

  for(var x = 0; x < blockAmt; x++) // generates the random block positions using blockAmt
  {
    setupblock = grid[floor(random(0,grid.length-1))];
    if(setupblock.buffer || setupblock.isblock)//if the chosen random cell is already a white block or a buffer block
    {
      blockAmt++; //increment blockAmt so all random blocks can be placed
    }
    else //block placement location is valid = change isblock value to true
    {
      setupblock.isblock = true;
    }
  }

  table = new p5.Table();

  table.addColumn('iteration');
  table.addColumn('steps');
}

function draw()
{
  if(endgame == false)
  {
    background(51);
    for (var i = 0; i < grid.length; i++)
    {
      grid[i].show();
    }

    fill("white");
    textSize(20);
    text("iteration: " + iterationcounter,250,18);

    //noLoop();
    current.visited = true;
    current.totalvisits++;//increments total steps for each tile
    current.visitcount++;
    stepcounter++;//total steps to go to end tile
    run.push(current);//add current cell to run array to distribute rewards after
    //print(run.length);
    //increases most visted counter for heatmap graphics
    if(current.totalvisits > mostvisits)
    {
      mostvisits = current.totalvisits;
    }

    current.highlight();//makes current tile have yellow square

    var nextcell = current.randommove();
    //nextcell.highlightbacktrack();
    if(current.reward == default_reward)
    {
      current.reward = 0;
    }
    else
    {
        current.reward = current.reward - discount_factor;
    }

    current = nextcell;

    if(goalcell.visited == true)
    {
      if(randomspawn)
      {
        current = grid[floor(random(0,grid.length-1))];//place starting cell at random point
      }
      else
      {
        current = grid[0];
      }
      while(current.isblock)
      {
        print("current is a block!");
        current = grid[floor(random(0,grid.length-1))];
      }
      goalcell.visited = false;

      let runset = [...new Set(run)];
      run = [];
      print(runset.length);
      for(var i = runset.length; i > 0; i--)
      {
        rewardupdater = runset.pop();
        if(rewardupdater.rewarded == true)
        {
          print("reward true");
          //doesnt reward
        }
        else
        {
          print("reward updated");
          rewardupdater.reward += completionreward;
        }
        //print("run");
      }
      iterationcounter++;
      //print("Iteration: "+ iterationcounter+" Steps: "+ stepcounter);
      //print(leastvisits);


      //adds content to table
      let newRow = table.addRow();
      newRow.setNum('iteration', iterationcounter);
      newRow.setNum('steps', stepcounter);

      //resest values for new iteration
      stepcounter = 0;
      for (var i = 0; i < grid.length; i++)
      {
        grid[i].visited = false;
        grid[i].visitcount = 0;
        grid[i].rewarded = false;
      }
      if(iterationcounter == generations)//ends the game and saves a CSV file
      {
        saveTable(table, 'new.csv');
        endgame = true;
      }
    }
    /*
    if(nextcell) //if a neighbor exists move the current position to next cell
    {
      nextcell.visited = true;//might be redundant
      //STEP 2
      stack.push(current);

      //STEP 3

      removeWalls(current,nextcell);

      //STEP 4
      current = nextcell;
    }
    else if (stack.length > 0)
    {
      current = stack.pop(); //backtracks through the neighbors stack
      current.highlightbacktrack();
      //print("Backtrack @: (" + current.i +", "+ current.j+")");
    }
    else //ENDSTATE
    {
      stroke("red");
      fill("red");
      text("DONE", 200, 200);
      noLoop();

    }*/
  }

}

function index(i, j)// column to row conversion for 1D array
{
  if (i < 0 || j < 0 || i > cols-1 || j > rows-1) //checks edge case senarios
  {
    return -1;//return -1 if cell does not exist
  }
  return i + j * cols;//basically creates a 2D array navigation
}

function Cell(i, j)
{
  this.i = i;
  this.j = j;
  this.reward = default_reward;
  this.nextmove = [100,100,100,100]; //array to display 4 walls of cell (top, rigtht, bot, left)
  this.visted = false; //initialized cells always are not visited
  this.isblock = false; // block cell boolean
  this.buffer = false;//sets buffer blocks for setup
  this.isend = false;
  this.rewarded = false;
  this.totalvisits = 0;
  this.visitcount = 0;

  /*this.checkNeighbors = function()
  {
    var neighbors = []; //array of neighbors that havent been visited, an element is added if the nearby cell hasnt been visited

    var top = grid[index(i, j-1)];
    var right = grid[index(i+1, j)];
    var bot = grid[index(i, j+1)];
    var left = grid[index(i-1, j)];

    if(top && !top.isblock) //if cell ontop is not visited yet
    {
      neighbors.push(top);//add cell to available neighbors array
    }
    if(right && !right.isblock)
    {
      neighbors.push(right);
    }
    if(bot && !bot.isblock)
    {
      neighbors.push(bot);
    }
    if(left && !left.isblock)
    {
      neighbors.push(left);
    }

    if(neighbors.length > 0)//picks a random existing neighbor for "current" to visit
    {
      var r = floor(random(0,neighbors.length));
      return neighbors[r];
    }
    else
    {
      return undefined;
    }
  }*/

  /*this.movecursor = function()
  {
    var nextcursor = [];

    var top = grid[index(i, j-1)];
    var right = grid[index(i+1, j)];
    var bot = grid[index(i, j+1)];
    var left = grid[index(i-1, j)];
    var standstill = grid[index(i,j)];

    var direction = keyPressed();

    nextcursor.push(standstill);
    if(keyIsDown(DOWN_ARROW)&& bot && !bot.isblock)
    {
      nextcursor.push(bot);
    }
    if(keyIsDown(UP_ARROW)&& top && !top.isblock)
    {
      nextcursor.push(top);
    }
    if(keyIsDown(RIGHT_ARROW)&& right && !right.isblock)
    {
      nextcursor.push(right);
    }
    if(keyIsDown(LEFT_ARROW)&& left && !left.isblock)
    {
      nextcursor.push(left);
    }

    if (nextcursor.length > 1)
    {
      return nextcursor[1];
    }
    else
    {
      return nextcursor[0];//standstill
    }
  }*/

  this.randommove = function()
  {
    var neighbors = [];

    var top = grid[index(i, j-1)];
    var right = grid[index(i+1, j)];
    var bot = grid[index(i, j+1)];
    var left = grid[index(i-1, j)];

    /*
    var topnextreward;
    var rightnextreward;
    var botnextreward;
    var leftnextreward;
    */
    if(top && !top.isblock) //if cell ontop is not visited yet
    {
      topnextreward = top.reward;
      neighbors.push(top);//add cell to available neighbors array
      //print("top");
    }
    if(right && !right.isblock)
    {
      rightnextreward = right.reward;
      neighbors.push(right);
      //print("right")
    }
    if(bot && !bot.isblock)
    {
      botnextreward = bot.reward;
      neighbors.push(bot);
      //print("bot")
    }
    if(left && !left.isblock)
    {
      leftnextreward = left.reward;
      neighbors.push(left);
      //print("left");
    }

    //print(" ");

    if(neighbors.length > 0)//picks a random existing neighbor for "current" to visit
    {
      /*
      var r = floor(random(0,neighbors.length));
      return neighbors[r];*/

      //determine best option
      var bestchoice = []; //array of indicies from the highest values of neighbors
      bestchoice = indexOfMax(neighbors);//array of indicies of the hightest values in neighbors

      var g = floor(random(0,bestchoice.length));//chooses a random number based of best choice length

      //if (bestchoice.length)
      var decision = (1-greedvalue) > (random(0,1));
      //print(decision);
      if(decision)
      {
        //expoitation - choose highest reward val
        return neighbors[bestchoice[g]]; //returns the random index of best choice to be used for next position
      }
      else
      {
        //exploration - remove best option and choose random option from remaining list
        neighbors.splice[bestchoice[g]];//remove best option
        var r = floor(random(0, neighbors.length));
        print("random");
        return neighbors[r];
      }
    }
    else
    {
      return undefined;
    }
  }


  this.highlight=function() //displays current cell position
  {
    var x = this.i*w;
    var y = this.j*w;
    noStroke();
    fill("yellow");
    rect(x+(w/4),y+(w/4),w/2,w/2);
  }

  this.highlightbacktrack = function()
  {
    var x = this.i*w;
    var y = this.j*w;
    noStroke();
    fill("orange");
    rect(x,y,w,w);
  }

  this.show = function()
  {
    var x = this.i*w;
    var y = this.j*w;

    //creates white lines
    stroke(255);
    line(x    ,y    ,x + w,y    );
    line(x + w,y    ,x + w,y + w);
    line(x + w,y + w,x    ,y + w);
    line(x    ,y + w,x    ,y    );

    if (this.isblock) //prints the white block
    {
      noStroke();
      fill("white");
      rect(x,y,w,w);
    }
    if (this.totalvisits > 0) //fills in heatmap when visted is true
    {
        noStroke();
        leastvisits = minval(grid);
        var colors = heatmap(this.totalvisits, mostvisits, leastvisits);

        fill(colors[0],colors[1],colors[2]);
        rect(x,y,w,w);
        fill("black");
        //text(this.reward,x+10,y+20);
        //text(this.totalvisits,x+10,y+40);

    }
    if (this.isend) //prints end block
    {
      //noStroke();
      //fill("green");
      //rect(x+(w/4),y+(w/4),w/2,w/2);
    }
  }
}

function keyPressed() //returns a number correlating to direction cursor moves
{
  switch (keyCode)
  {
    case 74:
      return 'left';
      break;
    case 76:
      return 'right';
      break;
    case 73:
      return 'up';
      break;
    case 75:
      return 'down';
      break;
  }
}

function heatmap(count, maxval,minval)
{
  var heatmap = [];

  if (count < (maxval/2))
  {
    heatmap[0] = 0;
    heatmap[1] = ceil((255/((maxval/2)-minval)) * (count-minval));
    heatmap[2] = floor(255 + (-255/((maxval/2)-minval)) * (count-minval));
  }
  else
  {
    heatmap[0] = ceil(255/(maxval-(maxval/2))*(count-(maxval/2)));
    heatmap[1] = ceil(255 + (-255/(maxval - (maxval/2))) * (count-(maxval/2)));
    heatmap[2] = 0;
  }
  return heatmap;

}

function minval(a)
{
  var min = a[0].totalvisits;

  for(var i = 1; i < a.length-1; i++)
  {
    if(a[i].totalvisits<min)
    {
      min = a[i].totalvisits;
    }
  }
  return min;
}

function indexOfMax(a)
{
  if(a.length === 0)
  {
    return undefined;
  }

  var maxValIndex = []; //returns an array so multiple max values can be returned - if max val is equal
  //maxValIndex[0]=0;

  var currentmax = a[0].reward;

  for(var i = 0; i < a.length; i++)
  {
    if(a[i].reward==currentmax)
    {
      maxValIndex.push(i); //maybe replace with i
      //print(currentmax);
    }
    if(a[i].reward > currentmax)
    {
      currentmax = a[i].reward;
      maxValIndex = [];
      maxValIndex.push(i);
      //print("Current max is: " + currentmax);
    }
  }

  var y = floor(random(0,maxValIndex.length));
  return maxValIndex;
}




/*function removeWalls(a, b)
{

  var x = a.i-b.i; //indicator for the direction the cell is moving to remove the wall
  var y = a.j-b.j;
  if (x == 1)
  {
    a.walls[3] = false; //removes left wall from A
    b.walls[1] = false; //removes right wall from B
  }
  else if (x == -1)
  {
    a.walls[1] = false;
    b.walls[3] = false;
  }

  if (y == 1)
  {
    a.walls[0] = false; //removes top wall from A
    b.walls[2] = false; //removes bottom wall from B
  }
  else if (y == -1)
  {
    a.walls[2] = false;
    b.walls[0] = false;
  }

}*/


//STEPS FROM THE WHITE POINT - CURSOR FOLLOWS THE PATH WITH LEAST STEPS
//CURSOR WILL EVALUATE THE NEIGHBORS FOR LEAST STEPS AND FOLLOW ACCORDINGLY
//STEPS ARE INITIALIZED TO 1000 - ONCE GOAL TILE IS PLACED, IT COUNTS STEPS FROM GOAL
//IF A TILE IS REPEATED ON BACKTRACK (WHERE A LOOP OCCURS), TILE STEPS ARE UPDATED
//NEED TO FIGURE OUT BRANCH LOGIC FROM MAIN PATH -




//REMAKE MAZE LAYOUT SIMILAR TO

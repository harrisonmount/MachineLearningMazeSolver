# Reinforcement Learning: Episodic Epsilon-Greedy Maze Solving Algorithm and Reward System Behavior Analysis

![](RackMultipart20210218-4-1tchwt9_html_639ef7a2988371a4.gif)

Harrison Mount

_College of Engineering_

_University of Miami_

_Coral Gables, FL_

hmm101@miami.edu

Harrison Mount
 College of Engineering
University of Miami
Coral Gables, FL
 hmm101@miami.edu

**_This paper will discuss the development, results, and behavior of a machine learning program that solves an N-by-N size maze using reinforcement learning tactics and varying heuristics by which the program learns to navigate._**

**_Keywords – Machine Learning, Reinforcement Learning, Agent, Epsilon-Greedy, Episodic, JavaScript, p5.js, Cell, Respawn, Pop, Stack, RGB, IMU, GPS, Optic Flow, ACL, Swarm Intelligence_**

1.
# Introduction

Reinforcement Learning is a branch of Machine Learning that, rather than the traditional approach of learning from an existing set of examples, an agent teaches itself by exploring a system and distributing rewards or punishments based on the outcome of its behavior. In this paper, reinforcement learning will be explained, demonstrated, and analyzed using a maze solving agent example, along with the discussion and exploration of the reward system implemented within the program.

1.
# Background

  1.
## N-Armed Bandit Problem

A useful example to break down how reinforcement learning works is the N-armed bandit problem, a playful display of the explore vs exploit method, a core function of any reinforcement learning algorithm.

![](RackMultipart20210218-4-1tchwt9_html_717e138b4f69a4a3.png)

Fig. 1 Set of &quot;Slot Machines&quot;

Imagine a set of infinite slot machines, each varying in individual average reward. Say, machine 2 averages a $3 return where machine 200 averages $0.50 return, the goal would be, obviously, to get as much money as possible from the slot machines, while minimizing the amount of coins used to generate such profit. A scientist would approach this with &quot;brute force&quot;, probing every machine, recording the outcome for each, then returning to the machine with the highest return. This is problematic because with infinite machines, it would cost an infinite amount of money to interact with them, not ideal for the scientist&#39;s wallet. A statistician may approach this using an optimal stopping algorithm, only probing around 30% of the machines before choosing one to stick with. An avid casino-goer may choose one machine and sit there all night… However, a computer scientist would gage the opportunity cost of exploring new machines vs the comfort of staying at one with a decent average return. This explore (find new machines) vs exploit (stay at the same machine) methodology is the backbone of reinforcement learning behavior, which seeks to solve a system, like a set of slot machines, for the best overall reward.

  1.
## Reinforcement Learning

Reinforcement learning mimics this behavior of choosing actions based off variable reward and experience in a system. Computationally, an agent keeps track of these rewards, and distributes new ones based on performance, all in real time (and without previous exposure to the system). Simply, every time a system iterates, it updates how the agent will act the next time it is run based of certain variables.

Rewarding in reinforcement learning, specifically in episodic systems, is manifested through the following pseudo code:

Input: user-specified parameter E, a set of actions (ai) and their initial value-estimates (Q0(ai)). For each action, let ki = 0 (number of times the action has occurred).

1. Generate a random number, p (0,1)
2. If p \&gt;= E, choose the action with the highest value (exploitation), otherwise choose a random other action (exploration)
3. Denote the action chosen in the previous step by ai
4. Update the value of ai using the following equation [1]
5. Set ki = ki + 1 and return to 1

![](RackMultipart20210218-4-1tchwt9_html_f127a291ba0c7ae1.png)

Equation [1]

This equation numerically represents the concepts mentioned earlier, with K being the number of previous actions, R being the amount you reward an action by, and Q being the &quot;memory&quot; of the agent. The E in the pseudo code earlier is referencing epsilon – the variable by which the agent explores (ranging from 0-1, 0 being very greedy, 1 being always exploring).

To note specifically, the system created in this paper using episodic formulation assigns rewards based on one iteration of the program, initializing all possibilities to a high value ensuring every option gets explored.

1.
# The Maze

  1.
## Structure

Using JavaScript and the p5.js graphics library, the maze structure is based of an array of &quot;Cell&quot; objects, with specific parameters. The most important parameters, of 11, are its location in the array (N-by-N size, using simple array math to navigate &quot;up&quot; and &quot;down&quot;), if the cell is the &quot;current&quot; cell (where the agent is), if the cell is a block (used to create barriers in the maze), a visit count within one iteration, its current reward amount (Q), and its total visits (for graphics). Figure 2 and 3 show 20 by 20 initial state mazes, one with no blocks, and the other with 70 randomly generated blocks.

![](RackMultipart20210218-4-1tchwt9_html_d0fe3164c294ac09.png)

Fig. 2 Blank Maze (Initial State)

![](RackMultipart20210218-4-1tchwt9_html_2cd03da71077a52e.png)

Fig. 3 Randomly Generated Blocks Maze (Initial State)

Agent behavior follows the steps in the pseudo code, determining where to move next by comparing available options and going with the best one, or randomly picking one depending on the greed value of the program. Other operations to note: the default respawn location of the agent after an iteration is the top left corner, the agent adds the cells it visits to a new array and rewards them subsequently after the agent reaches the goal, rather than having to check each cell in the maze to see if it has been visited, and rewards based off how many steps away from the goal it is (using a counter and the &quot;pop&quot; function of stacks).

Also, the program generates a heat map of the maze based on how many times a cell has been visited using a standard RGB (red, green, blue) display function. This heatmap is extremely useful in analyzing the behavior of the agent over time, and produces some interesting results.

1.
# Results

  1.
## 10x10xX – 90% Greedy

Initial testing for the algorithm used a 10 by 10 by X maze (x meaning the number of random barriers appearing in the maze) to demonstrate agent behavior. The initial 3, using X values of 10, 20, and 30, with 75% greedy behavior (.25 epsilon).

![](RackMultipart20210218-4-1tchwt9_html_bd90888671d04789.png)

Fig. 4 10x10x10 Maze

![](RackMultipart20210218-4-1tchwt9_html_21562db0cf62c3b1.png)

Fig. 5 10x10x20 Maze

![](RackMultipart20210218-4-1tchwt9_html_c287263527f0f283.png)

Fig. 6 10x10x30

The resulting graphs show steps per iteration vs iteration count for each maze using a CSV data file export function in p5.js.

![](RackMultipart20210218-4-1tchwt9_html_9b3926822e526a74.png)

Fig. 7 10x10x10 Graph

![](RackMultipart20210218-4-1tchwt9_html_a42530678130eb13.png)

Fig. 8 10x10x20 Graph

![](RackMultipart20210218-4-1tchwt9_html_2dbaf1666531e5b6.png)

Fig. 9 10x10x30 Graph

These graphs show extremely similar behavior despite varying levels of randomly generated barriers. It seems to show that, as long as the maze is solvable with a best path (only moving down and right) it will solve it in around 6 iterations with the minimum amount of moves N-1 (19 steps in the case of a 20 by 20 maze).

  1.
## 10x10xX – 60% Greedy

Here, a 10 by 10 maze with 10 and 30 random blocks are shown, this time with a higher epsilon value of .4, choosing a random available action 40% of the time.

![](RackMultipart20210218-4-1tchwt9_html_fe0e1c514d968472.png)

Fig. 10 10x10x10 Maze with Lower Greed

![](RackMultipart20210218-4-1tchwt9_html_985fddcf22d2db7d.png)

Fig. 11 10x10x30 Maze with Lower Greed

The resulting graphs display ample variability due to the unpredictable behavior of a less greedy agent, which never fully converges to a single solution.

![](RackMultipart20210218-4-1tchwt9_html_d73d20e28d67df49.png)

Fig. 12 10x10x10 Lower Greed Graph

![](RackMultipart20210218-4-1tchwt9_html_32f0a409daa46809.png)

Fig. 13 10x10x30 Lower Greed Graph

  1.
## 10x10xX – Random Respawn 90% Greedy

After viewing the behavior of varying greed and barrier generation in a 10 by 10 maze, a new variable is introduced to see how the program changes: randomizing the starting location of the agent each iteration. This was done by picking a random cell from the valid cells array each time the iteration begins and placing the agent in such cell. The resulting graphs would never converge, but it is nonetheless interesting to see how the heatmap displays the behavior of a randomized, yet deterministic system.

![](RackMultipart20210218-4-1tchwt9_html_9d3ec1ee4964530b.png)

Fig. 14 10x10x10 Random Respawn Maze

![](RackMultipart20210218-4-1tchwt9_html_9b5dc828bb531652.png)

Fig. 15 10x10x30 Random Respawn Maze

Random respawn systems required many more iterations for a behavioral pattern to surface from the heatmap.

  1.
## Very High Greed Systems

Once the behavior of the system became well known, experiments were made on maps with varying parameters to explore new behavior and patterns. The first being a common reoccurring &quot;S&quot; shape in extremely greedy agents.

![](RackMultipart20210218-4-1tchwt9_html_b39f108de9696570.png)

Fig. 16 10x10x10 100% Greed Maze

![](RackMultipart20210218-4-1tchwt9_html_e621cf6cac85ae9f.png)

Fig. 17 20x20x0 100% Greed Maze

These examples show how naïve an agent can be with high greed, only following one solution, reinforcing its results, rather than probing its other options to find a more optimal one.

![](RackMultipart20210218-4-1tchwt9_html_eeda5ce64578faf9.png)

Fig. 18 20x20x0 80% Greed Maze

The maze above is similar to Figure 17, but with less greed. The &quot;blurriness&quot; of the path is a result of the random actions taken by the agent.

  1.
## Very High Greed – Random Respawn Behavior

Behavior from Figure 14 previously showed an interesting pattern, which was experimented with on a larger scale shown below.

![](RackMultipart20210218-4-1tchwt9_html_9b0f745ae8e92e8b.png)

Fig. 19 20x20x0 80% Greed Maze

The random respawn pattern displays a similar shape to the random respawn pattern of the 10 by 10 maze previously shown. Two &quot;highway&quot; paths that emerge near the goal point attract the agent towards them before sending the agent to the bottom right corner.

  1.
## Random Respawn, Center Endpoint

The final experimentation with the reward system is a maze with random respawn, and a goal point at the center. 80% greed was used.

![](RackMultipart20210218-4-1tchwt9_html_c48172390d87f57c.png)

Fig. 20 24x24x0 Random Respawn

As shown, the behavior of this system made branches similar to Figure 19&#39;s heatmap. The emergence of &quot;highways&quot; which the agent is attracted to, shows how the algorithm attempts to tackle a random system, finding a solution in the chaos.

1.
# Conclusion

## In conclusion, modeling the behavior of a reinforcement learning program has been an extremely rewarding process. The ability to create an environment and adjust parameters allowing the creator to essentially explore it, is a true joy only computer scientists can experience.

XXX-X-XXXX-XXXX-X/XX/$XX.00 ©20XX IEEE

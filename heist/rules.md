---
title: MICE HEIST
description: Rulebook
---
<style type="text/css" rel="stylesheet">
table.components {
  width: 100%;
  table-layout: fixed;
}

.chip {
  clip-path: circle(50% at center);
}

.assist {
  color: #363b51;
  font-weight: bold;
}
.skill {
  color: #E8594B;
  font-weight: bold;
}
.obstacle {
  color: #5e7196;
  font-weight: bold;
}
.cheese {
  color: #ffdd99;
  font-weight: bold;
}
</style>

# COMPONENTS
Modifier chips

<table class="components">
<tr><th>Blue</th><th>Green</th><th>Yellow</th><th>Orange</th><th>Red</th><th>Purple</th></tr>
<tr><td><img class="chip" alt="blue +4/+2 modifier chip" src="rulebook/BluePlus4.png"/></td><td><img class="chip" alt="green +2/+1 modifier chip" src="rulebook/GreenPlus2.png"/></td><td><img class="chip" alt="yellow +1/-1 modifier chip" src="rulebook/YellowPlus1.png"/></td><td><img class="chip" alt="orange -1/-2 modifier chip" src="rulebook/OrangeMinus1.png"/></td><td><img class="chip" alt="red -2/-4 modifier chip" src="rulebook/RedMinus2.png"/></td><td><img class="chip" alt="purple +3/-3 modifier chip" src="rulebook/PurplePlus3.png"/></td></tr>
<tr><td><img class="chip" alt="blue +4/+2 modifier chip" src="rulebook/BluePlus2.png"/></td><td><img class="chip" alt="green +2/+1 modifier chip" src="rulebook/GreenPlus1.png"/></td><td><img class="chip" alt="yellow +1/-1 modifier chip" src="rulebook/YellowMinus1.png"/></td><td><img class="chip" alt="orange -1/-2 modifier chip" src="rulebook/OrangeMinus2.png"/></td><td><img class="chip" alt="red -2/-4 modifier chip" src="rulebook/RedMinus4.png"/></td><td><img class="chip" alt="purple +3/-3 modifier chip" src="rulebook/PurpleMinus3.png"/></td></tr>
<tr><td>x1</td><td>x2</td><td>x4</td><td>x2</td><td>x1</td><td>x1</td></tr>
</table>

<table class="components">
<tr><td><img class="card" alt="identity card" src="new-rulebook/identity.png"/></td><td><img class="card" alt="job card" src="new-rulebook/job.png"/></td></tr>
<tr><td>7 identity cards</td><td>6 job cards</td></tr>
<tr>Player marker<td><img class="card" alt="obstacle card" src="new-rulebook/obstacle.png"/></td><td></td></tr>
<tr><td>32 obstacle cards</td><td>5 player markers of each player color</td></tr>
</table>

<table class="components">
<tr><td><img class="card" alt="assist card" src="new-rulebook/assist.png"/></td><td><img class="card" alt="skill card" src="new-rulebook/trick.png"/></td><td>Cheese Token</td></tr>
<tr><td>42 assist cards</td><td>37 skill cards</td><td>60 cheese tokens</td></tr>
</table>

<table class="components">
<tr><td><img class="card" alt="rules reminder card" src="new-rulebook/rulesCard.png"/></td><td><img alt="bag"/></td><td><img alt="jobMarker"/></td></tr>
<tr><td>4 rules reminder cards</td><td>1 opaque bag</td><td><mark>Active job marker</mark></td></tr>
</table>

# SETUP
1. Randomly deal 1 Identity card face-up in front of each player. Return the rest to the game box.
1. Randomly select 4 <span class="job">Job</span> cards. Place them in the center of the table.
1. Place the <span class="obstacle">Obstacle</span> cards face-up immediately below their corresponding <span class="job">Job</span> card (e.g. place A5 on job A) in numeric order with the lowest number on top (e.g. place A1 on top)
1. Add 6 <span class="cheese">cheese</span> to each <span class="job">Job</span> card to seed its <span class="cheese">cheese</span> pool.
1. For each <span class="obstacle">Obstacle</span> card place <span class="cheese">cheese</span> on it equal to the amount shown in the bottom right of the card.
1. Put the remaining <span class="cheese">cheese</span> in a central supply.
1. Place all chips in the bag.
1. Shuffle the <span class="skill">Skill</span> cards and <span class="assist">Assist</span> cards separately to form 2 face-down resource decks. Leave room next to each for a face-up discard pile.
1. Deal each player 3 cards from the <span class="skill">Skill</span> deck and 2 cards <span class="assist">Assist</span> deck, forming their starting 5 card hand.
1. Each player chooses a player color and takes the 5 contribution markers of that color.
1. Randomly determine a starting player.

# GOAL
You are all looking to pull off a set of jobs. Each job is progressed by overcoming a sequence of <span class="obstacle">Obstacles</span>. Players will test their skill against these <span class="obstacle">Obstacles</span>. When the game ends players are paid out according to how well they helped with each job.

## Contribution

Each job has a contribution track. When you contribute to the success of that job, you will increase your position on that track. When an <span class="obstacle">Obstacle</span> is overcome, <span class="cheese">cheese</span> is added to that job's payout. The player in 1st place will get most of the <span class="cheese">cheese</span>, with steadily decreasing rewards for other places (see "End Game & Scoring" below).

# YOUR IDENTITY

<img class="card" alt="identity" style="max-width: 300px" src="new-rulebook/identity.png"/>

You start the game with an Identity card that provides your starting skills. There are 3 skills:
	 
| Agility | Charm | Dexterity |
| --- | --- | --- |
| <img alt="agility icon" src="new-rulebook/skillFoot.png" style="max-width: 100px"/> | <img alt="charm icon" src="new-rulebook/skillTeeth.png" style="max-width: 100px"/> | <img alt="skill icon" src="new-rulebook/skillPaw.png" style="max-width: 100px"/> |

The number of icons you have of a particular skill is your skill score. For example, the Cat Burglar starts with 2 Agility and 1 Dexterity.

# YOUR TURN
Players each take a turn in clockwise order. On your turn choose an <span class="obstacle">Obstacle</span> and place the active job marker on that <span class="obstacle">Obstacle</span> card. 

## FACING AN OBSTACLE

<img class="card" alt="obstacle card" style="float: right; max-width: 300px" src="new-rulebook/obstacle.png"/>

Each <span class="obstacle">Obstacle</span> may have the following elements:
- One or more required skills with a target number
- Failure penalty
- Success reward 
- Payout (bottom right)
- Associated Job (top right)

But all <span class="obstacle">Obstacles</span> will incur a <strong>test</strong>.

Resolving a test is done with the following steps:
1. Evaluate Skill
2. Get Help
3. Draw Chips
4. Play Skills
5. Resolve (Success or Failure)
6. Prepare

On your turn you are considered the "testing player."

### 1. EVALUATE SKILL
An <span class="obstacle">Obstacle</span> will test one or more of your skills. Each of your skills has a score, which is the sum of the icons on your Identity card and all <span class="skill">Skill</span> cards that have been added to your Identity card.

If an <span class="obstacle">Obstacle</span> is testing multiple skills, add the score of all skills indicated.

<mark>TODO: For “or” choice <span class="obstacle">Obstacles</span> do you choose up front (before assists) or at the end? Or is it just whichever is higher, no choice required?</mark>

### 2. GET HELP
Each other player has an opportunity to bet on the outcome of the testing player's upcoming test. In clockwise order (starting with the player to the left of the testing player), each player will choose one of the following:

#### A) Bet for
Play a <span class="assist">Assist</span> card to help (or potentially hinder) the active player, and share in their success.

#### B) Bet against

Play a <span class="skill">Skill</span> card facedown (ignoring the text on the front of the card) to learn from the active player's failure.

#### C) Abstain

Draw a card from either the <span class="skill">Skill</span> or <span class="assist">Assist</span> deck.

#### Resolving an Assist card

<img class="card" alt="assist card" style="max-width: 150px" src="new-rulebook/assist.png"/>

<span class="assist">Assist</span> cards may modify the test result with a number modifier (indicated in a circle). They may also have other effects. These effects are all resolved now, _prior_ to making the test. After resolving the effects, leave the <span class="assist">Assist</span> card in front of the player who committed them until the test is completed.

### 3. DRAW CHIPS
Draw 2 chips from the bag and without looking at them place them on the table. 

At times you may need to draw a chip when there are no chips remaining in the bag. When this happens, return all chips from the play area _except the ones already drawn for this test_ to the bag. Then proceed drawing.

### 4. PLAY SKILLS

<img class="card" alt="skill card" style="max-width: 150px" src="new-rulebook/trick.png"/> 

At this time you (and only you) may play any number of <span class="skill">Skill</span> cards to modify the chip results. These could involve flipping chips (to change which modifier value is showing), drawing additional chips, adding numeric modifiers, or any number of effects.

### 5. RESOLVE

<img class="card" alt="mandatory obstacle card" style="float: right; max-width: 300px" src="new-rulebook/mandatoryObstacle.png"/>

Add the revealed modifiers showing on all chips and committed <span class="assist">Assist</span> cards to your skill score. If the sum is less than the target number for that skill you <strong>failed</strong>. Otherwise you <strong>succeeded</strong>.

Leave the drawn chips in the center of the play area.

#### FAILURE
- Apply the "failure" effect of the <span class="obstacle">Obstacle</span> (if any).
- Unless the <span class="obstacle">Obstacle</span> says it is a “Mandatory Obstacle”, return the <span class="obstacle">Obstacle</span> card to the game box and any <span class="cheese">cheese</span> on it to the central supply.
- Discard any played <span class="assist">Assist</span> cards.
- You may **learn** one <span class="skill">Skill</span> cards you played, a <span class="skill">Skill</span> card from your hand, or the top <span class="skill">Skill</span> card from the <span class="skill">Skill</span> deck. To learn a <span class="skill">Skill</span> that card is added face-down to your identity card (upgrading your skill score).
- Discard any other played <span class="skill">Skill</span> cards.
- Increase your place on the job's contribution track by 3.

#### SUCCESS
- Apply the "success" effect of the <span class="obstacle">Obstacle</span> (if any).
- Add all <span class="cheese">cheese</span> on the <span class="obstacle">Obstacle</span> to the corresponding job.
- Return the <span class="obstacle">Obstacle</span> card to your game box.
- All players who played <span class="assist">Assist</span> cards increase their place on the job's contribution track by 1. Discard these <span class="assist">Assist</span> cards.
- Discard any played <span class="skill">Skill</span> cards.
- Increase your place on the job's contribution track by 1.

#### The contribution track

To increase your place on the contribution track, take your player-colored contribution marker and move it up that many spaces on the track. If you are not already on the track, start counting from the first track space. If your marker would land on an already occupied space, instead move to the next available space. If you have reached the end of the track and there are no more available spaces, instead take one <span class="cheese">cheese</span> from the job's pool and add it to your personal stash.

To decrease your place on the contribution track, move backwards as above however if you would land on an occupied space you instead move to the next available space _moving backwards_. If there are no previously available spaces then you remove your marker from the track entirely.

#### Reveal the next obstacle

If the <span class="obstacle">Obstacle</span> was discarded and a new one was revealed underneath it, add <span class="cheese">cheese</span> to that new <span class="obstacle">Obstacle</span> equal to the amount shown in the bottom right of that card.

If there was no <span class="obstacle">Obstacle</span> underneath, then the job is complete and the end game has been triggered (see below).

### 6. PREPARE
You may discard any number of cards from your hand. Then draw resource cards from the deck until you have 5 cards in your hand.

# OTHER DETAILS

## CHIPS RUN OUT
When a player is asked to draw a chip and there are none in the bag return all chips to the bag. Then continue drawing.

## DECK RUNS OUT
Either deck may run out of cards and you need to draw a card. When this happens, shuffle the discard pile of that deck to form a new face-down deck.

# END GAME & SCORING
The end game is triggered when one of the jobs has been completed (there are no more <span class="obstacle">Obstacle</span> cards).

## Job's pay out

For each job, pay out <span class="cheese">cheese</span> according to each player's place on the contribution track, adding to any <span class="cheese">cheese</span> that player has collected over the course of the game. The player in 1st place on the track will get paid half (rounded up) of that job's <span class="cheese">cheese</span> pool. The player in 2nd place will get paid half (rounded up) of the remaining <span class="cheese">cheese</span>, and so on.

You may also use this chart:
| Cheese | 1st | 2nd | 3rd | 4th | 5th |
| ------ | --- | --- | --- | --- | --- |
| 5      | 3   | 1   | 1   | 0   | 0   |
| 6      | 3   | 2   | 1   | 0   | 0   |
| 7      | 4   | 2   | 1   | 0   | 0   |
| 8      | 4   | 2   | 1   | 1   | 0   |
| 9      | 5   | 2   | 1   | 1   | 0   |
| 10     | 5   | 3   | 1   | 1   | 0   |
| 11     | 6   | 3   | 1   | 1   | 0   |
| 12     | 6   | 3   | 2   | 1   | 0   |
| 13     | 7   | 3   | 2   | 1   | 0   |
| 14     | 7   | 4   | 2   | 1   | 0   |
| 15     | 8   | 4   | 2   | 1   | 0   |
| 16     | 8   | 4   | 2   | 1   | 1   |
| 17     | 9   | 4   | 2   | 1   | 1   |
| 18     | 9   | 5   | 2   | 1   | 1   |
| 19     | 10  | 5   | 2   | 1   | 1   |
| 20     | 10  | 5   | 3   | 1   | 1   |
| 21     | 11  | 5   | 3   | 1   | 1   |
| 22     | 11  | 6   | 3   | 1   | 1   |
| 23     | 12  | 6   | 3   | 1   | 1   |
| 24     | 12  | 6   | 3   | 2   | 1   |
| 25     | 13  | 6   | 3   | 2   | 1   |
| 26     | 13  | 7   | 3   | 2   | 1   |
| 27     | 14  | 7   | 3   | 2   | 1   |
| 28     | 14  | 7   | 4   | 2   | 1   |
| 29     | 15  | 7   | 4   | 2   | 1   |
| 30     | 15  | 8   | 4   | 2   | 1   |

## Most cheese wins

The player with the most <span class="cheese">cheese</span>  is the winner. If there is a tie the player with the most total learned <span class="skill">Skill</span> cards is the winner. If there’s still a tie the players share the victory.
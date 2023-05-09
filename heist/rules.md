---
title: MICE HEIST
description: Rulebook
---
<style type="text/css" rel="stylesheet">
table.components {
  width: 100%;
  table-layout: fixed;
}

.token {
  clip-path: circle(50% at center);
}

.assist {
  color: #363b51;
}
.trick {
  color: #E8594B;
}
.obstacle {
  color: #5e7196;
}
</style>

# COMPONENTS
Modifier tokens

<table class="components">
<tr><th>Blue</th><th>Green</th><th>Yellow</th><th>Orange</th><th>Red</th><th>Purple</th></tr>
<tr><td><img class="token" alt="blue +4/+2 modifier token" src="rulebook/BluePlus4.png"/></td><td><img class="token" alt="green +2/+1 modifier token" src="rulebook/GreenPlus2.png"/></td><td><img class="token" alt="yellow +1/-1 modifier token" src="rulebook/YellowPlus1.png"/></td><td><img class="token" alt="orange -1/-2 modifier token" src="rulebook/OrangeMinus1.png"/></td><td><img class="token" alt="red -2/-4 modifier token" src="rulebook/RedMinus2.png"/></td><td><img class="token" alt="purple +3/-3 modifier token" src="rulebook/PurplePlus3.png"/></td></tr>
<tr><td><img class="token" alt="blue +4/+2 modifier token" src="rulebook/BluePlus2.png"/></td><td><img class="token" alt="green +2/+1 modifier token" src="rulebook/GreenPlus1.png"/></td><td><img class="token" alt="yellow +1/-1 modifier token" src="rulebook/YellowMinus1.png"/></td><td><img class="token" alt="orange -1/-2 modifier token" src="rulebook/OrangeMinus2.png"/></td><td><img class="token" alt="red -2/-4 modifier token" src="rulebook/RedMinus4.png"/></td><td><img class="token" alt="purple +3/-3 modifier token" src="rulebook/PurpleMinus3.png"/></td></tr>
<tr><td>x7</td><td>x9</td><td>x12</td><td>x9</td><td>x7</td><td>x6</td></tr>
</table>

<table class="components">
<tr><td><img class="card" alt="identity card" src="new-rulebook/identity.png"/></td><td><img class="card" alt="job card" src="new-rulebook/job.png"/></td></tr>
<tr><td>7 identity cards</td><td>6 job cards</td></tr>
<tr><td><img class="card" alt="obstacle card" src="new-rulebook/obstacle.png"/></td><td><img class="card" alt="heat track" src="new-rulebook/heat.png"/></td></tr>
<tr><td>32 obstacle cards</td><td>1 heat track card</td></tr>
</table>

<table class="components">
<tr><td><img class="card" alt="award card" src="new-rulebook/secret.png"/></td><td><img class="card" alt="assist card" src="new-rulebook/assist.png"/></td><td><img class="card" alt="trick card" src="new-rulebook/trick.png"/></td></tr>
<tr><td>4 award cards</td><td>42 assist cards</td><td>37 trick cards</td></tr>
</table>

<table class="components">
<tr><td><img class="card" alt="rules reminder card" src="new-rulebook/rulesCard.png"/></td><td><img alt="bag"/></td><td><img alt="jobMarker"/></td></tr>
<tr><td>4 rules reminder cards</td><td>1 opaque bag</td><td><mark>Active job marker</mark></td></tr>
</table>

# SETUP
1. Randomly deal 1 identity card face-up in front of each player. Return the rest to the game box.
2. Randomly select <span class="job">Job</span> cards equal to the number of players. Place them in the center of the table.
3. Place the <span class="obstacle">Obstacle</span> cards face-up on their corresponding <span class="job">Job</span> card (e.g. place A5 on job A) in numeric order with the lowest number on top (e.g. place A1 on top)
4. Place the following tokens in the bag, based on the number of players:

| Token | 2 players | 3 players | 4 players | 5 players | 6 players |
| --- | --- | --- | -- | --- | --- |
| <img class="token" alt="yellow +1 modifier token" src="rulebook/YellowPlus1.png"/> | 3 | 5 | 7 | 9 | 11 |
| <img class="token" alt="orange -1 modifier token" src="rulebook/OrangeMinus1.png"/> | 1 | 2 | 3 | 4 | 5 |
| <img class="token" alt="red -2 modifier token" src="rulebook/RedMinus2.png"/> | 1 | 1 | 1 | 1 | 1 |
| <img class="token" alt="purple +3 modifier token" src="rulebook/PurplePlus3.png"/> | 1 | 1 | 1 | 1 | 1 |

5. Put the heat track card in the center of the play area. For each 2 players in the game (rounded up) add 1 of the token indicated on each space of the heat track, as indicated in this chart:

| 2 players | 3 players | 4 players | 5 players | 6 players |
| --- | --- | -- | --- | --- |
| 2 | 2 | 4 | 4 | 5 |

6. Shuffle the <span class="trick">Trick</span> cards and <span class="assist">Assist</span> cards together to form a face-down resource deck. Leave room next to it for a face-up discard pile.
7. Deal each player 5 cards from the resource deck.
8. Randomly determine a starting player.

# GOAL
There are a set of jobs that you all are looking to pull off. Each job can only be completed by overcoming a sequence of obstacles. Players will test their skill against these obstacles. When the game ends players are paid out according to how well they helped. There are also awards granted for having the highest of each skill. The player with the largest payout is the winner.

# YOUR IDENTITY

<img class="card" alt="identity" style="max-width: 300px" src="new-rulebook/identity.png"/>

You start the game with an identity card that provides your starting skills. There are 3 skills:
	 
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
- Associated Job (bottom right)

But all <span class="obstacle">Obstacles</span> will incur a <strong>test</strong>.

Resolving a test is done with the following steps:
1. Evaluate Skill
2. Get Help
3. Draw Tokens
4. Play Tricks
5. Resolve (Success or Failure)
6. Prepare

### 1. EVALUATE SKILL
An <span class="obstacle">Obstacle</span> will test one or more of your skills. Each of your skills has a score, which is the sum of the icons on your identity card and all <span class="assist">Assist</span> and <span class="trick">Trick</span> cards that have been added to your identity card.

If an <span class="obstacle">Obstacle</span> is testing multiple skills, add the score of all skills indicated.

<mark>TODO: For “or” choice <span class="obstacle">Obstacles</span> do you choose up front (before assists) or at the end? Or is it just whichever is higher, no choice required?</mark>

### 2. GET HELP
Each other player has an opportunity to play an <span class="assist">Assist</span> card to help (or potentially hinder) the current player. They simultaneously reveal either nothing or an <span class="assist">Assist</span> card to commit from their hand to the upcoming test. If they reveal nothing they draw a card from the resource deck, and then discard until they have no more than 5 cards in their hand.

<img class="card" alt="assist card" style="max-width: 150px" src="new-rulebook/assist.png"/> <img class="card" alt="assist card" style="max-width: 150px" src="new-rulebook/assistReward.png"/>

<span class="assist">Assist</span> cards may modify the test result if they include a number in a circle. They may also modify the bag contents or have other effects. These are all resolved prior to making the test, in a clockwise order. Leave the <span class="assist">Assist</span> card in front of the player who committed them until the test is completed.

<mark>You may only commit an <span class="assist">Assist</span> card if your player pawn is at the location of the active job marker. You may discard one card to move your pawn to the active player's location. You only need to pay this cost after <span class="assist">Assist</span> cards are revealed. If you cannot pay this cost (you have no more cards in your hand) then your committed <span class="assist">Assist</span> card is discarded.</mark>

### 3. DRAW TOKENS
Draw 2 tokens from the bag and without looking at them place them on the table. 

Note that some <span class="obstacle">Obstacle</span> cards may modify how many tokens are drawn from the default of 2.

If any tokens had previously been set aside for your next test, they are added now.

### 4. PLAY TRICKS

<img class="card" alt="trick card" style="max-width: 150px" src="new-rulebook/trick.png"/> <img class="card" alt="trick card" style="max-width: 150px" src="new-rulebook/trickReward.png"/>

At this time you (and only you) may play any number of <span class="trick">Trick</span> cards to modify the token results. These could involve flipping tokens (to change which modifier value is showing), drawing additional tokens, or any number of effects.

### 5. RESOLVE

<img class="card" alt="mandatory obstacle card" style="float: right; max-width: 300px" src="new-rulebook/mandatoryObstacle.png"/>

Add the revealed modifiers showing on all tokens and committed <span class="assist">Assist</span> cards to your skill score. If the sum is less than the target number for that skill you <strong>failed</strong>. Otherwise you <strong>succeeded</strong>.

The drawn tokens remain in front of you until the end of the round.

#### FAILURE
- Apply the "failure" effect of the <span class="obstacle">Obstacle</span> (if any).
- Unless the <span class="obstacle">Obstacle</span> says it is a “Mandatory Obstacle”, return the <span class="obstacle">Obstacle</span> card to the game box.
- All players who played <span class="assist">Assist</span> cards that have a "Failure" (bottom) effect adds their card to their identity card. Discard any other <span class="assist">Assist</span> cards.
- If you played a <span class="trick">Trick</span> card that has a score (cheese) value, add it to your score pile.
- You may use the “Failure” (bottom) effect of one <span class="trick">Trick</span> card you played or of a <span class="trick">Trick</span> card from your hand. These are added to your identity card to upgrade your skills.
- Discard any other played <span class="trick">Trick</span> cards.

#### SUCCESS
- Apply the "success" effect of the <span class="obstacle">Obstacle</span> (if any).
- Add the <span class="obstacle">Obstacle</span> card to your score pile.
- All players who played <span class="assist">Assist</span> cards with a score (cheese) value adds their <span class="assist">Assist</span> card to their score pile.
- Any player who played an <span class="assist">Assist</span> card with a “Success” (bottom) effect adds that card to their identity card. These will upgrade their skills.
- Discard any played <span class="trick">Trick</span> cards.

### 6. PREPARE
You may discard any number of cards from your hand. Then draw resource cards from the deck until you have 5 cards in your hand.

Some <span class="obstacle">Obstacle</span> are labeled as "mandatory". These function the same as normal, except that if the test fails the 

## END OF THE ROUND
After each player has had a turn the round is over. Add the tokens for the current round number from the heat track to the bag.

Return all tokens in front of players to the bag.

If there are no more rounds on the heat track the game is over, proceed to _End Game & Scoring_.

# OTHER DETAILS

## DECK RUNS OUT
The resource deck may run out of cards and you need to draw a card. When this happens, shuffle the discard pile into a new face-down resource deck.

# END GAME & SCORING
- Tally the points on all cards in your score pile. 
- If a <span class="job">Job</span> was completed each player who completed at least 1 <span class="obstacle">Obstacle</span> from that <span class="job">Job</span> scores 1 point.
- For each of the 3 skills, the player with the highest value for that skill is awarded 3 points. If there is a tie, all tied players receive the 3 points.
- The player with te most scored <span class="assist">Assist</span> cards is awarded 3 points. If there is a tie, all tied players receive the 3 points.

The player with the most points is the winner. If there is a tie the player with the most scored <span class="assist">Assist</span> cards is the winner. If there’s still a tie the players share the victory.
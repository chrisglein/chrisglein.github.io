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
<tr><td><img class="card" alt="identity card" src="new-rulebook/identity.png"/></td><td><img class="card" alt="rules reminder card" src="new-rulebook/rulesCard.png"/></td></tr>
<tr><td>7 identity cards</td><td>4 rules reminder cards</td></tr>
<tr><td><img class="card" alt="job card" src="new-rulebook/job.png"/></td><td><img class="card" alt="obstacle card" src="new-rulebook/obstacle.png"/></td></tr>
<tr><td>6 job cards</td><td>30 obstacle cards<br>(5 per job)</td></tr>
<tr><td><img class="card" alt="contribution track" src="new-rulebook/contributionTrack.png"/></td><td><img alt="contribution marker" src="new-rulebook/contributionMarker.png"/></td></tr>
<tr><td>4 contribution tracks</td><td>20 player markers<br>(5 of each player color)</td></tr>
</table>

<table class="components">
<tr><td><img class="card" alt="assist card" src="new-rulebook/assist.png"/></td><td><img class="card" alt="skill card" src="new-rulebook/trick.png"/></td><td><img class="card" alt="skill rating card" src="new-rulebook/skillRating.png"/></td></tr>
<tr><td>42 assist cards</td><td>37 skill cards</td><td>36 skill rating cards<br>(9 for each player)</td></tr>
</table>

<table class="components">
<tr><td><img alt="cheese token" src="new-rulebook/cheeseToken.png"/></td><td><img alt="bag"/></td><td><img alt="jobMarker"/></td></tr>
<tr><td>60 cheese tokens</td><td>1 opaque bag</td><td><mark>Active job marker</mark></td></tr>
<tr><td><img alt="food token" src="new-rulebook/foodToken.png"/></td><td></td><td></td></tr>
<tr><td>12 food tokens<br>(4 each in values 12, 6, and 3)</td><td></td><td></td></tr>
</table>


# SETUP
### Skills
1. Randomly deal 1 Identity card face-up in front of each player. Return the rest to the game box.
1. Each player takes one set of 9 skill rating cards. Place them in 3 stacks, with the 4/5 on bottom, the 2/3 on top of that, and the 0/1 on top of that (so that the 0 is showing). <mark>TODO: Needs visual aid</mark>
1. According to their identity card, each player flips or removes skill rating cards until their rating matches the identity card. <mark>TODO: This is nonesense without a visual aid</mark>
1. Each player chooses a player color and takes all contribution markers of that color.
### Jobs
1. Place the 4 contribution tracks in the center of the table.
1. Randomly select 4 <span class="job">Job</span> cards. Place one in each contribution track. Return the rest to the game box.
1. Place the <span class="obstacle">Obstacle</span> cards face-up on top of  their corresponding <span class="job">Job</span> card (e.g. place A5 on job A) in numeric order with the lowest number on top (e.g. place A1 on top). Return all other unused <span class="obstacle">Obstacle</span> to the gabe box.
1. For each job select a 12 point, 6 point, and 3 point food item and place it above the track.
### Resource decks
1. Shuffle the <span class="skill">Skill</span> cards and <span class="assist">Assist</span> cards separately to form 2 face-down resource decks. Leave room next to each for a face-up discard pile.
1. Deal each player 3 cards from the <span class="skill">Skill</span> deck and 2 cards <span class="assist">Assist</span> deck, forming their starting 5 card hand.
### The rest
1. Put the <span class="cheese">cheese</span> in a central supply.
1. Place all chips in the bag.
1. Randomly determine a starting player. They take the active job marker.

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

## Skill rating
<mark>This section should explain the skill rating cards. Previously: </mark>
Your skill rating is the sum of the icons on your Identity card and all <span class="skill">Skill</span> cards that have been added to your Identity card.

## Learning a skill
When you learn a skill, you increase your rating in that skill by one. Flip over the corresponding skill rating card if your current value is even (0, 2, or 4) or return that skill rating card to the game box if your current value is odd (1 or 3). The maximum skill rating is 5; any increase beyond 5 is ignored.

When learning due to playing a <span class="skill">Skill</span> card, learn the matching skill displayed on the back of the card (also shown in the bottom right of the front of the card), then put that card in the discard pile.

# YOUR TURN
Players each take a turn in clockwise order. On your turn choose an <span class="obstacle">Obstacle</span> and place the active job marker on that <span class="obstacle">Obstacle</span> card. 

## FACING AN OBSTACLE

<img class="card" alt="obstacle card" style="float: right; max-width: 300px" src="new-rulebook/obstacle.png"/>

Each <span class="obstacle">Obstacle</span> will have the following elements:
- A <strong>test</strong>, with one or more required skills and a target number
- Failure effect (for mandatory obstacles only)
- Payout (bottom right)
- Associated Job (top right)

Resolving a test is done with the following steps:
1. Evaluate Skill
2. Get Help
3. Draw Chips
4. Play Skills
5. Resolve (Success or Failure)
6. Prepare

On your turn you are considered the <strong>testing player</strong>.

### 1. EVALUATE SKILL
An <span class="obstacle">Obstacle</span> will test one or more of your skills. Each of your skills has a rating, as explained above.

If an <span class="obstacle">Obstacle</span> is testing multiple skills, add the score of all skills indicated.

Some tests will provide an "or" choice between multiple skills. Before proceeding, choose one of these to use as the target for the test.

<mark>TODO: Add visual aid</mark>

### 2. GET HELP
Each other player has an opportunity to bet on the outcome of the testing player's upcoming test. Simultaneously, each player will choose one of the following:

#### A) Bet for
Play a <span class="assist">Assist</span> card to help (or potentially hinder) the active player, and share in their success. They are considered an <strong>assisting player</strong>

#### B) Bet against

Play a <span class="skill">Skill</span> card facedown (ignoring the text on the front of the card) to learn from the active player's failure.

#### C) Abstain

Play no card, but draw a card from either the <span class="skill">Skill</span> or <span class="assist">Assist</span> deck.

#### Resolving Assist cards

Once all players have chosen how to bet, their choice is revealed. <mark>TODO: Clarify how to show your bet</mark>. Any players who chose to abstain draw a card. Then, in clockwise order (starting with the player to the left of the testing player), any played <span class="assist">Assist</span> cards are resolved.

<img class="card" alt="assist card" style="max-width: 150px" src="new-rulebook/assist.png"/>

<span class="assist">Assist</span> cards may modify the test result with a number modifier (indicated in a circle). They may also have other effects. These effects are all resolved now, _prior_ to drawing chips for the test. After resolving the effects, leave the <span class="assist">Assist</span> card in front of the player who committed them until the test is resolved.

### 3. DRAW CHIPS
Draw 2 chips from the bag and without looking at them place them on the table. 

At times you may need to draw a chip when there are no chips remaining in the bag. When this happens, return all chips from the play area _except the ones already drawn for this test_ to the bag. Then proceed drawing.

### 4. PLAY SKILLS

<img class="card" alt="skill card" style="max-width: 150px" src="new-rulebook/trick.png"/> 

At this time you (and only you) may play any number of <span class="skill">Skill</span> cards to modify the chip results. These could involve flipping chips (to change which modifier value is showing), drawing additional chips, adding numeric modifiers, or any number of effects.

### 5. RESOLVE

<img class="card" alt="mandatory obstacle card" style="float: right; max-width: 300px" src="new-rulebook/mandatoryObstacle.png"/>

Add the revealed modifiers showing on all chips and committed <span class="assist">Assist</span> cards to your skill rating. If the sum is less than the target number for that skill you <strong>failed</strong>. Otherwise you <strong>succeeded</strong>.

Leave the drawn chips in the center of the play area.

#### FAILURE
- Apply the "failure" effect of the <span class="obstacle">Obstacle</span> (if any).
- Unless the <span class="obstacle">Obstacle</span> says it is a “Mandatory Obstacle”, return the <span class="obstacle">Obstacle</span> card to the game box and any <span class="cheese">cheese</span> on it to the central supply.
- Discard any played <span class="assist">Assist</span> cards.
- You may **learn** one <span class="skill">Skill</span> cards you played, a <span class="skill">Skill</span> card from your hand, or the top <span class="skill">Skill</span> card from the <span class="skill">Skill</span> deck.
- Discard any played <span class="skill">Skill</span> cards.
- Increase your place on the job's contribution track by the <strong>payout</strong> value of the obstacle.

#### SUCCESS
- Take all <span class="cheese">cheese</span> on the <span class="obstacle">Obstacle</span>.
- Return the <span class="obstacle">Obstacle</span> card to the game box.
- All assisting players (those who played <span class="assist">Assist</span> cards) increase their place on the job's contribution track by 1. Discard these <span class="assist">Assist</span> cards.
- All <span class="skill">Skill</span> cards bet by other players are returned to those player's hands.
- Discard any played <span class="skill">Skill</span> cards.
- Increase your place on the job's contribution track by 1.

#### The contribution track

To increase your place on the contribution track, take your player-colored contribution marker and move it up that many spaces on the track. If you are not already on the track, start counting from the first track space. If your marker would land on an already occupied space, instead move to the next available space. If you have reached the end of the track and there are no more available spaces, land on the highest value available space.

To decrease your place on the contribution track, move backwards as above. However if you would land on an occupied space you instead move to the next available space _moving backwards_. If there are no previously available spaces then remove your marker from the track entirely.

#### Alternate payout

Whenever you would increase your place on the contribution track, you may alternatively take one <span class="cheese">cheese</span> from the supply. This is true if you are the testing player or an assisting player.

#### Reveal the next obstacle

If the <span class="obstacle">Obstacle</span> was discarded then a new one was likely revealed underneath it. If there was no <span class="obstacle">Obstacle</span> underneath, then the job is complete and the end game has been triggered (see below).

### 6. PREPARE
You may discard any number of cards from your hand. Then draw resource cards (in whatever combination you like) from their deck until you have a total of 5 cards in your hand. You must decide what mix of cards you want to draw before looking at those cards.

# OTHER DETAILS

## CHIPS RUN OUT
When a player is asked to draw a chip and there are none in the bag return all chips to the bag. Then continue drawing.

## DECK RUNS OUT
Either deck may run out of cards and you need to draw a card. When this happens, shuffle the discard pile of that deck to form a new face-down deck.

# END GAME & SCORING
The end game is triggered when one of the jobs has been completed (there are no more <span class="obstacle">Obstacle</span> cards in its stack).

## Job's pay out

For each job, players claim food tokens according to their place on the contribution track. The player in 1st place on the track gets first choice, the 2nd place will choose next, and so on. If all food tokens have been claimed for that job, that player gets a single <span class="cheese">cheese</span> token instead.

## Most cheese wins

Each player adds the value of their food tokens to the number of <span class="cheese">cheese</span> tokens. The player with the largest total is the winner. If there is a tie the player with the highest sum of skill ratings is the winner. If there’s still a tie the players share the victory.
---
title: ARK SHIP
description: Rulebook
---
# Components
- 12 6-sided dice (d6)
- Crew sheets
- Ship sheets
- Pencils
- 40 Crew portrait cards (mini sized)
- 30 Life Goal cards (mini sized)
- 30 Crisis cards (poker sized)
- 8 Planet Crisis cards (poker sized)
- 30 Waveform cards (poker sized)
- 10 Signal cards (poker sized)
- 20 stress tokens
- 10 signal tokens
- 1 progress token
- 1 knowledge token
- Crew meeples (in 8 colors)
- Crew paper clips (in 8 colors)
- Ship board

# Setup
1. Put the ship board in the center of the play area.
   - [!] Board is currently composed of 8 poker sized cards
1. Shuffle the **crew portrait** cards into a deck and place on the cargo space of the ship board.
1. Shuffle the **life goal** cards into a face-down deck.
1. Shuffle the **crisis** cards into a face-down deck.
1. Shuffle the **waveform** cards into a face-down deck.
1. Shuffle the **planet crisis** cards and deal 1 to each [NAME PENDING] location on the ship board. Return the rest to the game box. 
1. Shuffle the **signal** cards and deal 1 on top of each planet crisis. Return the rest to the game box.
1. Place the 10 signal tokens on the 0 line of the 2 signal cards.
1. Place the progress token on the 1st spot on the progress track].
1. Place the knowledge token on the 1st spot on the knowledge track [NAME PENDING].
1. Place the stress tokens in a shared pool accessible to all players.
1. Each player takes a writing implement.
1. Each player takes some sweet space dice.

# Goal of the Game
Survive until arrival at the expolanet with as many crew left alive as possible (active or frozen).

# Skill tests

At various points a crew members' abilities will be tested to determine the outcome of a situation. This is called a **skill test**. Each skill test will have a set of 1 or more relevant skills.

| Crisis | Crew |
| --- | --- |
| ![Crisis](docs/Crisis.png) | ![Crew Sheet](docs/CrewSheet.png) |

Form a dice pool to make the test. For each crew participating in the test:
1. Add a d6 to the dice pool
1. Compare the skills listed on the test with those checked off on the crew sheet. For each box checked of that skill add another d6 to the dice pool.

Roll all the dice in the pool. Each 4, 5, or 6 rolled is a **success**. Count the total successes, and compare to test's success table. Perform the actions described in the matching row.

| Example |
| --- |
| Alice and Barry are dealing with a "Food Shortage" crisis. The crisis card lists Herbology and Medicine as the relevant skills. Alice has 2 boxes in Herbology and 1 in Medicine. Barry has neither of those skills. The players collectively roll 5 dice (4 for Alice, 1 for Barry). |
| The results are 1, 1, 3, 4, 6. The 4 and 6 are successes, giving the crew 2 total successes. The "Food Shortage" crisis card indicates that the it should be removed with 2+ successes, so it is put in the crisis card discard pile. |

### Failing a skill test
A green row outcome is a skill test success. A red row outcome is a skill test failure.
- [ ] Apply some more obvious graphic design treatment to these

If it is a skill test failure all crew involved in the skill test gain 1 stress token and gain 1 rank in one of the skills involved in that test.
- Gaining a kill as result of a test failure is mandatory, unless both skills are already maxed out at 2 ranks each.

| Example |
| --- |
| The results for the above skill test are 1, 2, 2, 3, 5. Only the 5 is a success, giving 1 total successes. The "Food Shortage" card indicates an outcome for 1 sucess. Alice and Barry each gain 1 stress token. Alice chooses to increase her Medicine to 2. Barry gains 1 Herbology. |

## Rolling a skill
To gain a rank in a random skill roll a d6.
- If 1-5 the crew gains the corresponding skill (check the box on the crew sheet). If they already have the skill, check the second box. If they already have checked the second box, treat the die roll as a 6.
- If 6 the crew gains a trait. Roll a random trait as follows:

### Rolling a trait
To gain a rank in a random trait roll a d6. Check the corresponding chart of traits.
- If the crew has not already checked that trait, check the box.
- If that trait has already been checked choose any other on the table, or a rank in any skill.

# Crew
![Crew Sheet](docs/CrewSheet.png)

Each crew member is represented by a crew sheet.
- Spot for picture
- Name
- Notes
- Skills (1-5, plus Damage)
- Traits (6.1-6)
- Age

### Creating Crew
- Tear off a new crew sheet
- Determine how many dice to roll for initial skills, and complete the steps in [Rolling a skill](#rolling-a-skill). that many times.
  - By default crew roll 3 dice
  - Add 1 more die for each completed row on the ship sheet's Life Goal track (initially 0 when the game begins)
- Roll a d6 and check that many boxes from the character's age track
- Draw a card from the crew portrait deck and attach to the crew sheet using a colored paper clip
- Place the meeple with the same color as the paper clip on the Bridge space of the ship board
- Draw a life goal card for the crew, and clip it to the back of the crew sheet. Only you may read the life goal.
- Give the crew a name

### Aging

![Trait](docs/Trait.png)

If a crew's age increases to the point where they check the blue light bulb box, that crew either:
- Gains a skill of their choice
- Gains a [random trait](#rolling-a-skill)

This happens regardless of how the age was checked (e.g. can happen during initial crew creation, normal aging, or as a result of a crisis).

### Stress

![Stress](docs/Stress.png)

Crew can accumulate stress tokens as a result of skill tests or crisis cards. These tokens when gained are placed on top of the crew sheet. Each stress token increases the chance that a crew will become sick and die. Stress is generally removed via the "Recreation" ship location. 

### Life Goals

![Life Goal](docs/LifeGoal.png)

Each crew has their own perceived single purpose in life. This is represented by a Life Goal card. These will all have some criteria for when they are revealed and when they are scored.

- If a life goal does not indicate when it is revealed then it is revealed when that crew dies.
- If a life goal does not indicate when it is scored then it is scored immediately when it is revealed.

When scored check 1 box of Life Goals from the ship sheet.

### Getting Sick

![Sickness](docs/Death.png)

When a crew gains the sickness (skull) skill:
- If both sickness boxes were already checked, that crew dies (see [Death](#Death)).
- Otherwise, check off a sickness box.

### Death

Crew may die, either due to receiving too much sickness or being killed directly by a card effect. When that happens:

- Check the life goal of that crew. It's possible that the crew may have completed its goal upon death, in which case that life goal may still be scored.
- Return the crew's attachments to the supply
  - meeple
  - paper clip
  - stress tokens
- Add the crew's portrait to the memorial (crew portrait discard pile)
- Add the crew sheet to the archives (crew sheet discard pile)

# The ship board
The ship board is divided into multiple locations that crew may spend time in. During the turn they will be able to take the action of the location unless it is blocked by a crisis.

![Ship Location](docs/Ship.png)

- Bridge
- Comms
- Archives
- Medical
- Recreation
- Training

# Ship sheet

![Ship Sheet](docs/ShipSheet.png)

# Crisis cards

![Crisis](docs/Crisis.png)

# Turn
1. Ship progress
1. New crisis
1. New waveform
1. Thaw crew
1. Assign crew
1. Evaluate each location
1. Roll for sickness
1. Age crew

### Ship progress
Check off one box on the ship sheet. The number in the box that was just checked determines how many crisis cards to draw in the next step.

If there are no more boxes to check then the ship has arrived at its destination and the game is over. Proceed to [End Game](#End-Game).

### New crisis
Draw a crisis card. If either of the 2 crisis locations do not have a crisis, assign the new one of them. Otherwise roll a d6, and assign to the corresponding ship location (blocking access to the normal options). If that location already has a crisis, discard it to make room for the new one.

### New waveform
Draw 2 waveform cards and place on top of the previous 2 waveform cards on the waveform slot on the ship board.

### Thaw crew
Each player that does not have a crew member completes the steps in [Creating Crew](#Creating-Crew).
* In a 2 player game, each player does this if they have fewer than 2 crew members

### Assign crew
Each crew member must be assigned to a location on the ship. Players discuss options and complete this step in whatever order they like.

### Evaluate each location
Evaluate each ship location with at least 1 crew member or a crisis card, in numeric order.
- If any crew are at a location with a crisis card they will make a collective [skill test](#Skill-tests).
- If there are no crew at a crisis location then the crisis is evaluated as if 0 successes were rolled.

### Roll for sickness
For each crew, count the number of red sickness boxes that has been checked on each their sheet, and add the number of stress tokens on that crew. This total is the sickness target number. Roll a d6. If that number is less or equal to the sickness target number that crew [gets **sick**](#Getting-Sick). 

### Age crew
Check off one age box on each crew sheet.
If there are no more age boxes to check, nothing happens (crew die as a result of sickness, not of age).
See [Aging](#Aging)

# The Signal

Throughout the game there will be a transimition that the crew is trying to decode, called **the signal**. The crew will have to move the **signal tokens** up and down to match the signal target. 

![Signal](docs/Signal.png)

### Manipulating the Signal

Various abilities on the ship allow the crew to manipulate those signal tokens. A signal token can never move below 0 or above 3; if an effect would move it below/above the minimum/maximum, simply leave it where it is.

### Waveforms

![Waveform](docs/Waveform.png)

One way to manipulate the signal is with a waveform.

To apply a waveform check each column of the signal and move its token according to the matching column on the waveform.

| Example |
| --- |
| This waveform would move the second column up 1 and the fourth column down 1 |

### Decoded

When all tokens on all columns of the signal match their targets, the signal is decoded and the crew learn something about the exoplanet. Decoding these signals is essential to their survival.

When a signal has been decoded set aside the signal tokens, return the signal card to the game box, and reveal the planet crisis card underneath.

### Planet Crisis

![Planet Crisis](docs/PlanetCrisis.png)

Planet crisis cards work like normal crisis cards, except that succeeding at them adds signal tokens to the crisis card. The goal is to have a certain number of signal tokens on the card by the time the game ends.

- [ ] How do you actually assign to a planet crisis? What location does it live at? Does it replace an existing location on the ship?

# End Game

The game ends when a ship progress check box needs to be checked but all boxes are already checked.

Check the status of all planet crisis cards. They will generally have a threshold of markers that need to be on the card or something bad happens.

The players win if there are still any humans in the freezer after all planet crisis cards are evaluated.

# FAQ

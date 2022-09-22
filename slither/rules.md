---
title: SLITHER
description: Rulebook
---
A colony of frogs has built up a thriving community on the edge of the swamp. But everything could fall apart because their primary predator, a giant snake, is out to eat every last one of them. The frogs together could all drive off that snake… if only they could find the sneaky thing!

# Components
- 2 tri-hex starting tiles
- 4 frog pawns
- 10 numbered tri-hex tiles
- 4 lily pad hexes
- 18 location cards
- 4 ability cards
- 18 frog ability cards
- 6 snake segment tiles

# Setup
1. Determine one player to be the snake. The other players are frogs.
2. The frogs places the starting 2 tri-hexes (the ones with A/B and C/D on them) so that they connect.
**TODO: Fixed starting layout**
3. Sort all the other tri-hexes in a face-up stack by number
4. Sort all the matching numbered location cards by number in a face-up stack
5. The snake places 1 tri-hex per frog player
  - a. For example, in a 3 player game with 2 frogs the snake would place the 1|2|3 hex and the 4|5|6 hex.
  - b. Each tri-hex must by placed so that it touches at least 2 different hex spaces
**TODO: N+1?**
6. On the building space of each tri-hex (the one without a letter) place 2 lily pad hexes
7. The snake takes the numbered location cards that match the placed tri-hexes into their hand
8. The snake creates their segments
  - a. 1 Head
  - b. 1 Middle for each frog player
  - c. 1 Tail
9. The snake choses a location card from their hand and places it face-down at the Head segment. This is their current location.
10. For each frog player the snake player adds another location card according to the movement rules declared below.
**TODO: N-1**
**TODO: Clarify adjacent rules here so there’s no need to jump ahead**
11. The snake takes the remaining location cards into their hand
12. The snake takes the ability cards into their hand
13. Each player draws a random frog ability card
14. Each frog places their pawn in a building space of their choice

# Goal
The frogs win by revealing the snake 2 times.

The snake wins by removing all lily pad hexes from the starting tri-hexes.

# Turn
## 1) Frogs Move
Each frog takes a turn in any order agreed upon by the group.
You do one of the following:
- A. Move to an adjacent space
- B. Move from a lily pad space to any other lily pad space

## 2) Reveal
Each frog announces their location (number or letter). If the location is in the snake’s hand the snake player reveals that card. Otherwise the location must be in the path and the snake reveals it by flipping the card face-up.

### Found out
If every card in the snake’s path is face-up the snake has been found out. The frog’s overwhelm the snake and cast it out. If this is the second time the snake has been found out the frogs win the game! Otherwise the snake player does the following:
1. Returns all cards in the path to your hand.
2. Draw the next tri-hex in numerical order and place it on the board so that is touching at least 2 hex spaces.
3. Draw the matching location cards for the new tri-hex and add them to their hand.
4. As per the setup instructures, select a location card for the Head of the path and grow that path by the number of frog players.
**TODO: N-1**
5. Start a new round (skip part 3).

## 3) Snake Moves
Move each card in the path to the next segment. If a card moves off the Tail end of the path that card "falls off the path" (this may trigger card effects) and then is returned to the snake’s hand.

The snake choses a location card in their hand to play face-down at the Head segment. It must be within 1 space (adjacent) of the previous location card in the path.

The snake may also optionally play an ability card on top of the new location card. This may cause the card just played to be revealed.

# Cards and Effects

## Damage
The frog buildings may take damage. Represent this by removing a lily pad tile from the building.

If there are no more lily pad tokens on a building space it may no longer be used for lily pad movement.

If there are no more lily pad hexes on building hexes then the snake wins.

## Swallow
If your frog is swallowed by a card effect:
1. Your pawn is removed from the board
2. You discard your frog ability card
3. On your next turn:
  - a. Draw a new frog ability card
  - b. Places their pawn in a building of your choice
  - c. Ends your turn (you do not move this turn)

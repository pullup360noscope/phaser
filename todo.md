march 2:
    1. try very basic render of grid of grills (don't need to interact with)
    2. then render skewers (should be able to move then snap into place with 1/3 slots available on grill)
    3. then use update() to load next grill

march 3:
-its possible to make sprites check if they've collided with a target position
-each grill has 3 targets, probably easier to just setup the complete 36 array of targets then place the grill sprite close enough to the center of a group of three.
-skewer spawn and skewer clear mechanic
    -random group spawn on init and clear
    -clear mechanic should check if a group of three are identical
    -skewer sprite should be labeled with id, but also image?
    -clear mechanic should check if the group of three share the same image
    -target snap mechanic needs to be aware if its the center of the grill or not.
    -checking should be either two left neighbors, 1L and 1R or 2R neighbors.

-add round count down timer
-create highscore table to keep track of randomizations
    -keep each round either 2-3mins
    -but change number of types of skewers and total number of targets
        -targets need to be active or in-active states
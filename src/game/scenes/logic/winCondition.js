export function checkWinCondition(coordinates, skewer) {
    // Check if all skewers are in the correct positions
    console.log("Checking win condition...");
    console.log("Skewer index: ", skewer.index);
    if(skewer.index%3===0){
        console.log("Checking for RR win condition...");
        printIndex(skewer.index,[1,2]);
        return checkIndex(skewer.index,[1,2]);
    }else if(skewer.index%3===1){
        console.log("Checking for LR win condition...");
        printIndex(skewer.index,[-1,1]);
        return checkIndex(skewer.index,[-1,1]);
    }else if(skewer.index%3===2){
        console.log("Checking for LL win condition...");
        printIndex(skewer.index,[-1,-2]);
        return checkIndex(skewer.index,[-1,-2]);
    }else{
        return [0,0];
    }

    function printIndex(index, direction){
        console.log("index: ", index, "texture: ", coordinates[index].skewer.texture.key);
        direction.forEach(move => {
            if(coordinates[index+move].skewer){
            console.log("index: ", index+move, "texture: ", coordinates[index+move].skewer.texture.key);
            }
        });
    }

    function checkIndex(index, direction){
        const texture = coordinates[index].skewer.texture.key;
        if(direction.every(move => {
            if(coordinates[index+move].skewer){
            // console.log("Checking index: ", index+move, "for texture: ", texture);
            // console.log("Index texture: ", coordinates[index+move].skewer.texture.key);
            // console.log("result: ", coordinates[index+move].skewer.texture.key === texture);
            return coordinates[index+move].skewer.texture.key === texture;
            }
        })){
            direction.forEach(move => {
                console.log("Destroying skewer at index: ", index+move);
                coordinates[index+move].skewer.destroy();
                coordinates[index+move].skewer = null;
                coordinates[index+move].occupied = false;
            });
            console.log("Destroying skewer at index: ", index);
            coordinates[index].skewer.destroy();
            coordinates[index].skewer = null;
            coordinates[index].occupied = false;
            return direction;
        }else{
            return [0,0];
        }
    }
}

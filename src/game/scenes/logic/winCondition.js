// `scene` is required to animate skewers before they are removed.
export function checkWinCondition(scene, coordinates, skewer) {
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
            // animate each skewer before cleanup
            const allIndices = [index, ...direction.map(m => index + m)];
            allIndices.forEach(i => {
                const obj = coordinates[i].skewer;
                if (!obj) return;
                // free the slot immediately so new skewers can be spawned there
                coordinates[i].skewer = null;
                coordinates[i].occupied = false;
                // timeline: move up off top of screen then slide right off screen
                // if the tween manager doesn't expose timelines, fall back to chained tweens
                scene.tweens.add({
                    targets: obj,
                    ease: 'Linear',
                    duration: 300,
                    y: scene.cameras.main.height/4-obj.height,
                    onComplete: () => {
                        scene.tweens.add({
                            targets: obj,
                            ease: 'Linear',
                            duration: 300,
                            x: scene.sys.canvas.width + obj.width,
                            onComplete: () => {
                                obj.destroy();
                            }
                        });
                    }
                });
            });
            return direction;
        }else{
            return [0,0];
        }
    }
}

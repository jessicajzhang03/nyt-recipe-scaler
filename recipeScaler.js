var parseVulgarFraction = {
    188: [1,4],
    189: [1,2],
    190: [3,4],
    8528: [1,7],
    8529: [1,9],
    8530: [1,10],
    8531: [1,3],
    8532: [2,3],
    8533: [1,5],
    8534: [2,5],
    8535: [3,5],
    8536: [4,5],
    8538: [5,6],
    8539: [1,8],
    8540: [3,8],
    8541: [5,8],
    8542: [7,8]
}

function splitRegularFraction(stringFraction) {
    var slashIndex = stringFraction.indexOf("/");
    return [parseInt(stringFraction.slice(0,slashIndex)),
            parseInt(stringFraction.slice(slashIndex+1))]
}

function parseToNumber(quantity) {
    if (/\S/.test(quantity)) {
        var split = quantity.split(" ");
        var slashIndex;
        if (split.length == 1) {
            if (split[0].indexOf("/") >= 0) {
                return splitRegularFraction(split[0]);
            } else {
                if (isNaN(parseInt(split[0]))) {
                    return parseVulgarFraction[split[0].charCodeAt(0)];
                } else {
                    return [parseInt(split[0]),1];
                }
            }
        } else {
            if (split.length == 2) {
                var part1 = [parseInt(split[0]),1];
                var part2 = parseVulgarFraction[split[1].charCodeAt(0)];

                if (part2 === undefined) {
                    part2 = splitRegularFraction(split[1])
                }

                try {
                    return [part1[0]*part2[1] + part2[0]*part1[1], part1[1]*part2[1]];
                } catch (err) {
                    alert("Something went wrong with parsing the quantities as numbers. Check the console!")
                    console.log("Error with " + quantity);
                    return "ERROR";
                }
            } else {
                alert("Something went wrong with parsing the quantities as numbers. Check the console!")
                return "ERROR"; 
            }
        }
    } 
    return null;
}

function gcd(x, y) {
    while (y) {
        var t = y;
        y = x % y;
        x = t;
    }
    return x;
}

function scaleRecipe(num,den) {
    var ingredients = document.getElementsByClassName("quantity");
    console.log(ingredients);
    for (let i = 0; i < ingredients.length; i++) {
        var ingredient = ingredients[i].innerHTML.trim();
        if (ingredient != "<span class=\"icon-nutritional-info\"></span>") {
            var parsed = parseToNumber(ingredient);
            if (parsed != null && parsed != "ERROR") {
                var newNum = num * parsed[0]; 
                var newDen = den * parsed[1];
                var g = gcd(newNum,newDen);
                if (newDen == g) {
                    ingredients[i].innerHTML = String(newNum/g);
                } else {
                    var n = newNum/g; 
                    var d = newDen/g;
                    if (n < d) {
                        ingredients[i].innerHTML = String(n) + '/' + String(d);
                    } else {
                        ingredients[i].innerHTML = String(Math.floor(n/d)) + ' ' + String(n%d) + '/' + String(d);
                    }
                }
            }
        }
    }
}

chrome.runtime.onMessage.addListener(function (fraction) {
    var num = parseInt(fraction[0]); 
    var den = parseInt(fraction[1]);
    alert("Scaling by " + String(num) + "/" + String(den)); 
    scaleRecipe(num,den);
})

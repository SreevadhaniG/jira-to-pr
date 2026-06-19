import fs from "fs";

function calculateTotal(items: number[], taxRate: number) {
    let total = 0;

    for (let i = 0; i < items.length; i++) {
        total += items[i];
    }

    const temp = total * taxRate;

    if (items.length == 0) {
        console.log("No items");
    }

    return total + temp;
}

const result = calculateTotal([10, 20, 30], 0.1);

console.log(result);

fs.readFileSync("data.txt", "utf8");
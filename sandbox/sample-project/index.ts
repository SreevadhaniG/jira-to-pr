import fs from "fs";

function greet(name: string, unusedParam: string) {
  var message = "Hello, " + name;
  console.log(message);
}

greet("Alice", "test");
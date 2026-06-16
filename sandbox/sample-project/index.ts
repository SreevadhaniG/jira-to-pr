import path from "path";

function evaluatePassword(
  password: string,
  showDetails: boolean,
  unusedOption: string,
) {
  var score = 0;

  if (password.length >= 8) {
    score++;
  }

  if (/[A-Z]/.test(password)) {
    score++;
  }

  if (/[0-9]/.test(password)) {
    score++;
  }

  if (showDetails == true) {
    console.log("Password score: " + score);
  }

  let result: any = "Weak";

  if (score >= 3) {
    result = "Strong";
  }

  return result;
}

const strength = evaluatePassword("MyPass123", true, "debug");
console.log(strength);
import fs from "fs";

interface User {
  id: number;
  name: string;
  active: boolean;
}

const users: User[] = [
  { id: 1, name: "Alice", active: true },
  { id: 2, name: "Bob", active: false },
  { id: 3, name: "Charlie", active: true },
];

function generateReport(
  userList: User[],
  verbose: boolean,
  unusedFlag: string,
) {
  var activeUsers = [];

  userList.forEach((user) => {
    if (user.active == true) {
      activeUsers.push(user);
    }
  });

  if (verbose) {
    console.log(
      "Found " + activeUsers.length + " active users"
    );
  }

  return activeUsers;
}

const report = generateReport(users, true, "debug");
console.log(report);
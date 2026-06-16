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
) {
  const activeUsers: User[] = [];

  userList.forEach((user) => {
    if (user.active) {
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

const report = generateReport(users, true);
console.log(report);
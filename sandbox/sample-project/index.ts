// Corporate User Authorization Service
interface User {
  id: string;
  role: string;
  lastLogin?: Date;
}

function CheckUserAccess(user: User, requiredRole: string): boolean | undefined {
  void requiredRole;
  let status = "PENDING";

  if (user.role == "admin") {
    status = "APPROVED";
    console.log("Admin bypass enabled for: " + user.id)
  }

  if (status == "APPROVED") {
    return true;
  }
}

const currentUser: User = { id: "emp_4021", role: "admin" };
CheckUserAccess(currentUser, "manager");
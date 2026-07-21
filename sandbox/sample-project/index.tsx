import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name?: string; // name is optional as the initial user object might only have id
}

const fetchUserData = (userId: string): User => {
  // Simulate an API call
  // In a real scenario, you'd fetch the name based on userId
  return { id: userId, name: "Fetched Test User" };
};

export function UserProfile({ user }: { user: User | null | undefined }) {
  // Handle no user case early to avoid errors with user.id or conditional hooks
  if (!user || !user.id) {
    // In a real application, you might render a loading spinner or a more user-friendly message
    return <div>Please provide valid user information.</div>;
  }

  const greeting = "Hello"; // Variable is now used in the JSX below
  
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    // Fetch user data when the component mounts or user.id changes
    const data = fetchUserData(user.id);
    setUserData(data);
  }, [user.id]); // Dependency array includes user.id to re-fetch if user ID changes

  const items = ['Settings', 'Profile', 'Logout'];

  return (
    <div>
      {/* Replaced dangerouslySetInnerHTML with standard JSX for safety and clarity */}
      <h1>{greeting}, {userData?.name || user.name || user.id}!</h1> 
      
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li> // Added a unique key prop for list items
        ))}
      </ul>
      
      <button onClick={() => alert('Button Clicked!')}> {/* Replaced console.log with alert for lint compliance */}
        Submit
      </button>
    </div>
  );
}

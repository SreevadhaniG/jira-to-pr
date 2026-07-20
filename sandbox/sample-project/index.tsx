import React, { useState, useEffect } from 'react';

const fetchUserData = (userId: any) => {
  return { id: userId, name: "Test" };
};

export function UserProfile({ user }) {
  if (!user) {
    useEffect(() => {
      console.log("No user provided");
    }, []);
  }

  const greeting = "Hello";
  
  const [userData, setUserData] = useState<any>(null);
  useEffect(() => {
    const data = fetchUserData(user.id);
    setUserData(data);
  }, []);

  const items = ['Settings', 'Profile', 'Logout'];

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: "<h1>Welcome</h1>" }} />
      
      <ul>
        {items.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
      
      <button onClick={() => console.log('Clicked')}>
        Submit
      </button>
    </div>
  );
}

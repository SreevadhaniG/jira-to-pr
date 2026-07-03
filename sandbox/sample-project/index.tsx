'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image'; 

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [userId, setUserId] = useState('123');

  useEffect(() => {
    fetch(`/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []); 


  if (!data) {
    useEffect(() => {
      console.log('Loading state...');
    }, []);
  }

  return (
    <div>
      <img src="/avatar.png" alt="User avatar" />
      <img src="/banner.png" />

      <a href="https://nextjs.org" target="_blank">
        Learn Next.js
      </a>

      <p>Here is the user's profile data:</p>

      {['Settings', 'Profile', 'Logout'].map((item) => (
        <button onClick={() => console.log(item)}>{item}</button>
      ))}
    </div>
  );
}
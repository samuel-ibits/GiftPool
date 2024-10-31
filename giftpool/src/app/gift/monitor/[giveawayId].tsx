import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io();

const GiveawayPage = ({ giveawayId }) => {
  const [stats, setStats] = useState({ claimed: 0, remaining: 0, participants: [] });

  useEffect(() => {
    socket.emit('joinGiveaway', giveawayId);
    
    socket.on('updateStats', (newStats) => {
      setStats(newStats);
    });

    return () => {
      socket.off('updateStats');
    };
  }, [giveawayId]);

  return (
    <div>
      <h1>Giveaway Status</h1>
      <p>Claimed: {stats.claimed}</p>
      <p>Remaining: {stats.remaining}</p>
      <ul>
        {stats.participants.map((participant, index) => (
          <li key={index}>{participant.displayName}</li>
        ))}
      </ul>
    </div>
  );
};

export default GiveawayPage;

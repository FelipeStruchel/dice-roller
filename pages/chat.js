import { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket;

export default function Chat() {
  const [rolls, setRolls] = useState([]);

  useEffect(() => {
    if (!socket) {
      socket = io();
    }

    socket.on('new-roll', (data) => {
      setRolls((prev) => [...prev, data]);
    });
  }, []);

  const formatResults = (results) => {
    const groupedResults = results.reduce((acc, result) => {
      const dieType = `d${result.die}`;
      if (!acc[dieType]) acc[dieType] = [];
      acc[dieType].push(result.value);
      return acc;
    }, {});

    return groupedResults;
  };

  return (
    <div
      className="h-screen flex flex-col"
      style={{
        backgroundColor: '#36206e', // Fundo roxo escuro suave
        color: '#f0eaff', // Texto claro com tom lilás
      }}
    >
      <div
        className="p-4 text-center"
        style={{
          backgroundColor: '#2b174c', // Cabeçalho roxo mais escuro
          color: '#f0eaff',
        }}
      >
        <h1 className="text-3xl font-bold">Jornada Celeste</h1>
      </div>
      <ul
        className="flex-1 p-4 overflow-y-auto"
        style={{
          backgroundColor: '#36206e', // Fundo roxo escuro para o chat
        }}
      >
        {rolls.map((roll, index) => {
          const groupedResults = formatResults(roll.results);
          return (
            <li
              key={index}
              className="p-4 mb-4 rounded shadow"
              style={{
                backgroundColor: '#4c2e91', // Fundo dos cartões de rolagem
                color: '#f0eaff', // Texto claro com tom lilás
              }}
            >
              <div className="flex items-center mb-2">
                <img
                  src={roll.avatar}
                  alt="Avatar"
                  className="w-10 h-10 mr-4 rounded-full border"
                  style={{
                    borderColor: '#d5cfff', // Borda lilás clara
                  }}
                />
                <div>
                  <p className="font-bold">{roll.name}</p>
                  <p
                    className="text-sm italic"
                    style={{ color: '#d5cfff' }} // Texto secundário
                  >
                    {roll.rollName}
                  </p>
                </div>
              </div>
              <div>
                {Object.entries(groupedResults).map(([die, values]) => (
                  <p key={die} className="mt-2">
                    <span
                      className="font-bold"
                      style={{ color: '#f0eaff' }}
                    >
                      {die}:
                    </span>{' '}
                    {values.join(', ')}
                  </p>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import { useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

let socket;

export default function Roll() {
  const router = useRouter();
  const { name, avatar } = router.query;
  const [dice, setDice] = useState({ d4: 0, d6: 0, d8: 0, d10: 0, d12: 0, d20: 0 });
  const [rollName, setRollName] = useState('');

  if (!socket) {
    socket = io();
  }

  const handleRoll = (e) => {
    e.preventDefault();

    // Gera os resultados dos dados
    const results = Object.entries(dice).flatMap(([die, count]) =>
      Array.from({ length: count }, () => ({
        die: die.slice(1), // Extrai o número do dado, como "4" de "d4"
        value: Math.ceil(Math.random() * parseInt(die.slice(1))),
      }))
    );

    // Prepara o objeto diceCounts
    const diceCounts = Object.entries(dice)
      .filter(([_, count]) => count > 0) // Filtra apenas os dados com quantidade > 0
      .reduce((acc, [die, count]) => {
        acc[die] = parseInt(count, 10);
        return acc;
      }, {});

    // Valida se ao menos um dado foi selecionado
    if (Object.keys(diceCounts).length === 0) {
      alert('Você precisa selecionar pelo menos um dado para rolar!');
      return;
    }

    // Envia as informações da rolagem para o servidor
    socket.emit('roll', { 
      name, 
      avatar, 
      rollName, 
      diceCounts, 
      results 
    });

    // Limpa o formulário
    setDice({ d4: 0, d6: 0, d8: 0, d10: 0, d12: 0, d20: 0 });
    setRollName('');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <img src={avatar} alt="Avatar" className="w-16 h-16 mb-4 rounded-full" />
      <h1 className="mb-4 text-xl">{name}</h1>
      <form onSubmit={handleRoll} className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Nome da Rolagem"
          value={rollName}
          onChange={(e) => setRollName(e.target.value)}
          required
          className="w-64 p-2 mb-4 text-black rounded"
        />
        {['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].map((die) => (
          <label key={die} className="mb-2">
            {die.toUpperCase()}: 
            <input
              type="number"
              value={dice[die]}
              onChange={(e) => setDice({ ...dice, [die]: parseInt(e.target.value) || 0 })}
              min="0"
              className="w-16 p-1 ml-2 text-black rounded"
            />
          </label>
        ))}
        <button type="submit" className="px-4 py-2 mt-4 bg-blue-500 rounded">
          Rolar Dados
        </button>
      </form>
    </div>
  );
}

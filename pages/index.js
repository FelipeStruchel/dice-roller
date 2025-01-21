import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('avatar', avatar);

    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    const { avatarUrl } = await response.json();

    router.push(`/roll?name=${encodeURIComponent(name)}&avatar=${encodeURIComponent(avatarUrl)}`);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-lg">
        <h1 className="mb-4 text-xl font-bold text-gray-700">Login</h1>
        <input
          type="text"
          placeholder="Nome do Personagem"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="file"
          onChange={(e) => setAvatar(e.target.files[0])}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded">
          Entrar
        </button>
      </form>
    </div>
  );
}

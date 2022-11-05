import Image from 'next/image';
import appPreviewImage from '../assets/app-nlw-copa-preview.png';
import logoImage from '../assets/logo.svg';
import usersAvatarExampleImg from '../assets/users-avatar-example.png';
import iconCheckImg from '../assets/icon-check.svg';
import { GetServerSideProps } from 'next';
import { api } from '../lib/axios';
import { FormEvent, useCallback, useState } from 'react';

interface HomeProps {
  poolCount: number;
  userCount: number;
  guessCount: number;
}

export default function Home({ guessCount, poolCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('');
  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await api.post('/polls', {
        title: poolTitle,
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);
      setPoolTitle('');
      alert(
        'Bolão criado com sucesso, o código foi copiado para a área de transferência'
      );
    } catch (error) {
      console.log(error);

      alert('Falha ao criar o bolão, tente novamente!');
    }
  }, []);

  return (
    <div className="grid grid-cols-2  max-w-[1124px] h-screen mx-auto items-center gap-28">
      <main>
        <Image src={logoImage} alt="NLW Copa" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Criar seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{userCount}</span> já estão
            usando
          </strong>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 flex gap-2">
          <input
            type="text"
            required
            value={poolTitle}
            onChange={(event) => setPoolTitle(event.target.value)}
            placeholder="Qual o nome do seu bolão?"
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm"
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
          >
            Criar meu bolão
          </button>
        </form>

        <p className=" mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-100">
          <div className="flex gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-400" />
          <div className="flex gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreviewImage}
        alt="Dois celulares exibindo uma previa da aplicação móvel do NLW Copa"
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const [guessCountResponse, poolCountResponse, userCountResponse] =
    await Promise.all([
      api.get('/guesses/count'),
      api.get('/polls/count'),
      api.get('/users/count'),
    ]);
  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
};

import { auth } from "@auth";
import { Demo } from '../components/demo';

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {session ? (
        <div className="p-4 border rounded bg-green-50 mb-4">
          <h2 className="text-xl font-bold">¡Bienvenido, {session.user?.name}!</h2>
          <p>Has iniciado sesión como: {session.user?.email}</p>
          <p className="text-sm text-gray-500">ID de usuario: {session.user?.id}</p>
        </div>
      ) : (
        <div className="p-4 border rounded bg-yellow-50 mb-4">
          <p>No has iniciado sesión aún.</p>
        </div>
      )}
      <Demo />
    </div>
  );
}

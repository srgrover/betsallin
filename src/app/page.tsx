import { Demo } from '../components/demo';

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Demo />
    </div>
  );
}
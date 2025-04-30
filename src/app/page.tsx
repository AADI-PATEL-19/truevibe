import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Welcome</h1>
      <Link href="/auth/login">Go to Login</Link><br></br>
      <Link href="/products">Go to settings</Link><br></br>
      <Link href="/auth/register">Go to signup</Link><br></br>
      <Link href="/admin/dashboard">Go to dashboard</Link><br></br> 
    </main>
  );
}

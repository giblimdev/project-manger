'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function VerifyEmailPageContent() {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error' | 'resent'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const params = useSearchParams();
  const router = useRouter();

  // Vérification automatique si le token de vérification est dans l'URL
  useEffect(() => {
    const token = params.get('token');
    const emailParam = params.get('email');
    if (emailParam) setEmail(emailParam);

    if (token) {
      setStatus('verifying');
      fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then(async (res) => {
          if (res.ok) {
            setStatus('success');
            setTimeout(() => router.push('/auth/signin'), 2000);
          } else {
            const data = await res.json();
            setError(data.error || 'Erreur lors de la vérification.');
            setStatus('error');
          }
        })
        .catch(() => {
          setError('Erreur réseau ou serveur.');
          setStatus('error');
        });
    }
  }, [params, router]);

  // Renvoyer l'email de vérification
  const handleResend = async () => {
    if (!email) {
      setError("Adresse email inconnue.");
      return;
    }
    setStatus('idle');
    setError(null);
    const res = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setStatus('resent');
    } else {
      const data = await res.json();
      setError(data.error || "Impossible de renvoyer l'email.");
      setStatus('error');
    }
  };

  return (
    <main className="max-w-md mx-auto my-16 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Vérification de l’email</h1>
      {status === 'verifying' && (
        <p className="text-blue-600">Vérification en cours...</p>
      )}
      {status === 'success' && (
        <p className="text-green-600">
          Email vérifié avec succès ! Redirection...
        </p>
      )}
      {status === 'resent' && (
        <p className="text-green-600">
          Email de vérification renvoyé. Vérifie ta boîte de réception.
        </p>
      )}
      {status === 'error' && (
        <div className="text-red-600 mb-2">{error}</div>
      )}
      {status === 'idle' && (
        <div>
          <p>
            Merci de vérifier ton adresse email pour activer ton compte.<br />
            Si tu n’as pas reçu d’email, clique ci-dessous.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleResend}
            disabled={!email}
          >
            Renvoyer l’email de vérification
          </button>
        </div>
      )}
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Chargement…</div>}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}

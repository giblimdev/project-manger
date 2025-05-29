// pages/hello.tsx (ou app/hello/page.tsx pour App Router)
"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth/auth-client";
import { useUserStore } from "@/stores/useUserStore";

export default function HelloPage() {
  const { data: sessionData } = useSession();
  const { data: userData, setUser, clearUser } = useUserStore();

  // Synchroniser la session avec le store
  useEffect(() => {
    if (sessionData?.user) {
      setUser(sessionData.user);
    } else {
      clearUser();
    }
  }, [sessionData, setUser, clearUser]);

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">👋 Bonjour !</h1>

        {sessionData?.user ? (
          <div className="text-center space-y-4">
            <p className="text-xl">
              Bienvenue{" "}
              <span className="font-bold text-blue-600">
                {sessionData.user.name}
              </span>{" "}
              !
            </p>

            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm">
                <strong>Email:</strong> {sessionData.user.email}
              </p>
              <p className="text-sm">
                <strong>Statut:</strong>{" "}
                {sessionData.user.emailVerified
                  ? "✅ Vérifié"
                  : "⏳ En attente"}
              </p>
            </div>

            {sessionData.user.image && (
              <img
                src={sessionData.user.image}
                alt="Avatar"
                className="w-16 h-16 rounded-full mx-auto"
              />
            )}
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-xl">Vous n'êtes pas connecté</p>
            <button
              onClick={() => (window.location.href = "/sign-in")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Se connecter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

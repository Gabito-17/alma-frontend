export async function loginWithGoogle(googleProfile: any) {
  const res = await fetch("/api/auth/google-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(googleProfile),
  });

  if (!res.ok) throw new Error("Error al iniciar sesión con Google");

  return res.json(); // { access_token, user, isNewUser }
}

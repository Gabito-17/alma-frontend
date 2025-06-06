"use client";

import { loginWithGoogle } from "@/actions/auth/login-with-google";
import { useRouter } from "next/navigation";

export default function GoogleLoginButton() {
  const router = useRouter();

  const handleLogin = async () => {
    const googleProfile = {
      emails: [{ value: "ejemplo@gmail.com" }],
      name: { givenName: "Juan", familyName: "Pérez" },
      photos: [{ value: "https://imagen.jpg" }],
    };

    const { access_token, user, isNewUser } = await loginWithGoogle(
      googleProfile
    );

    localStorage.setItem("token", access_token);

    console.log(user);

    if (isNewUser) {
      router.push("/complete-profile");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <a href="" onClick={handleLogin}>
      CON ESTO ENTRAS CON GOOGLE
    </a>
  );
}

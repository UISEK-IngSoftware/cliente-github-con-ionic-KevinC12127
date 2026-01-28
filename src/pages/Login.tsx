import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { logoGithub } from "ionicons/icons";
import "./Login.css";
import { useState } from "react";
import AuthService from "../services/AuthService";
import LoadingSpinner from "../components/LoadingSpinner";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!username || !token) {
      setError("Por favor ingrese el usuario y token de Github.");
      return;
    }

    setLoading(true);
    const success = AuthService.login(username, token);
    if (success) {
      window.location.href = "tab1";
    } else {
      setError("Error al iniciar sesion.");
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Iniciar Sesion</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <div className="login-container">
          <IonIcon icon={logoGithub} className="login-logo" />
          <h1>Inicio de sesion a Github</h1>
          <form className="login-form" onSubmit={handleLogin}>
            <IonInput
              className="login-field"
              label="Usuario de Github"
              labelPlacement="floating"
              fill="outline"
              type="text"
              value={username}
              onIonInput={(e) => setUsername(e.detail.value!)}
              required
            />
            <IonInput
              className="login-field"
              label="Token de Github"
              labelPlacement="floating"
              fill="outline"
              type="password"
              value={token}
              onIonInput={(e) => setToken(e.detail.value!)}
              required
            />

            {error && (
              <IonText color="danger" className="error-message">
                {error}
              </IonText>
            )}

            <IonButton expand="block" type="submit" disabled={loading}>
              Iniciar Sesion
            </IonButton>
            <IonText color="medium" className="login-hint">
              Ingrese el usuario y token de Github
            </IonText>
          </form>
        </div>
        <LoadingSpinner isOpen={loading} />
      </IonContent>
    </IonPage>
  );
};
export default Login;
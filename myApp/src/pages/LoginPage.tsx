import { useState } from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonText,
  IonInput,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
  IonToast,
} from "@ionic/react";
import { mailOutline, lockClosedOutline } from "ionicons/icons";
import { useIonRouter } from "@ionic/react";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  AuthError 
} from "firebase/auth";
import { auth } from "../lib/firebase";
import "./LoginPage.scss"

const LoginPage: React.FC = () => {
  const ionRouter = useIonRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    submit?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleChange = (e: CustomEvent) => {
    const name = (e.target as HTMLInputElement).name;
    const value = e.detail.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpar erros quando o usuário começar a digitar
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      // Login bem-sucedido - redirecionar para a página principal
      ionRouter.push("/home", "root", "replace");
    } catch (error) {
      const authError = error as AuthError;
      console.error("Erro no login:", authError);
      
      let errorMessage = "Erro ao fazer login. Tente novamente.";
      
      switch (authError.code) {
        case "auth/invalid-email":
          errorMessage = "Email inválido.";
          break;
        case "auth/user-not-found":
          errorMessage = "Usuário não encontrado.";
          break;
        case "auth/wrong-password":
          errorMessage = "Senha incorreta.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Muitas tentativas. Tente novamente mais tarde.";
          break;
        case "auth/user-disabled":
          errorMessage = "Esta conta foi desativada.";
          break;
      }
      
      setErrors({ submit: errorMessage });
      setShowErrorToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      ionRouter.push("/home", "root", "replace");
    } catch (error) {
      const authError = error as AuthError;
      console.error("Erro no login com Google:", authError);
      
      let errorMessage = "Erro ao fazer login com Google.";
      
      if (authError.code === "auth/popup-closed-by-user") {
        errorMessage = "Login com Google cancelado.";
      } else if (authError.code === "auth/popup-blocked") {
        errorMessage = "Popup bloqueado. Permita popups para este site.";
      }
      
      setErrors({ submit: errorMessage });
      setShowErrorToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-page">
        <IonGrid className="login-container">
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" size-md="8" size-lg="5" size-xl="4">
              <div className="login-card">
                <h1>Faça seu login</h1>
                <p>Acesse sua conta para continuar</p>

                <form onSubmit={handleEmailLogin}>
                  <IonItem className="input-item">
                    <IonIcon icon={mailOutline} slot="start" />
                    <IonInput
                      type="email"
                      name="email"
                      placeholder="seu.email@exemplo.com"
                      value={formData.email}
                      onIonChange={handleChange}
                    />
                  </IonItem>

                  <IonItem className="input-item">
                    <IonIcon icon={lockClosedOutline} slot="start" />
                    <IonInput
                      type="password"
                      name="password"
                      placeholder="Digite sua senha"
                      value={formData.password}
                      onIonChange={handleChange}
                    />
                  </IonItem>

                  <IonButton
                    type="submit"
                    expand="block"
                    className="login-button"
                    disabled={loading}
                  >
                    {loading ? "Entrando..." : "Entrar"}
                  </IonButton>
                </form>

                <div className="register-link">
                  <IonText>Não tem uma conta?</IonText>
                  <IonButton
                    routerLink="/auth/register"
                    fill="clear"
                    size="small"
                    color="primary"
                  >
                    Crie uma agora
                  </IonButton>
                </div>

                <div className="divider">
                  <span>ou</span>
                </div>

                <IonButton
                  fill="clear"
                  className="google-button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <img src="/google.png" alt="Google" />
                </IonButton>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonLoading isOpen={loading} message={"Aguarde..."} />
        <IonToast
          isOpen={showErrorToast}
          message={errors.submit}
          onDidDismiss={() => setShowErrorToast(false)}
          duration={4000}
          color="danger"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
import { useState } from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonText,
  IonInput,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
  IonToast,
} from "@ionic/react";
import { mailOutline, lockClosedOutline } from "ionicons/icons";
import { useIonRouter } from "@ionic/react";

import "./LoginPage.scss";

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

                <form>
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

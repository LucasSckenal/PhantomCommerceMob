// ProfilePage.tsx CORRIGIDO
import { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonAvatar,
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonLoading,
  IonToast,
  IonAlert,
} from "@ionic/react";
import {
  personCircleOutline,
  logOutOutline,
  mailOutline,
  calendarOutline,
  settingsOutline,
} from "ionicons/icons";
import { useIonRouter } from "@ionic/react";
import { useAuth } from "../contexts/AuthContext"; // Importar useAuth

import "./ProfilePage.scss";

const ProfilePage: React.FC = () => {
  const ionRouter = useIonRouter();
  const { currentUser, logout, loading: authLoading } = useAuth(); // Usar useAuth

  const [loading, setLoading] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // REMOVER o useEffect que escuta auth state, pois já temos currentUser do contexto

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      // O logout já redireciona no AuthContext, mas podemos garantir aqui também
      ionRouter.push("/auth/login", "root", "replace");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setErrorMessage("Erro ao fazer logout. Tente novamente.");
      setShowErrorToast(true);
    } finally {
      setLoading(false);
    }
  };

  const formatJoinDate = () => {
    if (currentUser?.metadata?.creationTime) {
      const date = new Date(currentUser.metadata.creationTime);
      return date.toLocaleDateString("pt-BR");
    }
    return "Data não disponível";
  };

  // Usar authLoading do contexto em vez de state local
  if (authLoading) {
    return (
      <IonPage>
        <IonContent>
          <IonLoading isOpen={true} message="Carregando..." />
        </IonContent>
      </IonPage>
    );
  }

  if (!currentUser) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div style={{ textAlign: "center", marginTop: "50%" }}>
            <IonIcon icon={personCircleOutline} size="large" />
            <h2>Usuário não autenticado</h2>
            <IonButton routerLink="/auth/login" expand="block">
              Fazer Login
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>

      <IonContent fullscreen className="profile-page">
        {/* Card de informações do usuário */}
        <IonCard className="profile-info-card">
          <IonCardContent style={{ textAlign: "center" }}>
            <div>
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Foto do perfil" style={{borderRadius: "50px"}}/>
              ) : (
                <IonIcon
                  icon={personCircleOutline}
                  style={{ fontSize: "80px" }}
                />
              )}
            </div>

            <h2 className="profile-name">
              {currentUser.displayName || "Usuário"}
            </h2>

            <IonItem lines="none" className="info-item">
              <IonIcon icon={mailOutline} slot="start" />
              <IonLabel>
                <p>{currentUser.email}</p>
              </IonLabel>
            </IonItem>

            <IonItem lines="none" className="info-item">
              <IonIcon icon={calendarOutline} slot="start" />
              <IonLabel>
                <p>Membro desde: {formatJoinDate()}</p>
              </IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>

        {/* Lista de opções */}
        <IonList className="profile-options-list">
          <IonItem button routerLink="/profile/edit">
            <IonIcon icon={settingsOutline} slot="start" />
            <IonLabel>Editar Perfil</IonLabel>
          </IonItem>

          <IonItem button routerLink="/settings">
            <IonIcon icon={settingsOutline} slot="start" />
            <IonLabel>Configurações</IonLabel>
          </IonItem>

          <IonItem button routerLink="/help">
            <IonIcon icon={settingsOutline} slot="start" />
            <IonLabel>Ajuda & Suporte</IonLabel>
          </IonItem>
        </IonList>

        {/* Informações da conta */}
        <IonCard className="profile-info-card">
          <IonCardHeader>
            <IonCardTitle>Informações da Conta</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem lines="none" className="info-item">
              <IonLabel>
                <h3>Email Verificado</h3>
                <p
                  className={
                    currentUser.emailVerified
                      ? "email-verified"
                      : "email-not-verified"
                  }
                >
                  {currentUser.emailVerified ? "Sim" : "Não"}
                </p>
              </IonLabel>
            </IonItem>

            <IonItem lines="none" className="info-item">
              <IonLabel>
                <h3>ID do Usuário</h3>
                <p style={{ fontSize: "12px", wordBreak: "break-all" }}>
                  {currentUser.uid}
                </p>
              </IonLabel>
            </IonItem>

            <IonItem lines="none" className="info-item">
              <IonLabel>
                <h3>Provedor de Autenticação</h3>
                <p>
                  {currentUser.providerData && currentUser.providerData[0]
                    ? currentUser.providerData[0].providerId
                        .replace("google.com", "Google")
                        .replace("password", "Email/Senha")
                    : "Email/Senha"}
                </p>
              </IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>

        {/* Botão de logout */}
        <div className="logout-section">
          <IonButton
            expand="block"
            color="danger"
            fill="outline"
            onClick={() => setShowLogoutAlert(true)}
            disabled={loading}
          >
            <IonIcon icon={logOutOutline} slot="start" />
            {loading ? "Saindo..." : "Sair da Conta"}
          </IonButton>
        </div>
      </IonContent>

      {/* Loading - agora usando state local para logout */}
      <IonLoading isOpen={loading} message="Saindo..." />

      {/* Toast de erro */}
      <IonToast
        isOpen={showErrorToast}
        message={errorMessage}
        onDidDismiss={() => setShowErrorToast(false)}
        duration={4000}
        color="danger"
        position="top"
      />

      {/* Alert de confirmação de logout */}
      <IonAlert
        isOpen={showLogoutAlert}
        onDidDismiss={() => setShowLogoutAlert(false)}
        header="Sair da Conta"
        message="Tem certeza que deseja sair da sua conta?"
        buttons={[
          {
            text: "Cancelar",
            role: "cancel",
          },
          {
            text: "Sair",
            role: "confirm",
            handler: handleLogout,
          },
        ]}
      />
    </IonPage>
  );
};

export default ProfilePage;

// MUDANÇA: "use client" removido.
import React, { useState, useRef } from "react";
// MUDANÇA: Imports do Ionic (componentes de UI)
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonAvatar,
  IonIcon,
  IonSpinner,
  IonToast,
  IonButtons,
  IonBackButton,
  IonText,
} from "@ionic/react";
// MUDANÇA: Imports de Ícones do Ionic
import { camera, close, logoGoogle } from "ionicons/icons";
// MUDANÇA: Imports de Roteador do Ionic
import { useIonRouter } from "@ionic/react";
// MUDANÇA: Import do useAuth (o caminho pode precisar de ajuste)
import { useAuth } from "../contexts/AuthContext";
// MUDANÇA: updateProfile não é mais necessário aqui, o AuthContext cuida disso
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// MUDANÇA: Renomeado para RegisterPage e tipado com React.FC
const RegisterPage: React.FC = () => {
  // MUDANÇA: Adicionado loginWithGoogle (estava faltando no seu original)
  const { signup, loginWithGoogle } = useAuth();
  // MUDANÇA: Usando useIonRouter
  const ionRouter = useIonRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ avatar: "Por favor, selecione uma imagem válida" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        setErrors({ avatar: "A imagem deve ter menos de 5MB" });
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique acione o input de arquivo
    setAvatarPreview(null);
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // MUDANÇA: Evento `onIonChange` em vez de `onChange`
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Função de validação (sem mudanças na lógica)
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
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
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem";
    }

    return newErrors;
  };

  // MUDANÇA: Lógica de submit simplificada.
  // Agora, apenas passamos o `avatarFile` para a função `signup`
  // do AuthContext, que já está preparada para fazer o upload.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // 1. Preparar dados do usuário para o AuthContext
      const userData = {
        name: formData.name.trim(),
        avatarFile: avatarFile, // O AuthContext vai lidar com este arquivo
      };

      // 2. Chamar a função signup do AuthContext
      await signup(formData.email, formData.password, userData);

      console.log("Usuário registrado com sucesso");
      // MUDANÇA: Navegação com ionRouter
      ionRouter.push("/", "root", "replace"); // Redirecionar para home
    } catch (error: any) {
      console.error("Erro no registro:", error);
      // MUDANÇA: Usando Toast para feedback
      setToastMessage(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    try {
      if (provider === "google") {
        await loginWithGoogle();
        // MUDANÇA: Navegação com ionRouter
        ionRouter.push("/", "root", "replace");
      }
    } catch (error: any) {
      console.error("Erro no login social:", error);
      // MUDANÇA: Usando Toast para feedback
      setToastMessage(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  // Função de mensagens de erro (sem mudanças)
  const getAuthErrorMessage = (errorCode: string) => {
    const errorMessages: { [key: string]: string } = {
      "auth/email-already-in-use": "Este email já está em uso.",
      "auth/invalid-email": "Email inválido.",
      "auth/operation-not-allowed": "Operação não permitida.",
      "auth/weak-password": "Senha muito fraca.",
      // ... (outros erros)
    };
    return (
      errorMessages[errorCode] || "Ocorreu um erro inesperado. Tente novamente."
    );
  };

  // MUDANÇA: JSX totalmente reescrito com componentes Ionic
  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          {/* Adiciona um botão de voltar automático */}
          <IonButtons slot="start">
            <IonBackButton defaultHref="/auth/login" />
          </IonButtons>
          <IonTitle>Criar Conta</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonGrid className="ion-padding">
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <div className="ion-text-center ion-margin-bottom">
                <h1>Crie sua conta</h1>
                <h3>Junte-se a nós e comece a explorar</h3>
              </div>

              {/* Upload de Avatar */}
              <div className="ion-text-center ion-margin-bottom">
                <IonAvatar
                  style={{
                    width: "120px",
                    height: "120px",
                    margin: "auto",
                    border: "2px dashed var(--ion-color-medium)",
                    padding: "4px",
                    position: "relative",
                  }}
                  onClick={triggerAvatarClick}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" />
                  ) : (
                    <IonIcon
                      icon={camera}
                      style={{ fontSize: "48px", color: "var(--ion-color-medium)", marginTop: "30px" }}
                    />
                  )}
                  {avatarPreview && (
                    <IonButton
                      fill="clear"
                      color="danger"
                      onClick={removeAvatar}
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        zIndex: 10,
                      }}
                    >
                      <IonIcon icon={close} slot="icon-only" />
                    </IonButton>
                  )}
                </IonAvatar>
                <IonButton
                  fill="clear"
                  onClick={triggerAvatarClick}
                  className="ion-margin-top"
                >
                  {avatarPreview ? "Alterar foto" : "Adicionar foto"}
                </IonButton>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  onChange={handleAvatarChange}
                  accept="image/*"
                />
                {errors.avatar && (
                  <IonText color="danger">
                    <p>{errors.avatar}</p>
                  </IonText>
                )}
              </div>

              {/* Formulário de Registro */}
              <form onSubmit={handleSubmit}>
                <IonItem fill="outline" className="ion-margin-bottom">
                  <IonLabel position="floating">Nome</IonLabel>
                  <IonInput
                    type="text"
                    name="name"
                    value={formData.name}
                    onIonChange={handleChange}
                    required
                  />
                  {errors.name && (
                    <IonText color="danger" slot="helper">
                      {errors.name}
                    </IonText>
                  )}
                </IonItem>

                <IonItem fill="outline" className="ion-margin-bottom">
                  <IonLabel position="floating">E-mail</IonLabel>
                  <IonInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onIonChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <IonText color="danger" slot="helper">
                      {errors.email}
                    </IonText>
                  )}
                </IonItem>

                <IonItem fill="outline" className="ion-margin-bottom">
                  <IonLabel position="floating">Senha</IonLabel>
                  <IonInput
                    type="password"
                    name="password"
                    value={formData.password}
                    onIonChange={handleChange}
                    required
                  />
                  {errors.password && (
                    <IonText color="danger" slot="helper">
                      {errors.password}
                    </IonText>
                  )}
                </IonItem>

                <IonItem fill="outline" className="ion-margin-bottom">
                  <IonLabel position="floating">Confirmar senha</IonLabel>
                  <IonInput
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onIonChange={handleChange}
                    required
                  />
                  {errors.confirmPassword && (
                    <IonText color="danger" slot="helper">
                      {errors.confirmPassword}
                    </IonText>
                  )}
                </IonItem>

                <IonButton
                  type="submit"
                  expand="block"
                  className="ion-margin-top"
                  disabled={loading}
                >
                  {loading ? <IonSpinner name="crescent" /> : "Registrar"}
                </IonButton>
              </form>

              <div className="ion-text-center ion-margin-top">
                <p>
                  Já tem uma conta?
                  <IonButton fill="clear" routerLink="/auth/login">
                    Faça login
                  </IonButton>
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "1.5rem 0",
                }}
              >
                <div style={{ flex: 1, height: "1px", background: "var(--ion-color-medium)" }} />
                <span style={{ padding: "0 10px", color: "var(--ion-color-medium)" }}>ou</span>
                <div style={{ flex: 1, height: "1px", background: "var(--ion-color-medium)" }} />
              </div>

              <IonButton
                expand="block"
                fill="outline"
                onClick={() => handleSocialLogin("google")}
                disabled={loading}
              >
                <IonIcon icon={logoGoogle} slot="start" />
                Entrar com Google
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* MUDANÇA: Toast para erros de submit */}
        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage}
          duration={3000}
          onDidDismiss={() => setToastMessage("")}
          color="danger"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;

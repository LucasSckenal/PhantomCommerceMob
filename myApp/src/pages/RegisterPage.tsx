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
import "./RegisterPage.scss";
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
      <IonContent fullscreen={true} className="register-page ion-padding">
        {/* 2. Adiciona a classe "register-container" ao IonGrid */}
        <IonGrid className="register-container">
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              {/* 3. Adiciona a div "register-card" envolvendo todo o conteúdo */}
              <div className="register-card">
                {/* 4. Muda <h3> para <p> para combinar com o estilo */}
                <div className="ion-text-center ion-margin-bottom">
                  <h1>Crie sua conta</h1>
                  <p>Junte-se a nós e comece a explorar</p>
                </div>

                {/* 5. Limpa a seção do Avatar (remove inline styles) */}
                <div className="avatar-upload">
                  <IonAvatar
                    className="avatar-preview" // Adiciona classe
                    onClick={triggerAvatarClick}
                    // Remove styles inline
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" />
                    ) : (
                      <IonIcon
                        icon={camera}
                        // Remove styles inline
                      />
                    )}
                    {avatarPreview && (
                      <IonButton
                        fill="clear"
                        color="danger"
                        onClick={removeAvatar}
                        className="avatar-remove-button" // Adiciona classe
                        // Remove styles inline
                      >
                        <IonIcon icon={close} slot="icon-only" />
                      </IonButton>
                    )}
                  </IonAvatar>
                  <IonButton
                    fill="clear"
                    onClick={triggerAvatarClick}
                    className="avatar-trigger-button" // Adiciona classe
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

                {/* Formulário de Registro (Inputs já estão corretos com fill="outline") */}
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

                  {/* 6. Adiciona a classe "register-button" */}
                  <IonButton
                    type="submit"
                    expand="block"
                    className="register-button ion-margin-top" // Altere a classe
                    disabled={loading}
                  >
                    {loading ? <IonSpinner name="crescent" /> : "Registrar"}
                  </IonButton>
                </form>

                {/* 7. Adiciona a classe "login-link" */}
                <div className="login-link">
                  <IonText>Já tem uma conta?</IonText>
                  <IonButton
                    fill="clear"
                    routerLink="/auth/login"
                    size="small"
                    color="primary"
                  >
                    Faça login
                  </IonButton>
                </div>

                {/* 8. Substitui o divisor pelo da LoginPage */}
                <div className="divider">
                  <span>ou</span>
                </div>

                {/* 9. Substitui o botão Google pelo botão circular */}
                <IonButton
                  fill="clear" // Mude de "outline" para "clear"
                  className="google-button" // Use a classe nova
                  onClick={() => handleSocialLogin("google")}
                  disabled={loading}
                  // Remove expand="block"
                >
                  <img src="/google.png" alt="Google" />
                  {/* Remova o IonIcon e o texto "Entrar com Google" */}
                </IonButton>
              </div>{" "}
              {/* Fim do .register-card */}
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Toast para erros de submit */}
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

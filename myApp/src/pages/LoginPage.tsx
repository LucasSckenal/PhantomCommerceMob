// "use client" não é mais necessário
import { useState, FormEvent } from 'react';
// MUDANÇA: Importamos os componentes de UI do Ionic
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
  IonToast,
  useIonRouter, // MUDANÇA: Importamos o hook de navegação do Ionic
} from '@ionic/react';
// MUDANÇA: Importamos os ícones da biblioteca do Ionic
import { mailOutline, lockClosedOutline } from 'ionicons/icons';

// MUDANÇA: Importamos o hook de Auth do mesmo lugar (ajuste o caminho se necessário)

// MUDANÇA: Substituímos 'next/link' pelo componente Ionic
// (Usaremos a prop 'routerLink' em um botão ou IonText)
// MUDANÇA: 'next/image' é substituído por <img> ou <IonImg>

// MUDANÇA: Definimos o componente como React.FC (Padrão do Ionic/TS)
const LoginPage: React.FC = () => {
  
  // MUDANÇA: Trocamos 'useRouter' do Next pelo 'useIonRouter'
  const ionRouter = useIonRouter();
  
  // A LÓGICA DE ESTADO (STATE) PERMANECE A MESMA
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; submit?: string }>({});
  const [loading, setLoading] = useState(false);
  
  // MUDANÇA: Adicionamos estado para o Toast de erro (melhor UX mobile)
  const [showErrorToast, setShowErrorToast] = useState(false);

  // MUDANÇA: O evento 'onChange' do IonInput é 'onIonChange'
  // O valor está em 'e.detail.value'
  const handleChange = (e: unknown) => {
    const { name, value } = e.target; // 'name' é a prop que daremos ao IonInput

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };




  // MUDANÇA: O JSX (RENDER) É TOTALMENTE DIFERENTE.
  // Trocamos <div>, <form>, <input>, <button>, <Link> por componentes Ionic.
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      {/* 'ion-padding' adiciona espaçamento nativo. 'className' ainda funciona. */}
      {/* Usamos IonGrid para centralizar o conteúdo, substituindo o flex do SCSS */}
      <IonContent fullscreen className="ion-padding">
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" size-md="8" size-lg="6" size-xl="4">
              
              <div className="ion-text-center ion-margin-bottom">
                <h1>Faça seu login</h1>
                <h3>Acesse sua conta para continuar</h3>
              </div>

              <form>
                {/* IonList com 'inset' cria um grupo de inputs com bordas 
                  arredondadas, comum em apps.
                */}
                <IonList inset>
                  {/* IonItem é o container para um input.
                    Substitui <div className={styles.inputGroup}>
                  */}
                  <IonItem>
                    <IonIcon icon={mailOutline} slot="start" />
                    <IonLabel position="floating">E-mail</IonLabel>
                    <IonInput
                      type="email"
                      name="email" // Usado pelo handleChange
                      placeholder="seu.email@exemplo.com"
                      value={formData.email}
                      onIonChange={handleChange}
                      required
                    />
                  </IonItem>
                  {errors.email && (
                    <IonText color="danger" className="ion-padding-start">
                      <small>{errors.email}</small>
                    </IonText>
                  )}

                  <IonItem>
                    <IonIcon icon={lockClosedOutline} slot="start" />
                    <IonLabel position="floating">Senha</IonLabel>
                    <IonInput
                      type="password"
                      name="password" // Usado pelo handleChange
                      placeholder="Digite sua senha"
                      value={formData.password}
                      onIonChange={handleChange}
                      required
                    />
                  </IonItem>
                  {errors.password && (
                    <IonText color="danger" className="ion-padding-start">
                      <small>{errors.password}</small>
                    </IonText>
                  )}
                </IonList>
                
                <IonButton 
                  type="submit" 
                  expand="block" 
                  className="ion-margin-top"
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </IonButton>
              </form>

              <div className="ion-text-center ion-margin-top">
                <IonText>Não tem uma conta? </IonText>
                {/* MUDANÇA: Substituímos <Link> por um IonButton
                  com 'routerLink' e 'fill="clear"' para parecer um link.
                */}
                <IonButton routerLink="/auth/register" fill="clear" size="small">
                  Crie uma agora
                </IonButton>
              </div>

              <div className="ion-text-center ion-margin">
                <IonText color="medium">
                  <small>ou</small>
                </IonText>
              </div>

              <div className="ion-text-center">
                <IonButton 
                  fill="outline" 
                  disabled={loading}
                >
                  {/* MUDANÇA: Usamos <img> normal para o asset local */}
                  <img src="/google.png" alt="Google" style={{ width: '24px', marginRight: '8px' }} />
                  Entrar com Google
                </IonButton>
                {/* Adicione outros botões sociais aqui */}
              </div>

            </IonCol>
          </IonRow>
        </IonGrid>

        {/* MUDANÇA: Componentes "invisíveis" para feedback 
          substituindo {errors.submit}
        */}
        <IonLoading isOpen={loading} message={'Aguarde...'} />
        <IonToast
          isOpen={showErrorToast}
          message={errors.submit}
          onDidDismiss={() => setShowErrorToast(false)}
          duration={5000} // 5 segundos
          color="danger"
          position="top"
        />
        
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;

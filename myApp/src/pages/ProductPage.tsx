// MUDANÇA: "use client" removido
import React, { useEffect } from 'react';
// MUDANÇA: Imports do Ionic (componentes de UI)
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonText,
} from '@ionic/react';
// MUDANÇA: Imports do react-router-dom (usado pelo Ionic)
import { useParams } from 'react-router-dom';
// MUDANÇA: Import do Contexto (caminho ajustado)
import { useProduct } from '../contexts/ProductContext';

// MUDANÇA: Importando os componentes (caminhos de exemplo)
// Você precisará traduzir estes componentes do Next.js para o Ionic
// e salvar em 'src/components/'
import HeroSection from '../components/HomeHeroSlider'; // (Ainda não traduzido)
import GameDetails from '../components/GameDetails'; // (Ainda não traduzido)
import RelatedGames from '../components/RelatedGames'; // (Ainda não traduzido)

// MUDANÇA: O 'params' não é passado como prop no react-router.
// Usamos o hook useParams() para pegar o 'id' da URL.
const ProductPage: React.FC = () => {
  // MUDANÇA: Pegando 'id' com useParams
  const { id } = useParams<{ id: string }>();
  
  // LÓGICA IDÊNTICA: A lógica de consumo do contexto não muda.
  const { game, relatedGames, loading, error, fetchProductData } = useProduct();

  // LÓGICA IDÊNTICA: O useEffect para buscar dados não muda.
  useEffect(() => {
    if (id) {
      fetchProductData(id);
    }
  }, [id, fetchProductData]);

  // MUDANÇA: A lógica de Loading/Erro/Vazio agora retorna JSX do Ionic
  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
            <IonTitle>Carregando...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (error) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
            <IonTitle>Erro</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <IonText color="danger" className="ion-text-center">
            <h1>Erro ao carregar o produto</h1>
            <p>{error}</p>
          </IonText>
        </IonContent>
      </IonPage>
    );
  }

  if (!game) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
            <IonTitle>Não Encontrado</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <IonText color="medium" className="ion-text-center">
            <h1>Jogo não encontrado</h1>
          </IonText>
        </IonContent>
      </IonPage>
    );
  }

  // MUDANÇA: Layout principal com componentes Ionic
  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          {/* O título pode vir do HeroSection ou ficar aqui */}
          <IonTitle>{game.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      {/* O <Header> do Next.js foi removido, pois o IonHeader acima o substitui. */}
      {/* O conteúdo da página é envolvido pelo IonContent. */}
      <IonContent fullscreen>
        {/*
          Estes são os seus componentes do Next.js.
          Eles vão quebrar inicialmente. Você precisa "traduzir"
          cada um deles para o Ionic (ex: trocar <div> por <IonGrid>, etc.)
        */}
        <HeroSection game={game} />
        <GameDetails game={game} />
        <RelatedGames games={relatedGames} />
      </IonContent>
    </IonPage>
  );
};

export default ProductPage;

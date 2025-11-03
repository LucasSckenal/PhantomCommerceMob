import React, { useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonLoading,
  IonAlert,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import { useProduct } from "../contexts/ProductContext";
import ProductHeroSection from "../components/ProductHeroSection";
import GameDetails from "../components/GameDetails";
import RelatedGames from "../components/RelatedGames";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { game, relatedGames, loading, error, fetchProductData } = useProduct();

  useEffect(() => {
    if (id) {
      fetchProductData(id);
    }
  }, [id, fetchProductData]);

  if (loading) {
    return (
      <IonPage>
        <IonContent>
          <IonLoading isOpen={true} message="Carregando..." />
        </IonContent>
      </IonPage>
    );
  }

  if (error) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <IonAlert
            isOpen={true}
            header="Erro"
            message={error}
            buttons={["OK"]}
          />
        </IonContent>
      </IonPage>
    );
  }

  if (!game) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div style={{ textAlign: "center", marginTop: "50%" }}>
            <h2>Jogo não encontrado</h2>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen className="product-content">
        <ProductHeroSection game={game} />
        <GameDetails game={game} />
        <RelatedGames games={relatedGames} />
      </IonContent>
    </IonPage>
  );
};

export default ProductPage;

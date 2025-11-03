import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';

// --- Estilos CSS-in-JS (Traduzido do seu GameDetails.module.scss) ---
const style = `
  /* MUDANÇA: .aboutSection virou um IonCard */
  .aboutCard {
    /* MUDANÇA: Usei a variável de cor do Ionic que mapeamos no variables.css */
    --background: var(--ion-color-step-100, #1A202C); 
    border-radius: 16px; 
    margin: 0 auto 3rem auto;
    /* MUDANÇA: IonCardContent já tem padding, mas podemos forçar o seu */
    padding: 1rem; 
  }

  .sectionTitle {
    width: fit-content;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--ion-text-color, #fff);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--ion-color-primary, #4D7CFF);
  }

  .gameDescription {
    font-size: 1rem;
    color: var(--ion-text-color, #fff);
    margin-bottom: 2rem;
    line-height: 1.7;
    text-align: justify;
  }

  /* MUDANÇA: Estilizando a lista e os itens */
  .infoList {
    background: transparent;
    --ion-background-color: transparent;
  }

  .infoItem {
    --background: transparent;
    --padding-start: 0;
    --inner-padding-end: 0;
    align-items: flex-start;
    flex-direction: column;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .infoLabel {
    font-size: 0.9rem;
    font-weight: bold;
    color: var(--ion-color-medium, #718096);
    margin-bottom: 0.25rem;
  }

  .infoValue {
    color: var(--ion-text-color, #fff);
    font-weight: 500;
    font-size: 1rem;
  }
`;

const GameDetails: React.FC<{ game: any }> = ({ game }) => {
  if (!game) {
    return null;
  }

  return (
    // MUDANÇA: Usando IonGrid para controlar o padding
    <IonGrid fixed={true}>
      <style>{style}</style>
      <IonRow>
        <IonCol>
          <IonCard className="aboutCard">
            <IonCardContent>
              <IonText>
                <h2 className="sectionTitle">Sobre o Jogo</h2>
              </IonText>
              <IonText>
                <p className="gameDescription">{game.description}</p>
              </IonText>

              {/* MUDANÇA: .infoGrid virou IonGrid + IonList */}
              <IonList className="infoList" lines="none">
                <IonGrid>
                  <IonRow>
                    <IonCol size="12" size-md="6">
                      <IonItem className="infoItem">
                        <IonLabel>
                          <p className="infoLabel">Desenvolvedora:</p>
                          <span className="infoValue">{game.developer}</span>
                        </IonLabel>
                      </IonItem>
                    </IonCol>

                    <IonCol size="12" size-md="6">
                      <IonItem className="infoItem">
                        <IonLabel>
                          <p className="infoLabel">Publicadora:</p>
                          <span className="infoValue">{game.publisher}</span>
                        </IonLabel>
                      </IonItem>
                    </IonCol>

                    <IonCol size="12" size-md="6">
                      <IonItem className="infoItem">
                        <IonLabel>
                          <p className="infoLabel">Gêneros:</p>
                          <span className="infoValue">{game.tags.join(', ')}</span>
                        </IonLabel>
                      </IonItem>
                    </IonCol>

                    <IonCol size="12" size-md="6">
                      <IonItem className="infoItem">
                        <IonLabel>
                          <p className="infoLabel">Classificação:</p>
                          <span className="infoValue">{game.classification}</span>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonList>
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default GameDetails;

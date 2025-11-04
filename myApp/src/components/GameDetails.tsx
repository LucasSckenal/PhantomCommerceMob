import React from "react";
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
} from "@ionic/react";
import styles from "./GameDetails.module.scss";

const GameDetails: React.FC<{ game: any }> = ({ game }) => {
  if (!game) return null;

  return (
    <IonGrid fixed={true}>
      <IonRow className="ion-justify-content-center">
        <IonCol size="12" sizeMd="10" sizeLg="8">
          <IonCard className={styles.aboutCard}>
            <IonCardContent>
              <IonText>
                <h2 className={styles.sectionTitle}>Sobre o Jogo</h2>
              </IonText>

              <IonText>
                <p className={styles.gameDescription}>{game.description}</p>
              </IonText>

              <IonList className={styles.infoList} lines="none">
                <IonGrid>
                  <IonRow>
                    <IonCol size="12" size-md="6">
                      <IonItem className={styles.infoItem}>
                        <IonLabel>
                          <p className={styles.infoLabel}>Desenvolvedora:</p>
                          <span className={styles.infoValue}>
                            {game.developer}
                          </span>
                        </IonLabel>
                      </IonItem>
                    </IonCol>

                    <IonCol size="12" size-md="6">
                      <IonItem className={styles.infoItem}>
                        <IonLabel>
                          <p className={styles.infoLabel}>Publicadora:</p>
                          <span className={styles.infoValue}>
                            {game.publisher}
                          </span>
                        </IonLabel>
                      </IonItem>
                    </IonCol>

                    <IonCol size="12" size-md="6">
                      <IonItem className={styles.infoItem}>
                        <IonLabel>
                          <p className={styles.infoLabel}>Gêneros:</p>
                          <span className={styles.infoValue}>
                            {game.tags?.join(", ") || "N/A"}
                          </span>
                        </IonLabel>
                      </IonItem>
                    </IonCol>

                    <IonCol size="12" size-md="6">
                      <IonItem className={styles.infoItem}>
                        <IonLabel>
                          <p className={styles.infoLabel}>Classificação:</p>
                          <span className={styles.infoValue}>
                            {game.classification || "Livre"}
                          </span>
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

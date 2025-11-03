import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { chevronBack, chevronForward } from 'ionicons/icons';
import { useIonRouter } from '@ionic/react';

// Estilos embutidos para este componente
const style = `
  .section-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between; /* Garante que o título e os botões fiquem em lados opostos */
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--ion-text-color, #fff);
    border-bottom: 3px solid var(--ion-color-primary, #4D7CFF);
    padding-bottom: 4px; /* Adiciona um pequeno espaçamento para a borda */
  }

  .section-nav, .section-view-more {
    display: none; /* Esconde por padrão em telas pequenas */
  }

  /* Mostra em telas maiores */
  @media (min-width: 768px) {
    .section-nav {
      display: flex;
      gap: 0.5rem;
    }

    .section-nav ion-button {
      --background: var(--ion-color-step-150, #1A202C);
      --border-color: var(--ion-color-primary, #4D7CFF);
      --border-width: 1px;
      --border-style: solid;
      --color: var(--ion-text-color, #fff);
      --border-radius: 50%;
      width: 36px; /* Tamanho explícito */
      height: 36px; /* Tamanho explícito */
    }

    .section-view-more {
      display: block;
      --background: transparent;
      --background-hover: var(--ion-color-primary);
      --border-color: var(--ion-color-primary);
      --border-style: solid;
      --border-width: 1px;
      --color: var(--ion-color-primary);
      --color-hover: var(--ion-text-color, #fff);
      --border-radius: 99px;
      font-weight: 600;
      text-transform: none; /* Evita que o botão fique em maiúsculas */
    }
  }
`;

// Props do componente
interface SectionHeaderProps {
  title: string;
  viewMoreLink?: string; // Link opcional para "Ver Mais"
  onNavClick?: (direction: 'left' | 'right') => void; // Função opcional para botões de navegação
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, viewMoreLink, onNavClick }) => {
  const router = useIonRouter();

  const handleViewMore = () => {
    if (viewMoreLink) {
      router.push(viewMoreLink);
    }
  };

  return (
    <>
      {/* Adiciona os estilos no componente */}
      <style>{style}</style>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>

        {/* Mostra a navegação (setas) OU o botão "Ver Mais" */}
        {onNavClick ? (
          <div className="section-nav">
            <IonButton onClick={() => onNavClick('left')} aria-label="Scroll Left">
              <IonIcon icon={chevronBack} slot="icon-only" />
            </IonButton>
            <IonButton onClick={() => onNavClick('right')} aria-label="Scroll Right">
              <IonIcon icon={chevronForward} slot="icon-only" />
            </IonButton>
          </div>
        ) : viewMoreLink ? (
          <IonButton
            className="section-view-more"
            fill="outline"
            onClick={handleViewMore}
          >
            Ver Mais
          </IonButton>
        ) : null}
      </div>
    </>
  );
};

export default SectionHeader;


import React, { useRef } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { chevronBack, chevronForward } from 'ionicons/icons';
import GameCard from './GameCard'; // Assumindo que o GameCard está em 'src/components/GameCard.tsx'

// MUDANÇA: Vamos definir um estilo básico aqui, já que não temos o .scss
// O ideal é adicionar essas classes ao seu 'variables.css' ou 'global.css'
const style = `
  .horizontal-scroll-container {
    position: relative;
  }

  .scroll-content {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 250px; /* Largura de cada card */
    gap: 1.5rem;
    overflow-x: auto;
    padding: 1rem 0 1.5rem;
    scroll-behavior: smooth;
    -ms-overflow-style: none; /* IE e Edge */
    scrollbar-width: none; /* Firefox */
  }

  .scroll-content::-webkit-scrollbar {
    display: none; /* Chrome, Safari e Opera */
  }

  .scroll-nav {
    display: none; /* Esconde botões em telas pequenas por padrão */
  }

  /* Mostra botões em telas maiores */
  @media (min-width: 768px) {
    .scroll-nav {
      display: block;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      background: var(--ion-color-step-150, rgba(255, 255, 255, 0.1));
      --border-radius: 50%;
    }

    .nav-left {
      left: -10px;
    }

    .nav-right {
      right: -10px;
    }
  }
`;

interface HorizontalGameScrollProps {
  games: any[]; // Use um tipo mais específico se tiver (ex: Game[])
}

const HorizontalGameScroll: React.FC<HorizontalGameScrollProps> = ({ games }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      // Pega 80% da largura visível para rolar
      const scrollAmount = scrollRef.current.offsetWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="horizontal-scroll-container">
      {/* Adicionando os estilos aqui */}
      <style>{style}</style>

      {/* Botões de Navegação (só aparecem em telas maiores) */}
      <IonButton
        fill="clear"
        className="scroll-nav nav-left"
        onClick={() => handleScroll('left')}
        aria-label="Scroll Left"
      >
        <IonIcon icon={chevronBack} slot="icon-only" />
      </IonButton>

      {/* Conteúdo rolável */}
      <div className="scroll-content" ref={scrollRef}>
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      <IonButton
        fill="clear"
        className="scroll-nav nav-right"
        onClick={() => handleScroll('right')}
        aria-label="Scroll Right"
      >
        <IonIcon icon={chevronForward} slot="icon-only" />
      </IonButton>
    </div>
  );
};

export default HorizontalGameScroll;


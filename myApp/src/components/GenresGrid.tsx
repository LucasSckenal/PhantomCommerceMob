import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import {
  flameOutline, // Ação
  compassOutline, // Aventura
  sparklesOutline, // RPG
  diceOutline, // Estratégia
  gameControllerOutline, // Default/Indie
  trophyOutline, // Esportes
  carSportOutline, // Corrida
} from 'ionicons/icons';

// --- ÍCONES (Versão Ionic) ---
// Mapeia os nomes dos gêneros para os ícones do Ionic
const genreIcons: { [key: string]: string } = {
  "Ação": flameOutline,
  "Aventura": compassOutline,
  "RPG": sparklesOutline,
  "Estratégia": diceOutline,
  "Indie": gameControllerOutline,
  "Esportes": trophyOutline,
  "Corrida": carSportOutline,
  "Default": gameControllerOutline
};

// --- Estilos CSS-in-JS (Traduzido do seu Home.module.scss) ---
const style = `
  .genresGrid {
    display: grid;
    /* MUDANÇA: Grid responsivo que se auto-ajusta */
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
    justify-content: center; /* Centraliza os botões */
  }

  .genreButton {
    --background: var(--ion-card-background, #1A202C);
    --border-color: var(--ion-border-color, #4A5568);
    --border-style: solid;
    --border-width: 1px;
    --color: var(--ion-text-color, #fff);
    --border-radius: var(--br-16, 16px);
    --padding-top: 1.5rem;
    --padding-bottom: 1.5rem;
    /* MUDANÇA: Altura e largura automáticas para preencher o grid */
    height: 120px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
    text-decoration: none;
    text-transform: none; /* Remove o 'uppercase' padrão do IonButton */
    transition: all 0.3s ease;
  }

  /* Efeito hover traduzido */
  .genreButton:hover {
    --background: var(--ion-color-step-200, #39455e);
    --border-color: var(--ion-color-primary, #4D7CFF);
    --color: var(--ion-color-primary, #4D7CFF);
  }

  .genreButton ion-icon {
    font-size: 24px; /* Tamanho do ícone */
  }
`;

interface GenresGridProps {
  genres: string[];
}

const GenresGrid: React.FC<GenresGridProps> = ({ genres = [] }) => {
  if (!genres || genres.length === 0) {
    return null;
  }

  // --- Lógica de Slug (Reutilizada do seu page.jsx) ---
  const getGenreSlug = (genre: string) => {
    // Mantém "RPG" como slug
    if (genre === "RPG") return "RPG";
    
    // Converte "Ação" para "acao"
    return genre.toLowerCase()
      .normalize("NFD") // Remove acentos
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-'); // Troca espaços por hífens
  };

  return (
    <>
      <style>{style}</style>
      <div className="genresGrid">
        {genres.map(genre => {
          const genreSlug = getGenreSlug(genre);
          const icon = genreIcons[genre] || genreIcons.Default;
          
          return (
            <IonButton
              key={genre}
              className="genreButton"
              routerLink={`/category/${genreSlug}`} // Navega para a página de categoria
              fill="outline" // Assegura que os estilos de borda e fundo sejam aplicados
            >
              <IonIcon icon={icon} slot="icon-only" />
              <span>{genre}</span>
            </IonButton>
          );
        })}
      </div>
    </>
  );
};

export default GenresGrid;


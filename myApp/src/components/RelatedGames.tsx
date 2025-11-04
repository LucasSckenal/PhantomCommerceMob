import React, { useState, useEffect } from "react";
import { IonGrid, IonRow, IonCol, IonText } from "@ionic/react";
import { useProduct } from "../contexts/ProductContext";
import GameCard from "./GameCard";

// --- Hook para layout dinâmico ---
const useDynamicLayout = () => {
  const [columns, setColumns] = useState({
    xs: 2, // Mobile pequeno: 2 cards por linha
    sm: 3, // Mobile grande: 3 cards por linha
    md: 4, // Tablet: 4 cards por linha
    lg: 5, // Desktop: 5 cards por linha
    xl: 6, // Desktop grande: 6 cards por linha
  });

  // Função para calcular colunas baseada na largura da tela
  const calculateColumns = () => {
    const width = window.innerWidth;

    if (width < 576) return columns.xs; // xs
    if (width < 768) return columns.sm; // sm
    if (width < 992) return columns.md; // md
    if (width < 1200) return columns.lg; // lg
    return columns.xl; // xl
  };

  const [currentColumns, setCurrentColumns] = useState(calculateColumns());

  useEffect(() => {
    const handleResize = () => {
      setCurrentColumns(calculateColumns());
    };

    window.addEventListener("resize", handleResize);
    // Calcular inicialmente
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [columns]);

  return {
    currentColumns,
    setColumns,
    columns,
  };
};

// --- Estilos CSS-in-JS ---
const style = `
  .relatedSection {
    padding: 1rem;
    margin: 0 auto 3rem auto;
  }

  .sectionTitle {
    width: fit-content;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--ion-text-color, #fff);
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--ion-color-primary, #4D7CFF);
  }
`;

const RelatedGames: React.FC = () => {
  const { relatedGames } = useProduct();
  const { currentColumns } = useDynamicLayout();

  if (!relatedGames || relatedGames.length === 0) {
    return null;
  }

  // Calcular o tamanho das colunas baseado no número atual de colunas
  const getColumnSize = () => {
    const size = 12 / currentColumns;
    return size.toString();
  };

  return (
    <section className="relatedSection">
      <style>{style}</style>

      <IonText>
        <h2 className="sectionTitle">Jogos Relacionados</h2>
      </IonText>

      <IonGrid>
        <IonRow>
          {relatedGames.map((game: any) => (
            <IonCol
              key={game.id}
              size={getColumnSize()}
              style={{ marginBottom: "16px" }}
            >
              <GameCard game={game} />
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </section>
  );
};

export default RelatedGames;

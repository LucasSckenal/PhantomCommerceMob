import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import {
  playCircleOutline,
  star,
  cartOutline,
  heartOutline,
  logoPlaystation,
  logoXbox,
  logoSteam,
  gameControllerOutline,
  desktopOutline,
} from 'ionicons/icons';
import { useCart } from '../contexts/CartContext';

// Mapeamento de plataformas para ícones (VERSÃO IONIC)
const platformIcons: { [key: string]: string } = {
  Xbox: logoXbox,
  PlayStation: logoPlaystation,
  Steam: logoSteam,
  'Nintendo Switch': gameControllerOutline,
  PC: desktopOutline,
};

// --- Estilos CSS-in-JS (Traduzido do seu HeroSection.module.scss) ---
const style = `
  .heroWrapper {
    position: relative;
    width: 100%;
    padding-bottom: 3rem;
  }

  .banner {
    width: 100%;
    height: 60vh;
    min-height: 400px;
    background-size: cover;
    background-position: center 25%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }

  .titleSection {
    margin-bottom: 2rem;
    color: var(--ion-text-color, #fff);
    padding-top: 30vh; 
  }

  .gameTitle {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .gameMeta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    color: var(--ion-color-medium, #718096);
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
  }

  .metaItem {
    background: rgba(0, 0, 0, 0.6);
    padding: 8px 12px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .classificationBadge {
    border-radius: 8px;
    padding: 0.65rem 1rem;
    font-weight: 600;
    font-size: 0.8rem;
  }

  .platformIcons {
    padding: 0.8rem 1rem;
    gap: 0.75rem;
  }

  .platformIconWrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .priceInfo {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  .discountedPrice {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--ion-text-color, #fff);
  }

  .originalPrice {
    font-size: 1rem;
    color: var(--ion-color-medium, #718096);
    text-decoration: line-through;
  }

  .saveBadge {
    background-color: var(--ion-color-success, #28a745);
    color: var(--ion-color-success-contrast, #fff);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.2rem 0.5rem;
    border-radius: 16px;
  }

  .buttonGroup {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .trailerButton {
    --border-color: var(--ion-color-primary, #4D7CFF);
    --color: var(--ion-text-color, #fff);
  }
  
  .mediaGallery {
    border-radius: 8px;
  }

  .mainMedia {
    position: relative;
    aspect-ratio: 16 / 9;
    background-color: black;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mainImage {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .playButton {
    position: absolute;
    color: white;
    --background: rgba(0, 0, 0, 0.3);
    --border-radius: 50%;
    --border-color: white;
    --border-width: 2px;
    width: 70px;
    height: 70px;
  }
  .playButton ion-icon {
    font-size: 40px;
  }

  .thumbnailStrip {
    --background: transparent;
  }
  .thumbnailSegmentButton {
    --background: transparent;
    --background-checked: transparent;
    --border-width: 0;
    --indicator-color: transparent;
    padding: 0 !important;
    margin: 0 4px;
    opacity: 0.6;
    transition: opacity 0.3s ease;
  }
  .segment-button-checked {
    opacity: 1;
  }
  .thumbnailImage {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: 4px;
    border: 2px solid var(--ion-color-medium);
  }
  .segment-button-checked .thumbnailImage {
    border: 2px solid var(--ion-color-primary);
  }

  .purchaseCard {
    background: var(--ion-color-step-100, #1A202C);
    border-radius: 12px;
  }

  .requirementsCard {
    --background: var(--ion-color-step-100, #1A202C);
    border-radius: 12px;
    margin-top: 1rem;
  }
  
  .reqTitle {
    color: var(--ion-text-color, #fff);
    font-weight: 600;
    margin-bottom: 0.75rem;
    font-size: 1rem;
    border-bottom: 2px solid var(--ion-color-primary);
    padding-bottom: 6px;
  }

  .reqList {
    font-size: 0.85rem;
    color: var(--ion-text-color, #fff);
  }
  .reqList ion-item {
    --background: transparent;
    --padding-start: 0;
    --inner-padding-end: 0;
  }
  .reqList ion-label {
    display: flex;
    justify-content: space-between;
  }
  .reqList strong {
    color: var(--ion-color-medium);
  }
`;

// MUDANÇA: Nome do componente
const ProductHero: React.FC<{ game: any }> = ({ game }) => {
  const [isViewingVideo, setIsViewingVideo] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  const { addToCart, cartItems } = useCart();

  const isInCart = cartItems.some((item: any) => item.id === game.id);

  const handleAddToCart = () => {
    const itemToAdd = {
      id: game.id,
      name: game.title,
      edition: 'Edição Padrão',
      price: game.discountedPrice,
      oldPrice: game.originalPrice,
      image: game.bannerImage || game.headerImageUrl,
      quantity: 1 
    };
    addToCart(itemToAdd);
  };

  // ... (toda a lógica permanece a mesma) ...
  const hasDiscount = game.originalPrice && game.discountedPrice && game.originalPrice > game.discountedPrice;
  const gameDiscount = hasDiscount ? game.originalPrice - game.discountedPrice : 0;
  const discountPercentage = hasDiscount ? Math.round(((game.originalPrice - game.discountedPrice) / game.originalPrice) * 100) : 0;

  const gameRelease = new Date(game.releaseDate);
  const today = new Date();
  const isReleased = today >= gameRelease;

  const formattedReleaseDate = gameRelease.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const mainTrailerUrl = game.trailerUrls && game.trailerUrls.length > 0 ? game.trailerUrls[0] : '';

  const extractYouTubeID = (url: string) => {
    if (!url) return null;
    try {
      const regex = /(?:youtube\.com\/(?:.*v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
      const m = url.match(regex);
      if (m && m[1]) return m[1];
      const q = url.split('?')[1] || '';
      const params = new URLSearchParams(q);
      if (params.has('v')) return params.get('v');
      return null;
    } catch (e) {
      console.warn('extractYouTubeID error', e);
      return null;
    }
  };

  const youtubeId = extractYouTubeID(mainTrailerUrl);
  const youtubeThumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null;
  
  const galleryImages = [
    ...(youtubeThumbnailUrl ? [youtubeThumbnailUrl] : []),
    ...game.gallery
  ];
  
  const [activeImage, setActiveImage] = useState(galleryImages[0]);

  useEffect(() => {
    setPlayerError(false);
  }, [mainTrailerUrl]);

  const handlePlayVideo = () => {
    if (!youtubeId) {
      console.warn('Nenhum trailer do YouTube disponível');
      return;
    }
    setPlayerError(false);
    setIsViewingVideo(true);
    setActiveImage(youtubeThumbnailUrl);
  };

  const handleThumbnailClick = (img: string) => {
    if (img === youtubeThumbnailUrl) {
      handlePlayVideo();
    } else {
      setIsViewingVideo(false);
      setActiveImage(img);
    }
  };
  
  const onSegmentChange = (e: CustomEvent) => {
    handleThumbnailClick(e.detail.value);
  }


  return (
    <div className="hero-wrapper">
      <style>{style}</style>
      <div
        className="banner"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15, 20, 36, 0.2) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(15, 20, 36, 0.8) 70%, rgba(15, 20, 36, 1) 100%), url('${game.headerImageUrl || game.coverImageUrl}')`
        }}
      ></div>

      <IonGrid fixed={true}>
        <IonRow>
          <IonCol>
            <section className="titleSection">
              <h1 className="gameTitle">{game.title}</h1>
              <div className="gameMeta">
                <span className="metaItem">
                  <IonIcon icon={star} /> {game.rating}
                </span>
                <span className="metaItem">Lançamento: {formattedReleaseDate}</span>
                <div className="metaItem platformIcons">
                  {game.platforms.map((platform: string) => (
                    <span key={platform} title={platform} className="platformIconWrapper">
                      <IonIcon icon={platformIcons[platform] || desktopOutline} />
                    </span>
                  ))}
                </div>
                <span className="metaItem classificationBadge">{game.classification}</span>
              </div>
              <div className="priceInfo">
                {hasDiscount ? (
                  <>
                    <span className="discountedPrice">R$ {game.discountedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="originalPrice">R$ {game.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="saveBadge">{discountPercentage}% OFF</span>
                  </>
                ) : (
                  <span className="discountedPrice">R$ {game.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                )}
              </div>
              <div className="buttonGroup">
                <IonButton
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  size="large"
                >
                  <IonIcon slot="start" icon={cartOutline} />
                  {isInCart ? 'No Carrinho' : (isReleased ? 'Comprar Agora' : 'Realizar Pré-Venda')}
                </IonButton>
                {mainTrailerUrl && (
                  <IonButton fill="outline" size="large" className="trailerButton">
                    <IonIcon slot="start" icon={heartOutline} />
                    Adicionar à Lista de Desejos
                  </IonButton>
                )}
              </div>
            </section>
          </IonCol>
        </IonRow>

        <IonRow>
          {/* Coluna da Esquerda (Mídia) */}
          <IonCol size="12" size-lg="7">
            <div className="mediaGallery">
              <div className="mainMedia">
                {isViewingVideo && youtubeId ? (
                  <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&color=white`}
                      title="Trailer do jogo"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        border: 'none', borderRadius: '12px'
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <img src={activeImage} alt="Visualização do jogo" className="mainImage" />
                    {!isViewingVideo && activeImage === youtubeThumbnailUrl && (
                      <IonButton className="playButton" fill="clear" onClick={handlePlayVideo}>
                        <IonIcon icon={playCircleOutline} />
                      </IonButton>
                    )}
                  </>
                )}
              </div>
              
              <IonSegment 
                scrollable 
                value={activeImage} 
                onIonChange={onSegmentChange}
                className="thumbnailStrip"
              >
                {galleryImages.map((img, index) => (
                  <IonSegmentButton 
                    key={index} 
                    value={img} 
                    className="thumbnailSegmentButton"
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="thumbnailImage" />
                  </IonSegmentButton>
                ))}
              </IonSegment>
            </div>
          </IonCol>
          
          {/* Coluna da Direita (Compra e Requisitos) */}
          <IonCol size="12" size-lg="5">
            <IonCard className="purchaseCard">
              <IonCardContent>
                <div className="priceInfo">
                  {hasDiscount ? (
                    <>
                      <span className="discountedPrice">R$ {game.discountedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <span className="originalPrice">R$ {game.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </>
                  ) : (
                    <span className="discountedPrice">R$ {game.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  )}
                </div>
                {hasDiscount && (
                  <IonText color="success">
                    <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                      Você economiza R$ {gameDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </IonText>
                )}
                <IonButton
                  expand="block"
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  style={{ marginTop: hasDiscount ? '0' : '12px' }}
                >
                  <IonIcon slot="start" icon={cartOutline} />
                  {isInCart ? 'No Carrinho' : (isReleased ? 'Comprar Agora' : 'Realizar Pré-Venda')}
                </IonButton>
              </IonCardContent>
            </IonCard>

            <IonCard className="requirementsCard">
              <IonCardContent>
                <h3 className="reqTitle">Requisitos Mínimos</h3>
                <IonList lines="none" className="reqList">
                  <IonItem><IonLabel><strong>CPU:</strong> <span>{game.systemRequirements.minimum.cpu}</span></IonLabel></IonItem>
                  <IonItem><IonLabel><strong>RAM:</strong> <span>{game.systemRequirements.minimum.ram}</span></IonLabel></IonItem>
                  <IonItem><IonLabel><strong>GPU:</strong> <span>{game.systemRequirements.minimum.gpu}</span></IonLabel></IonItem>
                  <IonItem><IonLabel><strong>Armazenamento:</strong> <span>{game.systemRequirements.minimum.storage}</span></IonLabel></IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
            
            <IonCard className="requirementsCard">
              <IonCardContent>
                <h3 className="reqTitle">Requisitos Recomendados</h3>
                <IonList lines="none" className="reqList">
                  <IonItem><IonLabel><strong>CPU:</strong> <span>{game.systemRequirements.recommended.cpu}</span></IonLabel></IonItem>
                  <IonItem><IonLabel><strong>RAM:</strong> <span>{game.systemRequirements.recommended.ram}</span></IonLabel></IonItem>
                  <IonItem><IonLabel><strong>GPU:</strong> <span>{game.systemRequirements.recommended.gpu}</span></IonLabel></IonItem>
                  <IonItem><IonLabel><strong>Armazenamento:</strong> <span>{game.systemRequirements.recommended.storage}</span></IonLabel></IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

// MUDANÇA: Exporta o novo nome
export default ProductHero;

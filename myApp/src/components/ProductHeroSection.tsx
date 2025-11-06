import React, { useState, useEffect } from "react";
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonChip,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
} from "@ionic/react";
import {
  playOutline,
  heartOutline,
  cartOutline,
  closeOutline,
  starOutline,
} from "ionicons/icons";
import { useCart } from "../contexts/CartContext";
import { FaPlaystation, FaXbox, FaSteam } from "react-icons/fa";
import { BsNintendoSwitch, BsPcDisplay } from "react-icons/bs";

import "./ProductHeroSection.scss";

const platformIcons = {
  Xbox: <FaXbox size={16} />,
  PlayStation: <FaPlaystation size={16} />,
  Steam: <FaSteam size={16} />,
  "Nintendo Switch": <BsNintendoSwitch size={16} />,
  PC: <BsPcDisplay size={16} />,
};

interface Game {
  id: string;
  title: string;
  headerImageUrl: string;
  coverImageUrl: string;
  rating: number;
  releaseDate: string;
  platforms: string[];
  classification: string;
  originalPrice: number;
  discountedPrice: number;
  trailerUrls: string[];
  gallery: string[];
  systemRequirements: {
    minimum: {
      cpu: string;
      ram: string;
      gpu: string;
      storage: string;
    };
    recommended: {
      cpu: string;
      ram: string;
      gpu: string;
      storage: string;
    };
  };
}

interface ProductHeroSectionProps {
  game: Game;
}

const ProductHeroSection: React.FC<ProductHeroSectionProps> = ({ game }) => {
  const [isViewingVideo, setIsViewingVideo] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const { addToCart, cartItems } = useCart();

  const isInCart = cartItems.some((item) => item.id === game.id);

  const handleAddToCart = () => {
    const itemToAdd = {
      id: game.id,
      name: game.title,
      edition: "Edição Padrão",
      price: game.discountedPrice || game.originalPrice,
      oldPrice: game.originalPrice,
      image: game.headerImageUrl || game.coverImageUrl,
    };
    addToCart(itemToAdd);
  };

  const hasDiscount =
    game.originalPrice &&
    game.discountedPrice &&
    game.originalPrice > game.discountedPrice;
  const gameDiscount = hasDiscount
    ? game.originalPrice - game.discountedPrice
    : 0;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((game.originalPrice - game.discountedPrice) / game.originalPrice) * 100
      )
    : 0;

  // Data handling
  const gameRelease = new Date(game.releaseDate);
  const today = new Date();
  const isReleased = today >= gameRelease;

  const formattedReleaseDate = gameRelease.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Video handling
  const mainTrailerUrl =
    game.trailerUrls && game.trailerUrls.length > 0 ? game.trailerUrls[0] : "";

  const extractYouTubeID = (url: string) => {
    if (!url) return null;
    try {
      const regex =
        /(?:youtube\.com\/(?:.*v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
      const m = url.match(regex);
      if (m && m[1]) return m[1];

      const q = url.split("?")[1] || "";
      const params = new URLSearchParams(q);
      if (params.has("v")) return params.get("v");

      return null;
    } catch (e) {
      console.warn("extractYouTubeID error", e);
      return null;
    }
  };

  const youtubeId = extractYouTubeID(mainTrailerUrl);
  const youtubeThumbnailUrl = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : null;

  useEffect(() => {
    setActiveImage(
      youtubeThumbnailUrl || game.gallery?.[0] || game.headerImageUrl
    );
  }, [game, youtubeThumbnailUrl]);

  const handlePlayVideo = () => {
    if (!mainTrailerUrl) {
      console.warn("Nenhum trailer disponível");
      return;
    }
    setIsViewingVideo(true);
  };

  return (
    <div className="product-hero">
      <div
        className="hero-banner"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15, 20, 36, 0.2) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(15, 20, 36, 0.8) 70%, rgba(15, 20, 36, 1) 100%), url('${
            game.headerImageUrl || game.coverImageUrl
          }')`,
        }}
      />

      <IonGrid className="hero-content">
        <IonRow>
          {/* Game Info Section */}
          <IonCol size="12" sizeMd="6">
            <div className="game-info-section">
              <h1 className="game-title">{game.title}</h1>

              <div className="game-meta">
                <IonChip color="primary">
                  <IonIcon icon={starOutline} />
                  <IonLabel>{game.rating}</IonLabel>
                </IonChip>

                <IonChip>
                  <IonLabel>Lançamento: {formattedReleaseDate}</IonLabel>
                </IonChip>

                <div className="platforms">
                  {game.platforms?.map((platform) => (
                    <IonChip key={platform} color="medium">
                      {platformIcons[platform] || platform}
                    </IonChip>
                  ))}
                </div>

                <IonChip color="warning">
                  <IonLabel>{game.classification}</IonLabel>
                </IonChip>
              </div>

              <div className="price-section">
                {hasDiscount ? (
                  <>
                    <span className="current-price">
                      R${" "}
                      {(game.discountedPrice || 0).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="original-price">
                      R${" "}
                      {(game.originalPrice || 0).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <IonChip color="success" className="discount-badge">
                      <IonLabel>{discountPercentage}% OFF</IonLabel>
                    </IonChip>
                  </>
                ) : (
                  <span className="current-price">
                    R${" "}
                    {(game.originalPrice || 0).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                )}
              </div>

              <div className="action-buttons">
                <IonButton
                  expand="block"
                  color="primary"
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  className="buy-button"
                >
                  <IonIcon icon={cartOutline} slot="start" />
                  {isInCart
                    ? "NO CARRINHO"
                    : isReleased
                    ? "COMPRAR AGORA"
                    : "PRÉ-VENDA"}
                </IonButton>

                <IonButton
                  expand="block"
                  color="primary"
                  fill="outline"
                  className="wishlist-button"
                >
                  <IonIcon icon={heartOutline} slot="start" />
                  LISTA DE DESEJOS
                </IonButton>
              </div>
            </div>
          </IonCol>

          {/* Media Section */}
          <IonCol size="12" sizeMd="6">
            <div className="media-section">
              {/* Main Media Display */}
              <IonCard className="main-media-card">
                <IonCardContent>
                  {activeImage && (
                    <div
                      className="main-media"
                      onClick={
                        youtubeThumbnailUrl &&
                        activeImage === youtubeThumbnailUrl
                          ? handlePlayVideo
                          : undefined
                      }
                    >
                      <img
                        src={activeImage}
                        alt={game.title}
                        className="main-image"
                      />
                      {youtubeThumbnailUrl &&
                        activeImage === youtubeThumbnailUrl && (
                          <div className="play-overlay">
                            <IonIcon icon={playOutline} />
                          </div>
                        )}
                    </div>
                  )}
                </IonCardContent>
              </IonCard>

              {/* Thumbnail Gallery */}
              <div className="thumbnail-gallery">
                {youtubeThumbnailUrl && (
                  <div
                    className={`thumbnail ${
                      activeImage === youtubeThumbnailUrl ? "active" : ""
                    }`}
                    onClick={() => setActiveImage(youtubeThumbnailUrl)}
                  >
                    <img src={youtubeThumbnailUrl} alt="Trailer" />
                    <div className="video-indicator">
                      <IonIcon icon={playOutline} />
                    </div>
                  </div>
                )}

                {game.gallery?.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${
                      activeImage === img ? "active" : ""
                    }`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img src={img} alt={`Screenshot ${index + 1}`} />
                  </div>
                ))}
              </div>

              {/* Requirements Card */}
              <IonCard className="requirements-card">
                <IonCardContent>
                  <h3>Requisitos do Sistema</h3>

                  <div className="requirements-grid">
                    <div className="requirement-section">
                      <h4>Mínimos</h4>
                      <ul>
                        <li>
                          <strong>CPU:</strong>{" "}
                          {game.systemRequirements?.minimum?.cpu || "N/A"}
                        </li>
                        <li>
                          <strong>RAM:</strong>{" "}
                          {game.systemRequirements?.minimum?.ram || "N/A"}
                        </li>
                        <li>
                          <strong>GPU:</strong>{" "}
                          {game.systemRequirements?.minimum?.gpu || "N/A"}
                        </li>
                        <li>
                          <strong>Armazenamento:</strong>{" "}
                          {game.systemRequirements?.minimum?.storage || "N/A"}
                        </li>
                      </ul>
                    </div>

                    <div className="requirement-section">
                      <h4>Recomendados</h4>
                      <ul>
                        <li>
                          <strong>CPU:</strong>{" "}
                          {game.systemRequirements?.recommended?.cpu || "N/A"}
                        </li>
                        <li>
                          <strong>RAM:</strong>{" "}
                          {game.systemRequirements?.recommended?.ram || "N/A"}
                        </li>
                        <li>
                          <strong>GPU:</strong>{" "}
                          {game.systemRequirements?.recommended?.gpu || "N/A"}
                        </li>
                        <li>
                          <strong>Armazenamento:</strong>{" "}
                          {game.systemRequirements?.recommended?.storage ||
                            "N/A"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>

      {/* Video Modal */}
      <IonModal
        isOpen={isViewingVideo}
        onDidDismiss={() => setIsViewingVideo(false)}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Trailer - {game.title}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsViewingVideo(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {youtubeId && (
            <div className="video-container">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                title="Trailer do jogo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </IonContent>
      </IonModal>
    </div>
  );
};

export default ProductHeroSection;

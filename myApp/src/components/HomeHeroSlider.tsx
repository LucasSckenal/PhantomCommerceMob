import React, { useState, useRef, useEffect } from 'react';
import {
  IonSlides,
  IonSlide,
  IonButton,
  IonIcon,
  IonText,
} from '@ionic/react';
import {
  chevronBack,
  chevronForward,
  heartOutline,
  star,
  calendarOutline,
} from 'ionicons/icons';
import { FaPlaystation, FaXbox, FaSteam } from 'react-icons/fa';
import { BsNintendoSwitch, BsPcDisplay } from 'react-icons/bs';
import { useIonRouter } from '@ionic/react';

// --- ÍCONES (copiado do seu page.jsx) ---
const platformIcons: { [key: string]: React.ReactNode } = {
  xbox: <FaXbox size={16} />,
  playstation: <FaPlaystation size={16} />,
  steam: <FaSteam size={16} />,
  'nintendo switch': <BsNintendoSwitch size={15} />,
  pc: <BsPcDisplay size={15} />,
};

// --- Função utilitária (copiado do seu page.jsx) ---
const formatReleaseDate = (dateStr: string | undefined) => {
  if (!dateStr) return 'TBA';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// --- Estilos CSS-in-JS (traduzido do seu Home.module.scss) ---
// Vamos injetar esses estilos dinamicamente
const getStyle = () => `
  .hero-slides {
    height: 65vh;
    min-height: 500px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
  }

  .hero-slide {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center 30%;
    position: relative;
    color: var(--ion-text-color, #fff);
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background-image: radial-gradient(circle, transparent 45%, black 80%),
                      linear-gradient(to right, rgba(15, 20, 36, 0.7) 20%, transparent 80%);
    background-color: rgba(15, 20, 36, 0.4);
  }

  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 90%;
    display: flex;
    flex-direction: column;
    gap: 1rem; /* Reduzido para mobile */
    padding: 2rem;
    text-align: left;
    align-items: flex-start; /* Alinha à esquerda */
  }

  /* Em telas maiores, recria o layout do Next.js */
  @media (min-width: 768px) {
    .hero-content {
      max-width: 50%;
      padding-left: 5rem;
      gap: 1.25rem;
    }
  }

  .hero-title {
    font-size: 2.5rem; /* Ajustado */
    font-weight: 700;
    line-height: 1.1;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  }

  .hero-subtitle {
    font-size: 1.1rem;
    font-weight: bold;
  }

  .hero-description {
    font-size: 0.9rem;
    line-height: 1.6;
    max-width: 480px;
    display: none; /* Escondido em telas pequenas */
  }

  @media (min-width: 768px) {
    .hero-description {
      display: block; /* Mostra em telas maiores */
    }
    .hero-title {
      font-size: 3.5rem;
    }
  }

  .hero-info-bar {
    display: flex;
    align-items: center;
    gap: 1rem; /* Ajustado */
    flex-wrap: wrap;
  }

  .info-item, .platform-icons-hero {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    background-color: rgba(15, 20, 36, 0.7);
    padding: 0.4rem 0.6rem;
    border-radius: 16px;
    font-size: 0.9rem;
  }

  .info-item ion-icon {
    color: var(--ion-color-primary, #4D7CFF);
  }

  .hero-price-section {
    font-size: 2.2rem;
    font-weight: 700;
  }

  .hero-actions {
    display: flex;
    gap: 1rem; /* Ajustado */
    margin-top: 0.5rem;
    flex-wrap: wrap; /* Permite que botões quebrem a linha */
  }

  /* Botões de navegação */
  .hero-nav-arrow {
    position: absolute;
    z-index: 10;
    top: 50%;
    transform: translateY(-50%);
    --background: rgba(26, 32, 44, 0.5);
    --background-hover: rgba(77, 124, 255, 0.8);
    --border-color: var(--ion-color-primary, #4D7CFF);
    --border-width: 1px;
    --border-style: solid;
    --color: var(--ion-text-color, #fff);
    --border-radius: 50%;
    backdrop-filter: blur(4px);
    display: none; /* Escondido em telas pequenas */
  }

  @media (min-width: 768px) {
    .hero-nav-arrow {
      display: block; /* Mostra em telas maiores */
    }
  }

  .nav-left { left: 2rem; }
  .nav-right { right: 2rem; }

  /* Indicadores */
  .hero-indicators {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.75rem;
    z-index: 2;
  }

  .indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--ion-color-step-300, #ccc);
    cursor: pointer;
    opacity: 0.7;
  }

  .indicator-active {
    background-color: var(--ion-color-primary, #4D7CFF);
    opacity: 1;
  }
`;

// Opções do IonSlides
const slideOpts = {
  speed: 600,
  autoplay: {
    delay: 7000,
  },
  loop: true,
  slidesPerView: 1,
};

// Props do componente
interface HeroSectionProps {
  heroGames: any[]; // Use um tipo mais específico se tiver (ex: Game[])
}

const HeroSection: React.FC<HeroSectionProps> = ({ heroGames }) => {
  const router = useIonRouter();
  const slidesRef = useRef<HTMLIonSlidesElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [styleInjected, setStyleInjected] = useState(false);

  // Injeta os estilos no <head> uma única vez
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = getStyle();
    document.head.appendChild(styleElement);
    setStyleInjected(true);

    return () => {
      // Limpa os estilos quando o componente é desmontado
      document.head.removeChild(styleElement);
    };
  }, []);

  if (!styleInjected) {
    return null; // Não renderiza nada até os estilos serem injetados
  }

  const handleSlideChange = async () => {
    const index = await slidesRef.current?.getActiveIndex();
    const totalSlides = heroGames.length;
    if (index !== undefined) {
      // O IonSlides com loop adiciona slides extras, precisamos normalizar o índice
      setCurrentSlide(index % totalSlides);
    }
  };

  const handleNav = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      slidesRef.current?.slidePrev();
    } else {
      slidesRef.current?.slideNext();
    }
  };

  const handleIndicatorClick = (index: number) => {
    slidesRef.current?.slideTo(index);
  };

  // MUDANÇA: Link (router.push) em vez de <Link>
  const goToProduct = (id: string) => {
    router.push(`/product/${id}`);
  };

  if (!heroGames || heroGames.length === 0) {
    return null; // Não renderiza nada se não houver jogos
  }

  return (
    <>
      <IonSlides
        ref={slidesRef}
        options={slideOpts}
        onIonSlideDidChange={handleSlideChange}
        pager={false} // Desativamos o pager padrão para usar o nosso
        className="hero-slides"
      >
        {heroGames.map((game) => (
          <IonSlide
            key={game.id}
            className="hero-slide"
            style={{
              backgroundImage: `url(${
                game.headerImageUrl || game.coverImageUrl || '/placeholder.jpg'
              })`,
            }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <IonText>
                <h1 className="hero-title">{game.title}</h1>
              </IonText>
              <IonText>
                <h2 className="hero-subtitle">
                  {game.shortDescription || 'Confira agora este sucesso!'}
                </h2>
              </IonText>
              <p className="hero-description">
                {(game.about || game.description || 'Um dos jogos...').substring(
                  0,
                  200
                )}
                ...
              </p>
              <div className="hero-info-bar">
                <div className="info-item">
                  <IonIcon icon={star} />
                  <span>{game.rating} estrelas</span>
                </div>
                <div className="info-item">
                  <IonIcon icon={calendarOutline} />
                  <span>Lançamento: {formatReleaseDate(game.releaseDate)}</span>
                </div>
                <div className="platform-icons-hero">
                  {game.platforms?.map((platform: string) => (
                    <span key={platform} title={platform}>
                      {platformIcons[platform.toLowerCase()] ||
                        platformIcons.pc}
                    </span>
                  ))}
                </div>
              </div>
              <div className="hero-price-section">
                <span>
                  R${' '}
                  {(game.discountedPrice || game.price).toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="hero-actions">
                <IonButton onClick={() => goToProduct(game.id)}>
                  Ver jogo
                </IonButton>
                <IonButton fill="outline" color="light">
                  <IonIcon slot="start" icon={heartOutline} />
                  Favoritos
                </IonButton>
              </div>
            </div>
          </IonSlide>
        ))}
      </IonSlides>

      {/* Navegação Customizada (Setas) */}
      <IonButton
        fill="clear"
        className="hero-nav-arrow nav-left"
        onClick={() => handleNav('prev')}
        aria-label="Slide Anterior"
      >
        <IonIcon icon={chevronBack} slot="icon-only" />
      </IonButton>
      <IonButton
        fill="clear"
        className="hero-nav-arrow nav-right"
        onClick={() => handleNav('next')}
        aria-label="Próximo Slide"
      >
        <IonIcon icon={chevronForward} slot="icon-only" />
      </IonButton>

      {/* Indicadores Customizados */}
      <div className="hero-indicators">
        {heroGames.map((_, index) => (
          <span
            key={index}
            className={`indicator ${
              currentSlide === index ? 'indicator-active' : ''
            }`}
            onClick={() => handleIndicatorClick(index)}
          ></span>
        ))}
      </div>
    </>
  );
};

export default HeroSection;


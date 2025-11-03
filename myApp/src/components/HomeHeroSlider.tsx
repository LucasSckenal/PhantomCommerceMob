import React, { useRef } from 'react';
// MUDANÇA: IonSlides e IonSlide foram REMOVIDOS
import {
  IonButton,
  IonIcon,
  IonText,
} from '@ionic/react';
// MUDANÇA: Importando Swiper e módulos
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperInstance } from 'swiper';
import { SwiperOptions } from 'swiper/types';
import { Pagination, Autoplay } from 'swiper/modules';  // MUDANÇA: Módulos do Swiper
import 'swiper/css'; // MUDANÇA: CSS principal do Swiper
import 'swiper/css/pagination'; // MUDANÇA: CSS de paginação
import 'swiper/css/autoplay'; // MUDANÇA: CSS do autoplay

import {
  arrowForward,
  arrowBack,
  star,
  logoPlaystation,
  logoXbox,
  logoSteam,
  gameControllerOutline,
  desktopOutline,
} from 'ionicons/icons';

// --- Estilos CSS-in-JS (Traduzido do seu Home.module.scss) ---
const style = `
  /* MUDANÇA: O IonSlides precisa de altura definida */
  .heroSlider {
    height: 65vh;
    min-height: 500px;
    border-radius: var(--br-16, 16px);
    overflow: hidden;
  }

  .heroSlide {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    background-size: cover;
    background-position: center 30%;
    padding: 2rem 3rem;
    color: var(--ion-text-color-contrast, #fff);
    position: relative;
  }

  .heroOverlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background-image: radial-gradient(circle, transparent 45%, black 80%),
                      linear-gradient(to right, rgba(15, 20, 36, 0.7) 20%, transparent 80%);
    background-color: rgba(15, 20, 36, 0.4);
  }

  .heroContent {
    position: relative;
    z-index: 2;
    max-width: 45%;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding-left: 3rem;
    text-align: left;
  }

  .heroTitle {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1.1;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  }

  .heroSubtitle { font-size: 1.2rem; font-weight: bold; }
  .heroDescription { font-size: 0.95rem; line-height: 1.6; max-width: 480px; }

  .heroInfoBar {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  
  .infoItem, .platformIconsHero {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    background-color: rgba(15, 20, 36, 0.7);
    padding: 0.4rem 0.8rem; /* Aumentado o padding horizontal */
    border-radius: 16px; /* var(--br-16) */
    font-size: 0.9rem;
  }
  .infoItem ion-icon { 
    color: var(--ion-color-primary, #4D7CFF); 
    font-size: 16px;
  }
  .platformIconsHero ion-icon {
    font-size: 16px;
  }

  .heroPriceSection {
    margin-top: 0.5rem;
  }
  .currentPrice { font-size: 2.2rem; font-weight: 700; }

  .heroActions {
    display: flex;
    gap: 1.5rem;
    margin-top: 0.5rem;
  }

  /* MUDANÇA: Estilizando IonButton */
  .heroButtonPrimary {
    --background: var(--ion-color-primary, #2D5BFF);
    --background-hover: var(--ion-color-primary-shade, #2951e0);
    --color: var(--ion-text-color-contrast, #fff);
    --border-radius: 8px; /* var(--br-8) */
    --padding-start: 2.5rem;
    --padding-end: 2.5rem;
    --padding-top: 0.9rem;
    --padding-bottom: 0.9rem;
    font-size: 1rem;
    font-weight: 600;
    text-transform: none;
  }

  .heroButtonSecondary {
    --background: rgba(15, 20, 36, 0.8);
    --color: var(--ion-text-color-contrast, #fff);
    --border-color: var(--ion-color-primary, #4D7CFF);
    --border-width: 1px;
    --border-style: solid;
    --border-radius: 8px;
    --padding-start: 1.5rem;
    --padding-end: 1.5rem;
    --padding-top: 0.8rem;
    --padding-bottom: 0.8rem;
    font-size: 1rem;
    font-weight: 600;
    text-transform: none;
  }
  .heroButtonSecondary:hover {
    --color: var(--ion-color-primary, #4D7CFF);
  }

  /* MUDANÇA: Botões de navegação */
  .heroNavArrow {
    position: absolute;
    z-index: 10;
    top: 50%;
    transform: translateY(-50%);
    --background: rgba(26, 32, 44, 0.5);
    --background-hover: var(--ion-color-primary-shade, #2951e0);
    --border-color: var(--ion-color-primary, #4D7CFF);
    --border-width: 1px;
    --border-style: solid;
    --color: #fff;
    --border-radius: 50%;
    width: 48px;
    height: 48px;
    backdrop-filter: blur(4px);
  }
  .heroNavArrow.left { left: 2rem; }
  .heroNavArrow.right { right: 2rem; }

  /* MUDANÇA: Estilizando a paginação do Swiper */
  .heroSlider .swiper-pagination {
    bottom: 2rem !important; /* Força a posição */
  }
  .heroSlider .swiper-pagination-bullet {
    background: var(--ion-color-light, #f4f5f8);
    opacity: 0.7;
  }
  .heroSlider .swiper-pagination-bullet-active {
    background: var(--ion-color-primary, #4D7CFF);
    opacity: 1;
  }
`;

// MUDANÇA: Mapeamento de ícones para Ionic
const platformIcons: { [key: string]: string } = {
  xbox: logoXbox,
  playstation: logoPlaystation,
  steam: logoSteam,
  'nintendo switch': gameControllerOutline,
  pc: desktopOutline,
};

// Define a ordem de exibição desejada para as plataformas
const platformOrder = ['pc', 'playstation', 'xbox', 'nintendo switch', 'steam'];

// Dados mocados (substitua pelos seus dados reais)
const mockHeroData = [
  {
    id: '1',
    title: 'Cyberpunk 2077',
    subtitle: 'Phantom Liberty',
    description: 'Uma expansão de suspense e espionagem para Cyberpunk 2077. Volte como V e embarque em uma missão de alto risco.',
    rating: 4.8,
    platforms: ['PC', 'PlayStation', 'Xbox'],
    price: 'R$ 149,90',
    backgroundImage: 'https://images.gog-statics.com/b2654516a512d5d2b37060b2d6c13bdc26f634b0718d002fbe3a6c06a8f158c5_background_1920.jpg',
    productUrl: '/product/1'
  },
  {
    id: '2',
    title: 'Starfield',
    subtitle: 'Aventura Espacial',
    description: 'Starfield é o primeiro novo universo em 25 anos da Bethesda Game Studios, os criadores de The Elder Scrolls V: Skyrim e Fallout 4.',
    rating: 4.5,
    platforms: ['PC', 'Xbox'],
    price: 'R$ 299,00',
    backgroundImage: 'https://images.gog-statics.com/6a033a2a6320a568a15990f1d56740a6b7eaa40d21c33c37d6d1d4f295b9c71b_background_1920.jpg',
    productUrl: '/product/2'
  },
  // Adicione mais slides
];

const HomeHeroSlider: React.FC = () => {
  const slidesRef = useRef<SwiperInstance | null>(null);

  // MUDANÇA: Opções do Swiper (não mais necessárias como um objeto separado)
  // const swiperOptions: SwiperOptions = { ... };

  const handlePrev = () => slidesRef.current?.slidePrev();
  const handleNext = () => slidesRef.current?.slideNext();

  const sortedPlatforms = (platforms: string[] = []) => {
    return [...platforms].sort((a, b) => {
      const platformA = a.toLowerCase();
      const platformB = b.toLowerCase();
      const indexA = platformOrder.indexOf(platformA);
      const indexB = platformOrder.indexOf(platformB);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  };

  return (
    <div style={{ position: 'relative' }}>
      <style>{style}</style>
      {/* MUDANÇA: Substituído IonSlides por Swiper */}
      <Swiper
        className="heroSlider"
        modules={[Pagination, Autoplay]} // MUDANÇA: Passando módulos
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
        }}
        onSwiper={(swiper) => { // MUDANÇA: onIonSlidesDidLoad -> onSwiper
          slidesRef.current = swiper;
        }}
      >
        {mockHeroData.map((game) => (
          // MUDANÇA: Substituído IonSlide por SwiperSlide
          <SwiperSlide
            key={game.id}
            className="heroSlide"
            style={{ backgroundImage: `url(${game.backgroundImage})` }}
          >
            <div className="heroOverlay"></div>
            <div className="heroContent">
              <h2 className="heroTitle">{game.title}</h2>
              <h3 className="heroSubtitle">{game.subtitle}</h3>
              <p className="heroDescription">{game.description}</p>
              
              <div className="heroInfoBar">
                <div className="infoItem">
                  <IonIcon icon={star} />
                  <span>{game.rating}</span>
                </div>
                <div className="platformIconsHero">
                  {sortedPlatforms(game.platforms).map((platform) => (
                    <IonIcon
                      key={platform}
                      icon={platformIcons[platform.toLowerCase()] || desktopOutline}
                      title={platform}
                    />
                  ))}
                </div>
              </div>

              <div className="heroPriceSection">
                <IonText><h4 className="currentPrice">{game.price}</h4></IonText>
              </div>

              <div className="heroActions">
                <IonButton 
                  className="heroButtonPrimary" 
                  routerLink={game.productUrl}
                >
                  <IonIcon slot="start" icon={arrowForward} />
                  Ver Jogo
                </IonButton>
                <IonButton 
                  className="heroButtonSecondary"
                  fill="outline"
                >
                  Mais Detalhes
                </IonButton>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Botões de Navegação Externos */}
      <IonButton
        className="heroNavArrow left"
        fill="clear"
        onClick={handlePrev}
      >
        <IonIcon slot="icon-only" icon={arrowBack} />
      </IonButton>
      <IonButton
        className="heroNavArrow right"
        fill="clear"
        onClick={handleNext}
      >
        <IonIcon slot="icon-only" icon={arrowForward} />
      </IonButton>
    </div>
  );
};

export default HomeHeroSlider;



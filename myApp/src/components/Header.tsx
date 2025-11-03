import React, { useState, useEffect, useRef } from 'react';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonBadge,
  IonPopover,
  IonAvatar,
  IonModal,
  IonContent,
  IonTitle,
  IonMenuButton, // Para o menu mobile
  IonMenu, // O menu em si
  IonListHeader,
  IonRouterLink,
  IonSpinner,
} from '@ionic/react';
import {
  searchOutline,
  cartOutline,
  heartOutline,
  personCircleOutline,
  menuOutline,
  closeOutline,
  chevronDownOutline,
  logInOutline,
  logOutOutline,
  personOutline,
  storefrontOutline,
  gridOutline,
  arrowDown,
} from 'ionicons/icons';
import { useSearch } from '../contexts/SearchContext'; // Ajuste o caminho
import { useCart } from '../contexts/CartContext'; // Ajuste o caminho
import { useAuth } from '../contexts/AuthContext'; // Ajuste o caminho
import { useIonRouter } from '@ionic/react'; // MUDANÇA: Para navegação

// Dados mocados para categorias
const categories = [
  { name: 'Ação', slug: 'acao' },
  { name: 'Aventura', slug: 'aventura' },
  { name: 'RPG', slug: 'rpg' },
  { name: 'Estratégia', slug: 'estrategia' },
  { name: 'Simulação', slug: 'simulacao' },
];

// --- Estilos CSS-in-JS (Traduzido do seu Header.module.scss) ---
const style = `
  /* Cabeçalho principal */
  ion-header {
    /* Remove a borda padrão */
    --border-width: 0;
  }

  ion-toolbar {
    /* Cor de fundo padrão (modo escuro) */
    --background: var(--ion-color-step-50, #0F1424);
    --color: var(--ion-color-primary-contrast, #fff);
    transition: background-color 0.3s ease, padding 0.3s ease;
  }

  /* Efeito de scroll (simulado) */
  .header-scrolled ion-toolbar {
    --background: rgba(15, 20, 36, 0.8);
    backdrop-filter: blur(10px);
  }

  /* Container do Logo */
  .logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  .logo-img {
    height: 40px;
    width: auto;
  }

  /* Barra de Pesquisa */
  .search-section {
    flex-grow: 1;
    max-width: 500px;
    position: relative;
    /* Em telas médias (md) e maiores, ela aparece */
    display: none;
  }
  @media (min-width: 992px) {
    .search-section {
      display: block;
    }
  }

  .searchbar-main {
    --background: rgba(255, 255, 255, 0.05);
    --border-radius: 8px;
    --box-shadow: none;
    --border-color: rgba(255, 255, 255, 0.1);
    --icon-color: var(--ion-color-medium);
    --clear-button-color: var(--ion-color-medium);
    padding: 0;
  }

  .search-results-container {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 8px;
    background: var(--ion-color-step-100, #1A202C);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    max-height: 400px;
    overflow-y: auto;
    z-index: 35;
  }

  .search-result-item {
    --background: transparent;
    --background-hover: rgba(255, 255, 255, 0.08);
  }
  .result-image {
    width: 80px;
    height: 45px;
    object-fit: cover;
    border-radius: 4px;
  }

  /* Botões e Ações */
  .desktop-nav {
    display: none;
  }
  @media (min-width: 992px) {
    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  }

  .nav-button {
    --padding-start: 0.5rem;
    --padding-end: 0.5rem;
  }

  .icon-button {
    position: relative;
  }

  /* Dropdown de Perfil */
  .profile-popover {
    --width: 240px;
  }
  .profile-info {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 0.5rem;
  }
  .profile-info strong {
    display: block;
    font-size: 0.95rem;
    font-weight: 600;
  }
  .profile-info span {
    display: block;
    font-size: 0.8rem;
    color: var(--ion-color-medium);
  }
  .dropdown-item {
    --background: transparent;
    --background-hover: var(--ion-color-primary);
  }

  /* Menu Mobile */
  .mobile-menu-toggle {
    display: block;
  }
  @media (min-width: 992px) {
    .mobile-menu-toggle {
      display: none;
    }
  }

  /* Estilos do Menu Lateral (ion-menu) */
  ion-menu ion-content {
    --background: var(--ion-color-step-50, #0F1424);
  }
  ion-menu ion-item {
    --background: transparent;
    --color: var(--ion-color-primary-contrast);
    font-size: 1.2rem;
  }
  .mobile-user-button {
    --background: transparent;
  }
  .mobile-user-avatar {
    width: 28px;
    height: 28px;
    margin-right: 1rem;
  }
`;

// Dados mocados para fallback de imagem
const DEFAULT_AVATAR = 'https://placehold.co/100x100/4D7CFF/FFFFFF?text=P';
const DEFAULT_GAME_IMAGE = 'https://placehold.co/160x90/1A202C/4A5568?text=...';

// --- Componente Principal ---
const Header: React.FC = () => {
  const router = useIonRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategoryPopover, setShowCategoryPopover] = useState({ open: false, event: undefined });
  const [showProfilePopover, setShowProfilePopover] = useState({ open: false, event: undefined });

  // MUDANÇA: Contextos
  const { currentUser, logout, userProfile } = useAuth();
  const { cartItems, handleCartClick } = useCart();
  const {
    searchQuery,
    searchResults,
    isResultsVisible,
    isSearching,
    handleSearchSubmit,
    handleSearchChange,
    hideSearchResults,
    clearSearch
  } = useSearch();

  // MUDANÇA: Referências para fechar popovers/buscas
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const categoryPopoverRef = useRef<HTMLIonPopoverElement>(null);
  const profilePopoverRef = useRef<HTMLIonPopoverElement>(null);

  // MUDANÇA: Efeito de scroll (usando o IonContent da página)
  useEffect(() => {
    // Esta é uma limitação. O header não sabe qual 'IonContent' está rolando.
    // Em um app real, o IonContent da página emitiria um evento.
    // Por enquanto, vamos simular o efeito de scroll.
    const handleScroll = (e: any) => {
      // O e.detail.scrollTop nos dará a posição do scroll
      if (e.detail.scrollTop > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    // Tenta encontrar o IonContent principal
    const content = document.querySelector('ion-app > ion-router-outlet > ion-page > ion-content');
    if (content) {
      content.addEventListener('ionScroll', handleScroll);
    }
    return () => {
      if (content) {
        content.removeEventListener('ionScroll', handleScroll);
      }
    };
  }, []);

  // MUDANÇA: Efeito para fechar popups ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Fecha a busca
      if (isResultsVisible && searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        hideSearchResults();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isResultsVisible, hideSearchResults]);


  const onSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      handleSearchSubmit(searchQuery);
      // MUDANÇA: Navega para a página de busca
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const onSearchChange = (event: CustomEvent) => {
    handleSearchChange({ target: { value: event.detail.value } });
  };

  const onSearchItemClick = (gameId: string) => {
    clearSearch();
    router.push(`/product/${gameId}`);
  };

  const openCategoryPopover = (e: any) => {
    e.persist();
    setShowCategoryPopover({ open: true, event: e });
  };

  const openProfilePopover = (e: any) => {
    e.persist();
    setShowProfilePopover({ open: true, event: e });
  };

  const handleLogout = async () => {
    setShowProfilePopover({ open: false, event: undefined });
    await logout();
    router.push('/auth/login');
  };

  // MUDANÇA: Função para fechar menu mobile e navegar
  const closeMenuAndNavigate = (path: string) => {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      menu.close();
    }
    router.push(path);
  };
  
  const handleMenuLogout = async () => {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      menu.close();
    }
    await logout();
    router.push('/auth/login');
  };

  const avatarUrl = userProfile?.photoURL || currentUser?.photoURL || DEFAULT_AVATAR;

  return (
    <>
      <style>{style}</style>

      {/* --- MENU LATERAL (MOBILE) --- */}
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {currentUser ? (
              <IonItem lines="full" className="mobile-user-button">
                <IonAvatar slot="start" className="mobile-user-avatar">
                  <img src={avatarUrl} onError={(e) => e.currentTarget.src = DEFAULT_AVATAR} />
                </IonAvatar>
                <IonLabel>
                  <h3>{userProfile?.displayName || 'Bem-vindo!'}</h3>
                  <p>{currentUser.email}</p>
                </IonLabel>
              </IonItem>
            ) : (
              <IonItem lines="none" button onClick={() => closeMenuAndNavigate('/auth/login')}>
                <IonIcon slot="start" icon={logInOutline} />
                <IonLabel>Entrar / Registrar</IonLabel>
              </IonItem>
            )}
            
            <IonListHeader>Navegação</IonListHeader>
            <IonItem button onClick={() => closeMenuAndNavigate('/')}>
              <IonIcon slot="start" icon={storefrontOutline} />
              <IonLabel>Loja</IonLabel>
            </IonItem>
            <IonItem button onClick={() => closeMenuAndNavigate('/category/all')}>
              <IonIcon slot="start" icon={gridOutline} />
              <IonLabel>Categorias</IonLabel>
            </IonItem>
            <IonItem button>
              <IonIcon slot="start" icon={heartOutline} />
              <IonLabel>Lista de Desejos</IonLabel>
            </IonItem>

            {currentUser && (
              <>
                <IonListHeader>Conta</IonListHeader>
                <IonItem button onClick={() => closeMenuAndNavigate('/profile')}>
                  <IonIcon slot="start" icon={personOutline} />
                  <IonLabel>Minha Conta</IonLabel>
                </IonItem>
                <IonItem button onClick={handleMenuLogout}>
                  <IonIcon slot="start" icon={logOutOutline} color="danger" />
                  <IonLabel color="danger">Sair</IonLabel>
                </IonItem>
              </>
            )}
          </IonList>
        </IonContent>
      </IonMenu>

      {/* --- CABEÇALHO PRINCIPAL --- */}
      <IonHeader id="main-header" className={isScrolled ? 'header-scrolled' : ''}>
        <IonToolbar>
          {/* MUDANÇA: Botão do Menu Mobile (Esquerda) */}
          <IonButtons slot="start" className="mobile-menu-toggle">
            <IonMenuButton menu="main-content" />
          </IonButtons>

          {/* Logo (Esquerda em Desktop) */}
          <IonButtons slot="start" className="desktop-nav">
            <IonRouterLink routerLink="/" className="logo-link">
              <img src="/logo.svg" alt="Logo" className="logo-img" />
            </IonRouterLink>
          </IonButtons>
          
          {/* MUDANÇA: Navegação Desktop */}
          <div slot="start" className="desktop-nav">
            <IonButton fill="clear" color="light" routerLink="/" className="nav-button">
              Loja
            </IonButton>
            <IonButton fill="clear" color="light" onClick={openCategoryPopover} className="nav-button">
              Categorias
              <IonIcon slot="end" icon={chevronDownOutline} />
            </IonButton>
          </div>

          {/* MUDANÇA: Seção de Pesquisa */}
          <div className="search-section" ref={searchContainerRef}>
            <form onSubmit={onSearchSubmit}>
              <IonSearchbar
                className="searchbar-main"
                placeholder="Buscar jogos..."
                value={searchQuery}
                onIonChange={onSearchChange}
                showClearButton="always"
                searchIcon={searchOutline}
                onIonClear={clearSearch}
                onFocus={() => searchQuery && searchResults.length > 0 && handleSearchChange({ target: { value: searchQuery } })}
              />
            </form>
            
            {isResultsVisible && (
              <div className="search-results-container">
                <IonList>
                  {isSearching && <IonItem lines="none"><IonSpinner name="crescent" slot="start" /><IonLabel>Buscando...</IonLabel></IonItem>}
                  {!isSearching && searchResults.length === 0 && <IonItem lines="none"><IonLabel>Nenhum resultado.</IonLabel></IonItem>}
                  
                  {!isSearching && searchResults.map((game: any) => (
                    <IonItem 
                      key={game.id} 
                      button 
                      className="search-result-item"
                      onClick={() => onSearchItemClick(game.id)}
                    >
                      <IonThumbnail slot="start">
                        <img 
                          src={game.coverImageUrl || game.headerImageUrl || DEFAULT_GAME_IMAGE} 
                          alt={game.title}
                          className="result-image"
                          onError={(e) => e.currentTarget.src = DEFAULT_GAME_IMAGE}
                        />
                      </IonThumbnail>
                      <IonLabel>{game.title}</IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </div>
            )}
          </div>
          
          {/* MUDANÇA: Ações (Direita) */}
          <IonButtons slot="end">
            <IonButton className="icon-button desktop-nav" onClick={handleCartClick}>
              <IonIcon slot="icon-only" icon={cartOutline} />
              {cartItems.length > 0 && <IonBadge color="primary">{cartItems.length}</IonBadge>}
            </IonButton>
            <IonButton className="icon-button desktop-nav">
              <IonIcon slot="icon-only" icon={heartOutline} />
              {/* <IonBadge color="danger">3</IonBadge> */}
            </IonButton>

            {/* MUDANÇA: Botão de Login/Perfil (Desktop) */}
            <div className="desktop-nav">
              {currentUser ? (
                <IonButton fill="clear" onClick={openProfilePopover} className="icon-button">
                  <IonAvatar style={{ width: '38px', height: '38px', border: '2px solid var(--ion-color-primary)' }}>
                    <img src={avatarUrl} onError={(e) => e.currentTarget.src = DEFAULT_AVATAR} />
                  </IonAvatar>
                </IonButton>
              ) : (
                <IonButton routerLink="/auth/login">
                  <IonIcon slot="start" icon={logInOutline} />
                  Entrar
                </IonButton>
              )}
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* --- POP-OVER DE CATEGORIAS --- */}
      <IonPopover
        ref={categoryPopoverRef}
        isOpen={showCategoryPopover.open}
        event={showCategoryPopover.event}
        onDidDismiss={() => setShowCategoryPopover({ open: false, event: undefined })}
        arrow={true}
        className="profile-popover"
      >
        <IonList>
          <IonItem button routerLink="/category/all" onClick={() => setShowCategoryPopover({ open: false, event: undefined })}>
            <IonLabel>Ver Todas</IonLabel>
          </IonItem>
          {categories.map((category) => (
            <IonItem 
              key={category.slug} 
              button 
              routerLink={`/category/${category.slug}`}
              onClick={() => setShowCategoryPopover({ open: false, event: undefined })}
            >
              <IonLabel>{category.name}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonPopover>

      {/* --- POP-OVER DE PERFIL --- */}
      <IonPopover
        ref={profilePopoverRef}
        isOpen={showProfilePopover.open}
        event={showProfilePopover.event}
        onDidDismiss={() => setShowProfilePopover({ open: false, event: undefined })}
        arrow={true}
        className="profile-popover"
      >
        <IonContent>
          <div className="profile-info">
            <strong>{userProfile?.displayName || 'Bem-vindo(a)!'}</strong>
            <span>{currentUser?.email}</span>
          </div>
          <IonList>
            <IonItem button routerLink="/profile" className="dropdown-item" onClick={() => setShowProfilePopover({ open: false, event: undefined })}>
              <IonIcon slot="start" icon={personOutline} />
              <IonLabel>Minha Conta</IonLabel>
            </IonItem>
            <IonItem button onClick={handleLogout} className="dropdown-item">
              <IonIcon slot="start" icon={logOutOutline} color="danger" />
              <IonLabel color="danger">Sair</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>
    </>
  );
};

export default Header;


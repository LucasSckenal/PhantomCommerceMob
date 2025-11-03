import React, { useState } from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonBadge,
  IonList,
  IonItem,
  IonLabel,
  IonPopover,
} from '@ionic/react';
import { cart, personCircleOutline } from 'ionicons/icons';
import { useCart } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext';
import { useAuth } from '../contexts/AuthContext';
import { useIonRouter } from '@ionic/react';

// Estilos para o Header
const style = `
  ion-toolbar {
    --background: var(--ion-toolbar-background, #1A202C);
    --color: var(--ion-text-color, #fff);
  }

  ion-header {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); /* --shadow-500 */
  }

  .header-title {
    font-weight: 700;
    cursor: pointer;
  }

  /* Ajusta a barra de pesquisa */
  ion-searchbar {
    padding-left: 0;
    padding-right: 0;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    --background: var(--ion-color-step-200, #39455e);
    --border-radius: 8px;
    --box-shadow: none;
  }

  /* Posição do badge do carrinho */
  .cart-button {
    position: relative;
  }

  .cart-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    --background: var(--ion-color-danger, #E03E3E);
    --color: var(--ion-text-color, #fff);
    font-size: 0.7rem;
    font-weight: bold;
  }

  /* Popover de resultados da pesquisa */
  .search-popover {
    --width: 500px;
    --max-height: 400px;
  }

  .search-popover ion-list {
    --background: var(--ion-card-background, #1A202C);
  }

  .search-popover ion-item {
    --background: var(--ion-card-background, #1A202C);
    --color: var(--ion-text-color, #fff);
  }
`;

const Header: React.FC = () => {
  const router = useIonRouter();
  const { getCartItemsCount } = useCart();
  const {
    searchQuery,
    searchResults,
    isResultsVisible,
    handleSearchChange,
    handleSearchSubmit,
    clearSearch,
  } = useSearch();
  const { isAuthenticated } = useAuth();
  
  const [popoverEvent, setPopoverEvent] = useState<Event | undefined>(undefined);
  
  const cartCount = getCartItemsCount();

  const onSearchChange = (e: CustomEvent) => {
    handleSearchChange(e);
    if (e.detail.value && !popoverEvent) {
      setPopoverEvent(e.nativeEvent);
    } else if (!e.detail.value) {
      setPopoverEvent(undefined);
      clearSearch();
    }
  };
  
  const onSearchSubmit = () => {
    handleSearchSubmit(searchQuery);
    setPopoverEvent(undefined); // Fecha o popover ao submeter
  };
  
  const onResultClick = (id: string) => {
    router.push(`/product/${id}`);
    setPopoverEvent(undefined); // Fecha o popover ao clicar
    clearSearch();
  };

  return (
    <>
      <style>{style}</style>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="header-title" onClick={() => router.push('/home')}>
            PhantomCommerce
          </IonTitle>
          
          {/* MUDANÇA: Barra de pesquisa fica no centro em telas maiores */}
          <div className="ion-hide-md-down" style={{ width: '100%' }}>
            <IonSearchbar
              id="desktop-search"
              value={searchQuery}
              onIonChange={onSearchChange}
              onIonClear={clearSearch}
              onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
              placeholder="Pesquisar jogos..."
              debounce={300}
            />
          </div>
          
          <IonButtons slot="end">
            <IonButton className="cart-button" onClick={() => router.push('/cart')}> {/* TODO: Criar a página /cart */}
              <IonIcon icon={cart} slot="icon-only" />
              {cartCount > 0 && (
                <IonBadge className="cart-badge">{cartCount}</IonBadge>
              )}
            </IonButton>
            <IonButton onClick={() => router.push(isAuthenticated ? '/profile' : '/auth/login')}> {/* TODO: Criar a página /profile */}
              <IonIcon icon={personCircleOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>

        {/* MUDANÇA: Barra de pesquisa abaixo do header em telas pequenas */}
        <IonToolbar className="ion-hide-md-up">
           <IonSearchbar
             id="mobile-search"
             value={searchQuery}
             onIonChange={onSearchChange}
             onIonClear={clearSearch}
             onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
             placeholder="Pesquisar jogos..."
             debounce={300}
           />
        </IonToolbar>

        {/* Popover de Resultados */}
        <IonPopover
          isOpen={isResultsVisible && !!popoverEvent}
          event={popoverEvent}
          onDidDismiss={() => setPopoverEvent(undefined)}
          showBackdrop={false}
          className="search-popover"
          trigger={popoverEvent?.type.includes('focus') ? (popoverEvent.target as any).id : undefined}
          triggerAction="manual"
        >
          <IonList>
            {searchResults.map((game: any) => (
              <IonItem
                button
                key={game.id}
                onClick={() => onResultClick(game.id)}
              >
                <IonLabel>
                  <h3>{game.title}</h3>
                  <p>R$ {game.discountedPrice?.toFixed(2) || game.price?.toFixed(2)}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </IonPopover>
      </IonHeader>
    </>
  );
};

export default Header;


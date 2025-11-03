import React from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonButton,
  IonIcon,
  IonText,
  IonImg,
} from '@ionic/react';
import { trashOutline, cartOutline, closeOutline } from 'ionicons/icons';

// --- Estilos CSS-in-JS (Traduzido do seu CartModal.module.scss) ---
const style = `
  /* Animação de entrada dos itens */
  @keyframes itemFadeIn {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* MUDANÇA: O IonModal cuida do overlay */
  
  /* Container principal do modal */
  .cartModal {
    /* MUDANÇA: O IonModal tem suas próprias props para isso (breakpoint, initialBreakpoint) */
    /* Mas podemos forçar o estilo se quisermos */
    --background: var(--ion-color-step-100, #1A202C);
    --border-radius: var(--br-16, 16px);
    --border-color: var(--ion-color-step-300, #4A5568);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
  }

  /* MUDANÇA: O IonToolbar substitui o headerContainer */
  .cartToolbar {
    --background: var(--ion-color-step-100, #1A202C);
    --color: var(--ion-text-color, #fff);
    text-align: center;
    border-bottom: 1px solid var(--ion-color-step-300, #4A5568);
  }
  
  .cartToolbar ion-title {
    font-size: 1.5rem; /* 2xl */
    font-weight: 700; /* bold */
    letter-spacing: 0.05em; /* tracking-wider */
  }

  /* MUDANÇA: O IonButton substitui o closeButton */
  .closeButton {
    --color: var(--ion-color-medium, #718096);
    --ripple-color: transparent;
  }
  .closeButton:hover {
    --color: var(--ion-text-color, #fff);
  }

  /* Estilos para o carrinho vazio */
  .emptyCartContainer {
    height: 100%; /* Para centralizar no IonContent */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem;
    opacity: 0;
    animation: itemFadeIn 0.5s 0.2s ease-out forwards;
  }

  .emptyCartIcon {
    font-size: 96px;
    color: var(--ion-color-medium-shade, #4A5568);
    margin-bottom: 1.5rem;
    opacity: 0.6;
  }

  .emptyCartTitle {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--ion-text-color-step-500, #718096);
    margin: 0;
  }

  .emptyCartText {
    color: var(--ion-color-medium, #718096);
    margin-top: 0.5rem;
    font-size: 1rem;
  }

  /* Lista de itens */
  .cartItemsList {
    padding: 1rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* Card de cada item do carrinho */
  .cartItemCard {
    display: flex;
    align-items: center;
    min-height: 100px;
    background: var(--ion-color-step-150, #1F2736); /* Um pouco mais claro que o fundo */
    border: 1px solid var(--ion-color-step-300, #4A5568);
    border-radius: var(--br-8, 8px);
    opacity: 0;
    transform: translateX(20px);
    animation: itemFadeIn 0.5s ease-out forwards;
    position: relative;
    overflow: hidden;
  }

  /* Container da imagem na esquerda */
  .itemImageContainer {
    width: 100px;
    height: 100px;
    flex-shrink: 0;
    overflow: hidden;
  }

  .itemImage {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Container do conteúdo textual */
  .itemContent {
    flex: 1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .itemInfo {
    flex: 1;
  }

  .itemName {
    font-size: 1rem;
    font-weight: 600;
    color: var(--ion-text-color, #fff);
    margin-bottom: 0.25rem;
    line-height: 1.3;
  }

  .itemEdition {
    font-size: 0.85rem;
    color: var(--ion-color-medium, #718096);
    font-weight: 500;
  }

  .priceContainer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .currentPrice {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--ion-text-color, #fff);
  }

  .oldPrice {
    font-size: 0.9rem;
    color: var(--ion-color-medium, #718096);
    text-decoration: line-through;
  }

  /* Botão de remover */
  .removeButton {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    --color: var(--ion-color-medium, #718096);
    --background: transparent;
    --background-hover: var(--ion-color-danger-tint, #E03E3E_1A);
    --color-hover: var(--ion-color-danger, #E03E3E);
    --ripple-color: var(--ion-color-danger, #E03E3E);
    font-size: 1.2rem;
  }

  /* Rodapé do Modal */
  .cartFooter {
    --background: var(--ion-color-step-100, #1A202C);
    border-top: 1px solid var(--ion-color-step-300, #4A5568);
    padding: 1rem 1.5rem;
  }

  .footerContent {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.95rem;
    color: var(--ion-color-medium, #718096);
  }
  .row span:last-child {
    font-weight: 600;
    color: var(--ion-text-color, #fff);
  }

  .discount {
    color: var(--ion-color-success, #28A745);
    font-weight: 600;
  }

  .totalRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 700;
    padding: 0.75rem 0;
    border-top: 1px solid var(--ion-color-step-400, #5A6578);
    margin-top: 0.5rem;
  }
  .totalRow span:first-child {
    color: var(--ion-text-color, #fff);
    font-size: 1.1rem;
  }
  .totalRow span:last-child {
    font-size: 1.4rem;
    color: var(--ion-color-primary, #4D7CFF);
  }

  .checkoutButton {
    width: 100%;
    --padding-top: 1.125rem;
    --padding-bottom: 1.125rem;
    font-size: 1.05rem;
    font-weight: 700;
    --background: var(--ion-color-primary, #2D5BFF);
    --background-hover: var(--ion-color-primary-shade, #2951e0);
    --border-radius: var(--br-8, 8px);
    margin: 0.75rem 0;
  }
`;

// --- Formatação (Reutilizada) ---
const formatCurrency = (value: number) =>
  (value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[]; // Você pode tipar isso melhor se quiser
  onRemoveItem: (id: string) => void;
  // Adicione outras props que seu useCart provê, se necessário
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems = [],
  onRemoveItem = () => {},
}) => {
  // MUDANÇA: useEffect foi removido, IonModal cuida disso

  // --- Lógica de Cálculo (Reutilizada) ---
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.oldPrice || item.price),
    0
  );
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);
  const discounts = subtotal - total;

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      // MUDANÇA: Controla o modal
      // Você pode usar 'breakpoints' se quiser que ele não cubra a tela toda
      initialBreakpoint={1}
      breakpoints={[0, 1]}
      backdropDismiss={true}
      className="cartModal"
    >
      <style>{style}</style>
      
      {/* Cabeçalho */}
      <IonHeader>
        <IonToolbar className="cartToolbar">
          <IonTitle>SEU CARRINHO</IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            onClick={onClose}
            className="closeButton"
            aria-label="Fechar carrinho"
          >
            <IonIcon icon={closeOutline} size="large" />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      {/* Conteúdo */}
      <IonContent>
        {cartItems.length === 0 ? (
          <div className="emptyCartContainer">
            <IonIcon icon={cartOutline} className="emptyCartIcon" />
            <IonText>
              <h3 className="emptyCartTitle">Seu carrinho está vazio</h3>
            </IonText>
            <IonText>
              <p className="emptyCartText">Adicione jogos para vê-los aqui.</p>
            </IonText>
          </div>
        ) : (
          <>
            {/* Lista */}
            <div className="cartItemsList">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="cartItemCard"
                  style={{ animationDelay: `${100 + index * 100}ms` }}
                >
                  {/* Imagem na esquerda */}
                  <div className="itemImageContainer">
                    <IonImg
                      src={item.image}
                      alt={`Capa de ${item.name}`}
                      className="itemImage"
                    />
                  </div>

                  {/* Conteúdo textual no centro */}
                  <div className="itemContent">
                    <div className="itemInfo">
                      <h3 className="itemName">{item.name}</h3>
                      <p className="itemEdition">{item.edition || 'Edição Padrão'}</p>
                    </div>
                    <div className="priceContainer">
                      <span className="currentPrice">
                        {formatCurrency(item.price)}
                      </span>
                      {item.oldPrice && (
                        <span className="oldPrice">
                          {formatCurrency(item.oldPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Lixeira na direita */}
                  <IonButton
                    fill="clear"
                    size="small"
                    onClick={() => onRemoveItem(item.id)}
                    className="removeButton"
                    aria-label={`Remover ${item.name} do carrinho`}
                  >
                    <IonIcon icon={trashOutline} />
                  </IonButton>
                </div>
              ))}
            </div>
          </>
        )}
      </IonContent>

      {/* Rodapé (só mostra se o carrinho não estiver vazio) */}
      {cartItems.length > 0 && (
        <IonFooter className="cartFooter">
          <div className="footerContent">
            <div className="row">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="row">
              <span>Descontos</span>
              <span className="discount">- {formatCurrency(discounts)}</span>
            </div>
            <div className="totalRow">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <IonButton expand="block" className="checkoutButton">
            FINALIZAR COMPRA
          </IonButton>
        </IonFooter>
      )}
    </IonModal>
  );
};

export default CartModal;


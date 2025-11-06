// Tabs.tsx
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { Route, Redirect, Switch } from "react-router-dom"; // Importar Switch
import { home, cart, person, grid } from "ionicons/icons";
import { useAuth } from "../contexts/AuthContext";

/* Páginas do app (internas das Tabs) */
import HomePage from "../pages/HomePage";
import CategoryPage from "../pages/CategoryPage";
import ProductPage from "../pages/ProductPage";
import SearchPage from "../pages/SearchPage";
import NotFoundPage from "../pages/NotFoundPage";
import CartPage from "../pages/CartPage";
import ProfilePage from "../pages/ProfilePage";

import "../theme/custom-tabs.css";

const Tabs: React.FC = () => {
   const { currentUser, loading } = useAuth();
  console.log("Tabs - currentUser:", currentUser);
  console.log("Tabs - loading:", loading);
  
  // Lógica de carregamento (loading)
  if (loading) {
    return (
      <IonTabs>
        <IonRouterOutlet>
          {/* Usamos Switch para melhor gerenciamento das rotas */}
          <Switch>
            <Route exact path="/home" component={HomePage} />
            <Route exact path="/category" component={CategoryPage} />
            <Route exact path="/cart" component={CartPage} />
            <Redirect exact from="/" to="/home" />
          </Switch>
        </IonRouterOutlet>

        <IonTabBar slot="bottom" className="custom-tabbar">
          <IonTabButton tab="home" href="/home">
            <div className="tab-inner">
              <IonIcon icon={home} />
            </div>
          </IonTabButton>

          <IonTabButton tab="category" href="/category">
            <div className="tab-inner">
              <IonIcon icon={grid} />
            </div>
          </IonTabButton>

          <IonTabButton tab="cart" href="/cart">
            <div className="tab-inner">
              <IonIcon icon={cart} />
            </div>
          </IonTabButton>

          <IonTabButton tab="profile" href="/auth/login">
            <div className="tab-inner">
              <IonIcon icon={person} />
            </div>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    );
  }

  // Estado normal (logado ou não, mas sem carregar)
  return (
    <IonTabs>
      <IonRouterOutlet>
        {/* Usamos Switch para garantir que apenas uma rota seja renderizada */}
        <Switch>
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/category" component={CategoryPage} />
          <Route exact path="/category/:slug" component={CategoryPage} />
          <Route exact path="/product/:id" component={ProductPage} />
          <Route exact path="/search" component={SearchPage} />
          <Route exact path="/cart" component={CartPage} />
          <Route exact path="/profile" component={ProfilePage} />
                    
          <Route exact path="/404" component={NotFoundPage} />
          <Redirect exact from="/" to="/home" />
          
          {/* Rota fallback para 404 caso nenhuma outra combine */}
          <Route component={NotFoundPage} />
        </Switch>
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className="custom-tabbar">
        <IonTabButton tab="home" href="/home">
          <div className="tab-inner">
            <IonIcon icon={home} />
          </div>
        </IonTabButton>

        <IonTabButton tab="category" href="/category">
          <div className="tab-inner">
            <IonIcon icon={grid} />
          </div>
        </IonTabButton>

        <IonTabButton tab="cart" href="/cart">
          <div className="tab-inner">
            <IonIcon icon={cart} />
          </div>
        </IonTabButton>

        <IonTabButton 
          tab="profile" 
          href={currentUser ? "/profile" : "/auth/login"}
        >
          <div className="tab-inner">
            <IonIcon icon={person} />
          </div>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
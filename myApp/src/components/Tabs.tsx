import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { home, cart, person, grid } from "ionicons/icons";
import { useAuth } from "../contexts/AuthContext";

/* Páginas do app */
import HomePage from "../pages/HomePage";
import CategoryPage from "../pages/CategoryPage";
import ProductPage from "../pages/ProductPage";
import SearchPage from "../pages/SearchPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";
import CartPage from "../pages/CartPage";
import ProfilePage from "../pages/ProfilePage";

import "../theme/custom-tabs.css";

const Tabs: React.FC = () => {
  const history = useHistory();
  const { user } = useAuth(); // pega o usuário autenticado

  const handleProfileClick = () => {
    if (user) {
      history.push("/profile"); // usuário logado → perfil
    } else {
      history.push("/auth/login"); // não logado → login
    }
  };

  return (
    <IonTabs>
      {/* ÁREA DE CONTEÚDO */}
      <IonRouterOutlet>
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/category" component={CategoryPage} />
        <Route exact path="/category/:slug" component={CategoryPage} />
        <Route exact path="/product/:id" component={ProductPage} />
        <Route exact path="/search" component={SearchPage} />
        <Route exact path="/cart" component={CartPage} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/auth/login" component={LoginPage} />
        <Route exact path="/auth/register" component={RegisterPage} />
        <Route exact path="/404" component={NotFoundPage} />
        <Redirect exact from="/" to="/home" />
      </IonRouterOutlet>

      {/* BARRA DE ABA INFERIOR */}
      <IonTabBar slot="bottom" className="custom-tabbar">
        {/* HOME */}
        <IonTabButton tab="home" href="/home">
          <div className="tab-inner">
            <IonIcon icon={home} />
            <IonLabel>Home</IonLabel>
          </div>
        </IonTabButton>

        {/* CATEGORIAS */}
        <IonTabButton tab="category" href="/category">
          <div className="tab-inner">
            <IonIcon icon={grid} />
            <IonLabel>Categorias</IonLabel>
          </div>
        </IonTabButton>

        {/* CARRINHO */}
        <IonTabButton tab="cart" href="/cart">
          <div className="tab-inner">
            <IonIcon icon={cart} />
            <IonLabel>Carrinho</IonLabel>
          </div>
        </IonTabButton>

        {/* PERFIL */}
        <IonTabButton tab="profile" onClick={handleProfileClick}>
          <div className="tab-inner">
            <IonIcon icon={person} />
            <IonLabel>Perfil</IonLabel>
          </div>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;

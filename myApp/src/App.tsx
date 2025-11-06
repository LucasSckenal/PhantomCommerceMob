import { Redirect, Route, Switch } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Imports das Páginas */
// Importamos aqui APENAS as páginas que ficam fora das Tabs
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage';

/* Imports dos Contexts */
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProductProvider } from './contexts/ProductContext';
import { SearchProvider } from './contexts/SearchContext';
import { StoreProvider } from './contexts/StoreContext';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
// Importamos o componente Tabs
import Tabs from './components/Tabs';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <CartProvider>
        <StoreProvider>
          <ProductProvider>
            <SearchProvider>
              <IonReactRouter>
                <IonRouterOutlet>
                  <Switch>
                    <Route exact path="/auth/login" component={LoginPage} />
                    <Route exact path="/auth/register" component={RegisterPage} />

                    <Route path="/" component={Tabs} />
                  </Switch>
                </IonRouterOutlet>
              </IonReactRouter>
            </SearchProvider>
          </ProductProvider>
        </StoreProvider>
      </CartProvider>
    </AuthProvider>
  </IonApp>
);

export default App;
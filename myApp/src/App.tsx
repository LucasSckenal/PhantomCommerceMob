import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Imports das Páginas */
// Importe as páginas que você criar. Estou usando 'HomePage' por consistência.
import HomePage from './pages/HomePage'; 
// Nossa página de Login (ajuste o caminho se necessário)
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
// Adicione a página 404
import NotFoundPage from './pages/NotFoundPage';

/* Imports dos Contexts */
// Importe TODOS os seus contexts do Next.js (copie os arquivos para o projeto Ionic)
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
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    {/* MUDANÇA: Envolvemos todo o App nos seus providers de Contexto.
      Isso garante que o `useAuth()`, `useCart()`, etc., funcionem
      em todas as páginas.
    */}
    <AuthProvider>
      <CartProvider>
        <StoreProvider>
          <ProductProvider>
            <SearchProvider>
              <IonReactRouter>
                <IonRouterOutlet>
                  {/* Rota da Home (baseada na sua `page.jsx`) */}
                  <Route exact path="/home">
                    <HomePage />
                  </Route>

                  {/* Rotas de Autenticação */}
                  <Route exact path="/auth/login">
                    <LoginPage />
                  </Route>
                  <Route exact path="/auth/register">
                    <RegisterPage />
                  </Route>

                  {/* Rotas de E-commerce (Note o :id e :slug para rotas dinâmicas) */}
                  <Route exact path="/product/:id">
                    <ProductPage />
                  </Route>
                  <Route exact path="/category/:slug">
                    <CategoryPage />
                  </Route>
                  <Route exact path="/search">
                    <SearchPage />
                  </Route>
                  
                  {/* Rota 404 (sem 'exact path') */}
                  <Route>
                    <NotFoundPage />
                  </Route>

                  {/* Rota Padrão: Redireciona para /home */}
                  <Route exact path="/">
                    <Redirect to="/home" />
                  </Route>

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

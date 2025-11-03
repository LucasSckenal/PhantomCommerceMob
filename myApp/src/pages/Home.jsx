import { useState, useEffect } from "react";
import {
  IonApp,
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonRouterLink,
  IonSlides,
  IonSlide,
} from "@ionic/react";
import {
  Star,
  CalendarDays,
  Heart,
  ChevronLeft,
  ChevronRight,
  Users,
  BarChart,
  Award,
  Zap,
  Sword,
  Shield,
  Wand,
  Brain,
  Puzzle,
  Trophy,
  Car,
  Gamepad2,
} from "lucide-react";
import { FaPlaystation, FaXbox, FaSteam } from "react-icons/fa";
import { BsNintendoSwitch, BsPcDisplay } from "react-icons/bs";
import { useStore } from "./contexts/StoreContext";
import GameCard from "./components/GameCard/GameCard";
import Header from "./components/Header/Header";

const platformIcons = {
  xbox: <FaXbox size={16} />,
  playstation: <FaPlaystation size={16} />,
  steam: <FaSteam size={16} />,
  "nintendo switch": <BsNintendoSwitch size={15} />,
  pc: <BsPcDisplay size={15} />,
};

const genreIcons = {
  Ação: <Sword size={24} />,
  Aventura: <Shield size={24} />,
  RPG: <Wand size={24} />,
  Estratégia: <Brain size={24} />,
  Indie: <Puzzle size={24} />,
  Esportes: <Trophy size={24} />,
  Corrida: <Car size={24} />,
  Default: <Gamepad2 size={24} />,
};

const formatReleaseDate = (dateStr?: string) => {
  if (!dateStr) return "TBA";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const HomePage = () => {
  const { games, loadingGames } = useStore();
  const [activeShowcase, setActiveShowcase] =
    (useState < "releases") | ("featured" > "releases");

  const bestRatedGames = [...games].sort(
    (a, b) => (b.rating || 0) - (a.rating || 0)
  );

  const discountedGames = [...games]
    .filter(
      (game) =>
        game.originalPrice &&
        game.discountedPrice &&
        game.originalPrice > game.discountedPrice
    )
    .map((game) => ({
      ...game,
      discountPercentage: Math.round(
        ((game.originalPrice - game.discountedPrice) / game.originalPrice) * 100
      ),
    }))
    .sort((a, b) => b.discountPercentage - a.discountPercentage);

  const heroGames = bestRatedGames.slice(0, 3);
  const popularGames = bestRatedGames.slice(3, 11);
  const showcaseGame = bestRatedGames[0];
  const bestSellers = bestRatedGames.slice(0, 4);
  const promotions = discountedGames.slice(0, 5);

  const latestReleaseGame = [...games]
    .filter((game) => game.releaseDate)
    .sort(
      (a, b) =>
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    )[0];

  const displayedShowcaseGame =
    activeShowcase === "releases" ? latestReleaseGame : showcaseGame;

  const genres = [
    "Ação",
    "Aventura",
    "RPG",
    "Estratégia",
    "Indie",
    "Esportes",
    "Corrida",
  ];

  if (loadingGames) return <div>Carregando jogos...</div>;
  if (!games || games.length === 0) return <div>Nenhum jogo encontrado.</div>;

  return (
    <IonApp>
      <IonPage>
        <Header />
        <IonContent>
          {/* Hero Section com IonSlides */}
          {heroGames.length > 0 && (
            <IonSlides
              options={{
                initialSlide: 0,
                speed: 600,
                autoplay: { delay: 7000 },
              }}
            >
              {heroGames.map((game, index) => (
                <IonSlide key={game.id}>
                  <div style={{ position: "relative" }}>
                    <img
                      src={
                        game.headerImageUrl ||
                        game.coverImageUrl ||
                        "/placeholder.jpg"
                      }
                      alt={game.title}
                      style={{
                        width: "100%",
                        height: "300px",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        padding: "1rem",
                        color: "#fff",
                      }}
                    >
                      <h1>{game.title}</h1>
                      <h2>
                        {game.shortDescription || "Confira agora este sucesso!"}
                      </h2>
                      <p>
                        {(game.about || game.description || "").substring(
                          0,
                          200
                        )}
                        ...
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          alignItems: "center",
                        }}
                      >
                        <Star size={16} /> {game.rating} estrelas
                        <CalendarDays size={16} /> Lançamento:{" "}
                        {formatReleaseDate(game.releaseDate)}
                        <div>
                          {game.platforms?.map(
                            (p) =>
                              platformIcons[p.toLowerCase()] || platformIcons.pc
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: "1rem",
                          display: "flex",
                          gap: "1rem",
                        }}
                      >
                        <IonRouterLink href={`/product/${game.id}`}>
                          <IonButton>Ver jogo</IonButton>
                        </IonRouterLink>
                        <IonButton>
                          <Heart /> Favoritos
                        </IonButton>
                      </div>
                    </div>
                  </div>
                </IonSlide>
              ))}
            </IonSlides>
          )}

          {/* Populares da Semana com IonSlides */}
          {popularGames.length > 0 && (
            <section style={{ margin: "2rem 0" }}>
              <h2>Populares da Semana</h2>
              <IonSlides options={{ slidesPerView: 2.2, spaceBetween: 10 }}>
                {popularGames.map((game) => (
                  <IonSlide key={game.id}>
                    <GameCard game={game} />
                  </IonSlide>
                ))}
              </IonSlides>
            </section>
          )}

          {/* Showcase */}
          {displayedShowcaseGame && (
            <section style={{ marginBottom: "2rem", position: "relative" }}>
              <div
                style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
              >
                <IonButton
                  fill={activeShowcase === "releases" ? "solid" : "outline"}
                  onClick={() => setActiveShowcase("releases")}
                >
                  Novos Lançamentos
                </IonButton>
                <IonButton
                  fill={activeShowcase === "featured" ? "solid" : "outline"}
                  onClick={() => setActiveShowcase("featured")}
                >
                  Destacado
                </IonButton>
              </div>
              <h3>{displayedShowcaseGame.title}</h3>
              <p>
                {(
                  displayedShowcaseGame.about ||
                  displayedShowcaseGame.description ||
                  ""
                ).substring(0, 250)}
                ...
              </p>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <IonRouterLink href={`/product/${displayedShowcaseGame.id}`}>
                  <IonButton>Ver jogo</IonButton>
                </IonRouterLink>
                <IonButton>
                  <Heart /> Favoritos
                </IonButton>
              </div>
              <img
                src={
                  displayedShowcaseGame.backgroundImage ||
                  displayedShowcaseGame.headerImageUrl ||
                  "/placeholder.jpg"
                }
                alt={displayedShowcaseGame.title}
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  borderRadius: "8px",
                }}
              />
            </section>
          )}

          {/* Mais Vendidos */}
          <section style={{ marginBottom: "2rem" }}>
            <h2>Mais Vendidos</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1rem",
              }}
            >
              {bestSellers.map((game, index) => (
                <IonRouterLink
                  key={game.id}
                  href={`/product/${game.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "0.5rem",
                      position: "relative",
                    }}
                  >
                    <img
                      src={game.headerImageUrl || "/placeholder.jpg"}
                      alt={game.title}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: "5px",
                        left: "5px",
                        fontWeight: "bold",
                        background: "#fff",
                        padding: "0 4px",
                        borderRadius: "4px",
                      }}
                    >
                      #{index + 1}
                    </span>
                    <h4>{game.title}</h4>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                      }}
                    >
                      <Tag size={14} /> {(game.categories || []).join(", ")}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                      }}
                    >
                      <Star size={14} /> {game.rating || "N/A"}
                    </div>
                    <div>
                      <span>
                        R${" "}
                        {(game.discountedPrice || game.price || 0)
                          .toFixed(2)
                          .replace(".", ",")}
                      </span>
                      <IonButton size="small">Ver jogo</IonButton>
                    </div>
                  </div>
                </IonRouterLink>
              ))}
            </div>
          </section>

          {/* Liderança */}
          <section style={{ marginBottom: "2rem" }}>
            <h3>Liderança em Gaming no Brasil</h3>
            <p>
              Referência máxima em entretenimento digital, oferecendo a maior
              variedade de jogos e a comunidade mais engajada do país.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <div>
                <Users size={28} />
                <h4>2.5M+</h4>
                <p>Usuários Ativos</p>
              </div>
              <div>
                <BarChart size={28} />
                <h4>500K+</h4>
                <p>Avaliações Positivas</p>
              </div>
              <div>
                <Award size={28} />
                <h4>98%</h4>
                <p>Satisfação do Cliente</p>
              </div>
              <div>
                <Zap size={28} />
                <h4>24/7</h4>
                <p>Suporte Dedicado</p>
              </div>
            </div>
          </section>

          {/* Explorar por Gênero */}
          <section style={{ marginBottom: "2rem" }}>
            <h2>Explore por Gênero</h2>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginTop: "0.5rem",
              }}
            >
              {genres.map((genre) => {
                const genreSlug =
                  genre === "RPG"
                    ? "RPG"
                    : genre
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/\s+/g, "-");
                return (
                  <IonRouterLink
                    key={genre}
                    href={`/category/${genreSlug}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      padding: "0.5rem 1rem",
                      background: "#eee",
                      borderRadius: "8px",
                      textDecoration: "none",
                    }}
                  >
                    {genreIcons[genre] || genreIcons.Default}
                    <span>{genre}</span>
                  </IonRouterLink>
                );
              })}
            </div>
          </section>

          {/* Promoções Imperdíveis */}
          <section style={{ marginBottom: "2rem" }}>
            <h2>Promoções Imperdíveis</h2>
            <span>Últimas 48h</span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {promotions.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        </IonContent>
      </IonPage>
    </IonApp>
  );
};

export default HomePage;

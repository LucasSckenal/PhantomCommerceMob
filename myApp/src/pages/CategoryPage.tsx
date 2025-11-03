// /src/pages/CategoryPage.tsx

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  IonPage,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonModal,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonFooter,
  IonToolbar,
  IonChip,
  IonFab,
  IonFabButton,
  IonBadge,
  IonSegment,
  IonSegmentButton,
  IonHeader,
} from "@ionic/react";
import { options, close, filter } from "ionicons/icons";
import { StoreProvider, useStore } from "../contexts/StoreContext";
import GameCard from "../components/GameCard";

// --- Modal de Filtros Otimizado para Mobile ---
interface FilterModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  allAvailableTags: string[];
  allAvailablePlatforms: string[];
  sortOrder: string;
  setSortOrder: (value: string) => void;
  selectedTags: string[];
  handleTagChange: (tag: string) => void;
  selectedPlatforms: string[];
  handlePlatformChange: (platform: string) => void;
  priceRange: { min: string; max: string };
  handlePriceChange: (e: any) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  isPristine: boolean;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onDismiss,
  allAvailableTags,
  allAvailablePlatforms,
  sortOrder,
  setSortOrder,
  selectedTags,
  handleTagChange,
  selectedPlatforms,
  handlePlatformChange,
  priceRange,
  handlePriceChange,
  clearFilters,
  activeFilterCount,
  isPristine,
}) => {
  const [activeTab, setActiveTab] = useState<
    "sort" | "tags" | "platforms" | "price"
  >("sort");

  const capitalize = (s: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onDismiss}
      breakpoints={[0, 0.85]}
      initialBreakpoint={0.85}
      style={{
        "--border-radius": "20px 20px 0 0",
        "--background": "var(--ion-color-step-50)",
        boxShadow: "0 -6px 20px rgba(0,0,0,0.3)",
      }}
    >
      <IonHeader className="ion-no-border">
        <IonToolbar
          style={{
            "--background": "transparent",
            borderBottom: "1px solid var(--ion-color-step-150)",
            padding: "4px 12px",
          }}
        >
          <IonButtons slot="start">
            <IonButton
              onClick={clearFilters}
              disabled={isPristine}
              style={{
                "--color": isPristine
                  ? "var(--ion-color-medium)"
                  : "var(--ion-color-primary)",
                fontWeight: 500,
              }}
            >
              Limpar
            </IonButton>
          </IonButtons>

          <IonText
            style={{
              fontWeight: 700,
              fontSize: "1.1rem",
              marginLeft: 8,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Filtros
            {activeFilterCount > 0 && (
              <IonBadge color="primary" style={{ borderRadius: "6px" }}>
                {activeFilterCount}
              </IonBadge>
            )}
          </IonText>

          <IonButtons slot="end">
            <IonButton onClick={onDismiss}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>

        <IonToolbar style={{ "--background": "transparent" }}>
          <IonSegment
            value={activeTab}
            onIonChange={(e) => setActiveTab(e.detail.value as any)}
            scrollable
            mode="md"
          >
            <IonSegmentButton value="sort">
              <IonLabel>Ordenar</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="tags">
              <IonLabel>Gêneros</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="platforms">
              <IonLabel>Plataformas</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="price">
              <IonLabel>Preço</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Ordenar */}
        {activeTab === "sort" && (
          <IonList lines="none">
            {[
              { label: "Melhor Avaliação", value: "rating" },
              { label: "Preço: Menor → Maior", value: "price-asc" },
              { label: "Preço: Maior → Menor", value: "price-desc" },
              { label: "Nome: A → Z", value: "name-asc" },
              { label: "Nome: Z → A", value: "name-desc" },
            ].map((opt) => (
              <IonItem
                key={opt.value}
                style={{
                  borderRadius: "12px",
                  marginBottom: "8px",
                  background: "var(--ion-color-step-100)",
                }}
              >
                <IonCheckbox
                  slot="start"
                  checked={sortOrder === opt.value}
                  onIonChange={() => setSortOrder(opt.value)}
                  style={{
                    "--checkbox-background-checked": "var(--ion-color-primary)",
                  }}
                />
                <IonLabel>{opt.label}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}

        {/* Gêneros */}
        {activeTab === "tags" && (
          <IonList lines="none">
            {allAvailableTags.map((tag) => (
              <IonItem
                key={tag}
                style={{
                  borderRadius: "12px",
                  marginBottom: "8px",
                  background: "var(--ion-color-step-100)",
                }}
              >
                <IonCheckbox
                  slot="start"
                  checked={selectedTags.includes(tag.toLowerCase())}
                  onIonChange={() => handleTagChange(tag)}
                  style={{
                    "--checkbox-background-checked": "var(--ion-color-primary)",
                  }}
                />
                <IonLabel>{capitalize(tag)}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}

        {/* Plataformas */}
        {activeTab === "platforms" && (
          <IonList lines="none">
            {allAvailablePlatforms.map((platform) => (
              <IonItem
                key={platform}
                style={{
                  borderRadius: "12px",
                  marginBottom: "8px",
                  background: "var(--ion-color-step-100)",
                }}
              >
                <IonCheckbox
                  slot="start"
                  checked={selectedPlatforms.includes(platform.toLowerCase())}
                  onIonChange={() => handlePlatformChange(platform)}
                  style={{
                    "--checkbox-background-checked": "var(--ion-color-primary)",
                  }}
                />
                <IonLabel>{capitalize(platform)}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}

        {/* Preço */}
        {activeTab === "price" && (
          <IonList lines="none">
            <IonItem
              style={{
                borderRadius: "12px",
                marginBottom: "12px",
                background: "var(--ion-color-step-100)",
              }}
            >
              <IonInput
                type="number"
                name="min"
                label="Preço mínimo"
                value={priceRange.min}
                placeholder="Ex: 20"
                onIonChange={handlePriceChange}
                style={{
                  "--padding-start": "10px",
                  "--border-radius": "10px",
                }}
              />
            </IonItem>
            <IonItem
              style={{
                borderRadius: "12px",
                background: "var(--ion-color-step-100)",
              }}
            >
              <IonInput
                type="number"
                name="max"
                label="Preço máximo"
                value={priceRange.max}
                placeholder="Ex: 200"
                onIonChange={handlePriceChange}
                style={{
                  "--padding-start": "10px",
                  "--border-radius": "10px",
                }}
              />
            </IonItem>
          </IonList>
        )}

        {/* Botão de aplicar */}
        <div
          style={{
            position: "sticky",
            bottom: `calc(env(safe-area-inset-bottom, 0) + 18px)`,
            padding: "16px 0",
            background: "var(--ion-color-step-50)",
          }}
        >
          <IonButton
            expand="block"
            size="large"
            onClick={onDismiss}
            style={{
              "--border-radius": "14px",
              "--background": "var(--ion-color-primary)",
              fontWeight: "600",
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            }}
          >
            Aplicar Filtros
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

// --- Componente Principal ---
function CategoryUI() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "all";

  const {
    loadingGames,
    allAvailableTags,
    allAvailablePlatforms,
    sortOrder,
    setSortOrder,
    selectedTags,
    setSelectedTags,
    selectedPlatforms,
    setSelectedPlatforms,
    priceRange,
    setPriceRange,
    filteredAndSortedGames,
    clearFilters,
  } = useStore();

  const [isMounted, setIsMounted] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const capitalize = (s: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  // Título dinâmico simplificado
  const dynamicPageTitle = useMemo(() => {
    const isAllCategory = slug.toLowerCase() === "all";
    const baseTagLower = isAllCategory
      ? ""
      : decodeURIComponent(slug).toLowerCase();

    if (
      !baseTagLower &&
      selectedTags.length === 0 &&
      selectedPlatforms.length === 0
    ) {
      return "Todos os Jogos";
    }

    const baseTagDisplay = baseTagLower ? capitalize(baseTagLower) : "";
    const additionalTags = selectedTags
      .filter((t) => t !== baseTagLower)
      .map(capitalize);
    const platformsDisplay = selectedPlatforms.map(capitalize);

    let title = "";
    if (baseTagDisplay) title += baseTagDisplay;
    if (additionalTags.length > 0)
      title += `${baseTagDisplay ? ", " : ""}${additionalTags.join(", ")}`;
    if (platformsDisplay.length > 0)
      title += `${title ? " - " : ""}${platformsDisplay.join(", ")}`;

    return title || "Jogos";
  }, [selectedTags, selectedPlatforms, slug]);

  // Contador de filtros ativos
  const { activeFilterCount, isPristine } = useMemo(() => {
    const isAllCategory = slug.toLowerCase() === "all";
    const baseTag = isAllCategory ? "" : decodeURIComponent(slug).toLowerCase();
    const additionalTags = selectedTags.filter((t) => t !== baseTag);
    let count = additionalTags.length + selectedPlatforms.length;
    if (priceRange.min) count++;
    if (priceRange.max) count++;
    if (sortOrder !== "rating") count++;
    return { activeFilterCount: count, isPristine: count === 0 };
  }, [selectedTags, selectedPlatforms, priceRange, sortOrder, slug]);

  // Handlers
  const handleTagChange = (tag: string) => {
    const lowerCaseTag = tag.toLowerCase();
    setSelectedTags((prev: string[]) =>
      prev.includes(lowerCaseTag)
        ? prev.filter((t) => t !== lowerCaseTag)
        : [...prev, lowerCaseTag]
    );
  };

  const handlePlatformChange = (platform: string) => {
    const lowerCasePlatform = platform.toLowerCase();
    setSelectedPlatforms((prev: string[]) =>
      prev.includes(lowerCasePlatform)
        ? prev.filter((p) => p !== lowerCasePlatform)
        : [...prev, lowerCasePlatform]
    );
  };

  const handlePriceChange = (e: any) => {
    const { name, value } = e.target;
    setPriceRange((prev: any) => ({ ...prev, [name]: value }));
  };

  if (loadingGames && !isMounted) {
    return (
      <IonPage>
        <IonContent
          fullscreen
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <IonSpinner name="crescent" />
            <IonText className="ion-margin-start">Carregando jogos...</IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent
        fullscreen
        style={{
          "--padding-bottom": "calc(90px + env(safe-area-inset-bottom, 0))",
        }}
      >
        {/* Header simplificado integrado ao conteúdo */}
        <div style={{ padding: "16px", paddingBottom: "8px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <IonButtons>
              <IonBackButton
                text=""
                style={{
                  "--color": "var(--ion-color-primary)",
                  "--background": "transparent",
                }}
              />
            </IonButtons>
            <IonText>
              <h1
                style={{
                  margin: 0,
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  marginLeft: "8px",
                }}
              >
                {dynamicPageTitle}
              </h1>
            </IonText>
          </div>

          {/* Informações rápidas */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IonText color="medium">
              <small>{filteredAndSortedGames.length} jogos encontrados</small>
            </IonText>

            {/* Chips de filtros ativos rápidos */}
            {activeFilterCount > 0 && (
              <div>
                <IonChip
                  color="primary"
                  outline
                  onClick={() => setIsFilterModalOpen(true)}
                  style={{ cursor: "pointer" }}
                >
                  <IonIcon icon={filter} size="small" />
                  <IonLabel>Filtros ({activeFilterCount})</IonLabel>
                </IonChip>
              </div>
            )}
          </div>
        </div>

        {/* Grid de jogos */}
        <IonGrid style={{ padding: "8px" }}>
          <IonRow>
            {loadingGames ? (
              <IonCol size="12" className="ion-text-center ion-padding">
                <IonSpinner name="crescent" />
                <IonText>
                  <p>Atualizando...</p>
                </IonText>
              </IonCol>
            ) : filteredAndSortedGames.length === 0 ? (
              <IonCol size="12" className="ion-text-center ion-padding">
                <IonText color="medium">
                  <p>Nenhum jogo encontrado com os filtros selecionados.</p>
                </IonText>
                <IonButton onClick={clearFilters}>Limpar Filtros</IonButton>
              </IonCol>
            ) : (
              filteredAndSortedGames.map((game: any) => (
                <IonCol size="6" sizeMd="4" sizeLg="3" key={game.id}>
                  <GameCard game={game} />
                </IonCol>
              ))
            )}
          </IonRow>
        </IonGrid>

        {/* Botão flutuante para filtros */}
        <IonFab
          vertical="bottom"
          horizontal="end"
          slot="fixed"
          style={{
            bottom: "120px",
            marginBottom: "env(safe-area-inset-bottom, 0)",
          }}
        >
          <IonFabButton onClick={() => setIsFilterModalOpen(true)}>
            <IonIcon icon={options} />
            {activeFilterCount > 0 && (
              <IonBadge
                color="danger"
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  fontSize: "12px",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {activeFilterCount}
              </IonBadge>
            )}
          </IonFabButton>
        </IonFab>

        {/* Modal de Filtros */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onDismiss={() => setIsFilterModalOpen(false)}
          allAvailableTags={allAvailableTags}
          allAvailablePlatforms={allAvailablePlatforms}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          selectedTags={selectedTags}
          handleTagChange={handleTagChange}
          selectedPlatforms={selectedPlatforms}
          handlePlatformChange={handlePlatformChange}
          priceRange={priceRange}
          handlePriceChange={handlePriceChange}
          clearFilters={clearFilters}
          activeFilterCount={activeFilterCount}
          isPristine={isPristine}
        />
      </IonContent>
    </IonPage>
  );
}

// --- Wrapper Principal ---
export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const location = useLocation();
  const slug = params.slug || "all";

  const initialFilters = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const sort = searchParams.get("sort") || "rating";
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
    const platforms =
      searchParams.get("platforms")?.split(",").filter(Boolean) || [];
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const isAllCategory = slug.toLowerCase() === "all";
    const baseTags = isAllCategory
      ? []
      : [decodeURIComponent(slug).toLowerCase()];
    return {
      sortOrder: sort,
      selectedTags: [...new Set([...baseTags, ...tags])],
      selectedPlatforms: platforms,
      priceRange: { min: minPrice, max: maxPrice },
    };
  }, [slug, location.search]);

  return (
    <Suspense
      fallback={
        <IonPage>
          <IonContent fullscreen className="ion-padding">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <IonSpinner name="crescent" />
              <IonText className="ion-margin-start">
                Carregando página...
              </IonText>
            </div>
          </IonContent>
        </IonPage>
      }
    >
      <StoreProvider slug={slug} initialFilters={initialFilters}>
        <CategoryUI />
      </StoreProvider>
    </Suspense>
  );
}

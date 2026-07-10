# Occto Pricing – Setup & Integration

## Inhalt dieses Ordners

- **`preview.html`** — Eigenständige HTML-Vorschau. Einfach im Browser doppelklicken, um das fertige Pricing live zu sehen (mit Animationen, Particles, Toggle Monatlich/Jährlich).
- **`components/pricing-cards.tsx`** — Die fertige React/TypeScript-Komponente für die Integration in dein Projekt.
- **`components/demo.tsx`** — Minimal-Beispiel, wie die Komponente eingebunden wird.

## Variante A — Schnell ansehen (kein Setup nötig)

Doppelklick auf `preview.html`. Fertig. Diese Datei ist self-contained, läuft offline und enthält alles (HTML/CSS/JS).

## Variante B — Integration in dein React/Next.js-Projekt

### 1. Voraussetzungen
Dein Projekt sollte folgendes haben:
- shadcn-Projektstruktur
- Tailwind CSS
- TypeScript

Falls noch nicht vorhanden — Setup über die shadcn CLI:

```bash
npx shadcn@latest init
```

### 2. Warum `/components/ui`?
Der Standard-Pfad bei shadcn ist `/components/ui`. Das ist wichtig, damit:
- Imports wie `@/components/ui/button` zuverlässig auflösen
- shadcn-CLI-Befehle die richtigen Pfade finden
- alle UI-Komponenten an einem Ort liegen

Falls `/components/ui` noch nicht existiert: anlegen, bevor du Komponenten kopierst.

### 3. NPM Dependencies installieren

```bash
npm install lucide-react
```

Die hier gelieferte `pricing-cards.tsx` ist **bewusst minimal gehalten** und benötigt
nur `lucide-react` (keine Radix-UI-Abhängigkeiten). Falls du später die volle 21st.dev-
Variante mit Radix-UI-Switch/Card/Button nutzen willst, zusätzlich:

```bash
npm install @radix-ui/react-slot @radix-ui/react-separator @radix-ui/react-switch @radix-ui/react-label class-variance-authority
```

### 4. Komponente einbauen

Kopiere `components/pricing-cards.tsx` in dein Projekt nach
`components/ui/pricing-cards.tsx` (oder einen anderen Pfad deiner Wahl).

Verwendung in einer Page:

```tsx
import PricingCards from "@/components/ui/pricing-cards";

export default function PricingPage() {
  return <PricingCards />;
}
```

### 5. Inhalte anpassen

Alle Texte, Preise und Features lassen sich per Props überschreiben:

```tsx
<PricingCards
  heading="Pakete & Preise"
  description="Wähle das Paket, das zu dir passt."
  contactEmail="hello@occto.com"
  plans={[ /* eigene Plan-Objekte */ ]}
  addons={[{ label: "Newsletter-Modul: +39 € / Monat" }]}
/>
```

## Hinweise zu den Preisen

- **Monatlich**: 99 € / 149 € / 249 €
- **Jährlich**: 10× Monatspreis (= 2 Monate gratis)
- **Setup einmalig**: 490 € / 790 € / ab 1.490 €
- **Add-on**: Newsletter-Modul für Starter/Business +39 € / Monat
- Alle Preise via `Intl.NumberFormat("de-DE", "EUR")` formatiert

## Anpassen der Jahrespreis-Logik

In `pricing-cards.tsx` ist der Jahrespreis als `monthly * 10` gesetzt
(2 Monate geschenkt). Falls du z. B. 15 % Rabatt statt 2 Monate gratis möchtest,
einfach in `defaultPlans` den `yearlyPrice` direkt setzen.

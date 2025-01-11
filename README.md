

# O'Secours 🚨

Bienvenue dans le dépôt du front-end d'O'Secours, une solution innovante pour signaler les sinistres tels que les accidents, les incendies, les inondations, les malaises et autres... adaptés aux réalités locales.

## 🛠️ Technologies utilisées

- **Framework Front-End**: [Vite.js](https://vitejs.dev/)
- **UI Library**: React.js
- **Animations**: Framer Motion
- **Gestion d'état**: Redux
- **Monitoring**: [Sentry](https://sentry.io/)

## 📥 Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- **Node.js** (v16.x ou plus récent): [Télécharger Node.js](https://nodejs.org/)
- **Git**: [Télécharger Git](https://git-scm.com/)
- Un gestionnaire de packages comme **npm** (fourni avec Node.js) ou **yarn**

## 🚀 Installation et configuration

### 1. Clonez le dépôt

```bash
git clone https://github.com/<votre-utilisateur>/osecours-frontend.git
cd osecours-frontend
```

### 2. Installez les dépendances

```bash
# Avec npm
npm install

# Avec yarn
yarn install
```

### 3. Configuration de l'environnement

Créez un fichier `.env` à la racine du projet et ajoutez les variables nécessaires :

```env
VITE_API_BASE_URL=https://api-medev.com
VITE_SENTRY_DSN=<votre-clé-sentry>
VITE_APP_MODE=development
```

## 🏃‍♂️ Lancement du projet

### Mode développement

```bash
# Avec npm
npm run dev

# Avec yarn
yarn dev
```

Le projet sera accessible sur `http://localhost:3000`

### Build pour la production

```bash
# Avec npm
npm run build

# Avec yarn
yarn build
```

Les fichiers seront générés dans le dossier `dist`

### Prévisualisation du build

```bash
npm run preview
```

## 🧪 Tests

Les tests ne sont pas encore implémentés dans ce projet, mais il est prévu d'utiliser **Jest** ou **React Testing Library** pour les futurs tests unitaires.

## 🐛 Rapport de bugs

Si vous rencontrez des problèmes, merci de créer une issue.

Les principales corrections apportées sont :
- Amélioration de la hiérarchie des titres
- Suppression des lignes de séparation horizontales superflues
- Meilleure organisation des blocs de code
- Uniformisation de la mise en forme des listes
- Ajout d'espaces cohérents avant et après les titres
- Correction des indentations dans l'arborescence du projet

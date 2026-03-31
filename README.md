# Systeme de Gestion des Promotions Universitaires

Application full-stack de gestion des promotions des enseignants-chercheurs au Maroc.

Stack utilisee :

- Backend : Laravel 12, Sanctum, MySQL, Eloquent, Form Requests, Carbon, storage prive
- Frontend : React + Vite + TypeScript, Tailwind CSS, React Router, Zustand, React Query, React Hook Form, Zod, Lucide, Sonner, Framer Motion

## Fonctionnalites principales

- Authentification securisee pour `admin` et `teacher`
- Gestion complete des profils enseignants
- Gestion des grades `PA`, `PH`, `PES`
- Gestion des echelons et calcul d'anciennete
- Eligibilite automatique aux promotions de grade et d'echelon
- Workflow de promotions : demande, validation, rejet, suppression
- Gestion documentaire securisee : upload, download, renommage, suppression
- Dashboards distincts administrateur et enseignant
- Interface moderne et responsive en francais

## Architecture

### Backend Laravel

- `app/Enums` : enums metier
- `app/Http/Controllers/Api` : endpoints REST
- `app/Http/Requests` : validation propre
- `app/Http/Resources` : format JSON coherent
- `app/Policies` : authorization fine
- `app/Services` : logique metier
- `app/Support` : helpers et reponses API
- `config/promotion.php` : regles centralisees de promotion

### Frontend React

- `frontend/src/api` : appels HTTP centralises
- `frontend/src/components` : composants reutilisables
- `frontend/src/features` : logique par domaine metier
- `frontend/src/pages` : pages par role
- `frontend/src/routes` : gardes d'authentification et de role
- `frontend/src/store` : session auth persistante
- `frontend/src/lib` : constantes, helpers et formatteurs

## Modele de donnees

Tables principales :

- `users`
- `professeurs`
- `promotions`
- `documents`
- `personal_access_tokens`

Relations :

- un `user` enseignant possede un seul `professeur`
- un `professeur` possede plusieurs `promotions`
- un `professeur` possede plusieurs `documents`
- une `promotion` peut etre approuvee par un `user` admin
- un `document` peut etre televerse par un `user`

## Regles de promotion

Les regles sont centralisees dans `config/promotion.php`.

### Echelon

- 1 -> 2 : 2 ans
- 2 -> 3 : 2 ans
- 3 -> 4 : 3 ans
- 4 -> 5 : 3 ans
- 5 -> 6 : 4 ans
- 6 -> 7 : 4 ans

### Grade

- `PA -> PH` : 6 ans dans le grade et echelon minimal 4
- `PH -> PES` : 6 ans dans le grade et echelon minimal 5

### Pourquoi Carbon

Carbon permet :

- de calculer proprement les annees de service
- de comparer les dates de recrutement et de derniere promotion
- de determiner les annees dans le grade et l'echelon
- de fixer proprement les dates d'effet lors des validations

### Approbation d'une promotion

Lorsqu'une promotion est approuvee :

- le statut passe a `approved`
- la date d'effet est stockee
- le grade ou l'echelon courant du professeur est mis a jour
- `date_last_promotion` est mise a jour
- la date specifique de grade ou d'echelon est egalement mise a jour

## Gestion des documents

Les documents sont stockes sur le disque `local`, donc dans `storage/app/private`.

Le telechargement se fait via une route securisee :

- aucun acces direct public aux pieces
- controle d'autorisation avant download
- metadata conservee en base de donnees

Le lien `php artisan storage:link` reste utile pour d'autres fichiers publics, mais les documents sensibles de promotion restent ici en stockage prive.

## Endpoints API principaux

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Professeurs

- `GET /api/professeurs`
- `POST /api/professeurs`
- `GET /api/professeurs/{id}`
- `PATCH /api/professeurs/{id}`
- `DELETE /api/professeurs/{id}`
- `GET /api/professeurs/{id}/eligibility`
- `GET /api/me/profile`
- `PATCH /api/me/profile`
- `GET /api/me/eligibility`

### Promotions

- `GET /api/promotions`
- `POST /api/promotions`
- `GET /api/promotions/{id}`
- `PATCH /api/promotions/{id}`
- `DELETE /api/promotions/{id}`
- `POST /api/promotions/{id}/approve`
- `POST /api/promotions/{id}/reject`
- `GET /api/me/promotions`
- `POST /api/me/promotions/request`

### Documents

- `GET /api/documents`
- `GET /api/professeurs/{id}/documents`
- `POST /api/professeurs/{id}/documents`
- `DELETE /api/professeurs/{id}/documents`
- `GET /api/me/documents`
- `POST /api/me/documents`
- `GET /api/documents/{id}/download`
- `PATCH /api/documents/{id}/rename`
- `DELETE /api/documents/{id}`

### Dashboards

- `GET /api/dashboard/admin`
- `GET /api/dashboard/teacher`

## Installation backend

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve
```

## Installation frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

## Variables d'environnement backend

Exemple important :

```env
APP_NAME="Systeme Promotions"
APP_URL=http://127.0.0.1:8000
APP_LOCALE=fr
APP_FALLBACK_LOCALE=fr
APP_FAKER_LOCALE=fr_FR

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=systemePromotion
DB_USERNAME=root
DB_PASSWORD=

FILESYSTEM_DISK=local
FRONTEND_URLS=http://localhost:5173,http://127.0.0.1:5173
```

## Variables d'environnement frontend

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## Comptes d'exemple

- `admin@example.com / password`
- `teacher1@example.com / password`
- `teacher2@example.com / password`

## Verifications realisees

- `php artisan route:list`
- `php artisan migrate:fresh --seed --force`
- `npm run build` dans `frontend/`

## Tests

Tests inclus :

- `tests/Feature/AuthTest.php`
- `tests/Unit/EligibilityServiceTest.php`

Execution :

```bash
php artisan test
```

## Evolutions futures

- notifications email a chaque changement de statut
- export PDF du dossier complet
- historique fin des decisions administratives
- workflow multi-niveaux de validation
- tableaux de bord avec charts et tendances mensuelles
- audit log complet des actions sensibles

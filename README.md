# Akal Business School (ABS) Website & Admin Panel

This repository contains the complete codebase for the **Akal Business School (ABS)** web portal and administrative control system. 

It is structured as a decoupled Headless CMS architecture:
- **`backend/`**: Laravel 9 REST API, MySQL Database, Laravel Sanctum Authentication, and Polymorphic SEO/AEO/GEO module.
- **`frontend/`**: Next.js 14 Web App, TypeScript, CSS Modules matching the corporate Navy/Gold design system.

---

## 🚀 Setup & Installation

### Prerequisites
Ensure you have the following installed on your machine:
- **PHP >= 8.1** (with extension support: `PDO`, `OpenSSL`, `Mbstring`, `Tokenizer`, `XML`, `Ctype`, `JSON`)
- **Composer**
- **Node.js >= 18.x** (with `npm` or `yarn`)
- **MySQL >= 8.0**
- **XAMPP / Laragon** (recommended for local Windows setup)

---

### 1. Backend Setup (Laravel REST API)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install PHP dependencies**:
   ```bash
   composer install
   ```

3. **Configure Environment Variables**:
   Copy the sample environment file:
   ```bash
   copy .env.example .env
   ```
   Open the `.env` file and configure your database settings:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=abs_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. **Generate Application Key**:
   ```bash
   php artisan key:generate
   ```

5. **Run Migrations & Seeders**:
   Execute the migration process to create all tables (including the new Polymorphic SEO suite tables) and populate default settings:
   ```bash
   php artisan migrate --seed
   ```

6. **Create Storage Link**:
   Create a symlink for uploaded files (logos, favicons, open graph images):
   ```bash
   php artisan storage:link
   ```

7. **Start Laravel Development Server**:
   ```bash
   php artisan serve
   ```
   The backend API will run at: `http://127.0.0.1:8000`.

---

### 2. Frontend Setup (Next.js 14)

1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file inside the `frontend/` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

4. **Start Next.js Development Server**:
   ```bash
   npm run dev
   ```
   The public web application and admin panel will be accessible at: `http://localhost:3000`.

---

## 📈 SEO, AEO & GEO Configuration

The system is equipped with a complete SEO/AEO/GEO optimization suite managed via `/admin/seo`. 

### 1. Global Settings
Configure site defaults, Google Tag Manager container, GA Measurement ID, Facebook Pixel tracking code, and Search Console verification tags under **Global SEO**.

### 2. Static Page SEO
Assign custom titles, meta descriptions, canonical URLs, and index rules for each primary route. Live Google search result previews are generated instantly.

### 3. Polymorphic Content SEO (News, Programs, Announcements, etc.)
Attach custom metadata and search crawler directions to any content item by choosing its type and item ID.

### 4. Answer Engine Optimization (AEO)
Add structured FAQ lists to any page or content item. The system automatically converts these into a validated **FAQPage JSON-LD schema** format to help target Google's Featured Snippets and voice searches.

### 5. Generative Engine Optimization (GEO)
Set structured details like author bios, Entity Keywords, citation references, and source attribution to improve visibility in AI Search engines (Gemini, ChatGPT Search, Perplexity).

---

## 🛠️ Main Management Commands
| Project Part | Command | Description |
| :--- | :--- | :--- |
| **Backend** | `php artisan migrate` | Apply database structural changes |
| **Backend** | `php artisan db:seed` | Seed default data & SEO settings |
| **Backend** | `php artisan serve` | Launch backend server at port 8000 |
| **Frontend** | `npm run dev` | Run Next.js local server at port 3000 |
| **Frontend** | `npx tsc --noEmit` | Validate type-safety |
| **Frontend** | `npm run build` | Compile optimized production code |

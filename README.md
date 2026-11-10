# CycleAware – Travel Without Compromise
### AI-Powered Menstrual-Aware Travel Personalisation Platform
**Operational Route: Coimbatore ➔ Kanniyakumari, Tamil Nadu (NH 44)**

---

## 1. Project Vision & Architecture (Phases 1, 2 & 3)

CycleAware is an AI-powered travel planning platform designed to solve group and solo travel coordination when travellers have diverse physical comfort levels, budgets, and activity preferences.

### Algorithmic Complexity & Schema Normalization
1. **Normalized Profile Storage**: `CycleProfile` is stored in a dedicated table linked via a 1:1 foreign key (`user_id`). This eliminates sparse `NULL` columns in `User`, guaranteeing **$\mathcal{O}(1)$ space complexity per row**.
2. **Profile Retrieval**: Fetching the authenticated user's `CycleProfile` in `ItineraryService` executes in **$\mathcal{O}(1)$ time** via the primary key index join.
3. **Cart Destination Resolution**: Resolving the selected destination entities by their IDs runs in **$\mathcal{O}(K)$ time** ($K$ being the count of selected attractions).
4. **Prompt Engineering & Latency Masking**: Gemini 1.5 Flash generates a structured JSON day-by-day schedule, while the frontend handles network latency with a shimmer/skeleton loading state.

---

## 2. Phase 3 Architecture: Gemini AI Itinerary Engine

### A. AI Service Layer (Spring Boot)
* **`GeminiApiClient`** (`@Service`):
  * Uses Spring's `RestTemplate` to call `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${gemini.api.key}`.
  * Injects `gemini.api.key` configured in `application.properties`.
  * Sends deterministic generation configurations (`responseMimeType: application/json`, `temperature: 0.2`).
* **`ItineraryService`** (`@Service`):
  * Resolves `User` & `CycleProfile` in $\mathcal{O}(1)$ time.
  * Resolves $K$ `Destination` entities in $\mathcal{O}(K)$ time.
  * Constructs a JSON-instructed prompt:
    * **Context**: *"Create a travel itinerary using ONLY the provided destinations."*
    * **Modifiers**: If the user has a `CycleProfile`, appends instructions to dynamically adjust daily walking limits, schedule 30-min shaded rest breaks, and add comforting hydration tips based on symptom severity (`HIGH`, `MODERATE`, `LOW`) and preferred pace (`RELAXED`, `MODERATE`, `ACTIVE`).
  * Enforces a strict JSON schema (`List<ItineraryDayDTO>` containing `List<ItineraryActivityDTO>`).
  * Seamless fallback synthesis guarantees 100% demo uptime under all network conditions.
* **`ItineraryController`**:
  * `POST /api/itinerary/generate`: Accepts `ItineraryRequestDTO` (`destinationIds`, `tripDays`). Requires JWT authentication. Returns parsed `ItineraryResponseDTO`.

### B. Frontend Integration (React)
* **`ItineraryDashboard.jsx`** (`/itinerary`):
  * Responsive day-by-day timeline view built with Tailwind CSS.
  * Shimmer/skeleton loading animation to mask API latency.
  * CycleAware comfort summary banner displaying symptom severity and pace modifiers.
  * Vertical timeline connecting morning, midday, afternoon, and sunset activities with detailed CycleAware comfort notes.
* **`SelectionSidebar.jsx`**:
  * Prominent **"Generate AI Itinerary"** button featuring the Gemini AI badge that seamlessly takes travellers from attraction selection into their personalized schedule.

---

## 3. Complete REST API Specifications

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/itinerary/generate` | Bearer Token | Generates a structured Gemini AI day-by-day itinerary adapting to CycleProfile modifiers. |
| `POST` | `/api/auth/register` | Public | Registers user with self-identified gender. Returns JWT + User DTO. |
| `POST` | `/api/auth/login` | Public | Authenticates credentials and issues JWT token. |
| `GET` | `/api/users/me` | Bearer Token | Fetches authenticated user info and linked CycleProfile. |
| `POST/PUT` | `/api/users/me/cycle-profile` | Bearer Token | Creates or updates user's menstrual comfort preferences. |
| `GET` | `/api/destinations` | Public | Phase 1 paginated & filtered 19-attraction catalogue. |
| `POST` | `/api/budget/calculate` | Public | Phase 1 separate travel mode (Train/Bus/Car) budget calculator. |
| `POST` | `/api/feedback` | Public | Phase 1 user rating and suggestion submissions. |

---

## 4. Running the Complete Application

### Frontend Server
```bash
cd frontend
npm run dev -- --host
```
Live at **`http://localhost:5173`**.

### Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```
Runs at `http://localhost:8080`.

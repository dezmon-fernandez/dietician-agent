# Lean AI Application Specification: Dietician Agent (MVP)

**Version:** 1.0
**Date:** 2025-04-17

**Instructions:** This document outlines the core requirements for the Minimum Viable Product (MVP) of the Dietician Agent, focusing on AI-driven development.

---

## 1. Core Concept & Goals

*   **1.1. Application Name:** Dietician Agent
*   **1.2. One-Liner Pitch:** For hospitals struggling with meal order errors, Dietician Agent provides an AI-powered voice ordering system that instantly validates patient meal choices against dietary restrictions, improving safety and saving staff time.
*   **1.3. Key Objectives for MVP:**
    1.  Enable patients to order meals via voice commands.
    2.  Accurately validate selected meal items against patient-specific dietary restrictions in real-time.
    3.  Provide immediate feedback to the patient if an item is non-compliant.
*   **1.4. Critical Success Factor:** The real-time dietary validation must be highly accurate and reliable to prevent patient safety incidents.

---

## 2. Key User Experience (MVP)

*   **2.1. Primary User(s) & Goal:** Hospital Patient - To easily and safely order meals that meet their prescribed dietary needs using voice.
*   **2.2. Core User Flow:**
    1.  Patient activates the system (e.g., presses a button, uses a wake word).
    2.  Patient states their desired meal item(s) (e.g., "I would like chicken soup and apple juice").
    3.  System processes the request.
    4.  AI validates each item against the patient's current dietary restrictions (fetched from DB).
    5.  System provides audio feedback:
        *   If compliant: "Okay, adding chicken soup and apple juice."
        *   If non-compliant: "Chicken soup is okay, but apple juice is not allowed on your current clear liquid diet. Would you like water instead?"
    6.  Patient confirms or modifies the order.
    7.  Validated order is logged.
*   **2.3. Interaction Style:** Voice Command (Primary for patient), Web Interface (Secondary for staff viewing logs/profiles - *Simplified for MVP*).
*   **2.4. Desired Look & Feel (Keywords):** Simple, Clear, Reliable, Accessible, Safe.

---

## 3. Core Features & Functionality (MVP Focus)

*   **Feature 1: Voice Meal Item Capture**
    *   **User Story:** As a Patient, I want to state my meal choices using voice so that the system can understand what I want to order.
    *   **Acceptance Criteria (Critical Path):**
        1.  System accurately transcribes spoken meal item names.
        2.  System correctly identifies distinct items from the voice command.
        3.  System provides confirmation of understood items before validation.
    *   **AI Generation Hints:** Use Google Cloud Speech-to-Text API. Expect common food item names. Handle potential background noise typical in hospital rooms.

*   **Feature 2: Real-time Dietary Validation**
    *   **User Story:** As a Patient ordering food, I want the system to instantly check if my selection is allowed on my diet so that I don't order something harmful.
    *   **Acceptance Criteria (Critical Path):**
        1.  System retrieves the correct, up-to-date dietary restrictions for the patient from the database.
        2.  System correctly flags food items that violate *any* active restriction (e.g., allergens, texture, specific diet type like 'renal' or 'clear liquid').
        3.  Validation response time is under 1 second.
    *   **AI Generation Hints:** Requires access to `patients` and `dietary_restrictions` tables. Use Gemini Pro to interpret complex restriction interactions if simple rule matching is insufficient. The core logic involves checking item properties against restriction rules.

*   **Feature 3: Non-Compliant Item Feedback & Basic Suggestion**
    *   **User Story:** As a Patient, if I order something not allowed, I want to be told immediately and offered a simple alternative so I can complete my order.
    *   **Acceptance Criteria (Critical Path):**
        1.  System clearly states which item is non-compliant and *briefly* why (if easily determined, e.g., "not allowed on clear liquid diet").
        2.  System suggests a basic, safe alternative if possible (e.g., water, broth for clear liquid). *MVP does not require complex suggestions.*
        3.  Patient can easily accept/reject the suggestion via voice.
    *   **AI Generation Hints:** Generate audio response using Google Cloud Text-to-Speech. Keep feedback concise. Suggestion logic can be simple rule-based for MVP (e.g., if clear liquid diet violation, suggest water).

---

## 4. Core AI Capabilities (MVP Focus)

*   **4.1. Primary AI Task(s):** Speech-to-Text (STT), Natural Language Understanding (NLU for identifying food items), Rule-Based Reasoning / Simple LLM Reasoning (for validation).
*   **4.2. Key AI Model(s) & Why:** Google Cloud STT (proven accuracy), Gemini Pro (via Google AI SDK) for understanding food items from unstructured speech and potentially handling complex validation rules if needed.
*   **4.3. Critical Data for AI:** Patient ID, Patient's active dietary restrictions, List of available food items and their properties (e.g., ingredients, nutritional info, dietary flags).
*   **4.4. AI Generation Hints:**
    *   For NLU: Prompt Gemini to extract food items from transcribed text. Example: `Text: "I guess I'll have the turkey sandwich and uh maybe some orange juice" -> Extracted: ["turkey sandwich", "orange juice"]`.
    *   For Validation: Provide patient restrictions and item details to the validation logic (can be rules engine or LLM call). Return `{isValid: boolean, reason: string|null}`.

---

## 5. Data Essentials (MVP)

*   **5.1. Key Input/Output Data:**
    *   Input: Patient voice -> Transcribed Text -> Extracted Food Items
    *   Output: Validation Result (Valid/Invalid + Reason) -> Audio Feedback -> Logged Order (PatientID, Items, Timestamp, Status)
*   **5.2. Core Data Schema:**
    ```sql
    -- patients
    --   patient_id (PK, TEXT)
    --   current_location (TEXT) -- e.g., Room number
    --   -- Other non-essential fields deferred for MVP

    -- dietary_restrictions
    --   restriction_id (PK, SERIAL)
    --   patient_id (FK -> patients)
    --   restriction_type (TEXT) -- e.g., 'allergy', 'diet_type', 'texture'
    --   restriction_value (TEXT) -- e.g., 'peanuts', 'clear_liquid', 'pureed'
    --   is_active (BOOLEAN)
    --   start_date (TIMESTAMP)
    --   end_date (TIMESTAMP, NULLABLE)

    -- food_items
    --   item_id (PK, TEXT)
    --   name (TEXT)
    --   description (TEXT, NULLABLE)
    --   dietary_flags (JSONB or TEXT[]) -- e.g., ['gluten_free', 'nut_free', 'clear_liquid']
    --   -- Other fields like nutrition deferred for MVP

    -- meal_orders_log (Simplified for MVP)
    --   log_id (PK, SERIAL)
    --   patient_id (FK -> patients)
    --   order_timestamp (TIMESTAMP)
    --   requested_items (TEXT[])
    --   validated_items (TEXT[])
    --   status (TEXT) -- e.g., 'Accepted', 'Rejected', 'Modified'
    ```
*   **5.3. Critical Privacy/Security Note:** Handles PHI (Patient ID, Dietary Restrictions). HIPAA relevant. Requires secure data handling, encryption (at rest/transit), and access controls.

---

## 6. Tech Stack Choices (Reflecting Current Repo)

*   **6.1. Language:** TypeScript
*   **6.2. Package Manager:** pnpm (in a monorepo structure)
*   **6.3. Frontend:** React, TypeScript, (Framework inferred - e.g., React/Vue/Svelte), potentially Cloudflare Pages routing
*   **6.4. Backend:** Node.js, TypeScript, Prisma (ORM), Express
*   **6.5. Database(s):** Relational DB managed via Prisma (e.g., PostgreSQL), likely containerized via Docker
*   **6.6. Key AI Libs/APIs:** Google Cloud Speech-to-Text, Google Cloud Text-to-Speech, Google AI SDK (for Gemini Pro) *(As per original spec)*
*   **6.7. Cloud Platform:** Potentially GCP (as per original spec), Cloudflare, or Docker hosting platform (e.g., DigitalOcean App Platform)
*   **6.8. Containerization:** Docker, Docker Compose
*   **6.9. Other Tools:** Prettier (Formatting), ESLint (Linting), K6 (Load Testing), GitHub Actions (CI/CD)

---

## 7. Key Examples (Crucial for AI Gen)

*   **7.1. Example User Input/Output:**
    *   Patient: "I want the grilled cheese sandwich."
    *   *(Patient has 'gluten_free' restriction)*
    *   System: "Grilled cheese sandwich is not allowed on your gluten-free diet. Would you like the gluten-free rice bowl instead?"
*   **7.2. Example API Request/Response (Validation Service - Internal):**
    *   Request: `POST /validate_item`
      ```json
      {
        "patient_id": "PID12345",
        "item_id": "grilled_cheese"
      }
      ```
    *   Response:
      ```json
      {
        "isValid": false,
        "reason": "Item contains gluten, violates 'gluten_free' restriction.",
        "suggested_alternative_id": "gf_rice_bowl"
      }
      ```
*   **7.3. Simple UI Mockup Description (Staff Log View - Low Priority MVP):** A simple table view showing `meal_orders_log` entries: Timestamp, Patient ID, Requested Items, Validated Items, Status.

---

## 8. MVP Constraints & Assumptions

*   **8.1. Key Constraints:** Requires reliable GCP API access. Initial version assumes English language only. Accuracy of dietary flags in `food_items` DB is critical.
*   **8.2. Core Assumptions:** Patients are able to use simple voice commands. Hospital Wi-Fi is reliable enough for API calls. Core patient restrictions are accurately entered into the system (via external process for MVP).

--- 
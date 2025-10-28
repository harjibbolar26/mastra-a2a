# 🐱 Cat Fact Profile API

A simple RESTful API that returns my profile information along with a random cat fact fetched dynamically from the [Cat Facts API](https://catfact.ninja/fact).

---

## 📌 Features
- Built with **Node.js + Express**
- Fetches dynamic data from an external API
- Returns current **UTC timestamp** in ISO 8601 format
- Handles errors gracefully
- Follows proper REST and JSON response standards

---

## 🚀 Endpoint

### GET `/me`

**Response format:**
```json
{
  "status": "success",
  "user": {
    "email": "your_email@example.com",
    "name": "Your Full Name",
    "stack": "Node.js/Express"
  },
  "timestamp": "2025-10-15T12:34:56.789Z",
  "fact": "A random cat fact."
}
# mastra-a2a

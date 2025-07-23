
# Gator - A CLI RSS Feed Aggregator

**Gator** is command-line tool written in TypeScript that allows users to subscribe to RSS feeds, store and browse posts, and manage their subscriptions — all backed by a PostgreSQL database.

---

## Prerequisites

Before running Gator, make sure the following are installed on your system:

- **[Node.js](https://nodejs.org/)**
- **[PostgreSQL](https://www.postgresql.org/download/)**

---

## Installation

1. **Clone the repository:**

   ```bash
   clone https://github.com/GircysRomualdas/gator
   cd gator
   npm install
   ```

## Configuration

Gator uses a `.gatorconfig.json` file in the home directory to store:

- The current user
- PostgreSQL connection credentials

### Example `.gatorconfig.json`:

```json
{
  "db_url": "postgres://postgres:postgres@localhost:5432/gator?sslmode=disable",
  "current_user_name": "your_username"
}
```

Add .gatorconfig.json to ~ (home).

---

## Usage

Gator supports a variety of CLI commands. After clone, run commands like this:

```bash
npm run start <command> [arguments]
```

### User Management

- **Register a user**

  ```bash
  npm run start register <username>
  ```

- **Login as a user**

  ```bash
  npm run start login <username>
  ```

- **Delete all user's**

  ```bash
  npm run start reset
  ```

- **List all users**

  ```bash
  npm run start users
  ```

---

### Feed Management

- **Add a new feed**

  ```bash
  npm run start addfeed <feed-name> <feed-url>
  ```

- **List all available feeds**

  ```bash
  npm run start feeds
  ```

- **Follow a feed**

  ```bash
  npm run start follow <feed-url>
  ```

- **Unfollow a feed**

  ```bash
  npm run start unfollow <feed-url>
  ```

- **List feeds you’re currently following**

  ```bash
  npm run start following
  ```

---

### Aggregation and Browsing

- **Aggregate (fetch and store posts)**

  ```bash
  npm run start agg
  ```

- **Browse posts from feeds you follow**

  ```bash
  npm run start browse
  ```

  Optionally, limit the number of results:

  ```bash
  npm run start browse 5
  ```

```mermaid
erDiagram
    Users {
        int user_id PK
        string user_name
        string first_name
        string last_name
        string email UK
        string password
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    Currencies {
        int currency_id PK
        string currency_name UK
        string currency_symbol UK
        datetime created_at
        datetime updated_at
    }

    Accounts {
        int account_id PK
        int user_id FK
        int currency_id FK
        string cbu UK
        decimal current_balance
        boolean is_default
        datetime created_at
        datetime updated_at
    }

    Transactions {
        int transaction_id PK
        decimal importe
        datetime transaction_date
        int sender_account_id FK
        int receive_account_id FK
        datetime created_at
        datetime updated_at
    }

    Payees {
        int payee_id PK
        int user_id FK
        string full_name
        string cbu
        string alias
        int currency_id FK
        datetime created_at
        datetime updated_at
    }

    Users ||--o{ Accounts : "tiene"
    Currencies ||--o{ Accounts : "se usa en"
    Accounts ||--o{ Transactions : "envía (sender)"
    Accounts ||--o{ Transactions : "recibe (receiver)"
    Users ||--o{ Payees : "agenda"
    Currencies ||--o{ Payees : "se usa en"
```
```mermaid
erDiagram
    Users {
        int user_id PK
        varchar user_name
        varchar email UK
        varchar password
    }

    Currencies {
        int currency_id PK
        varchar currency_name UK
        varchar currency_symbol UK
    }

    Accounts {
        int account_id PK
        int user_id FK
        int currency_id FK
        decimal current_balance
        boolean is_default
    }

    Transactions {
        int transaction_id PK
        decimal importe
        datetime transaction_date
        int sender_account_id FK
        int receive_account_id FK
    }

    Users ||--o{ Accounts : "posee"
    Currencies ||--o{ Accounts : "denomina"
    Accounts ||--o{ Transactions : "envía"
    Accounts ||--o{ Transactions : "recibe"
```

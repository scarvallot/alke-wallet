```mermaid
erDiagram
    User {
        int user_id PK
        varchar username
        varchar email
        varchar password
        decimal current_balance
    }

    Currency {
        int currency_id PK
        varchar currency_name
        varchar currency_symbol
    }

    Transaction {
        int transaction_id PK
        decimal importe
        datetime transaction_date
        int sender_user_id FK
        int receiver_user_id FK
        int currency_id FK
    }

    User ||--o{ Transaction : "envía (sender)"
    User ||--o{ Transaction : "recibe (receiver)"
    Currency ||--o{ Transaction : "usada en"
```

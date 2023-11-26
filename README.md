## Getting Started

First, run the development server:

```bash
pnpm install
# then
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant ApiClient
    participant Backend

    User->>UI: Clicks Submit Button
    UI->>UI: Prevents default form submission
    UI->>UI: Validates Thread Object
    alt Thread Object Valid
        UI->>UI: Sets isLoading to true
        UI->>ApiClient: addMessageToThread(thread, question)
        ApiClient->>Backend: POST /addMessage
        Backend->>ApiClient: Acknowledges Message
        ApiClient->>UI: Updates Conversation State with User Message
        UI->>UI: Clears Question State
        UI->>ApiClient: runAssistant(thread)
        ApiClient->>Backend: POST /runAssistant
        Backend->>ApiClient: Returns run object
        loop Polling for Response
            UI->>ApiClient: checkRunStatus(thread, run)
            ApiClient->>Backend: GET /runStatus
            Backend->>ApiClient: Returns Status
            ApiClient->>UI: Status Response
        end
        UI->>UI: Sets isLoading to false
        UI->>UI: Updates Conversation State with Assistant Message
    else Thread Object Invalid
        UI->>User: Shows Error Message
    end
```

# Application Flow Diagram

## Group Page

```mermaid

graph TD
  Login[Login Page] -->|Login Successful| Home[Home Screen]
  Home -->|Click Add Group| AddGroup[Add Group Page]
  AddGroup -->|Select Options and Create| NewGroup[New Group Created]
  NewGroup -->|Navigate to| GroupPage[Group Page]
  Home -->|Click Available Group| GroupPage[Group Page]
```

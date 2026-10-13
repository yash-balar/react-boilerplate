# Frontend-only data and permissions

This project currently has no backend integration. Authentication, manager records, and profile data are stored in browser `localStorage`; React Query is used only to coordinate the local data with the existing pages.

## Demo accounts

All seeded accounts use the password `Demo1234`:

| Role | Email |
| --- | --- |
| Admin | `admin@workspace.com` |
| Manager | `olivia.rhye@example.com` |
| Employee | `employee@workspace.com` |

Only managers and employees can register. The admin account is seeded and cannot be created through the registration form. The users and manager directory are initialized from `src/utils/userData.js` and `src/utils/dummyManagerData.js`.

## Roles and permissions

Role names, permissions, and role-to-permission grants are defined in `src/constants/permissions.js`. Routes and navigation use those grants; manager create, update, and delete actions are independently permission-checked.

## Browser storage

The application uses `workspace.users`, `workspace.session`, and `workspace.managers` localStorage keys. Clearing those keys resets the app to its seeded data. This is suitable for a frontend demo only: browser storage is not secure authentication or a trusted authorization boundary, and it must not be used for production credentials or sensitive data.

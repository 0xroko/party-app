# Party app

## Dizajn

- [Figma File](https://www.figma.com/file/AJCEXi6P13yXk1yh6gXvG3/)
- [Komponente](/apps/mobile/src/components/)

## Todo

- [ ] migrate from react-native-svg to react-native-skia (najvaznije)
- [ ] block user functionality
- [ ] party search
- [ ] party filter
- [ ] party sort
- [ ] party share
- [ ] party report

## Packages

- `app/mobile` -> expo app
- `app/next_js` -> next.js (primarno za edge functions)
- `packages/database` -> supabase types i prisma schema

### app/mobile

#### Struktura

- src
  - components -> komponente
  - hooks -> custom hooks
  - features -> feature folderi
    - auth -> auth feature
    - party -> party feature
    - user -> user feature

#### Paketi

- `@react-navigation` -> navigacija
- `react-native-mmkv` -> local storage
- `nativewind` -> styling
- [`houseform`](https://houseform.dev) -> forms
- `react-query` -> data fetching
- `zod` -> validation
- `zustand` -> state management

### app/next_js

#### Struktura

- src
  - api/ -> edge functions

### @party-app/database

#### Struktura

- src
  - supabase.ts -> supabase types
  - prisma/schema.prisma -> prisma schema

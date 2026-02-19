# Fast Eat

A React Native food ordering app built with Expo. Browse restaurant menus, place orders, and track deliveries on a live map — all from your phone.

> **University project** — Mobile Computing course, University of Milan (2024/25)

---

## Screenshots

| Onboarding | Home | Menu Detail |
| --- | --- | --- |
| *(Login / Register)* | *(Menu list)* | *(Ingredients & order)* |

| Confirm Order | Order Tracking | Profile |
| --- | --- | --- |
| *(Payment)* | *(Live map)* | *(User info)* |

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Expo](https://expo.dev/) ~52 / React Native 0.76 |
| Navigation | [React Navigation](https://reactnavigation.org/) v7 (Native Stack + Bottom Tabs) |
| Maps | [react-native-maps](https://github.com/react-native-maps/react-native-maps) 1.18 |
| Location | [expo-location](https://docs.expo.dev/versions/latest/sdk/location/) ~18 |
| Local DB | [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) ~15 |
| Async storage | [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) 1.23 |
| HTTP | Fetch API (via `CommunicationController`) |
| Styling | React Native `StyleSheet` with global design tokens |

---

## Architecture

The project follows an **MVVM** (Model–View–ViewModel) pattern:

``` bash
models/
  CommunicationController.js   # All HTTP calls to the course API
  PositionController.js        # Device GPS / expo-location wrapper
  StorageManager.js            # AsyncStorage + SQLite persistence

viewmodels/
  ViewModel.js                 # Business logic; bridges models ↔ views

views/
  Root.jsx                     # Navigation stack + tab bar setup
  onboarding/
    FirstComponent.jsx         # Login & registration screen
  menu/
    Home.jsx                   # Restaurant list / home feed
    MenusList.jsx              # Scrollable menu catalogue
    Menu.jsx                   # Single menu detail & order button
    Ingredients.jsx            # Ingredient list for a menu
    ConfirmOrder.jsx           # Order confirmation & payment
  order/
    Order.jsx                  # Active order status
    MapOrder.jsx               # Live delivery tracking map
  profile/
    ProfilePage.jsx            # Profile tab (routes to info/form)
    InfoProfile.jsx            # View user profile details
    Form.jsx                   # Edit profile form
  common/
    LoadingScreen.jsx          # Shared loading spinner

styles/
  styles.js                    # Global colour tokens & shared styles
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo-cli`
- iOS Simulator (macOS) **or** Android Emulator **or** [Expo Go](https://expo.dev/client) on a physical device

### Install

```bash
git clone https://github.com/gerolori/fast-eat-rn.git
cd fast-eat-rn
npm install
```

### Run

```bash
# Start the Expo dev server
npm start          # opens Expo DevTools

# Platform shortcuts
npm run android    # launch on Android emulator
npm run ios        # launch on iOS simulator (macOS only)
npm run web        # launch in browser
```

Scan the QR code with **Expo Go** to run on a physical device.

---

## Screens & Features

| Screen | Description |
| --- | --- |
| **Login / Register** (`FirstComponent`) | Create an account or log in; credentials stored in AsyncStorage |
| **Home** (`Home`) | Displays nearby restaurants fetched from the API |
| **Menu List** (`MenusList`) | Browse all available menus for a restaurant |
| **Menu Detail** (`Menu`) | View menu name, price, image, and add to cart |
| **Ingredients** (`Ingredients`) | List of ingredients with origin and bio flag |
| **Confirm Order** (`ConfirmOrder`) | Enter payment card details and place the order |
| **Order Status** (`Order`) | Shows current order status and estimated time remaining |
| **Order Tracking** (`MapOrder`) | Live map showing delivery position via `react-native-maps` |
| **Profile** (`InfoProfile` / `Form`) | View and edit user profile (name, last name, card info) |

---

## API

Base URL: redacted

This is the university course REST API provided for the Mobile Computing exam. All requests are handled by `models/CommunicationController.js`.

Key endpoints (illustrative):

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/user` | Register a new user |
| `GET` | `/user/:sid` | Get user profile |
| `PUT` | `/user/:sid` | Update user profile |
| `GET` | `/menu` | List available menus |
| `GET` | `/menu/:mid` | Get menu detail |
| `GET` | `/menu/:mid/ingredients` | Get ingredients for a menu |
| `POST` | `/order` | Place an order |
| `GET` | `/order/:oid` | Get order status |

---

## Project Structure

``` bash
fast-eat-rn/
├── App.js                   # Entry point; initialises ViewModel
├── index.js                 # Expo registerRootComponent
├── app.json                 # Expo config (name, slug, icons)
├── package.json
├── eslint.config.js
│
├── assets/
│   ├── logo/
│   │   ├── logo.png
│   │   └── splash_logo.png
│   └── icons/
│       ├── home.png
│       ├── menu.png
│       ├── user.png
│       ├── shopping_bag.png
│       ├── pin.png
│       └── drone.png
│
├── models/
│   ├── CommunicationController.js
│   ├── PositionController.js
│   └── StorageManager.js
│
├── viewmodels/
│   └── ViewModel.js
│
├── views/
│   ├── Root.jsx
│   ├── common/
│   │   └── LoadingScreen.jsx
│   ├── onboarding/
│   │   └── FirstComponent.jsx
│   ├── menu/
│   │   ├── Home.jsx
│   │   ├── MenusList.jsx
│   │   ├── Menu.jsx
│   │   ├── Ingredients.jsx
│   │   └── ConfirmOrder.jsx
│   ├── order/
│   │   ├── Order.jsx
│   │   └── MapOrder.jsx
│   └── profile/
│       ├── ProfilePage.jsx
│       ├── InfoProfile.jsx
│       └── Form.jsx
│
└── styles/
    └── styles.js
```

---

## Development Stages (Exam Practice)

These sections capture notes from working through past exam exercises. Each exam presents 4 numbered tasks (Prima–Quarta) to implement under time pressure. The notes below reflect the approach and implementation steps taken.

---

### Exam — January (Ingredients Screen)

Step-by-step notes for implementing the Ingredients screen feature, recorded with timing:

#### Prima — Add button to menu detail & navigate to new screen

- Add a new `TouchableOpacity` button to the menu detail screen (~12 min for correct styling)
- Wire button to a navigation call
- Style the page with the button linked to a ViewModel call
- Add the API function in `CommunicationController` with the correct query/body params
- Add the ViewModel function that calls `CommunicationController`
- Validate data similarly to the form fields
- Show an alert dialog on error

#### Seconda — New Ingredients screen with list

- Create a new screen titled "Ingredients of [menu name]" (~28 min: screen with navigation and header)
  - Import the new screen in `Root.jsx`
  - Add it to the appropriate stack, optionally with header enabled for a back button
  - Initialise the screen with placeholder text, copy essential imports and style references from other screens
- Register the screen in the ViewModel's page-saving mechanism (~40 min):
  - Add a `useEffect` with `savePage` (copied from other screens)
  - `savePage` calls the ViewModel passing the new screen name
  - Add the case to `getInitialRouteNames`
- Pressing the button navigates to the new screen (done from the start)
- Back navigation works via the stack header (done from the start)
- Add the ingredients API call in `CommunicationController` (~1 h)
- Add the corresponding ViewModel method (~1 h)
- Debug the ViewModel call (~1 h 30 min):
  - Open the debugger (`j`), inspect the network response, fix errors
  - Remember to pass required parameters to the API call

#### Terza — Display ingredient details (name, origin, bio, description)

- Render a list where each item shows: name, origin, bio (boolean), description (~1 h 35 min)

#### Quarta — Conditional discount display

- If discount applied: show text + logo
- If discount not applied: show text + logo
- *(Completed in ~10 minutes — straightforward conditional rendering)*

---

### Exam — January (Subscription & Pricing)

#### Prima

- Add button to page
- Wire button to navigation call
- Style the page with button linked to a ViewModel call
- Add function in `CommunicationController` with correct query/body params
- Add ViewModel function calling `CommunicationController`
- Validate data as per form fields
- Show dialog on error

#### Seconda

- In `CommunicationController`: duplicate the profile request, changing the URL to the correct one
- Add the "mangione" (heavy eater) field with its value under the profile values
- Show the "mangione" user button conditionally based on whether the user has a subscription

#### Terza

- Change the pricing logic: subtract the price directly if the user has a subscription
- Without subscription: menus with a discount return a `missedDiscount` field
- Log the API call
- No UI changes required at this stage

#### Quarta

- If discount applied: show text + logo
- If discount not applied: show text + logo

---

### Recommended VS Code Extensions

`ESLint` · `SonarQube for IDE` · `IntelliJ Keybindings` · `Prettier` · `Todo Tree` · `Error Lens` · `ES7+ React/Native Snippets` · `Auto Import` · `JetBrains Icon Theme`

---

## Course Info

**Course:** Mobile Computing  
**University:** Università degli Studi di Milano  
**Academic Year:** 2024/25  
**API Environment:** redacted

---

## Commands for the emulator

### Emulator

To run emulator without opening Android Studio (on Windows 11):

`C:\Users\YOURUSERNAME\AppData\Local\Android\Sdk\emulator\emulator.exe -avd Pixel_9`

### Native

Start React server locally and open it in the expo app:

`npx expo run:android`

### Debugging

When running app on emulator:

1. Press m on the terminal to show the dev dialog
2. On the emulator press "Open JS Debugger"
3. Probably need to refresh the app to show the source files

#### Brakepoints

Go to the sources tab an with right click you can search in all files so you can find the same function of your code or the text of your screen.
After that you can set breakpoints there (by clicking the search results it then throws you into the actual code file). You can navigate breakpoints in the top right corner
You can also check Network calls and components (even with a eyedrop picker).

## License

This project is for educational purposes only.

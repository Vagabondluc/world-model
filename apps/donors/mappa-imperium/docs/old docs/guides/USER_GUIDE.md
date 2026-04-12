# Mappa Imperium - Player's Guide

Welcome to the Mappa Imperium application! This guide will walk you through the core features and help you get started on your collaborative worldbuilding journey.

## 1. Starting or Joining a Game

When you first launch the app, you'll be on the **Game Setup** screen. From here, you have several options:

-   **Start a New Game**: Configure the number of human and AI players, the game length, and the years-per-turn. Click "Begin Worldbuilding" (or "Configure AI Players") to start.
-   **Import a Saved Game**: Click the "Import" button to load a `mappa-imperium-export.json` file you saved from a previous session.
-   **Load from a Chronicle Feed**: If someone has given you a URL to a `chronicle-feed.json` file, paste it into the URL input and click "Load". This will let you view their world as an observer.
-   **Browse the Lobby**: Click "Browse" to see a list of public games you can join as an observer.

After setting up or loading a game, you'll land on the **Player Selection** screen. Here you can:
-   **Join as a Player**: Click an open player slot, enter your name, set a password to claim the slot, and join the game.
-   **Rejoin as a Player**: If you've joined before, click your named slot and enter your password.
-   **Join as an Observer**: Click the "Join as Observer" button to get a read-only view of the world.

## 2. The Main Screen

Once in the game, the screen is divided into a few key areas:

-   **Header**: At the top of the screen.
    -   **View Toggle**: Switch between the **Rulebook** view (where you play the game) and the **Element Manager** view (where you manage your creations).
    -   **Era Selector**: (In Rulebook view) Allows you to navigate between the different eras of the game.
    -   **Player Status**: Shows who is online and allows you to log off.
    -   **Export Menu**: Where you can save your game or publish a feed.

-   **Main Content Area**: The central part of the screen where you'll interact with the rules and gameplay forms.

-   **Completion Tracker**: The footer at the bottom of the screen. It shows the overall progress of all players through the current era. You can expand it to see detailed stats for each player.

## 3. Playing the Game: An Era Walkthrough

Most eras follow a consistent layout provided by the `EraLayoutContainer`:

-   **Rules / Gameplay Tabs**: At the top of the main content area, you can switch between reading the rules for the era and accessing the interactive gameplay forms.
-   **Gameplay Steps**: A progress bar shows the major steps for the current era. You can often click on completed steps to go back and review your work.
-   **"Your Creations" Sidebar**: A sidebar on the right shows a list of all the elements you have created in the current era.

## 4. Managing Your World: The Element Manager

Switching to the **Element Manager** view gives you a powerful interface to see everything that has been created in your world.

-   **Filtering & Searching**: Use the controls at the top to find specific elements by name, type, owner, or era.
-   **Views**:
    -   **Grid View**: The default view, showing detailed cards for each element.
    -   **List View**: A compact, table-like view for quickly scanning many elements.
    -   **Timeline View**: A chronological view that sorts elements by the year they were created, telling the story of your world in order.
-   **Interacting with Elements**:
    -   **Click**: Click anywhere on a card to open a read-only modal with its full details.
    -   **Actions Menu**: Use the "Actions" dropdown on a card to Edit or Delete an element (if you are the owner).

## 5. Exporting Your World

From the "Export" menu in the header, you have three options:

-   **Save Game (.json)**: This is your session save file. Use this to save your progress and continue later.
-   **Publish Feed (.json)**: This creates a `chronicle-feed.json` file. This is the file you would host on a server for others to load as observers.
-   **Export Markdown (.zip)**: This packages every element in your world into a zip file containing organized folders of Markdown files, perfect for personal notes or use in other platforms.

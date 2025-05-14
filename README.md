# MSN-BAHRAIN

- MSN Bahrain is an online advertising platform created to help users sell their products and facilitate connections between sellers and buyers. Users can post, browse, and manage advertisements in multiple categories, including Books, Electronics, and Car Supplies. The platform features user authentication, image upload capabilities, and ad filtering options.

---
## Trello Documentation
[Trello](https://trello.com/invite/b/682467cc76713d02ef11fa3f/ATTIc093db85297ab01652d70dd45ba8160c07C0957D/my-trello-board)
---
## Features

### Current Features

- User registration and login
- Guests Viewer
- Post, edit, and delete advertisements
- Categories
- Image upload for ads
- Search and filter ads
- Save ads as favorites
- User Dashboard to manage ads

### Future Features

- Featured Ad
- Inspection products
-
- ***

## The Scenarios

- Guest enters the website & search for specific product
- Guest enters & view all the posted ads
- User can create new ads
- User can edit their own ads
- User can delete their own ads

---

## Main Functionality

- Sign up
- Sing in
- sing out
- Show all (Landing page)
- Search by keyword
- User Dashboard (User landing page)
- Creating Ad
- Edit & Update Add
- Delete Ad

---

## Entities

- Users
- Ads
- Category

---

## Entity Relationship Diagram

- Users

  - UserID
  - name
  - ContactNo
  - Email
  - password

- Ads

  - AdsID
  - CategoryID
  - UserID
  - Title
  - Price
  - Date
  - Description

- Category
  - CategoryID
  - Title
  - Description
  - Quantity
  - isAvailable
  - Date

---

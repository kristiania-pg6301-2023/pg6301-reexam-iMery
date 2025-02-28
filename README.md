# Social Media App - reexam

A **social media app** with authentication and posts, built using **React, Express, Node.js, MongoDB, OpenID connect, Heroku**.

## Heroku

[![Deploy on Heroku](https://img.shields.io/badge/Heroku-Live_App-430098?style=for-the-badge&logo=heroku&logoColor=white)](https://social-media-app-maka-cda458daeb4b.herokuapp.com)

## Requirements

- [x] Anonyme brukere skal se de siste innleggene og reaksjoner (emojis) når de kommer til nettsiden (lag noen eksempelinnlegg for å demonstrere)
- [x] Brukere kan logge seg inn. Du kan velge brukere skal kunne registrere seg med brukernavn og passord (anbefales ikke) eller om brukere skal logge inn med Google eller Entra ID
- [x] En bruker som er logget inn kan se på sin profilside
- [x] Brukere skal forbli logget inn når de refresher websiden
- [x] En bruker som er logget inn kan klikke på et innlegg for hvem som har reagert på innlegget og kommentarer. Detaljene skal inkludere en overskrift, tekst, navn og bilde (om tilgjengelig) på den som publiserte den
- [x] Brukere kan publisere nye innlegg. Innlegg skal være mellom 10 ord og 1000 tegn.
- [x] Systemet hindrer en bruker fra å publisere mer enn 5 innlegg innefor en time
- [x] Brukeren skal forhindres fra å sende inn en nyhetsartikkel som mangler tekst
- [x] En bruker skal kunne redigere et innlegg de selv har publisert
- [x] En bruker skal kunne slette et innlegg de selv har publisert
- [x] Brukere skal reagere på andres innlegg med en av flere emojis
- [x] **Valgfritt:** Brukere kan legge til kommentarer til andres innlegg
- [ ] **Valgfritt:** Brukere kan legge til andre brukere som venner
- [x] Alle feil fra server skal presenteres til bruker på en pen måte, med mulighet for brukeren til å prøve igjen

### Note

By the end of the exam i noticed that the exam requires 3 type of users! Thats why i only have logging in with openID connect and anonymous users. I also faced some deployment challenges with heroku and it took a lot of time, so i I couldn’t do testing either.

### Github link:
https://github.com/kristiania-pg6301-2023/pg6301-reexam-iMery

## Running the project

### **Option 1: Run Everything Together**

```sh
# Install all dependencies from the root folder
npm install

# Start the project runs both frontend and backend
npm run start

# Or backend and frontend can be run seperatly
cd server
npm install
npm run dev

cd ../client
npm install
npm run start
```

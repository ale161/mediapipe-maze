# 🚀 Deployment Guide

Αυτός ο οδηγός περιγράφει πώς να κάνετε deploy την εφαρμογή MediaPipe Maze Game.

## GitHub Pages (Recommended)

Το GitHub Pages είναι η ευκολότερη και δωρεάν λύση για hosting.

### Βήματα:

1. **Ενεργοποιήστε το GitHub Pages**
   - Πηγαίνετε στο https://github.com/ale161/mediapipe-maze/settings/pages
   - Στο "Source", επιλέξτε **main** branch
   - Στο "Folder", επιλέξτε **/ (root)**
   - Κάντε κλικ στο **Save**

2. **Περιμένετε το deployment**
   - Το GitHub θα χρειαστεί 1-5 λεπτά για να κάνει build και deploy
   - Μπορείτε να δείτε την πρόοδο στο tab "Actions"

3. **Επισκεφτείτε την εφαρμογή**
   - URL: https://ale161.github.io/mediapipe-maze/
   - Η εφαρμογή θα είναι διαθέσιμη με HTTPS (απαραίτητο για camera access)

### Ενημερώσεις:

Κάθε φορά που κάνετε push στο main branch, το GitHub Pages θα ενημερώνεται αυτόματα.

---

## Netlify (Alternative)

Το Netlify προσφέρει εξαιρετική performance και εύκολο deployment.

### Βήματα:

1. **Δημιουργήστε λογαριασμό στο Netlify**
   - Πηγαίνετε στο https://www.netlify.com/
   - Συνδεθείτε με το GitHub account σας

2. **Συνδέστε το repository**
   - Κάντε κλικ στο "Add new site" → "Import an existing project"
   - Επιλέξτε το repository `ale161/mediapipe-maze`
   - Branch: `main`
   - Build command: (αφήστε κενό)
   - Publish directory: (αφήστε κενό ή βάλτε `/`)

3. **Deploy**
   - Κάντε κλικ στο "Deploy site"
   - Το Netlify θα δώσει ένα τυχαίο URL (π.χ. `random-name-123.netlify.app`)
   - Μπορείτε να αλλάξετε το domain name στις ρυθμίσεις

### Custom Domain:

Αν έχετε δικό σας domain, μπορείτε να το συνδέσετε στο Netlify:
- Settings → Domain management → Add custom domain

---

## Vercel (Alternative)

Το Vercel είναι μια άλλη εξαιρετική πλατφόρμα για static sites.

### Βήματα:

1. **Δημιουργήστε λογαριασμό στο Vercel**
   - Πηγαίνετε στο https://vercel.com/
   - Συνδεθείτε με το GitHub account σας

2. **Import project**
   - Κάντε κλικ στο "Add New" → "Project"
   - Επιλέξτε το repository `ale161/mediapipe-maze`
   - Framework Preset: "Other"
   - Κάντε κλικ στο "Deploy"

3. **Επισκεφτείτε την εφαρμογή**
   - Το Vercel θα δώσει ένα URL (π.χ. `mediapipe-maze.vercel.app`)

---

## Local Testing

Για local testing χωρίς HTTPS (η κάμερα δεν θα λειτουργεί):

```bash
# Python
cd mediapipe-maze
python3 -m http.server 8080
# Open http://localhost:8080
```

Για local testing με HTTPS (χρειάζεται για camera access):

```bash
# Χρησιμοποιήστε ngrok ή mkcert για local HTTPS

# Option 1: ngrok
ngrok http 8080

# Option 2: mkcert (για local SSL certificates)
mkcert -install
mkcert localhost
# Στη συνέχεια χρησιμοποιήστε έναν server που υποστηρίζει SSL
```

---

## Troubleshooting

### Camera δεν λειτουργεί:
- ✅ Βεβαιωθείτε ότι χρησιμοποιείτε HTTPS
- ✅ Επιτρέψτε την πρόσβαση στην κάμερα στο browser
- ✅ Ελέγξτε αν η κάμερα χρησιμοποιείται από άλλη εφαρμογή

### MediaPipe δεν φορτώνει:
- ✅ Ελέγξτε τη σύνδεση στο internet
- ✅ Βεβαιωθείτε ότι το CDN είναι προσβάσιμο
- ✅ Δοκιμάστε σε άλλο browser

### Αργή απόδοση:
- ✅ Χρησιμοποιήστε σύγχρονο browser (Chrome recommended)
- ✅ Κλείστε άλλες εφαρμογές που χρησιμοποιούν την κάμερα
- ✅ Βελτιώστε τον φωτισμό για καλύτερο hand tracking

---

## Production Checklist

Πριν το production deployment:

- [x] Όλα τα JavaScript modules λειτουργούν
- [x] CSS styling είναι responsive
- [x] MediaPipe CDN links είναι σωστά
- [x] README documentation είναι πλήρης
- [x] LICENSE αρχείο υπάρχει
- [x] .gitignore είναι configured
- [x] Repository είναι public (για GitHub Pages)
- [x] HTTPS είναι enabled (για camera access)

---

## Monitoring

Μετά το deployment, παρακολουθήστε:

- **Performance**: Χρόνος φόρτωσης, FPS του game
- **Errors**: Browser console errors
- **User feedback**: Issues στο GitHub
- **Analytics**: (προαιρετικό) Google Analytics ή παρόμοιο

---

## Updates

Για να ενημερώσετε την εφαρμογή:

```bash
# 1. Κάντε τις αλλαγές σας
# 2. Commit και push
git add .
git commit -m "Your update message"
git push origin main

# 3. Το deployment θα γίνει αυτόματα (GitHub Pages/Netlify/Vercel)
```

---

**Καλή επιτυχία με το deployment! 🚀**

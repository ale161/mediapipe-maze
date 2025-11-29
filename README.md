# 🎮 MediaPipe Maze Game

Διαδραστικό παιχνίδι λαβυρίνθου που χρησιμοποιεί **MediaPipe Hand Tracking** για έλεγχο ενός ανθρωπάκι μέσω της κάμερας.

## 🌟 Χαρακτηριστικά

- **Hand Tracking με MediaPipe**: Ελέγξτε το ανθρωπάκι με το δείκτη του χεριού σας
- **Τυχαίοι Λαβύρινθοι**: Κάθε επίπεδο δημιουργεί έναν νέο, μοναδικό λαβύρινθο
- **Σύστημα Σκορ**: Υπολογισμός σκορ βάσει απόστασης και χρόνου
- **Αύξηση Δυσκολίας**: Κάθε επίπεδο γίνεται πιο δύσκολο με μεγαλύτερους λαβυρίνθους
- **Session Management**: Παρακολούθηση του best score σε κάθε session
- **Responsive Design**: Λειτουργεί σε desktop και mobile browsers

## 🚀 Τεχνολογίες

- **HTML5 Canvas**: Για rendering του παιχνιδιού
- **Vanilla JavaScript**: Καθαρός κώδικας χωρίς frameworks
- **MediaPipe Hands**: Google's hand tracking solution
- **CSS3**: Modern styling με animations

## 📋 Απαιτήσεις

- Σύγχρονο browser (Chrome, Firefox, Safari, Edge)
- Κάμερα (webcam)
- HTTPS connection (για camera access)

## 🎯 Πως Παίζεται

1. **Εισάγετε το όνομά σας** στην αρχική οθόνη
2. **Επιτρέψτε την πρόσβαση στην κάμερα** όταν σας ζητηθεί
3. **Δείξτε το δείκτη σας** στην κάμερα
4. **Ελέγξτε το ανθρωπάκι** για να φτάσετε στο πράσινο τετράγωνο
5. **Ολοκληρώστε το επίπεδο** και προχωρήστε στο επόμενο!

## 🏗️ Αρχιτεκτονική

Το project αποτελείται από τα εξής modules:

### JavaScript Modules

- **`maze.js`**: Γεννήτρια τυχαίων λαβυρίνθων (Recursive Backtracking)
- **`handController.js`**: MediaPipe Hand Tracking integration
- **`game.js`**: Game engine με collision detection και game loop
- **`scoreManager.js`**: Διαχείριση σκορ και session statistics
- **`ui.js`**: UI management και screen transitions
- **`main.js`**: Entry point που συνδέει όλα τα modules

### Αλγόριθμος Λαβυρίνθου

Χρησιμοποιεί τον αλγόριθμο **Recursive Backtracking** για τη δημιουργία τέλειων λαβυρίνθων με εγγυημένη λύση.

### Σύστημα Σκορ

**Φόρμουλα**: `score = totalDistance / timeInSeconds`

- **totalDistance**: Συνολική απόσταση που διένυσε το ανθρωπάκι
- **timeInSeconds**: Χρόνος ολοκλήρωσης επιπέδου

Όσο μεγαλύτερο το σκορ, τόσο καλύτερη η απόδοση!

## 🎮 Αύξηση Δυσκολίας

Κάθε επίπεδο αυξάνει τη δυσκολία:

- **Level 1**: 8x8 maze
- **Level 2**: 8x8 maze
- **Level 3**: 10x10 maze
- **Level 4**: 10x10 maze
- **Level 5+**: +2 cells κάθε 2 επίπεδα (max 20x20)

## 🌐 Browser Support

| Browser | Platform | Status |
|---------|----------|--------|
| Chrome  | Desktop  | ✅ Full support |
| Firefox | Desktop  | ✅ Full support |
| Safari  | Desktop  | ✅ Full support |
| Edge    | Desktop  | ✅ Full support |
| Chrome  | Mobile   | ✅ Full support |
| Safari  | iOS      | ✅ Full support (iOS 14+) |

## 📦 Installation

### Local Development

```bash
# Clone repository
git clone https://github.com/ale161/mediapipe-maze.git
cd mediapipe-maze

# Serve with any HTTP server (HTTPS required for camera)
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js http-server
npx http-server -p 8000

# Open in browser
# Note: Camera requires HTTPS, use ngrok or similar for testing
```

### Deploy to GitHub Pages

```bash
# Enable GitHub Pages in repository settings
# Select branch: main
# Select folder: / (root)
# Your site will be available at: https://ale161.github.io/mediapipe-maze/
```

## 🔧 Configuration

MediaPipe Hands configuration στο `handController.js`:

```javascript
this.hands.setOptions({
    maxNumHands: 1,              // Ανίχνευση 1 χεριού
    modelComplexity: 1,          // Μέτρια πολυπλοκότητα
    minDetectionConfidence: 0.5, // Ελάχιστη εμπιστοσύνη ανίχνευσης
    minTrackingConfidence: 0.5   // Ελάχιστη εμπιστοσύνη tracking
});
```

## 🐛 Troubleshooting

### Η κάμερα δεν λειτουργεί
- Βεβαιωθείτε ότι έχετε επιτρέψει την πρόσβαση στην κάμερα
- Χρησιμοποιήστε HTTPS connection
- Ελέγξτε αν η κάμερα χρησιμοποιείται από άλλη εφαρμογή

### Το hand tracking είναι αργό
- Κλείστε άλλες εφαρμογές που χρησιμοποιούν την κάμερα
- Μειώστε το `modelComplexity` στο `handController.js`
- Χρησιμοποιήστε καλύτερο φωτισμό

### Το ανθρωπάκι δεν κινείται ομαλά
- Αυξήστε το `smoothFactor` στο `handController.js`
- Βελτιώστε τον φωτισμό για καλύτερο tracking

## 📝 License

MIT License - Ελεύθερο για προσωπική και εμπορική χρήση.

## 👨‍💻 Author

Created with ❤️ using MediaPipe and JavaScript

## 🙏 Acknowledgments

- [Google MediaPipe](https://google.github.io/mediapipe/) - Hand tracking technology
- [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands.html) - Hand landmark detection

## 📞 Support

Για ερωτήσεις ή προβλήματα, ανοίξτε ένα issue στο GitHub repository.

---

**Enjoy the game! 🎮✨**

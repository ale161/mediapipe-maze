# MediaPipe Maze Game - Αρχιτεκτονική

## Επισκόπηση
Διαδραστικό παιχνίδι λαβυρίνθου που χρησιμοποιεί MediaPipe Hand Tracking για έλεγχο ενός ανθρωπάκι μέσω της κάμερας.

## Τεχνολογίες

### Frontend
- **HTML5 Canvas**: Για rendering του λαβυρίνθου και του ανθρωπάκι
- **Vanilla JavaScript**: Λογική παιχνιδιού και αλληλεπίδραση
- **CSS3**: Styling και responsive design

### MediaPipe Integration
- **@mediapipe/hands**: Hand tracking library από CDN
- **@mediapipe/camera_utils**: Utilities για χειρισμό κάμερας
- **@mediapipe/drawing_utils**: Utilities για visualization των landmarks

## Αρχιτεκτονική Συστατικών

### 1. Maze Generator (maze.js)
- Αλγόριθμος δημιουργίας τυχαίων λαβυρίνθων (Recursive Backtracking)
- Δυναμικό μέγεθος βάσει επιπέδου δυσκολίας
- Εγγυημένη λύση από είσοδο σε έξοδο

### 2. Game Engine (game.js)
- Κύριος game loop
- Collision detection
- Έλεγχος νίκης (φτάσιμο στο τέλος)
- Διαχείριση επιπέδων και δυσκολίας

### 3. Hand Tracking Controller (handController.js)
- Ενσωμάτωση MediaPipe Hands
- Tracking του index finger tip (landmark 8)
- Μετατροπή συντεταγμένων χεριού σε συντεταγμένες canvas
- Smooth movement με interpolation

### 4. Score System (scoreManager.js)
- Υπολογισμός σκορ: διαδρομή / χρόνος
- Αποθήκευση best score ανά session
- Εμφάνιση στατιστικών μετά από κάθε επίπεδο

### 5. UI Manager (ui.js)
- Οθόνη εισαγωγής ονόματος
- Εμφάνιση σκορ και στατιστικών
- Μενού μεταξύ επιπέδων
- Feedback για τον παίκτη

## Δομή Αρχείων

```
mediapipe-maze/
├── index.html              # Κύρια σελίδα
├── css/
│   └── style.css          # Styles
├── js/
│   ├── maze.js            # Maze generation
│   ├── game.js            # Game engine
│   ├── handController.js  # MediaPipe integration
│   ├── scoreManager.js    # Score system
│   ├── ui.js              # UI management
│   └── main.js            # Entry point
├── assets/
│   └── player.svg         # Ανθρωπάκι sprite (optional)
└── README.md              # Documentation

```

## Game Flow

1. **Αρχικοποίηση**
   - Εισαγωγή ονόματος χρήστη
   - Αίτημα πρόσβασης στην κάμερα
   - Φόρτωση MediaPipe Hands model

2. **Gameplay Loop**
   - Δημιουργία τυχαίου λαβυρίνθου
   - Τοποθέτηση ανθρωπάκι στην είσοδο
   - Hand tracking και έλεγχος κίνησης
   - Collision detection με τοίχους
   - Έλεγχος φτάσιμο στο τέλος

3. **Ολοκλήρωση Επιπέδου**
   - Υπολογισμός και εμφάνιση σκορ
   - Αύξηση δυσκολίας
   - Μετάβαση σε επόμενο επίπεδο

## Σύστημα Σκορ

**Φόρμουλα**: `score = totalDistance / timeInSeconds`

- **totalDistance**: Συνολική απόσταση που διένυσε το ανθρωπάκι
- **timeInSeconds**: Χρόνος ολοκλήρωσης επιπέδου

Όσο μεγαλύτερο το σκορ, τόσο καλύτερη η απόδοση (γρήγορη διαδρομή).

## Αύξηση Δυσκολίας

Κάθε επίπεδο αυξάνει τη δυσκολία:
- **Level 1**: 10x10 maze
- **Level 2**: 15x15 maze
- **Level 3**: 20x20 maze
- **Level 4+**: +5 cells ανά επίπεδο

## MediaPipe Hand Tracking

### Landmarks που χρησιμοποιούμε:
- **Landmark 8**: Index finger tip (για έλεγχο θέσης)
- **Landmark 0**: Wrist (για fallback)

### Coordinate Mapping:
```javascript
// MediaPipe coordinates: [0, 1] (normalized)
// Canvas coordinates: [0, canvasWidth] x [0, canvasHeight]

canvasX = handLandmark.x * canvasWidth
canvasY = handLandmark.y * canvasHeight
```

## Deployment

Η εφαρμογή θα κάνει deploy σε:
- **GitHub Pages**: Για δωρεάν hosting
- **Netlify** (εναλλακτικά): Για καλύτερη performance

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 14+)
- Opera: ✅ Full support

## Απαιτήσεις

- Σύγχρονο browser με WebGL support
- Κάμερα (webcam)
- HTTPS connection (για camera access)

# Changelog

Όλες οι σημαντικές αλλαγές στο project θα τεκμηριώνονται σε αυτό το αρχείο.

## [1.1.0] - 2025-11-29

### ✨ Βελτιώσεις UI/UX

#### Προβολή Κάμερας στο Background
- **Νέο**: Η εικόνα της κάμερας εμφανίζεται τώρα στο υπόβαθρο με 30% διαφάνεια
- **Νέο**: Ο λαβύρινθος σχεδιάζεται από πάνω με 85% opacity λευκό φόντο για καθαρή ορατότητα
- **Βελτίωση**: Οι παίκτες μπορούν τώρα να βλέπουν ταυτόχρονα το χέρι τους και τον λαβύρινθο
- **Βελτίωση**: Αφαιρέθηκαν τα hand landmarks για καθαρότερη εμφάνιση
- **Νέο**: Glowing πράσινος δείκτης στο index finger tip για καλύτερο visual feedback

#### Τεχνικές Αλλαγές
- Ενημέρωση CSS για σωστή στοίβαξη z-index των layers
- Τροποποίηση HandController για rendering της κάμερας στο background canvas
- Βελτιστοποίηση του Game.js για semi-transparent background
- Βελτίωση της drawPointer μεθόδου με glow effect

### 📝 Αρχεία που Τροποποιήθηκαν
- `css/style.css`: Ενημέρωση z-index και opacity για hand-canvas και game-canvas
- `js/handController.js`: Αλλαγή rendering logic και pointer visualization
- `js/game.js`: Semi-transparent background για καλύτερη ορατότητα

---

## [1.0.0] - 2025-11-29

### 🎉 Αρχική Έκδοση

#### Χαρακτηριστικά
- ✅ MediaPipe Hand Tracking integration
- ✅ Τυχαίοι λαβύρινθοι με Recursive Backtracking
- ✅ Σύστημα σκορ (distance/time)
- ✅ Αύξηση δυσκολίας ανά επίπεδο
- ✅ Session management με best score tracking
- ✅ Responsive UI design
- ✅ Real-time statistics display

#### Modules
- `maze.js`: Maze generation
- `handController.js`: MediaPipe integration
- `game.js`: Game engine
- `scoreManager.js`: Score calculation
- `ui.js`: UI management
- `main.js`: Application entry point

#### Documentation
- `README.md`: Οδηγίες χρήσης
- `ARCHITECTURE.md`: Τεχνική τεκμηρίωση
- `DEPLOYMENT.md`: Οδηγίες deployment
- `LICENSE`: MIT License

---

## Σημειώσεις Έκδοσης

### Version Numbering
Χρησιμοποιούμε [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: Νέα features (backward compatible)
- **PATCH**: Bug fixes

### Roadmap
Μελλοντικές βελτιώσεις που εξετάζονται:
- [ ] Adjustable camera opacity slider
- [ ] Multiple difficulty modes
- [ ] Sound effects
- [ ] Multiplayer support
- [ ] Leaderboard system
- [ ] Mobile touch controls (fallback)
- [ ] Gesture-based controls (e.g., fist for pause)

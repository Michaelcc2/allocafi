AllocaFi Full Live Replacement - 6/5/2026

This folder is a full replacement copy for:
C:\Users\cobin\OneDrive\Desktop\allocafi-live

It includes the current updated AllocaFi app plus the .git folder copied from allocafi-live,
so GitHub Desktop should still recognize it as the same repository after you swap folders.

Recommended swap:
1. Close GitHub Desktop if it is open.
2. Rename the current folder:
   C:\Users\cobin\OneDrive\Desktop\allocafi-live
   to:
   C:\Users\cobin\OneDrive\Desktop\allocafi-live-backup-before-mobile-onboarding-6-5-2026

3. Rename this folder:
   C:\Users\cobin\OneDrive\Desktop\allocafi-live-full-replacement-6-5-2026
   to:
   C:\Users\cobin\OneDrive\Desktop\allocafi-live

4. Open GitHub Desktop.
5. Select the allocafi repository.
6. Commit the changed files.
7. Push origin.

Render should auto-deploy after GitHub receives the push.

Notes:
- Old live folder is preserved as a backup.
- This copy excludes node_modules, temporary responsive test files, and design-snapshots.

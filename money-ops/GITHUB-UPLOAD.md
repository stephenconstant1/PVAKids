# Upload this pilot to GitHub

This ZIP is arranged as a complete static site. `index.html` is at the top level so GitHub Pages can load the game directly.

1. Extract the ZIP on your computer.
2. Open the target repository on GitHub.
3. Choose **Add file → Upload files**.
4. Drag all extracted files and folders into the upload area. Include `src`, `tests`, `index.html`, `style.css`, the SVG files, and the Markdown/package files.
5. Commit the upload to the repository's publishing branch.
6. In **Settings → Pages**, choose **Deploy from a branch**, select that branch and `/ (root)`, then save.

GitHub's repository page does not unpack a ZIP dropped into the repository. Extract it first and upload the contents. If replacing an older site, remove or rename its old root `index.html` so this package's `index.html` is the one GitHub Pages serves.

The child-facing pilot contains two activities: **Help & earn** and **Save & grow**. It saves progress in the browser and needs no backend, secret keys, or build command.

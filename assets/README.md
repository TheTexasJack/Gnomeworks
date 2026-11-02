# Art spec

Drop finished art into the folders below with these names.  Once a file is in place, its entry in `js/config.js` gets an `img` path and the placeholder goes away.

## Rules

* PNG with a real transparent background.  Check each one on a dark background, since some AI tools paint a fake gray checkerboard into the picture.
* Square canvas.  Keep the native size (1024 x 1024 is fine).  The game shrinks them.
* Subject centered with roughly 10% empty margin on every side.
* Similar fill: a sock and a can of beans should take up about the same amount of the canvas.
* One style prompt reused for everything: same outline weight, light from the top left, same palette.
* One pose per gnome.  Bobbing, swinging, and squishing are done in code.
* Hats on their own canvas, never drawn onto a gnome.
* No branded or recognizable characters, logos, or card designs.

## Folders and names

All lowercase with underscores.

```
assets/gnomes/gnome_tiny.png
assets/gnomes/gnome_tinier.png
assets/gnomes/gnome_warrior.png
assets/gnomes/gnome_stick.png          (the little gnome on the stick)

assets/weapons/weapon_dagger.png
assets/weapons/weapon_sword.png
assets/weapons/weapon_hammer.png
assets/weapons/weapon_wand.png
assets/weapons/weapon_staff.png

assets/hats/hat_classic.png
assets/hats/hat_party.png
assets/hats/hat_heart.png
assets/hats/hat_clover.png
assets/hats/hat_flower.png
assets/hats/hat_firework.png
assets/hats/hat_witch.png
assets/hats/hat_harvest.png
assets/hats/hat_santa.png

assets/items/item_<id>.png             (id from js/config.js, for example item_socks.png)
assets/items/item_lucky_sprocket.png
```

Gears, the wall, the hatch, and the wood and brass trim are drawn in code and need no files.

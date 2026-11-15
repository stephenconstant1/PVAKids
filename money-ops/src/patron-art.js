export const patronCycles={
  "orange-sweater": {
    "image": "assets/runner/patrons/CMI_level-02-patron-orange-sweater-walk-sheet.png",
    "width": 2172,
    "height": 724,
    "baseline": 715,
    "bodyHeight": 702,
    "frames": [
      {
        "rect": [
          0,
          0,
          543,
          724
        ],
        "visibleBounds": [
          88,
          13,
          471,
          713
        ]
      },
      {
        "rect": [
          543,
          0,
          543,
          724
        ],
        "visibleBounds": [
          123,
          13,
          376,
          715
        ]
      },
      {
        "rect": [
          1086,
          0,
          543,
          724
        ],
        "visibleBounds": [
          70,
          15,
          477,
          713
        ]
      },
      {
        "rect": [
          1629,
          0,
          543,
          724
        ],
        "visibleBounds": [
          148,
          15,
          361,
          715
        ]
      }
    ],
    "sha256": "7141c096c9b40bee1ba12d9d4c5ef50a9d68842aa879654558e47d308a7e80b8"
  },
  "teal-shirt": {
    "image": "assets/runner/patrons/CMI_level-02-patron-teal-shirt-walk-sheet.png",
    "width": 2172,
    "height": 724,
    "baseline": 711,
    "bodyHeight": 702,
    "frames": [
      {
        "rect": [
          0,
          0,
          543,
          724
        ],
        "visibleBounds": [
          81,
          9,
          464,
          711
        ]
      },
      {
        "rect": [
          543,
          0,
          543,
          724
        ],
        "visibleBounds": [
          126,
          9,
          425,
          711
        ]
      },
      {
        "rect": [
          1086,
          0,
          543,
          724
        ],
        "visibleBounds": [
          65,
          14,
          480,
          711
        ]
      },
      {
        "rect": [
          1629,
          0,
          543,
          724
        ],
        "visibleBounds": [
          139,
          15,
          410,
          711
        ]
      }
    ],
    "sha256": "597c244186095cea245663d67d4257d8bcb82089c269e38463cb78b8b763ba3b"
  },
  "silver-hair": {
    "image": "assets/runner/patrons/CMI_level-02-patron-silver-hair-walk-sheet.png",
    "width": 2172,
    "height": 724,
    "baseline": 720,
    "bodyHeight": 711,
    "frames": [
      {
        "rect": [
          0,
          0,
          543,
          724
        ],
        "visibleBounds": [
          70,
          9,
          464,
          711
        ]
      },
      {
        "rect": [
          543,
          0,
          543,
          724
        ],
        "visibleBounds": [
          144,
          9,
          375,
          716
        ]
      },
      {
        "rect": [
          1086,
          0,
          543,
          724
        ],
        "visibleBounds": [
          66,
          11,
          467,
          711
        ]
      },
      {
        "rect": [
          1629,
          0,
          543,
          724
        ],
        "visibleBounds": [
          127,
          11,
          411,
          720
        ]
      }
    ],
    "sha256": "5fface3f9292aa55a014ce990031034cf9743551833c1c9c288437386249dbdf"
  }
};
export class PatronArt {
 constructor(){this.images=new Map();for(const [id,m]of Object.entries(patronCycles)){const image=new Image();image.src=new URL('../'+m.image,import.meta.url).href;this.images.set(id,image);}}
 draw(c,id,x,feet,height,time,direction=1,reduced=false){const m=patronCycles[id],image=this.images.get(id);if(!m||!image?.complete||!image.naturalWidth)return false;const frame=m.frames[reduced?0:Math.floor(time*8)%4],sx=frame.rect[0],scale=height/m.bodyHeight;c.save();c.translate(x,feet);c.scale(direction,1);c.drawImage(image,sx,0,frame.rect[2],frame.rect[3],-frame.rect[2]*scale/2,-m.baseline*scale,frame.rect[2]*scale,frame.rect[3]*scale);c.restore();return true;}
}

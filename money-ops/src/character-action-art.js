const poses={
  "jordan": {
    "climb": {
      "image": "assets/runner/climb/CMI_kanyon-climb-pose.png",
      "sourceRect": [
        145,
        25,
        615,
        1464
      ],
      "width": 1024,
      "height": 1536
    },
    "kick": {
      "image": "assets/runner/kick/CMI_kanyon-kick-pose.png",
      "sourceRect": [
        24,
        15,
        1146,
        1230
      ],
      "width": 1199,
      "height": 1312
    }
  },
  "maya": {
    "climb": {
      "image": "assets/runner/climb/CMI_maya-climb-pose.png",
      "sourceRect": [
        84,
        32,
        665,
        1439
      ],
      "width": 1024,
      "height": 1536
    },
    "kick": {
      "image": "assets/runner/kick/CMI_maya-kick-pose.png",
      "sourceRect": [
        24,
        11,
        1155,
        1149
      ],
      "width": 1207,
      "height": 1303
    }
  },
  "kai": {
    "climb": {
      "image": "assets/runner/climb/CMI_everest-climb-pose.png",
      "sourceRect": [
        155,
        13,
        647,
        1488
      ],
      "width": 1024,
      "height": 1536
    },
    "kick": {
      "image": "assets/runner/kick/CMI_everest-kick-pose.png",
      "sourceRect": [
        10,
        18,
        995,
        1275
      ],
      "width": 1024,
      "height": 1536
    }
  },
  "sofia": {
    "climb": {
      "image": "assets/runner/climb/CMI_sofia-climb-pose.png",
      "sourceRect": [
        84,
        0,
        697,
        1456
      ],
      "width": 1013,
      "height": 1552
    },
    "kick": {
      "image": "assets/runner/kick/CMI_sofia-kick-pose.png",
      "sourceRect": [
        13,
        8,
        1122,
        1327
      ],
      "width": 1152,
      "height": 1366
    }
  },
  "eli": {
    "climb": {
      "image": "assets/runner/climb/CMI_zion-climb-pose.png",
      "sourceRect": [
        142,
        21,
        642,
        1491
      ],
      "width": 1024,
      "height": 1536
    },
    "kick": {
      "image": "assets/runner/kick/CMI_zion-kick-pose.png",
      "sourceRect": [
        8,
        54,
        1000,
        1273
      ],
      "width": 1024,
      "height": 1536
    }
  },
  "ruby": {
    "climb": {
      "image": "assets/runner/climb/CMI_ruby-climb-pose.png",
      "sourceRect": [
        108,
        36,
        687,
        1437
      ],
      "width": 1024,
      "height": 1536
    },
    "kick": {
      "image": "assets/runner/kick/CMI_ruby-kick-pose.png",
      "sourceRect": [
        14,
        27,
        1146,
        1175
      ],
      "width": 1186,
      "height": 1327
    }
  }
};
export class CharacterActionArt {
 constructor(id,kind){this.meta=poses[id]?.[kind]||poses.maya[kind];this.image=new Image();this.ready=false;this.failed=false;this.image.onload=()=>{this.ready=true};this.image.onerror=()=>{this.failed=true};this.image.src=new URL('../'+this.meta.image,import.meta.url).href;this.ready=Boolean(this.image.complete&&this.image.naturalWidth);}
 draw(c,height,gripX=null){if(!this.ready||!this.image.naturalWidth)return false;const [x,y,w,h]=this.meta.sourceRect,dh=height*(gripX===null?1:1.14),dw=dh*w/h,dx=gripX===null?-dw/2:gripX-dw*.82;c.drawImage(this.image,x,y,w,h,dx,height/2-dh,dw,dh);return true;}
}

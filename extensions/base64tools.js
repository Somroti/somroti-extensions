class Base64ImageTools {
  getInfo() {
    return {
      id: 'base64tools',
      name: 'Base64 Outils',
      blocks: [
        {
          opcode: 'fileUrlToBase64',
          blockType: Scratch.BlockType.REPORTER,
          text: 'convertir [URL] en base64 en tant que [TYPE]',
          arguments: {
            URL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://example.com/chien loup0.mp3'
            },
            TYPE: {
              type: Scratch.ArgumentType.STRING,
              menu: 'mimeTypes',
              defaultValue: 'mp3'
            }
          }
        },
        {
          opcode: 'compressBase64ToJpeg',
          blockType: Scratch.BlockType.REPORTER,
          text: 'compresser base64 PNG [BASE64] en JPEG qualité [QUALITY] largeur [WIDTH] hauteur [HEIGHT]',
          arguments: {
            BASE64: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: ''
            },
            QUALITY: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0.8
            },
            WIDTH: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 100
            },
            HEIGHT: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 100
            }
          }
        }
      ],
      menus: {
        mimeTypes: {
          acceptReporters: true,
          items: [
            'mp3', 'wav', 'ogg',
            'png', 'jpeg', 'jpg', 'webp',
            'gif', 'bmp',
            'svg+xml',
            'pdf', 'txt', 'json'
          ]
        }
      }
    };
  }

  async fileUrlToBase64(args) {
    const url = args.URL;
    const type = args.TYPE.toLowerCase();

    try {
      const response = await fetch(url);
      const blob = await response.blob();

      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1]; // enlever l’ancien header
          const dataUri = `data:application/octet-stream;base64,${base64}`;
          const mimeHeader = `data:${this.resolveMime(type)};base64,${base64}`;
          resolve(mimeHeader);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return 'Erreur: ' + e.message;
    }
  }

  resolveMime(type) {
    const mimeMap = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      bmp: 'image/bmp',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      pdf: 'application/pdf',
      txt: 'text/plain',
      json: 'application/json'
    };
    return mimeMap[type] || 'application/octet-stream';
  }

  async compressBase64ToJpeg(args) {
    const inputBase64 = args.BASE64;
    const quality = Math.max(0, Math.min(1, Number(args.QUALITY)));
    const targetWidth = Number(args.WIDTH);
    const targetHeight = Number(args.HEIGHT);

    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth > 0 ? targetWidth : img.width;
        canvas.height = targetHeight > 0 ? targetHeight : img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        try {
          const jpegBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(jpegBase64);
        } catch (e) {
          reject('Erreur: ' + e.message);
        }
      };
      img.onerror = () => reject('Impossible de charger l\'image.');
      img.src = inputBase64;
    }).catch(err => 'Erreur : ' + err);
  }
}

Scratch.extensions.register(new Base64ImageTools());

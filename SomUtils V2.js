(function (Scratch) {
    'use strict';

    class SomUtilsV2 {
        getInfo() {
            return {
                id: 'somUtilsV2',
                name: 'SomUtils V2',
                color1: '#FF0000',
                blocks: [
                    // Couleurs
                    {
                        opcode: 'centerColor',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'JPEG au centre de [size]px de cette image [base64]',
                        arguments: {
                            size: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            base64: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'data:image/jpeg;base64,...'
                            }
                        },
                        category: 'Couleurs'
                    },
                    {
                        opcode: 'averageColor',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'couleur moyenne de cette image [base64]',
                        arguments: {
                            base64: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'data:image/jpeg;base64,...'
                            }
                        },
                        category: 'Couleurs'
                    },
                    // Texte
                    {
                        opcode: 'encrypt',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'chiffrer [TEXT]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Texte à chiffrer'
                            }
                        },
                        category: 'Texte'
                    },
                    {
                        opcode: 'decrypt',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'déchiffrer [TEXT]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Texte à déchiffrer'
                            }
                        },
                        category: 'Texte'
                    },
                    // Lettres
                    {
                        opcode: 'getRandomLetter',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'lettre aléatoire',
                        category: 'Lettres'
                    }
                ]
            };
        }

        async _decodeImage(base64) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = base64;
                img.onload = () => resolve(img);
                img.onerror = reject;
            });
        }

        async centerColor({ size, base64 }) {
            try {
                const img = await this._decodeImage(base64);
                if (!img) {
                    return 'Erreur : Image invalide';
                }

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);
                const centerX = Math.floor(img.width / 2);
                const centerY = Math.floor(img.height / 2);
                const startX = Math.max(centerX - size / 2, 0);
                const startY = Math.max(centerY - size / 2, 0);

                // Découper la région centrale
                const croppedCanvas = document.createElement('canvas');
                const croppedCtx = croppedCanvas.getContext('2d');
                croppedCanvas.width = size;
                croppedCanvas.height = size;
                croppedCtx.drawImage(canvas, startX, startY, size, size, 0, 0, size, size);

                // Convertir en JPEG base64
                const croppedBase64 = croppedCanvas.toDataURL('image/jpeg');
                return croppedBase64;
            } catch (err) {
                console.error('Erreur dans centerColor:', err);
                return 'Erreur : Impossible de traiter l’image';
            }
        }

        async averageColor({ base64 }) {
            try {
                const img = await this._decodeImage(base64);
                if (!img) {
                    return 'Erreur : Image invalide';
                }

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, img.width, img.height);

                let r = 0, g = 0, b = 0, count = 0;

                for (let i = 0; i < imageData.data.length; i += 4) {
                    r += imageData.data[i];     // Rouge
                    g += imageData.data[i + 1]; // Vert
                    b += imageData.data[i + 2]; // Bleu
                    count++;
                }

                if (count === 0) {
                    return 'Erreur : Données image vides';
                }

                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);

                return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
            } catch (err) {
                console.error('Erreur dans averageColor:', err);
                return 'Erreur : Impossible de calculer la couleur moyenne';
            }
        }

        _encrypt(text) {
            const shift = 5;
            let encrypted = '';

            for (let char of text) {
                if (char === ' ') {
                    encrypted += '_'; // Remplace les espaces par _
                } else if (/[a-zA-Z]/.test(char)) {
                    // Décalage uniquement pour les lettres
                    const isUpperCase = char === char.toUpperCase();
                    const base = isUpperCase ? 65 : 97;
                    encrypted += String.fromCharCode(
                        ((char.charCodeAt(0) - base + shift) % 26) + base
                    );
                } else {
                    // Garde les caractères spéciaux inchangés
                    encrypted += char;
                }
            }
            return encrypted;
        }

        _decrypt(text) {
            const shift = 5;
            let decrypted = '';

            for (let char of text) {
                if (char === '_') {
                    decrypted += ' '; // Remplace _ par des espaces
                } else if (/[a-zA-Z]/.test(char)) {
                    // Décalage uniquement pour les lettres
                    const isUpperCase = char === char.toUpperCase();
                    const base = isUpperCase ? 65 : 97;
                    decrypted += String.fromCharCode(
                        ((char.charCodeAt(0) - base - shift + 26) % 26) + base
                    );
                } else {
                    // Garde les caractères spéciaux inchangés
                    decrypted += char;
                }
            }
            return decrypted;
        }

        encrypt({ TEXT }) {
            return this._encrypt(TEXT);
        }

        decrypt({ TEXT }) {
            return this._decrypt(TEXT);
        }

        getRandomLetter() {
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const randomIndex = Math.floor(Math.random() * alphabet.length);
            const letter = alphabet[randomIndex];
            return Math.random() < 0.5 ? letter.toLowerCase() : letter;
        }
    }

    Scratch.extensions.register(new SomUtilsV2());
})(Scratch);

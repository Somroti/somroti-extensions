(function(Scratch) {
    'use strict';

    class SimpleEncoding {
        getInfo() {
            return {
                id: 'simpleencoding',
                name: 'Simple Encoding',
                color1: '#d9ade0', // Couleur principale
                menuIconURI: 'data:image/png;base64,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', // Icône du menu
                blockIconURI: 'data:image/png;base64,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', // Icône des blocs
                blocks: [
                    {
                        opcode: 'encode',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Encode [TEXT] with [PASSWORD]',
                        arguments: {
                            TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello' },
                            PASSWORD: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hi' }
                        }
                    },
                    {
                        opcode: 'decode',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Decode [TEXT] with [PASSWORD]',
                        arguments: {
                            TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '...' },
                            PASSWORD: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hi' }
                        }
                    },
                    {
                        opcode: 'generatePassword',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Random password'
                    }
                ]
            };
        }

        encode(args) {
            return btoa(this.xorEncrypt(args.TEXT, args.PASSWORD)); // Encode in Base64
        }

        decode(args) {
            try {
                return this.xorEncrypt(atob(args.TEXT), args.PASSWORD); // Decode Base64 + XOR
            } catch (e) {
                return '⚠️ Decryption error!';
            }
        }

        generatePassword() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let password = '';
            for (let i = 0; i < 20; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return password;
        }

        xorEncrypt(text, key) {
            let output = '';
            for (let i = 0; i < text.length; i++) {
                output += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            return output;
        }
    }

    Scratch.extensions.register(new SimpleEncoding());
})(Scratch);

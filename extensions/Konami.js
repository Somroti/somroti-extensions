(function(Scratch) {
    'use strict';

    class Konami {
        constructor(runtime) {
        this.runtime = runtime;
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        this.step = 0;
        this.konamiTriggered = false;
        this.iconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIEUExURZ4AALAUFNU+Pq8TE60REcoxMelUVPpnZ/9tbdQ9PaUICLsgIOpVVfdkZP5sbO5aWrQYGLEWFuZRUckxMacLC91GRuFMTKkNDdI6OrccHMIoKPNgYKwQEOhUVPpoaNxGRq4SEutWVt5ISL8lJdtERPhlZfJeXrwhIaMFBc01NeBLS9M7O/tpacsyMrofH9A4OLYbG7ogIKQGBudSUqsODp8BAehTU9dAQPBcXP1ra6oODrkeHvViYsUsLMcuLqACAuBKSuJMTKEEBPZjY8MqKp8CAqgLC9Q8PKEDA8gvL6kMDKIEBMAmJs42NqMGBrMYGLQZGeNOTvRhYfxqasszM+xYWO1YWKQHB8w0NO9bW+pWVq8UFM83N/VhYb0jI/lmZtpDQ/1qat9JScIpKaYJCcYtLbkfH9E5OaIFBacKCvhmZsMpKe1ZWdxFRb4kJLMXF91HR7IXF+VQULUaGrIWFrshIetXV+VPT8cvL/lnZ/toaMQrK6wPD/BdXdpEROJNTcAnJ/NfX7EVFdE6OsoyMqsPD+RPT8kwML8mJtM8PMwzM9lDQ9I7O+FLS+lVVbohIbwjI74lJdY/P8IqKvJfX8ozM8UtLeNNTbYcHNtFReNPT7cdHeZSUsEnJ50AAM43N8EoKO5bW7AVFcQqKuxXV7gdHdhBQaIGBss0NKUJCaoNDQAAAJoY+2YAAACsdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wAFlRWxAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGHRFWHRTb2Z0d2FyZQBQYWludC5ORVQgNS4xLjQS36aDAAAAtmVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAADAAAAMQECABAAAABaAAAAaYcE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';
        this.handleKeyPress = this.handleKeyPress.bind(this);
        document.addEventListener('keydown', this.handleKeyPress);
        }
    
        getInfo() {
        return {
            id: 'konami',
            name: 'Konami',
            color1: '#9e0000',
            menuIconURI: this.iconURI,
            blockIconURI: this.iconURI,
            blocks: [
            {
                opcode: 'getKonamiCode',
                blockType: Scratch.BlockType.REPORTER,
                text: 'konami code',
            },
            {
                opcode: 'konamiDetected',
                blockType: Scratch.BlockType.BOOLEAN,
                text: 'is konami code activated?',
            },
            {
                opcode: 'whenKonami',
                blockType: Scratch.BlockType.HAT,
                text: 'when konami code activated',
            }
            ]
        };
        }
    
        getKonamiCode() {
        return '↑↑↓↓←→←→BA';
        }
    
        konamiDetected() {
        return this.konamiTriggered;
        }
    
        whenKonami() {
        return this.konamiTriggered;
        }
    
        handleKeyPress(event) {
        if (event.code === this.konamiCode[this.step]) {
            this.step++;
            if (this.step === this.konamiCode.length) {
            this.konamiTriggered = true;
            setTimeout(() => {
                this.konamiTriggered = false;
                this.step = 0;
            }, 200);
            }
        } else {
            this.step = 0;
        }
        }
    }
    
    Scratch.extensions.register(new Konami());
})(Scratch);

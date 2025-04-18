(function(Scratch) {
    "use strict";
    if (!Scratch.extensions.unsandboxed) throw new Error("SomrotiDB must run unsandboxed");

    class SomrotiBDD {
        constructor() {
        this.api = "https://bdd.somroti-yt.workers.dev"; // if you want, you can set your own API
        }
    
        getInfo() {
        return {
            id: "SomrotiBDD",
            name: "Somroti DB",
            color1: "#4000ff",
            blocks: [
            {
                opcode: "getKey",
                blockType: Scratch.BlockType.REPORTER,
                text: "get [KEY]",
                arguments: {
                KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" }
                }
            },
            {
                opcode: "setKey",
                blockType: Scratch.BlockType.COMMAND,
                text: "set [KEY] to [VALUE]",
                arguments: {
                KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" },
                VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "value" }
                }
            },
            {
                opcode: "deleteKey",
                blockType: Scratch.BlockType.COMMAND,
                text: "delete [KEY]",
                arguments: {
                KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" }
                }
            },
            "---",
            {
                opcode: "ProtectedKeys",
                blockType: Scratch.BlockType.LABEL,
                text: "Protected Keys"

            },
            {
                opcode: "setProtectedKey",
                blockType: Scratch.BlockType.COMMAND,
                text: "set protected key [KEY] to [VALUE] with password [PASSWORD]",
                arguments: {
                KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" },
                VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "value" },
                PASSWORD: { type: Scratch.ArgumentType.STRING, defaultValue: "password" }
                }
            },
            {
                opcode: "getProtectedKey",
                blockType: Scratch.BlockType.REPORTER,
                text: "get protected key [KEY] with password [PASSWORD]",
                arguments: {
                KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" },
                PASSWORD: { type: Scratch.ArgumentType.STRING, defaultValue: "password" }
                }
            },
            {
                opcode: "deleteProtectedKey",
                blockType: Scratch.BlockType.COMMAND,
                text: "delete protected key [KEY] with password [PASSWORD]",
                arguments: {
                KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" },
                PASSWORD: { type: Scratch.ArgumentType.STRING, defaultValue: "password" }
                }
            },
            {
                opcode: "checkPassword",
                blockType: Scratch.BlockType.BOOLEAN,
                text: "password [PASSWORD] is the password of [KEY]?",
                arguments: {
                PASSWORD: { type: Scratch.ArgumentType.STRING, defaultValue: "password" },
                KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" }
                }
            }
            ]
        };
        }
    
        async getKey({ KEY }) {
        try {
            const r = await fetch(`${this.api}/get/${encodeURIComponent(KEY)}`);
            return r.ok ? await r.text() : "";
        } catch {
            return "";
        }
        }
    
        setKey({ KEY, VALUE }) {
        fetch(`${this.api}/set/${encodeURIComponent(KEY)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: VALUE })
        });
        }
    
        deleteKey({ KEY }) {
        fetch(`${this.api}/delete/${encodeURIComponent(KEY)}`, {
            method: "DELETE"
        });
        }
    
        setProtectedKey({ KEY, VALUE, PASSWORD }) {
        fetch(`${this.api}/set_protected/${encodeURIComponent(KEY)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: VALUE, password: PASSWORD })
        });
        }
    
        async getProtectedKey({ KEY, PASSWORD }) {
        try {
            const r = await fetch(`${this.api}/get_protected/${encodeURIComponent(KEY)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: PASSWORD })
            });
            return r.ok ? await r.text() : "";
        } catch {
            return "";
        }
        }
    
        deleteProtectedKey({ KEY, PASSWORD }) {
        fetch(`${this.api}/delete_protected/${encodeURIComponent(KEY)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: PASSWORD })
        });
        }
    
        async checkPassword({ PASSWORD, KEY }) {
        try {
            const r = await fetch(`${this.api}/check_password/${encodeURIComponent(KEY)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: PASSWORD })
            });
            const json = await r.json();
            return !!json.match;
        } catch {
            return false;
        }
        }
    }
    
    Scratch.extensions.register(new SomrotiBDD());
})(Scratch);

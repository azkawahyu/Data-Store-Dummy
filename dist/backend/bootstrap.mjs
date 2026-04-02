var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@next/env/dist/index.js
var require_dist = __commonJS({
  "node_modules/@next/env/dist/index.js"(exports, module) {
    "use strict";
    (() => {
      var e = { 383: (e2) => {
        "use strict";
        function _searchLast(e3, t2) {
          const n2 = Array.from(e3.matchAll(t2));
          return n2.length > 0 ? n2.slice(-1)[0].index : -1;
        }
        function _interpolate(e3, t2, n2) {
          const r = _searchLast(e3, /(?!(?<=\\))\$/g);
          if (r === -1) return e3;
          const o = e3.slice(r);
          const s = /((?!(?<=\\))\${?([\w]+)(?::-([^}\\]*))?}?)/;
          const i = o.match(s);
          if (i != null) {
            const [, r2, o2, s2] = i;
            return _interpolate(e3.replace(r2, t2[o2] || s2 || n2.parsed[o2] || ""), t2, n2);
          }
          return e3;
        }
        function _resolveEscapeSequences(e3) {
          return e3.replace(/\\\$/g, "$");
        }
        function expand(e3) {
          const t2 = e3.ignoreProcessEnv ? {} : process.env;
          for (const n2 in e3.parsed) {
            const r = Object.prototype.hasOwnProperty.call(t2, n2) ? t2[n2] : e3.parsed[n2];
            e3.parsed[n2] = _resolveEscapeSequences(_interpolate(r, t2, e3));
          }
          for (const n2 in e3.parsed) {
            t2[n2] = e3.parsed[n2];
          }
          return e3;
        }
        e2.exports.j = expand;
      }, 234: (e2, t2, n2) => {
        const r = n2(147);
        const o = n2(17);
        const s = n2(37);
        const i = n2(113);
        const c = n2(803);
        const a = c.version;
        const p = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;
        function parse(e3) {
          const t3 = {};
          let n3 = e3.toString();
          n3 = n3.replace(/\r\n?/gm, "\n");
          let r2;
          while ((r2 = p.exec(n3)) != null) {
            const e4 = r2[1];
            let n4 = r2[2] || "";
            n4 = n4.trim();
            const o2 = n4[0];
            n4 = n4.replace(/^(['"`])([\s\S]*)\1$/gm, "$2");
            if (o2 === '"') {
              n4 = n4.replace(/\\n/g, "\n");
              n4 = n4.replace(/\\r/g, "\r");
            }
            t3[e4] = n4;
          }
          return t3;
        }
        function _parseVault(e3) {
          const t3 = _vaultPath(e3);
          const n3 = l.configDotenv({ path: t3 });
          if (!n3.parsed) {
            throw new Error(`MISSING_DATA: Cannot parse ${t3} for an unknown reason`);
          }
          const r2 = _dotenvKey(e3).split(",");
          const o2 = r2.length;
          let s2;
          for (let e4 = 0; e4 < o2; e4++) {
            try {
              const t4 = r2[e4].trim();
              const o3 = _instructions(n3, t4);
              s2 = l.decrypt(o3.ciphertext, o3.key);
              break;
            } catch (t4) {
              if (e4 + 1 >= o2) {
                throw t4;
              }
            }
          }
          return l.parse(s2);
        }
        function _log(e3) {
          console.log(`[dotenv@${a}][INFO] ${e3}`);
        }
        function _warn(e3) {
          console.log(`[dotenv@${a}][WARN] ${e3}`);
        }
        function _debug(e3) {
          console.log(`[dotenv@${a}][DEBUG] ${e3}`);
        }
        function _dotenvKey(e3) {
          if (e3 && e3.DOTENV_KEY && e3.DOTENV_KEY.length > 0) {
            return e3.DOTENV_KEY;
          }
          if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
            return process.env.DOTENV_KEY;
          }
          return "";
        }
        function _instructions(e3, t3) {
          let n3;
          try {
            n3 = new URL(t3);
          } catch (e4) {
            if (e4.code === "ERR_INVALID_URL") {
              throw new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenv.org/vault/.env.vault?environment=development");
            }
            throw e4;
          }
          const r2 = n3.password;
          if (!r2) {
            throw new Error("INVALID_DOTENV_KEY: Missing key part");
          }
          const o2 = n3.searchParams.get("environment");
          if (!o2) {
            throw new Error("INVALID_DOTENV_KEY: Missing environment part");
          }
          const s2 = `DOTENV_VAULT_${o2.toUpperCase()}`;
          const i2 = e3.parsed[s2];
          if (!i2) {
            throw new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${s2} in your .env.vault file.`);
          }
          return { ciphertext: i2, key: r2 };
        }
        function _vaultPath(e3) {
          let t3 = o.resolve(process.cwd(), ".env");
          if (e3 && e3.path && e3.path.length > 0) {
            t3 = e3.path;
          }
          return t3.endsWith(".vault") ? t3 : `${t3}.vault`;
        }
        function _resolveHome(e3) {
          return e3[0] === "~" ? o.join(s.homedir(), e3.slice(1)) : e3;
        }
        function _configVault(e3) {
          _log("Loading env from encrypted .env.vault");
          const t3 = l._parseVault(e3);
          let n3 = process.env;
          if (e3 && e3.processEnv != null) {
            n3 = e3.processEnv;
          }
          l.populate(n3, t3, e3);
          return { parsed: t3 };
        }
        function configDotenv(e3) {
          let t3 = o.resolve(process.cwd(), ".env");
          let n3 = "utf8";
          const s2 = Boolean(e3 && e3.debug);
          if (e3) {
            if (e3.path != null) {
              t3 = _resolveHome(e3.path);
            }
            if (e3.encoding != null) {
              n3 = e3.encoding;
            }
          }
          try {
            const o2 = l.parse(r.readFileSync(t3, { encoding: n3 }));
            let s3 = process.env;
            if (e3 && e3.processEnv != null) {
              s3 = e3.processEnv;
            }
            l.populate(s3, o2, e3);
            return { parsed: o2 };
          } catch (e4) {
            if (s2) {
              _debug(`Failed to load ${t3} ${e4.message}`);
            }
            return { error: e4 };
          }
        }
        function config2(e3) {
          const t3 = _vaultPath(e3);
          if (_dotenvKey(e3).length === 0) {
            return l.configDotenv(e3);
          }
          if (!r.existsSync(t3)) {
            _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${t3}. Did you forget to build it?`);
            return l.configDotenv(e3);
          }
          return l._configVault(e3);
        }
        function decrypt(e3, t3) {
          const n3 = Buffer.from(t3.slice(-64), "hex");
          let r2 = Buffer.from(e3, "base64");
          const o2 = r2.slice(0, 12);
          const s2 = r2.slice(-16);
          r2 = r2.slice(12, -16);
          try {
            const e4 = i.createDecipheriv("aes-256-gcm", n3, o2);
            e4.setAuthTag(s2);
            return `${e4.update(r2)}${e4.final()}`;
          } catch (e4) {
            const t4 = e4 instanceof RangeError;
            const n4 = e4.message === "Invalid key length";
            const r3 = e4.message === "Unsupported state or unable to authenticate data";
            if (t4 || n4) {
              const e5 = "INVALID_DOTENV_KEY: It must be 64 characters long (or more)";
              throw new Error(e5);
            } else if (r3) {
              const e5 = "DECRYPTION_FAILED: Please check your DOTENV_KEY";
              throw new Error(e5);
            } else {
              console.error("Error: ", e4.code);
              console.error("Error: ", e4.message);
              throw e4;
            }
          }
        }
        function populate(e3, t3, n3 = {}) {
          const r2 = Boolean(n3 && n3.debug);
          const o2 = Boolean(n3 && n3.override);
          if (typeof t3 !== "object") {
            throw new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
          }
          for (const n4 of Object.keys(t3)) {
            if (Object.prototype.hasOwnProperty.call(e3, n4)) {
              if (o2 === true) {
                e3[n4] = t3[n4];
              }
              if (r2) {
                if (o2 === true) {
                  _debug(`"${n4}" is already defined and WAS overwritten`);
                } else {
                  _debug(`"${n4}" is already defined and was NOT overwritten`);
                }
              }
            } else {
              e3[n4] = t3[n4];
            }
          }
        }
        const l = { configDotenv, _configVault, _parseVault, config: config2, decrypt, parse, populate };
        e2.exports.configDotenv = l.configDotenv;
        e2.exports._configVault = l._configVault;
        e2.exports._parseVault = l._parseVault;
        e2.exports.config = l.config;
        e2.exports.decrypt = l.decrypt;
        e2.exports.parse = l.parse;
        e2.exports.populate = l.populate;
        e2.exports = l;
      }, 113: (e2) => {
        "use strict";
        e2.exports = __require("crypto");
      }, 147: (e2) => {
        "use strict";
        e2.exports = __require("fs");
      }, 37: (e2) => {
        "use strict";
        e2.exports = __require("os");
      }, 17: (e2) => {
        "use strict";
        e2.exports = __require("path");
      }, 803: (e2) => {
        "use strict";
        e2.exports = JSON.parse('{"name":"dotenv","version":"16.3.1","description":"Loads environment variables from .env file","main":"lib/main.js","types":"lib/main.d.ts","exports":{".":{"types":"./lib/main.d.ts","require":"./lib/main.js","default":"./lib/main.js"},"./config":"./config.js","./config.js":"./config.js","./lib/env-options":"./lib/env-options.js","./lib/env-options.js":"./lib/env-options.js","./lib/cli-options":"./lib/cli-options.js","./lib/cli-options.js":"./lib/cli-options.js","./package.json":"./package.json"},"scripts":{"dts-check":"tsc --project tests/types/tsconfig.json","lint":"standard","lint-readme":"standard-markdown","pretest":"npm run lint && npm run dts-check","test":"tap tests/*.js --100 -Rspec","prerelease":"npm test","release":"standard-version"},"repository":{"type":"git","url":"git://github.com/motdotla/dotenv.git"},"funding":"https://github.com/motdotla/dotenv?sponsor=1","keywords":["dotenv","env",".env","environment","variables","config","settings"],"readmeFilename":"README.md","license":"BSD-2-Clause","devDependencies":{"@definitelytyped/dtslint":"^0.0.133","@types/node":"^18.11.3","decache":"^4.6.1","sinon":"^14.0.1","standard":"^17.0.0","standard-markdown":"^7.1.0","standard-version":"^9.5.0","tap":"^16.3.0","tar":"^6.1.11","typescript":"^4.8.4"},"engines":{"node":">=12"},"browser":{"fs":false}}');
      } };
      var t = {};
      function __nccwpck_require__(n2) {
        var r = t[n2];
        if (r !== void 0) {
          return r.exports;
        }
        var o = t[n2] = { exports: {} };
        var s = true;
        try {
          e[n2](o, o.exports, __nccwpck_require__);
          s = false;
        } finally {
          if (s) delete t[n2];
        }
        return o.exports;
      }
      (() => {
        __nccwpck_require__.n = (e2) => {
          var t2 = e2 && e2.__esModule ? () => e2["default"] : () => e2;
          __nccwpck_require__.d(t2, { a: t2 });
          return t2;
        };
      })();
      (() => {
        __nccwpck_require__.d = (e2, t2) => {
          for (var n2 in t2) {
            if (__nccwpck_require__.o(t2, n2) && !__nccwpck_require__.o(e2, n2)) {
              Object.defineProperty(e2, n2, { enumerable: true, get: t2[n2] });
            }
          }
        };
      })();
      (() => {
        __nccwpck_require__.o = (e2, t2) => Object.prototype.hasOwnProperty.call(e2, t2);
      })();
      (() => {
        __nccwpck_require__.r = (e2) => {
          if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
            Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" });
          }
          Object.defineProperty(e2, "__esModule", { value: true });
        };
      })();
      if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
      var n = {};
      (() => {
        "use strict";
        __nccwpck_require__.r(n);
        __nccwpck_require__.d(n, { initialEnv: () => a, updateInitialEnv: () => updateInitialEnv, processEnv: () => processEnv, resetEnv: () => resetEnv, loadEnvConfig: () => loadEnvConfig2 });
        var e2 = __nccwpck_require__(147);
        var t2 = __nccwpck_require__.n(e2);
        var r = __nccwpck_require__(17);
        var o = __nccwpck_require__.n(r);
        var s = __nccwpck_require__(234);
        var i = __nccwpck_require__.n(s);
        var c = __nccwpck_require__(383);
        let a = void 0;
        let p = void 0;
        let l = void 0;
        let u = [];
        let _ = [];
        function updateInitialEnv(e3) {
          Object.assign(a || {}, e3);
        }
        function replaceProcessEnv(e3) {
          Object.keys(process.env).forEach(((t3) => {
            if (!t3.startsWith("__NEXT_PRIVATE")) {
              if (e3[t3] === void 0 || e3[t3] === "") {
                delete process.env[t3];
              }
            }
          }));
          Object.entries(e3).forEach((([e4, t3]) => {
            process.env[e4] = t3;
          }));
        }
        function processEnv(e3, t3, n2 = console, o2 = false, i2) {
          var p2;
          if (!a) {
            a = Object.assign({}, process.env);
          }
          if (!o2 && (process.env.__NEXT_PROCESSED_ENV || e3.length === 0)) {
            return [process.env];
          }
          process.env.__NEXT_PROCESSED_ENV = "true";
          const l2 = Object.assign({}, a);
          const u2 = {};
          for (const o3 of e3) {
            try {
              let e4 = {};
              e4.parsed = s.parse(o3.contents);
              e4 = (0, c.j)(e4);
              if (e4.parsed && !_.some(((e5) => e5.contents === o3.contents && e5.path === o3.path))) {
                i2 === null || i2 === void 0 ? void 0 : i2(o3.path);
              }
              for (const t4 of Object.keys(e4.parsed || {})) {
                if (typeof u2[t4] === "undefined" && typeof l2[t4] === "undefined") {
                  u2[t4] = (p2 = e4.parsed) === null || p2 === void 0 ? void 0 : p2[t4];
                }
              }
              o3.env = e4.parsed || {};
            } catch (e4) {
              n2.error(`Failed to load env from ${r.join(t3 || "", o3.path)}`, e4);
            }
          }
          return [Object.assign(process.env, u2), u2];
        }
        function resetEnv() {
          if (a) {
            replaceProcessEnv(a);
          }
        }
        function loadEnvConfig2(t3, n2, o2 = console, s2 = false, i2) {
          if (!a) {
            a = Object.assign({}, process.env);
          }
          if (p && !s2) {
            return { combinedEnv: p, parsedEnv: l, loadedEnvFiles: u };
          }
          replaceProcessEnv(a);
          _ = u;
          u = [];
          const c2 = process.env.NODE_ENV === "test";
          const d = c2 ? "test" : n2 ? "development" : "production";
          const f = [`.env.${d}.local`, d !== "test" && `.env.local`, `.env.${d}`, ".env"].filter(Boolean);
          for (const n3 of f) {
            const s3 = r.join(t3, n3);
            try {
              const t4 = e2.statSync(s3);
              if (!t4.isFile() && !t4.isFIFO()) {
                continue;
              }
              const r2 = e2.readFileSync(s3, "utf8");
              u.push({ path: n3, contents: r2, env: {} });
            } catch (e3) {
              if (e3.code !== "ENOENT") {
                o2.error(`Failed to load env from ${n3}`, e3);
              }
            }
          }
          [p, l] = processEnv(u, t3, o2, s2, i2);
          return { combinedEnv: p, parsedEnv: l, loadedEnvFiles: u };
        }
      })();
      module.exports = n;
    })();
  }
});

// lib/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}
var config;
var init_class = __esm({
  "lib/generated/prisma/internal/class.ts"() {
    "use strict";
    config = {
      "previewFeatures": [],
      "clientVersion": "7.4.2",
      "engineVersion": "94a226be1cf2967af2541cca5529f0f7ba866919",
      "activeProvider": "postgresql",
      "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../lib/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum DocumentStatus {\n  pending\n  verified\n  rejected\n}\n\nmodel activity_logs {\n  id          String    @id @default(uuid()) @db.Uuid\n  user_id     String?   @db.Uuid\n  action      String?   @db.VarChar(100)\n  description String?\n  created_at  DateTime? @default(now()) @db.Timestamp(6)\n  users       users?    @relation(fields: [user_id], references: [id], onDelete: NoAction, onUpdate: NoAction)\n}\n\nmodel documents {\n  id            String         @id @default(uuid()) @db.Uuid\n  employee_id   String?        @db.Uuid\n  document_type String         @db.VarChar(50)\n  file_path     String\n  file_name     String\n  file_size     Int\n  mime_type     String\n  status        DocumentStatus @default(pending)\n  uploaded_at   DateTime?      @default(now()) @db.Timestamp(6)\n  verified_by   String?        @db.Uuid\n  verified_at   DateTime?      @db.Timestamp(6)\n  employees     employees?     @relation(fields: [employee_id], references: [id], onDelete: Cascade, onUpdate: NoAction)\n  users         users?         @relation(fields: [verified_by], references: [id], onDelete: NoAction, onUpdate: NoAction)\n}\n\nmodel employees {\n  id         String      @id @default(uuid()) @db.Uuid\n  nip        String      @unique @db.VarChar(50)\n  nama       String      @db.VarChar(150)\n  jabatan    String?     @db.VarChar(100)\n  unit       String?     @db.VarChar(100)\n  status     String?     @db.VarChar(50)\n  alamat     String?\n  no_hp      String?     @db.VarChar(20)\n  email      String?     @db.VarChar(150)\n  created_at DateTime?   @default(now()) @db.Timestamp(6)\n  updated_at DateTime?   @updatedAt\n  documents  documents[]\n  users      users?\n}\n\nmodel roles {\n  id    String  @id @default(uuid()) @db.Uuid\n  name  String  @unique @db.VarChar(50)\n  users users[]\n}\n\nmodel users {\n  id            String          @id @default(uuid()) @db.Uuid\n  employee_id   String?         @unique @db.Uuid\n  role_id       String?         @db.Uuid\n  username      String          @unique @db.VarChar(100)\n  password_hash String\n  nip           String?         @unique @db.VarChar(50)\n  email         String?         @db.VarChar(150)\n  created_at    DateTime?       @default(now()) @db.Timestamp(6)\n  activity_logs activity_logs[]\n  documents     documents[]\n  employees     employees?      @relation(fields: [employee_id], references: [id], onDelete: NoAction, onUpdate: NoAction)\n  roles         roles?          @relation(fields: [role_id], references: [id], onDelete: NoAction, onUpdate: NoAction)\n}\n',
      "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
      },
      "parameterizationSchema": {
        "strings": [],
        "graph": ""
      }
    };
    config.runtimeDataModel = JSON.parse('{"models":{"activity_logs":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"user_id","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"created_at","kind":"scalar","type":"DateTime"},{"name":"users","kind":"object","type":"users","relationName":"activity_logsTousers"}],"dbName":null},"documents":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"employee_id","kind":"scalar","type":"String"},{"name":"document_type","kind":"scalar","type":"String"},{"name":"file_path","kind":"scalar","type":"String"},{"name":"file_name","kind":"scalar","type":"String"},{"name":"file_size","kind":"scalar","type":"Int"},{"name":"mime_type","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"DocumentStatus"},{"name":"uploaded_at","kind":"scalar","type":"DateTime"},{"name":"verified_by","kind":"scalar","type":"String"},{"name":"verified_at","kind":"scalar","type":"DateTime"},{"name":"employees","kind":"object","type":"employees","relationName":"documentsToemployees"},{"name":"users","kind":"object","type":"users","relationName":"documentsTousers"}],"dbName":null},"employees":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"nip","kind":"scalar","type":"String"},{"name":"nama","kind":"scalar","type":"String"},{"name":"jabatan","kind":"scalar","type":"String"},{"name":"unit","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"alamat","kind":"scalar","type":"String"},{"name":"no_hp","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"created_at","kind":"scalar","type":"DateTime"},{"name":"updated_at","kind":"scalar","type":"DateTime"},{"name":"documents","kind":"object","type":"documents","relationName":"documentsToemployees"},{"name":"users","kind":"object","type":"users","relationName":"employeesTousers"}],"dbName":null},"roles":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"users","kind":"object","type":"users","relationName":"rolesTousers"}],"dbName":null},"users":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"employee_id","kind":"scalar","type":"String"},{"name":"role_id","kind":"scalar","type":"String"},{"name":"username","kind":"scalar","type":"String"},{"name":"password_hash","kind":"scalar","type":"String"},{"name":"nip","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"created_at","kind":"scalar","type":"DateTime"},{"name":"activity_logs","kind":"object","type":"activity_logs","relationName":"activity_logsTousers"},{"name":"documents","kind":"object","type":"documents","relationName":"documentsTousers"},{"name":"employees","kind":"object","type":"employees","relationName":"employeesTousers"},{"name":"roles","kind":"object","type":"roles","relationName":"rolesTousers"}],"dbName":null}},"enums":{},"types":{}}');
    config.parameterizationSchema = {
      strings: JSON.parse('["where","orderBy","cursor","activity_logs","documents","users","_count","employees","roles","activity_logs.findUnique","activity_logs.findUniqueOrThrow","activity_logs.findFirst","activity_logs.findFirstOrThrow","activity_logs.findMany","data","activity_logs.createOne","activity_logs.createMany","activity_logs.createManyAndReturn","activity_logs.updateOne","activity_logs.updateMany","activity_logs.updateManyAndReturn","create","update","activity_logs.upsertOne","activity_logs.deleteOne","activity_logs.deleteMany","having","_min","_max","activity_logs.groupBy","activity_logs.aggregate","documents.findUnique","documents.findUniqueOrThrow","documents.findFirst","documents.findFirstOrThrow","documents.findMany","documents.createOne","documents.createMany","documents.createManyAndReturn","documents.updateOne","documents.updateMany","documents.updateManyAndReturn","documents.upsertOne","documents.deleteOne","documents.deleteMany","_avg","_sum","documents.groupBy","documents.aggregate","employees.findUnique","employees.findUniqueOrThrow","employees.findFirst","employees.findFirstOrThrow","employees.findMany","employees.createOne","employees.createMany","employees.createManyAndReturn","employees.updateOne","employees.updateMany","employees.updateManyAndReturn","employees.upsertOne","employees.deleteOne","employees.deleteMany","employees.groupBy","employees.aggregate","roles.findUnique","roles.findUniqueOrThrow","roles.findFirst","roles.findFirstOrThrow","roles.findMany","roles.createOne","roles.createMany","roles.createManyAndReturn","roles.updateOne","roles.updateMany","roles.updateManyAndReturn","roles.upsertOne","roles.deleteOne","roles.deleteMany","roles.groupBy","roles.aggregate","users.findUnique","users.findUniqueOrThrow","users.findFirst","users.findFirstOrThrow","users.findMany","users.createOne","users.createMany","users.createManyAndReturn","users.updateOne","users.updateMany","users.updateManyAndReturn","users.upsertOne","users.deleteOne","users.deleteMany","users.groupBy","users.aggregate","AND","OR","NOT","id","employee_id","role_id","username","password_hash","nip","email","created_at","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","name","every","some","none","nama","jabatan","unit","status","alamat","no_hp","updated_at","document_type","file_path","file_name","file_size","mime_type","DocumentStatus","uploaded_at","verified_by","verified_at","user_id","action","description","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
      graph: "wwIuUAkFAACvAQAgYQAAwwEAMGIAAAUAEGMAAMMBADBkAQAAAAFrQACtAQAhiwEBALkBACGMAQEArAEAIY0BAQCsAQAhAQAAAAEAIA8DAAC6AQAgBAAArgEAIAcAALsBACAIAAC8AQAgYQAAuAEAMGIAAAMAEGMAALgBADBkAQC-AQAhZQEAuQEAIWYBALkBACFnAQCrAQAhaAEAqwEAIWkBAKwBACFqAQCsAQAha0AArQEAIQEAAAADACAJBQAArwEAIGEAAMMBADBiAAAFABBjAADDAQAwZAEAvgEAIWtAAK0BACGLAQEAuQEAIYwBAQCsAQAhjQEBAKwBACEFBQAAmQIAIGsAAMQBACCLAQAAxAEAIIwBAADEAQAgjQEAAMQBACADAAAABQAgAQAABgAwAgAAAQAgEAUAAK8BACAHAAC7AQAgYQAAwAEAMGIAAAgAEGMAAMABADBkAQC-AQAhZQEAuQEAIX4AAMIBiAEiggEBAKsBACGDAQEAqwEAIYQBAQCrAQAhhQECAMEBACGGAQEAqwEAIYgBQACtAQAhiQEBALkBACGKAUAArQEAIQYFAACZAgAgBwAApQIAIGUAAMQBACCIAQAAxAEAIIkBAADEAQAgigEAAMQBACAQBQAArwEAIAcAALsBACBhAADAAQAwYgAACAAQYwAAwAEAMGQBAAAAAWUBALkBACF-AADCAYgBIoIBAQCrAQAhgwEBAKsBACGEAQEAqwEAIYUBAgDBAQAhhgEBAKsBACGIAUAArQEAIYkBAQC5AQAhigFAAK0BACEDAAAACAAgAQAACQAwAgAACgAgEAQAAK4BACAFAACvAQAgYQAAqgEAMGIAAAwAEGMAAKoBADBkAQC-AQAhaQEAqwEAIWoBAKwBACFrQACtAQAhewEAqwEAIXwBAKwBACF9AQCsAQAhfgEArAEAIX8BAKwBACGAAQEArAEAIYEBQACtAQAhAQAAAAwAIAMAAAAIACABAAAJADACAAAKACABAAAAAwAgAQAAAAgAIAEAAAADACABAAAADAAgBgUAAKgBACBhAACnAQAwYgAAEwAQYwAApwEAMGQBAL4BACF3AQCrAQAhAQAAABMAIAkDAACkAgAgBAAAmAIAIAcAAKUCACAIAACmAgAgZQAAxAEAIGYAAMQBACBpAADEAQAgagAAxAEAIGsAAMQBACAPAwAAugEAIAQAAK4BACAHAAC7AQAgCAAAvAEAIGEAALgBADBiAAADABBjAAC4AQAwZAEAAAABZQEAAAABZgEAuQEAIWcBAAAAAWgBAKsBACFpAQAAAAFqAQCsAQAha0AArQEAIQMAAAADACABAAAVADACAAAWACABAAAAAwAgAQAAAAUAIAEAAAAIACABAAAAAQAgAwAAAAUAIAEAAAYAMAIAAAEAIAMAAAAFACABAAAGADACAAABACADAAAABQAgAQAABgAwAgAAAQAgBgUAAKMCACBkAQAAAAFrQAAAAAGLAQEAAAABjAEBAAAAAY0BAQAAAAEBDgAAHwAgBWQBAAAAAWtAAAAAAYsBAQAAAAGMAQEAAAABjQEBAAAAAQEOAAAhADABDgAAIQAwAQAAAAMAIAYFAACiAgAgZAEAyAEAIWtAAMoBACGLAQEAyQEAIYwBAQDJAQAhjQEBAMkBACECAAAAAQAgDgAAJQAgBWQBAMgBACFrQADKAQAhiwEBAMkBACGMAQEAyQEAIY0BAQDJAQAhAgAAAAUAIA4AACcAIAIAAAAFACAOAAAnACABAAAAAwAgAwAAAAEAIBUAAB8AIBYAACUAIAEAAAABACABAAAABQAgBwYAAJ8CACAbAAChAgAgHAAAoAIAIGsAAMQBACCLAQAAxAEAIIwBAADEAQAgjQEAAMQBACAIYQAAtwEAMGIAAC8AEGMAALcBADBkAQCXAQAha0AAmwEAIYsBAQCYAQAhjAEBAJoBACGNAQEAmgEAIQMAAAAFACABAAAuADAaAAAvACADAAAABQAgAQAABgAwAgAAAQAgAQAAAAoAIAEAAAAKACADAAAACAAgAQAACQAwAgAACgAgAwAAAAgAIAEAAAkAMAIAAAoAIAMAAAAIACABAAAJADACAAAKACANBQAAlQIAIAcAAN4BACBkAQAAAAFlAQAAAAF-AAAAiAECggEBAAAAAYMBAQAAAAGEAQEAAAABhQECAAAAAYYBAQAAAAGIAUAAAAABiQEBAAAAAYoBQAAAAAEBDgAANwAgC2QBAAAAAWUBAAAAAX4AAACIAQKCAQEAAAABgwEBAAAAAYQBAQAAAAGFAQIAAAABhgEBAAAAAYgBQAAAAAGJAQEAAAABigFAAAAAAQEOAAA5ADABDgAAOQAwAQAAAAwAIAEAAAADACANBQAAkwIAIAcAANwBACBkAQDIAQAhZQEAyQEAIX4AANoBiAEiggEBAMgBACGDAQEAyAEAIYQBAQDIAQAhhQECANkBACGGAQEAyAEAIYgBQADKAQAhiQEBAMkBACGKAUAAygEAIQIAAAAKACAOAAA-ACALZAEAyAEAIWUBAMkBACF-AADaAYgBIoIBAQDIAQAhgwEBAMgBACGEAQEAyAEAIYUBAgDZAQAhhgEBAMgBACGIAUAAygEAIYkBAQDJAQAhigFAAMoBACECAAAACAAgDgAAQAAgAgAAAAgAIA4AAEAAIAEAAAAMACABAAAAAwAgAwAAAAoAIBUAADcAIBYAAD4AIAEAAAAKACABAAAACAAgCQYAAJoCACAbAACdAgAgHAAAnAIAIC0AAJsCACAuAACeAgAgZQAAxAEAIIgBAADEAQAgiQEAAMQBACCKAQAAxAEAIA5hAACwAQAwYgAASQAQYwAAsAEAMGQBAJcBACFlAQCYAQAhfgAAsgGIASKCAQEAmQEAIYMBAQCZAQAhhAEBAJkBACGFAQIAsQEAIYYBAQCZAQAhiAFAAJsBACGJAQEAmAEAIYoBQACbAQAhAwAAAAgAIAEAAEgAMBoAAEkAIAMAAAAIACABAAAJADACAAAKACAQBAAArgEAIAUAAK8BACBhAACqAQAwYgAADAAQYwAAqgEAMGQBAAAAAWkBAAAAAWoBAKwBACFrQACtAQAhewEAqwEAIXwBAKwBACF9AQCsAQAhfgEArAEAIX8BAKwBACGAAQEArAEAIYEBQACtAQAhAQAAAEwAIAEAAABMACAKBAAAmAIAIAUAAJkCACBqAADEAQAgawAAxAEAIHwAAMQBACB9AADEAQAgfgAAxAEAIH8AAMQBACCAAQAAxAEAIIEBAADEAQAgAwAAAAwAIAEAAE8AMAIAAEwAIAMAAAAMACABAABPADACAABMACADAAAADAAgAQAATwAwAgAATAAgDQQAAJYCACAFAACXAgAgZAEAAAABaQEAAAABagEAAAABa0AAAAABewEAAAABfAEAAAABfQEAAAABfgEAAAABfwEAAAABgAEBAAAAAYEBQAAAAAEBDgAAUwAgC2QBAAAAAWkBAAAAAWoBAAAAAWtAAAAAAXsBAAAAAXwBAAAAAX0BAAAAAX4BAAAAAX8BAAAAAYABAQAAAAGBAUAAAAABAQ4AAFUAMAEOAABVADANBAAAhAIAIAUAAIUCACBkAQDIAQAhaQEAyAEAIWoBAMkBACFrQADKAQAhewEAyAEAIXwBAMkBACF9AQDJAQAhfgEAyQEAIX8BAMkBACGAAQEAyQEAIYEBQADKAQAhAgAAAEwAIA4AAFgAIAtkAQDIAQAhaQEAyAEAIWoBAMkBACFrQADKAQAhewEAyAEAIXwBAMkBACF9AQDJAQAhfgEAyQEAIX8BAMkBACGAAQEAyQEAIYEBQADKAQAhAgAAAAwAIA4AAFoAIAIAAAAMACAOAABaACADAAAATAAgFQAAUwAgFgAAWAAgAQAAAEwAIAEAAAAMACALBgAAgQIAIBsAAIMCACAcAACCAgAgagAAxAEAIGsAAMQBACB8AADEAQAgfQAAxAEAIH4AAMQBACB_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_AQCsAQAhgAEBAKwBACGBAUAArQEAIY4BAAAMACCPAQAADAAgCAUAAKgBACBhAACnAQAwYgAAEwAQYwAApwEAMGQBAL4BACF3AQCrAQAhjgEAABMAII8BAAATACAIbAEAAAABbQEAAAAFbgEAAAAFbwEAAAABcAEAAAABcQEAAAABcgEAAAABcwEAvQEAIQhsAQAAAAFtAQAAAARuAQAAAARvAQAAAAFwAQAAAAFxAQAAAAFyAQAAAAFzAQC_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_gEAIAMAAAAWACAVAAD-AQAgFgAA_QEAIAEOAACyAgAwDwMAALoBACAEAACuAQAgBwAAuwEAIAgAALwBACBhAAC4AQAwYgAAAwAQYwAAuAEAMGQBAAAAAWUBAAAAAWYBALkBACFnAQAAAAFoAQCrAQAhaQEAAAABagEArAEAIWtAAK0BACECAAAAFgAgDgAA_QEAIAIAAAD7AQAgDgAA_AEAIAthAAD6AQAwYgAA-wEAEGMAAPoBADBkAQC-AQAhZQEAuQEAIWYBALkBACFnAQCrAQAhaAEAqwEAIWkBAKwBACFqAQCsAQAha0AArQEAIQthAAD6AQAwYgAA-wEAEGMAAPoBADBkAQC-AQAhZQEAuQEAIWYBALkBACFnAQCrAQAhaAEAqwEAIWkBAKwBACFqAQCsAQAha0AArQEAIQdkAQDIAQAhZQEAyQEAIWcBAMgBACFoAQDIAQAhaQEAyQEAIWoBAMkBACFrQADKAQAhCgMAAMsBACAEAADMAQAgBwAAzQEAIGQBAMgBACFlAQDJAQAhZwEAyAEAIWgBAMgBACFpAQDJAQAhagEAyQEAIWtAAMoBACEKAwAA6wEAIAQAAOwBACAHAADtAQAgZAEAAAABZQEAAAABZwEAAAABaAEAAAABaQEAAAABagEAAAABa0AAAAABBBUAAPMBADCQAQAA9AEAMJIBAAD2AQAglgEAAPcBADAAAAAACxUAAIsCADAWAACPAgAwkAEAAIwCADCRAQAAjQIAMJIBAACOAgAgkwEAANMBADCUAQAA0wEAMJUBAADTAQAwlgEAANMBADCXAQAAkAIAMJgBAADWAQAwBxUAAIYCACAWAACJAgAgkAEAAIcCACCRAQAAiAIAIJQBAAADACCVAQAAAwAglgEAABYAIAoDAADrAQAgBAAA7AEAIAgAAO4BACBkAQAAAAFmAQAAAAFnAQAAAAFoAQAAAAFpAQAAAAFqAQAAAAFrQAAAAAECAAAAFgAgFQAAhgIAIAMAAAADACAVAACGAgAgFgAAigIAIAwAAAADACADAADLAQAgBAAAzAEAIAgAAM4BACAOAACKAgAgZAEAyAEAIWYBAMkBACFnAQDIAQAhaAEAyAEAIWkBAMkBACFqAQDJAQAha0AAygEAIQoDAADLAQAgBAAAzAEAIAgAAM4BACBkAQDIAQAhZgEAyQEAIWcBAMgBACFoAQDIAQAhaQEAyQEAIWoBAMkBACFrQADKAQAhCwUAAJUCACBkAQAAAAF-AAAAiAECggEBAAAAAYMBAQAAAAGEAQEAAAABhQECAAAAAYYBAQAAAAGIAUAAAAABiQEBAAAAAYoBQAAAAAECAAAACgAgFQAAlAIAIAMAAAAKACAVAACUAgAgFgAAkgIAIAEOAACxAgAwAgAAAAoAIA4AAJICACACAAAA1wEAIA4AAJECACAKZAEAyAEAIX4AANoBiAEiggEBAMgBACGDAQEAyAEAIYQBAQDIAQAhhQECANkBACGGAQEAyAEAIYgBQADKAQAhiQEBAMkBACGKAUAAygEAIQsFAACTAgAgZAEAyAEAIX4AANoBiAEiggEBAMgBACGDAQEAyAEAIYQBAQDIAQAhhQECANkBACGGAQEAyAEAIYgBQADKAQAhiQEBAMkBACGKAUAAygEAIQcVAACsAgAgFgAArwIAIJABAACtAgAgkQEAAK4CACCUAQAAAwAglQEAAAMAIJYBAAAWACALBQAAlQIAIGQBAAAAAX4AAACIAQKCAQEAAAABgwEBAAAAAYQBAQAAAAGFAQIAAAABhgEBAAAAAYgBQAAAAAGJAQEAAAABigFAAAAAAQMVAACsAgAgkAEAAK0CACCWAQAAFgAgBBUAAIsCADCQAQAAjAIAMJIBAACOAgAglgEAANMBADADFQAAhgIAIJABAACHAgAglgEAABYAIAAJAwAApAIAIAQAAJgCACAHAAClAgAgCAAApgIAIGUAAMQBACBmAADEAQAgaQAAxAEAIGoAAMQBACBrAADEAQAgAAAAAAAAAAAHFQAApwIAIBYAAKoCACCQAQAAqAIAIJEBAACpAgAglAEAAAMAIJUBAAADACCWAQAAFgAgAxUAAKcCACCQAQAAqAIAIJYBAAAWACAACgQAAJgCACAFAACZAgAgagAAxAEAIGsAAMQBACB8AADEAQAgfQAAxAEAIH4AAMQBACB_AADEAQAggAEAAMQBACCBAQAAxAEAIAEFAACAAgAgCwQAAOwBACAHAADtAQAgCAAA7gEAIGQBAAAAAWUBAAAAAWYBAAAAAWcBAAAAAWgBAAAAAWkBAAAAAWoBAAAAAWtAAAAAAQIAAAAWACAVAACnAgAgAwAAAAMAIBUAAKcCACAWAACrAgAgDQAAAAMAIAQAAMwBACAHAADNAQAgCAAAzgEAIA4AAKsCACBkAQDIAQAhZQEAyQEAIWYBAMkBACFnAQDIAQAhaAEAyAEAIWkBAMkBACFqAQDJAQAha0AAygEAIQsEAADMAQAgBwAAzQEAIAgAAM4BACBkAQDIAQAhZQEAyQEAIWYBAMkBACFnAQDIAQAhaAEAyAEAIWkBAMkBACFqAQDJAQAha0AAygEAIQsDAADrAQAgBwAA7QEAIAgAAO4BACBkAQAAAAFlAQAAAAFmAQAAAAFnAQAAAAFoAQAAAAFpAQAAAAFqAQAAAAFrQAAAAAECAAAAFgAgFQAArAIAIAMAAAADACAVAACsAgAgFgAAsAIAIA0AAAADACADAADLAQAgBwAAzQEAIAgAAM4BACAOAACwAgAgZAEAyAEAIWUBAMkBACFmAQDJAQAhZwEAyAEAIWgBAMgBACFpAQDJAQAhagEAyQEAIWtAAMoBACELAwAAywEAIAcAAM0BACAIAADOAQAgZAEAyAEAIWUBAMkBACFmAQDJAQAhZwEAyAEAIWgBAMgBACFpAQDJAQAhagEAyQEAIWtAAMoBACEKZAEAAAABfgAAAIgBAoIBAQAAAAGDAQEAAAABhAEBAAAAAYUBAgAAAAGGAQEAAAABiAFAAAAAAYkBAQAAAAGKAUAAAAABB2QBAAAAAWUBAAAAAWcBAAAAAWgBAAAAAWkBAAAAAWoBAAAAAWtAAAAAAQJkAQAAAAF3AQAAAAECAAAAZAAgFQAAswIAIAwEAACWAgAgZAEAAAABaQEAAAABagEAAAABa0AAAAABewEAAAABfAEAAAABfQEAAAABfgEAAAABfwEAAAABgAEBAAAAAYEBQAAAAAECAAAATAAgFQAAtQIAIARkAQAAAAFrQAAAAAGMAQEAAAABjQEBAAAAAQwFAACXAgAgZAEAAAABaQEAAAABagEAAAABa0AAAAABewEAAAABfAEAAAABfQEAAAABfgEAAAABfwEAAAABgAEBAAAAAYEBQAAAAAECAAAATAAgFQAAuAIAIAMAAAAMACAVAAC4AgAgFgAAvAIAIA4AAAAMACAFAACFAgAgDgAAvAIAIGQBAMgBACFpAQDIAQAhagEAyQEAIWtAAMoBACF7AQDIAQAhfAEAyQEAIX0BAMkBACF-AQDJAQAhfwEAyQEAIYABAQDJAQAhgQFAAMoBACEMBQAAhQIAIGQBAMgBACFpAQDIAQAhagEAyQEAIWtAAMoBACF7AQDIAQAhfAEAyQEAIX0BAMkBACF-AQDJAQAhfwEAyQEAIYABAQDJAQAhgQFAAMoBACEKZAEAAAABZQEAAAABfgAAAIgBAoIBAQAAAAGDAQEAAAABhAEBAAAAAYUBAgAAAAGGAQEAAAABiAFAAAAAAYoBQAAAAAEDAAAAEwAgFQAAswIAIBYAAMACACAEAAAAEwAgDgAAwAIAIGQBAMgBACF3AQDIAQAhAmQBAMgBACF3AQDIAQAhAwAAAAwAIBUAALUCACAWAADDAgAgDgAAAAwAIAQAAIQCACAOAADDAgAgZAEAyAEAIWkBAMgBACFqAQDJAQAha0AAygEAIXsBAMgBACF8AQDJAQAhfQEAyQEAIX4BAMkBACF_AQDJAQAhgAEBAMkBACGBAUAAygEAIQwEAACEAgAgZAEAyAEAIWkBAMgBACFqAQDJAQAha0AAygEAIXsBAMgBACF8AQDJAQAhfQEAyQEAIX4BAMkBACF_AQDJAQAhgAEBAMkBACGBAUAAygEAIQEFBAIFAwcBBAsDBgAIBxIECBQGAgURAgcNBAMEDgMFDwIGAAUBBBAAAgUXAgYABwEFGAACAxkABBoAAAEFJAIBBSoCAwYADRsADhwADwAAAAMGAA0bAA4cAA8CBT0CBzwEAgVEAgdDBAUGABQbABccABgtABUuABYAAAAAAAUGABQbABccABgtABUuABYAAAMGAB0bAB4cAB8AAAADBgAdGwAeHAAfAAADBgAkGwAlHAAmAAAAAwYAJBsAJRwAJgIHhgEECIcBBgIHjQEECI4BBgMGACsbACwcAC0AAAADBgArGwAsHAAtCQIBChsBCxwBDB0BDR4BDyABECIJESMKEiYBEygJFCkLFysBGCwBGS0JHTAMHjEQHzIDIDMDITQDIjUDIzYDJDgDJToJJjsRJz8DKEEJKUISKkUDK0YDLEcJL0oTMEsZMU0EMk4EM1AENFEENVIENlQEN1YJOFcaOVkEOlsJO1wbPF0EPV4EPl8JP2IcQGMgQWUGQmYGQ2gGRGkGRWoGRmwGR24JSG8hSXEGSnMJS3QiTHUGTXYGTncJT3ojUHsnUXwCUn0CU34CVH8CVYABAlaCAQJXhAEJWIUBKFmJAQJaiwEJW4wBKVyPAQJdkAECXpEBCV-UASpglQEu"
    };
    config.compilerWasm = {
      getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
      getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
        return await decodeBase64AsWasm(wasm);
      },
      importName: "./query_compiler_fast_bg.js"
    };
  }
});

// lib/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext, NullTypes2, TransactionIsolationLevel, defineExtension;
var init_prismaNamespace = __esm({
  "lib/generated/prisma/internal/prismaNamespace.ts"() {
    "use strict";
    getExtensionContext = runtime2.Extensions.getExtensionContext;
    NullTypes2 = {
      DbNull: runtime2.NullTypes.DbNull,
      JsonNull: runtime2.NullTypes.JsonNull,
      AnyNull: runtime2.NullTypes.AnyNull
    };
    TransactionIsolationLevel = runtime2.makeStrictEnum({
      ReadUncommitted: "ReadUncommitted",
      ReadCommitted: "ReadCommitted",
      RepeatableRead: "RepeatableRead",
      Serializable: "Serializable"
    });
    defineExtension = runtime2.Extensions.defineExtension;
  }
});

// lib/generated/prisma/enums.ts
var init_enums = __esm({
  "lib/generated/prisma/enums.ts"() {
    "use strict";
  }
});

// lib/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";
var PrismaClient;
var init_client = __esm({
  "lib/generated/prisma/client.ts"() {
    "use strict";
    init_class();
    init_prismaNamespace();
    init_enums();
    init_enums();
    globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
    PrismaClient = getPrismaClientClass();
  }
});

// lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
var globalForPrisma, prisma;
var init_prisma = __esm({
  "lib/prisma.ts"() {
    "use strict";
    init_client();
    globalForPrisma = global;
    prisma = globalForPrisma.prisma || new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
  }
});

// lib/jwt.ts
import jwt from "jsonwebtoken";
function signToken(payload) {
  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  };
  return jwt.sign(payload, JWT_SECRET, options);
}
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
var JWT_SECRET;
var init_jwt = __esm({
  "lib/jwt.ts"() {
    "use strict";
    JWT_SECRET = process.env.JWT_SECRET;
  }
});

// lib/logActivity.ts
async function createActivity(opts) {
  const { userId = null, action, description = null } = opts;
  const desc = description === null || typeof description === "string" ? description : JSON.stringify(description);
  return prisma.activity_logs.create({
    data: {
      user_id: userId,
      action,
      description: desc
    }
  });
}
var init_logActivity = __esm({
  "lib/logActivity.ts"() {
    "use strict";
    init_prisma();
  }
});

// lib/services/users/employeeLinking.ts
function normalizeValue(value) {
  return value?.trim() ?? "";
}
function normalizeEmail(email) {
  const value = normalizeValue(email).toLowerCase();
  return value.length > 0 ? value : "";
}
function normalizeNip(nip) {
  const value = normalizeValue(nip);
  return value.length > 0 ? value : "";
}
function evaluateCandidates({
  matchesByNip,
  matchesByEmail
}) {
  const nipSingle = matchesByNip.length === 1 ? matchesByNip[0] : null;
  const emailSingle = matchesByEmail.length === 1 ? matchesByEmail[0] : null;
  if (matchesByNip.length > 1 || matchesByEmail.length > 1) {
    return {
      employeeId: null,
      status: "conflict",
      message: "Ditemukan lebih dari satu kandidat pegawai. Perlu pengaitan manual."
    };
  }
  if (nipSingle && emailSingle && nipSingle.id !== emailSingle.id) {
    return {
      employeeId: null,
      status: "conflict",
      message: "Data NIP dan email mengarah ke pegawai berbeda. Perlu pengaitan manual."
    };
  }
  if (nipSingle) {
    return {
      employeeId: nipSingle.id,
      status: "linked_auto",
      message: "Akun berhasil dikaitkan otomatis berdasarkan NIP."
    };
  }
  if (emailSingle) {
    return {
      employeeId: emailSingle.id,
      status: "linked_auto",
      message: "Akun berhasil dikaitkan otomatis berdasarkan email."
    };
  }
  return {
    employeeId: null,
    status: "unlinked",
    message: "Belum ada pegawai yang cocok otomatis."
  };
}
async function resolveEmployeeLinkForUser(input) {
  const manualEmployeeId = normalizeValue(input.manualEmployeeId);
  if (manualEmployeeId) {
    return {
      employeeId: manualEmployeeId,
      status: "linked_manual",
      message: "Akun dikaitkan manual oleh admin."
    };
  }
  const normalizedEmail = normalizeEmail(input.email);
  const normalizedNip = normalizeNip(input.nip);
  if (!normalizedEmail && !normalizedNip) {
    return {
      employeeId: null,
      status: "unlinked",
      message: "Tidak ada data pencocokan otomatis (NIP/email)."
    };
  }
  const candidates = await prisma.employees.findMany({
    where: {
      OR: [
        normalizedNip ? { nip: normalizedNip } : void 0,
        normalizedEmail ? {
          email: {
            equals: normalizedEmail,
            mode: "insensitive"
          }
        } : void 0
      ].filter((v) => v != null)
    },
    select: {
      id: true,
      nip: true,
      email: true
    }
  });
  const matchesByNip = normalizedNip ? candidates.filter(
    (candidate) => normalizeNip(candidate.nip) === normalizedNip
  ) : [];
  const matchesByEmail = normalizedEmail ? candidates.filter(
    (candidate) => normalizeEmail(candidate.email) === normalizedEmail
  ) : [];
  return evaluateCandidates({ matchesByNip, matchesByEmail });
}
async function resolveUserLinkForEmployee(input) {
  const normalizedNip = normalizeNip(input.nip);
  const normalizedEmail = normalizeEmail(input.email);
  if (!normalizedNip && !normalizedEmail) {
    return {
      userId: null,
      status: "unlinked",
      message: "Tidak ada data pencocokan otomatis (NIP/email)."
    };
  }
  const users = await prisma.users.findMany({
    where: {
      employee_id: null,
      OR: [
        normalizedNip ? { nip: normalizedNip } : void 0,
        normalizedEmail ? {
          email: {
            equals: normalizedEmail,
            mode: "insensitive"
          }
        } : void 0
      ].filter((v) => v != null)
    },
    select: {
      id: true,
      username: true,
      nip: true,
      email: true
    }
  });
  const matchesByNip = normalizedNip ? users.filter((user) => normalizeNip(user.nip) === normalizedNip) : [];
  const matchesByEmail = normalizedEmail ? users.filter((user) => normalizeEmail(user.email) === normalizedEmail) : [];
  if (matchesByNip.length > 1 || matchesByEmail.length > 1) {
    return {
      userId: null,
      status: "conflict",
      message: "Ditemukan lebih dari satu kandidat user. Perlu pengaitan manual."
    };
  }
  const nipSingle = matchesByNip.length === 1 ? matchesByNip[0] : null;
  const emailSingle = matchesByEmail.length === 1 ? matchesByEmail[0] : null;
  if (nipSingle && emailSingle && nipSingle.id !== emailSingle.id) {
    return {
      userId: null,
      status: "conflict",
      message: "Data NIP dan email mengarah ke user berbeda. Perlu pengaitan manual."
    };
  }
  if (nipSingle) {
    return {
      userId: nipSingle.id,
      status: "linked_auto",
      message: "Pegawai berhasil dikaitkan otomatis ke user berdasarkan NIP."
    };
  }
  if (emailSingle) {
    return {
      userId: emailSingle.id,
      status: "linked_auto",
      message: "Pegawai berhasil dikaitkan otomatis ke user berdasarkan email."
    };
  }
  return {
    userId: null,
    status: "unlinked",
    message: "Belum ada user yang cocok otomatis."
  };
}
var init_employeeLinking = __esm({
  "lib/services/users/employeeLinking.ts"() {
    "use strict";
    init_prisma();
  }
});

// lib/validations/userRules.ts
function isValidUuid(value) {
  return UUID_REGEX.test(value.trim());
}
var USERNAME_REGEX, NIP_REGEX, PASSWORD_REGEX, UUID_REGEX, USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, NIP_MIN_LENGTH, NIP_MAX_LENGTH, PASSWORD_MIN_LENGTH, EMAIL_MAX_LENGTH;
var init_userRules = __esm({
  "lib/validations/userRules.ts"() {
    "use strict";
    USERNAME_REGEX = /^[a-zA-Z0-9_.-]+$/;
    NIP_REGEX = /^\d+$/;
    PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)\S+$/;
    UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    USERNAME_MIN_LENGTH = 3;
    USERNAME_MAX_LENGTH = 100;
    NIP_MIN_LENGTH = 8;
    NIP_MAX_LENGTH = 50;
    PASSWORD_MIN_LENGTH = 8;
    EMAIL_MAX_LENGTH = 150;
  }
});

// lib/validations/userValidations.ts
import { z } from "zod";
var usernameSchema, nipSchema, passwordSchema, emailSchema, roleIdSchema, employeeIdSchema, userCreateSchema, userUpdateSchema;
var init_userValidations = __esm({
  "lib/validations/userValidations.ts"() {
    "use strict";
    init_userRules();
    usernameSchema = z.string({ error: "Username wajib diisi" }).trim().min(1, "Username wajib diisi").min(USERNAME_MIN_LENGTH, "Username minimal 3 karakter").max(USERNAME_MAX_LENGTH, "Username maksimal 100 karakter").regex(
      USERNAME_REGEX,
      "Username hanya boleh huruf, angka, titik, garis bawah, atau strip"
    );
    nipSchema = z.string({ error: "NIP wajib diisi" }).trim().min(1, "NIP wajib diisi").min(NIP_MIN_LENGTH, "NIP minimal 8 digit").max(NIP_MAX_LENGTH, "NIP maksimal 50 digit").regex(NIP_REGEX, "NIP hanya boleh berisi angka");
    passwordSchema = z.string({ error: "Password wajib diisi" }).min(1, "Password wajib diisi").min(PASSWORD_MIN_LENGTH, "Password minimal 8 karakter").regex(
      PASSWORD_REGEX,
      "Password harus mengandung huruf dan angka tanpa spasi"
    );
    emailSchema = z.string({ error: "Email wajib diisi" }).trim().min(1, "Email wajib diisi").max(EMAIL_MAX_LENGTH, "Email maksimal 150 karakter").email("Format email tidak valid");
    roleIdSchema = z.string({ error: "Role wajib dipilih" }).trim().min(1, "Role wajib dipilih").refine((value) => isValidUuid(value), {
      message: "Format role tidak valid"
    });
    employeeIdSchema = z.string().trim().optional().nullable().transform((value) => value && value.length > 0 ? value : null).refine((value) => value === null || isValidUuid(value), {
      message: "Format pegawai tidak valid"
    });
    userCreateSchema = z.object({
      username: usernameSchema,
      password: passwordSchema,
      nip: nipSchema,
      email: emailSchema,
      role_id: roleIdSchema,
      employee_id: employeeIdSchema
    });
    userUpdateSchema = z.object({
      nip: nipSchema,
      email: emailSchema,
      role_id: roleIdSchema,
      employee_id: employeeIdSchema
    });
  }
});

// lib/services/users/createUser.ts
import bcrypt from "bcrypt";
async function createUser(data) {
  const parsed = userCreateSchema.parse(data);
  const { username, password, nip, email, role_id, employee_id } = parsed;
  const existingUser = await prisma.users.findUnique({
    where: { username }
  });
  if (existingUser) {
    throw new Error("Username sudah digunakan");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const linkResolution = await resolveEmployeeLinkForUser({
    nip,
    email,
    manualEmployeeId: employee_id
  });
  const user = await prisma.users.create({
    data: {
      username,
      password_hash: hashedPassword,
      nip,
      email,
      role_id,
      employee_id: linkResolution.employeeId
    }
  });
  return {
    ...user,
    link_status: linkResolution.status,
    link_message: linkResolution.message
  };
}
var init_createUser = __esm({
  "lib/services/users/createUser.ts"() {
    "use strict";
    init_prisma();
    init_employeeLinking();
    init_userValidations();
  }
});

// lib/services/auth/registerPublicUser.ts
import { z as z2 } from "zod";
async function registerPublicUser(input) {
  const parsed = publicRegisterSchema.parse(input);
  const employeeRole = await prisma.roles.findUnique({
    where: { name: "employee" },
    select: { id: true }
  });
  if (!employeeRole) {
    throw new Error("Role employee belum tersedia. Hubungi admin.");
  }
  const user = await createUser({
    username: parsed.username,
    password: parsed.password,
    nip: parsed.nip,
    email: parsed.email,
    role_id: employeeRole.id,
    employee_id: null
  });
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    link_status: user.link_status,
    link_message: user.link_message
  };
}
var publicRegisterSchema;
var init_registerPublicUser = __esm({
  "lib/services/auth/registerPublicUser.ts"() {
    "use strict";
    init_prisma();
    init_createUser();
    publicRegisterSchema = z2.object({
      username: z2.string(),
      password: z2.string(),
      nip: z2.string(),
      email: z2.string()
    });
  }
});

// lib/cookie-options.ts
function parseBoolean(value, fallback) {
  if (value === void 0) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}
function parseSameSite(value, fallback) {
  const normalized = value?.toLowerCase();
  if (normalized === "strict") return "strict";
  if (normalized === "none") return "none";
  if (normalized === "lax") return "lax";
  return fallback;
}
function parseMaxAge(value) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MAX_AGE;
}
function getSessionCookieOptions(overrides = {}) {
  return {
    httpOnly: true,
    secure: parseBoolean(
      process.env.SESSION_COOKIE_SECURE,
      process.env.NODE_ENV === "production"
    ),
    sameSite: parseSameSite(process.env.SESSION_COOKIE_SAMESITE, "lax"),
    path: "/",
    maxAge: parseMaxAge(process.env.SESSION_COOKIE_MAX_AGE),
    domain: process.env.SESSION_COOKIE_DOMAIN || void 0,
    ...overrides
  };
}
function getClearedSessionCookieOptions() {
  return getSessionCookieOptions({ expires: /* @__PURE__ */ new Date(0), maxAge: 0 });
}
var DEFAULT_MAX_AGE;
var init_cookie_options = __esm({
  "lib/cookie-options.ts"() {
    "use strict";
    DEFAULT_MAX_AGE = 60 * 60 * 24;
  }
});

// backend/routes/auth.ts
import { Router } from "express";
import bcrypt2 from "bcrypt";
import { randomUUID } from "crypto";
function getCookieValue(cookieHeader, key) {
  if (!cookieHeader) return null;
  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const [rawName, ...rawValueParts] = pair.trim().split("=");
    if (rawName !== key) continue;
    return decodeURIComponent(rawValueParts.join("="));
  }
  return null;
}
var router, auth_default;
var init_auth = __esm({
  "backend/routes/auth.ts"() {
    "use strict";
    init_prisma();
    init_jwt();
    init_logActivity();
    init_registerPublicUser();
    init_cookie_options();
    router = Router();
    router.post("/api/register", async (req, res) => {
      try {
        const user = await registerPublicUser({
          username: req.body?.username,
          password: req.body?.password,
          nip: req.body?.nip,
          email: req.body?.email
        });
        return res.status(201).json({
          message: "Registrasi berhasil. Silakan login.",
          data: user
        });
      } catch (error) {
        console.error("Public register error:", error);
        if (error instanceof Error) {
          return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    router.post("/api/login", async (req, res) => {
      try {
        const activeToken = getCookieValue(req.headers.cookie, "token");
        const activeSessionId = getCookieValue(req.headers.cookie, "session_id");
        if (activeToken && activeSessionId) {
          try {
            const payload = verifyToken(activeToken);
            if (payload.sessionId === activeSessionId) {
              return res.json({
                message: "Sesi aktif ditemukan",
                token: activeToken,
                alreadyLoggedIn: true
              });
            }
          } catch (error) {
            console.warn("Token verification failed:", error);
          }
        }
        const { username, password } = req.body ?? {};
        if (!username || !password) {
          return res.status(400).json({
            message: "Username dan password wajib diisi"
          });
        }
        const user = await prisma.users.findUnique({
          where: { username },
          include: { roles: true }
        });
        if (!user) {
          return res.status(401).json({ message: "User tidak ditemukan" });
        }
        const passwordMatch = await bcrypt2.compare(password, user.password_hash);
        if (!passwordMatch) {
          return res.status(401).json({ message: "Username atau Password salah" });
        }
        const sessionId = randomUUID();
        const token = signToken({
          userId: user.id,
          username: user.username,
          role: user.roles?.name,
          sessionId
        });
        await createActivity({
          userId: user.id,
          action: "login",
          description: { username: user.username, message: "login" }
        });
        res.cookie("token", token, getSessionCookieOptions());
        res.cookie("session_id", sessionId, getSessionCookieOptions());
        return res.json({
          message: "Login berhasil",
          token
        });
      } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    router.post("/api/logout", async (_req, res) => {
      res.cookie("token", "", getClearedSessionCookieOptions());
      res.cookie("session_id", "", getClearedSessionCookieOptions());
      return res.json({ message: "Logout berhasil" });
    });
    auth_default = router;
  }
});

// lib/services/users/getAllUsers.ts
async function getUsers() {
  const users = await prisma.users.findMany({ orderBy: { id: "desc" } });
  const mappedUsers = await Promise.all(
    users.map(async (user) => {
      const resolution = await resolveEmployeeLinkForUser({
        nip: user.nip,
        email: user.email,
        manualEmployeeId: user.employee_id
      });
      return {
        ...user,
        link_status: resolution.status,
        link_message: resolution.message
      };
    })
  );
  return mappedUsers;
}
var init_getAllUsers = __esm({
  "lib/services/users/getAllUsers.ts"() {
    "use strict";
    init_prisma();
    init_employeeLinking();
  }
});

// lib/services/users/getUserById.ts
async function getUserById(id) {
  const user = await prisma.users.findUnique({
    where: {
      id
    }
  });
  if (!user) return null;
  const resolution = await resolveEmployeeLinkForUser({
    nip: user.nip,
    email: user.email,
    manualEmployeeId: user.employee_id
  });
  return {
    ...user,
    link_status: resolution.status,
    link_message: resolution.message
  };
}
var init_getUserById = __esm({
  "lib/services/users/getUserById.ts"() {
    "use strict";
    init_prisma();
    init_employeeLinking();
  }
});

// lib/services/users/updateUser.ts
async function updateUser(id, data) {
  const currentUser = await prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      nip: true,
      email: true,
      employee_id: true
    }
  });
  if (!currentUser) {
    throw new Error("User not found");
  }
  const nextNip = typeof data.nip === "string" ? data.nip : data.nip === null ? null : currentUser.nip ?? null;
  const normalizedNip = nextNip?.trim() ?? "";
  if (!normalizedNip) {
    throw new Error("NIP wajib diisi");
  }
  const nextEmail = typeof data.email === "string" ? data.email : data.email === null ? null : currentUser.email;
  let nextEmployeeId;
  if (typeof data.employee_id === "string") {
    nextEmployeeId = data.employee_id;
  } else if (data.employee_id === null) {
    nextEmployeeId = null;
  }
  const linkResolution = await resolveEmployeeLinkForUser({
    nip: normalizedNip,
    email: nextEmail,
    manualEmployeeId: nextEmployeeId
  });
  const updated = await prisma.users.update({
    where: {
      id
    },
    data: {
      ...data,
      nip: normalizedNip,
      employee_id: linkResolution.employeeId
    }
  });
  const resolvedEmployeeId = linkResolution.employeeId ?? updated.employee_id;
  const isNewLink = resolvedEmployeeId && resolvedEmployeeId !== currentUser.employee_id;
  const isEmailChanged = resolvedEmployeeId && nextEmail && nextEmail !== currentUser.email;
  if (isNewLink) {
    await prisma.employees.update({
      where: { id: resolvedEmployeeId },
      data: {
        ...nextEmail ? { email: nextEmail } : {},
        ...normalizedNip ? { nip: normalizedNip } : {}
      }
    }).catch(() => {
    });
  } else if (isEmailChanged) {
    await prisma.employees.update({
      where: { id: resolvedEmployeeId },
      data: { email: nextEmail }
    }).catch(() => {
    });
  }
  return {
    ...updated,
    link_status: linkResolution.status,
    link_message: linkResolution.message
  };
}
var init_updateUser = __esm({
  "lib/services/users/updateUser.ts"() {
    "use strict";
    init_prisma();
    init_employeeLinking();
  }
});

// lib/services/users/deleteUser.ts
async function deleteUser(id) {
  return prisma.users.delete({
    where: {
      id
    }
  });
}
var init_deleteUser = __esm({
  "lib/services/users/deleteUser.ts"() {
    "use strict";
    init_prisma();
  }
});

// lib/require-role.ts
function requireRole(user, roles) {
  if (!roles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
}
var init_require_role = __esm({
  "lib/require-role.ts"() {
    "use strict";
  }
});

// backend/lib/auth.ts
function getCookieValue2(cookieHeader, key) {
  if (!cookieHeader) return null;
  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const [rawName, ...rawValueParts] = pair.trim().split("=");
    if (rawName !== key) continue;
    return decodeURIComponent(rawValueParts.join("="));
  }
  return null;
}
function requireJWT(req) {
  const authHeader = req.headers.authorization;
  const cookieHeader = req.headers.cookie;
  const tokenFromCookie = getCookieValue2(cookieHeader, "token");
  const sessionIdFromCookie = getCookieValue2(cookieHeader, "session_id");
  const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!tokenFromCookie || !sessionIdFromCookie) {
    throw new Error("TOKEN_NOT_FOUND");
  }
  if (tokenFromHeader && tokenFromHeader !== tokenFromCookie) {
    throw new Error("TOKEN_OUT_OF_SYNC");
  }
  const payload = verifyToken(tokenFromCookie);
  if (payload.sessionId !== sessionIdFromCookie) {
    throw new Error("SESSION_MISMATCH");
  }
  return payload;
}
var init_auth2 = __esm({
  "backend/lib/auth.ts"() {
    "use strict";
    init_jwt();
  }
});

// backend/routes/users.ts
import { Router as Router2 } from "express";
var router2, users_default;
var init_users = __esm({
  "backend/routes/users.ts"() {
    "use strict";
    init_getAllUsers();
    init_createUser();
    init_getUserById();
    init_updateUser();
    init_deleteUser();
    init_logActivity();
    init_userValidations();
    init_require_role();
    init_auth2();
    router2 = Router2();
    router2.get("/api/user", async (req, res) => {
      try {
        const user = requireJWT(req);
        if (!user.role || typeof user.role !== "string") {
          return res.status(400).json({ message: "User role is required" });
        }
        requireRole({ ...user, role: user.role }, ["admin"]);
        const users = await getUsers();
        return res.json(users);
      } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
          return res.status(403).json({ message: "Forbidden" });
        }
        console.error("GET users error:", error);
        return res.status(500).json({ message: "Failed to fetch users" });
      }
    });
    router2.post("/api/user", async (req, res) => {
      try {
        const user = requireJWT(req);
        if (!user.role || typeof user.role !== "string") {
          return res.status(400).json({ message: "User role is required" });
        }
        requireRole({ ...user, role: user.role }, ["admin"]);
        const process2 = userCreateSchema.safeParse(req.body);
        if (!process2.success) {
          const firstError = process2.error.issues[0]?.message ?? "Data tidak valid";
          return res.status(400).json({ message: firstError });
        }
        const { username, password, nip, email, role_id, employee_id } = process2.data;
        const userCreate = await createUser({
          username,
          password,
          nip,
          email,
          role_id,
          employee_id
        });
        await createActivity({
          userId: userCreate.id ? String(userCreate.id) : null,
          action: "create_user",
          description: {
            userId: userCreate.id,
            username: userCreate.username,
            message: "created"
          }
        });
        return res.status(201).json({
          message: "User berhasil dibuat",
          data: {
            id: userCreate.id,
            username: userCreate.username,
            email: userCreate.email,
            employee_id: userCreate.employee_id,
            link_status: userCreate.link_status,
            link_message: userCreate.link_message,
            role: {
              role_id: userCreate.role_id
            }
          }
        });
      } catch (error) {
        console.error("Create user error:", error);
        if (error instanceof Error) {
          return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    router2.get("/api/user/:id", async (req, res) => {
      try {
        const authUser = requireJWT(req);
        if (!authUser.role || typeof authUser.role !== "string") {
          return res.status(400).json({ message: "User role is required" });
        }
        const { id } = req.params;
        const isAdmin = authUser.role.toLowerCase() === "admin";
        const isSelf = String(authUser.userId ?? "") === id;
        if (!isAdmin && !isSelf) {
          return res.status(403).json({ message: "Forbidden" });
        }
        const user = await getUserById(id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.json(user);
      } catch (error) {
        console.error("GET User Error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    router2.put("/api/user/:id", async (req, res) => {
      try {
        const authUser = requireJWT(req);
        if (!authUser.role || typeof authUser.role !== "string") {
          return res.status(400).json({ message: "User role is required" });
        }
        const { id } = req.params;
        const isAdmin = authUser.role.toLowerCase() === "admin";
        const isSelf = String(authUser.userId ?? "") === id;
        if (!isAdmin && !isSelf) {
          return res.status(403).json({ message: "Forbidden" });
        }
        const process2 = userUpdateSchema.safeParse(req.body);
        if (!process2.success) {
          const firstError = process2.error.issues[0]?.message ?? "Data tidak valid";
          return res.status(400).json({ message: firstError });
        }
        const nextData = { ...process2.data };
        if (!isAdmin) {
          const currentUser = await getUserById(id);
          if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
          }
          if (!currentUser.role_id) {
            return res.status(400).json({ message: "Role user tidak valid" });
          }
          nextData.role_id = currentUser.role_id;
          nextData.employee_id = currentUser.employee_id;
        }
        const user = await updateUser(id, nextData);
        await createActivity({
          userId: authUser.userId === null || authUser.userId === void 0 ? null : String(authUser.userId),
          action: "update_user",
          description: { userId: id, message: "updated" }
        });
        return res.json(user);
      } catch (error) {
        if (error instanceof Error && error.message === "User not found") {
          return res.status(404).json({ message: "User not found" });
        }
        if (error instanceof Error && error.message === "NIP wajib diisi") {
          return res.status(400).json({ message: error.message });
        }
        if (error?.code === "P2025") {
          return res.status(404).json({ message: "User not found" });
        }
        console.error("PUT user error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    router2.delete("/api/user/:id", async (req, res) => {
      try {
        const authUser = requireJWT(req);
        if (!authUser.role || authUser.role.toLowerCase() !== "admin") {
          return res.status(403).json({ message: "Forbidden" });
        }
        const { id } = req.params;
        await deleteUser(id);
        await createActivity({
          userId: authUser.userId === null || authUser.userId === void 0 ? null : String(authUser.userId),
          action: "delete_user",
          description: { userId: id, message: "deleted" }
        });
        return res.json({ message: "User deleted successfully" });
      } catch (error) {
        if (error?.code === "P2025") {
          return res.status(404).json({ message: "User not found" });
        }
        console.error("DELETE user error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    users_default = router2;
  }
});

// lib/services/roles/getAllRoles.ts
async function getRoles() {
  return prisma.roles.findMany({ orderBy: { id: "desc" } });
}
var init_getAllRoles = __esm({
  "lib/services/roles/getAllRoles.ts"() {
    "use strict";
    init_prisma();
  }
});

// backend/routes/roles.ts
import { Router as Router3 } from "express";
var router3, roles_default;
var init_roles = __esm({
  "backend/routes/roles.ts"() {
    "use strict";
    init_getAllRoles();
    init_require_role();
    init_auth2();
    router3 = Router3();
    router3.get("/api/roles", async (req, res) => {
      try {
        const user = requireJWT(req);
        if (!user.role || typeof user.role !== "string") {
          return res.status(400).json({ message: "User role is required" });
        }
        requireRole({ ...user, role: user.role }, ["admin"]);
        const roles = await getRoles();
        return res.json(roles);
      } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
          return res.status(403).json({ message: "Forbidden" });
        }
        console.error("GET roles error:", error);
        return res.status(500).json({ message: "Failed to fetch roles" });
      }
    });
    roles_default = router3;
  }
});

// lib/services/employee/getEmployees.ts
async function getEmployees() {
  return prisma.employees.findMany({ orderBy: { id: "desc" } });
}
var init_getEmployees = __esm({
  "lib/services/employee/getEmployees.ts"() {
    "use strict";
    init_prisma();
  }
});

// lib/services/employee/createEmployee.ts
async function createEmployee(data) {
  const employee = await prisma.employees.create({
    data
  });
  const resolution = await resolveUserLinkForEmployee({
    nip: employee.nip,
    email: employee.email
  });
  if (resolution.userId) {
    await prisma.users.update({
      where: { id: resolution.userId },
      data: { employee_id: employee.id }
    });
  }
  return employee;
}
var init_createEmployee = __esm({
  "lib/services/employee/createEmployee.ts"() {
    "use strict";
    init_prisma();
    init_employeeLinking();
  }
});

// lib/services/employee/getEmployeeById.ts
async function getEmployeeById(id) {
  return prisma.employees.findUnique({
    where: {
      id
    }
  });
}
var init_getEmployeeById = __esm({
  "lib/services/employee/getEmployeeById.ts"() {
    "use strict";
    init_prisma();
  }
});

// lib/services/employee/updateEmployee.ts
async function updateEmployee(id, data) {
  const directLinkedUser = await prisma.users.findFirst({
    where: { employee_id: id },
    select: { id: true, email: true, nip: true }
  });
  const nextEmployeeData = { ...data };
  if (directLinkedUser) {
    const requestedEmail = typeof data.email === "string" ? data.email.trim() : null;
    const requestedNip = typeof data.nip === "string" ? data.nip.trim() : null;
    const shouldUpdateUserEmail = requestedEmail !== null && requestedEmail !== directLinkedUser.email;
    const shouldUpdateUserNip = requestedNip !== null && requestedNip !== directLinkedUser.nip;
    let masterEmail = directLinkedUser.email;
    let masterNip = directLinkedUser.nip;
    if (shouldUpdateUserEmail || shouldUpdateUserNip) {
      const updatedUser = await prisma.users.update({
        where: { id: directLinkedUser.id },
        data: {
          employee_id: id,
          ...shouldUpdateUserEmail ? { email: requestedEmail } : {},
          ...shouldUpdateUserNip ? { nip: requestedNip } : {}
        },
        select: { email: true, nip: true }
      });
      masterEmail = updatedUser.email;
      masterNip = updatedUser.nip;
    }
    if (masterEmail) {
      nextEmployeeData.email = masterEmail;
    }
    if (masterNip) {
      nextEmployeeData.nip = masterNip;
    }
  }
  const employee = await prisma.employees.update({
    where: {
      id
    },
    data: nextEmployeeData
  });
  if (directLinkedUser) {
    return employee;
  }
  const resolution = await resolveUserLinkForEmployee({
    nip: employee.nip,
    email: employee.email
  });
  const linkedUserId = resolution.userId;
  if (linkedUserId) {
    await prisma.users.update({
      where: { id: linkedUserId },
      data: { employee_id: employee.id }
    });
  }
  return employee;
}
var init_updateEmployee = __esm({
  "lib/services/employee/updateEmployee.ts"() {
    "use strict";
    init_prisma();
    init_employeeLinking();
  }
});

// lib/services/employee/getDocumentsByEmployee.ts
async function getDocumentsByEmployee(employeeId) {
  const docs = await prisma.documents.findMany({
    where: {
      employee_id: employeeId
    },
    include: {
      employees: true,
      users: {
        include: {
          employees: true
        }
      }
    },
    orderBy: {
      uploaded_at: "desc"
    }
  });
  return docs.map((d) => ({
    ...d,
    employee_name: d.employees?.nama ?? null,
    verified_by: d.users?.id ?? d.verified_by ?? null,
    verified_by_name: d.users?.username ?? d.users?.employees?.nama ?? null
  }));
}
var init_getDocumentsByEmployee = __esm({
  "lib/services/employee/getDocumentsByEmployee.ts"() {
    "use strict";
    init_prisma();
  }
});

// lib/validations/employeeValidations.ts
import { z as z3 } from "zod";
var employeeSchema;
var init_employeeValidations = __esm({
  "lib/validations/employeeValidations.ts"() {
    "use strict";
    employeeSchema = z3.object({
      nip: z3.string().min(1, "NIP wajib diisi"),
      nama: z3.string().min(1, "Nama wajib diisi"),
      jabatan: z3.string().min(1, "Jabatan wajib diisi"),
      unit: z3.string().min(1, "Unit wajib diisi"),
      status: z3.string().min(1, "Status wajib diisi"),
      alamat: z3.string().min(1, "Alamat wajib diisi"),
      no_hp: z3.string().min(1, "No HP wajib diisi"),
      email: z3.string({
        error: "Email wajib diisi"
      }).min(1, "Email wajib diisi").email("Format email tidak valid")
    });
  }
});

// backend/routes/employees.ts
import { Router as Router4 } from "express";
var router4, employees_default;
var init_employees = __esm({
  "backend/routes/employees.ts"() {
    "use strict";
    init_prisma();
    init_getEmployees();
    init_createEmployee();
    init_getEmployeeById();
    init_updateEmployee();
    init_getDocumentsByEmployee();
    init_employeeValidations();
    init_logActivity();
    init_auth2();
    router4 = Router4();
    router4.get("/api/employees", async (req, res) => {
      try {
        const user = requireJWT(req);
        if (!user.role || typeof user.role !== "string") {
          return res.status(400).json({ message: "User role is required" });
        }
        const employees = await getEmployees();
        return res.json(employees);
      } catch (error) {
        console.error("GET employees error:", error);
        return res.status(500).json({ message: "Failed to fetch employees" });
      }
    });
    router4.post("/api/employees", async (req, res) => {
      try {
        const { role, userId } = requireJWT(req);
        if (role !== "admin" && role !== "employee" && role !== "hr") {
          return res.status(403).json({ message: "Forbidden" });
        }
        const shouldLinkToCurrentUser = req.body?.linkToCurrentUser === true;
        const process2 = employeeSchema.safeParse(req.body);
        if (!process2.success) {
          return res.status(400).json({ message: process2.error.issues });
        }
        const employee = await createEmployee(process2.data);
        if ((role === "employee" || shouldLinkToCurrentUser) && userId) {
          await prisma.users.update({
            where: { id: String(userId) },
            data: { employee_id: employee.id }
          });
        }
        await createActivity({
          userId: userId === null || userId === void 0 ? null : String(userId),
          action: "create_employee",
          description: {
            employeeId: employee.id,
            name: employee.nama ?? null,
            message: "created"
          }
        });
        return res.status(201).json({
          message: "Employee created successfully",
          data: employee
        });
      } catch (error) {
        console.error("ERROR:", error);
        if (error instanceof Error) {
          return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    router4.get("/api/employees/:id", async (req, res) => {
      try {
        const auth = requireJWT(req);
        const { id } = req.params;
        if (!auth.role || typeof auth.role !== "string") {
          return res.status(400).json({ message: "User role is required" });
        }
        if (auth.role !== "admin") {
          if (auth.role !== "employee" && !auth.userId) {
            return res.status(403).json({ message: "Forbidden" });
          }
          const me = await prisma.users.findUnique({
            where: { id: String(auth.userId) },
            select: { employee_id: true }
          });
          if (!me?.employee_id || me.employee_id !== id) {
            return res.status(404).json({ message: "Not Found" });
          }
        }
        const employee = await getEmployeeById(id);
        if (!employee) {
          return res.status(404).json({ message: "Employee not found" });
        }
        return res.json(employee);
      } catch (error) {
        console.error("GET Employee Error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    router4.put("/api/employees/:id", async (req, res) => {
      try {
        const { userId, role } = requireJWT(req);
        const employeeId = req.params.id;
        if (userId === null || role === null) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        if (role !== "admin" && role !== "hr") {
          return res.status(403).json({ message: "Forbidden" });
        }
        if (role === "hr") {
          const me = await prisma.users.findUnique({
            where: { id: String(userId) },
            select: { employee_id: true }
          });
          if (!me?.employee_id || me.employee_id !== employeeId) {
            return res.status(403).json({ message: "Forbidden" });
          }
        }
        const employeeOwner = await getEmployeeById(employeeId);
        if (!employeeOwner && role !== "admin") {
          return res.status(404).json({ message: "Employee not found" });
        }
        const employee = await updateEmployee(employeeId, req.body);
        await createActivity({
          userId: userId === null || userId === void 0 ? null : String(userId),
          action: "update_employee",
          description: {
            employeeId,
            employeeName: employeeOwner?.nama ?? null,
            message: "updated"
          }
        });
        return res.json(employee);
      } catch (error) {
        if (error?.code === "P2025") {
          return res.status(404).json({ message: "Employee not found" });
        }
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    router4.delete("/api/employees/:id", async (req, res) => {
      try {
        const { userId, role } = requireJWT(req);
        const employeeId = req.params.id;
        if (userId === null || role === null) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        if (role !== "admin") {
          return res.status(403).json({ message: "Forbidden" });
        }
        const employeeOwner = await getEmployeeById(employeeId);
        if (!employeeOwner) {
          return res.status(404).json({ message: "Employee not found" });
        }
        await prisma.$transaction(async (tx) => {
          await tx.users.updateMany({
            where: { employee_id: employeeId },
            data: { employee_id: null }
          });
          await tx.employees.delete({ where: { id: employeeId } });
        });
        await createActivity({
          userId: userId === null || userId === void 0 ? null : String(userId),
          action: "delete_employee",
          description: {
            employeeId,
            employeeName: employeeOwner?.nama ?? null,
            message: "deleted"
          }
        });
        return res.json({ message: "Employee deleted successfully" });
      } catch (error) {
        if (error?.code === "P2025") {
          return res.status(404).json({ message: "Employee not found" });
        }
        if (error?.code === "P2003") {
          return res.status(409).json({
            message: "Employee tidak bisa dihapus karena masih terhubung ke data lain"
          });
        }
        console.error("DELETE employee error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    router4.get("/api/employees/:id/documents", async (req, res) => {
      try {
        const { id } = req.params;
        const documents = await getDocumentsByEmployee(id);
        return res.json({ success: true, data: documents });
      } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ success: false, message });
      }
    });
    employees_default = router4;
  }
});

// lib/services/activity/getActivity.ts
async function getActivity() {
  return prisma.activity_logs.findMany({
    orderBy: {
      created_at: "desc"
    }
  });
}
var init_getActivity = __esm({
  "lib/services/activity/getActivity.ts"() {
    "use strict";
    init_prisma();
  }
});

// backend/routes/activity.ts
import { Router as Router5 } from "express";
var router5, activity_default;
var init_activity = __esm({
  "backend/routes/activity.ts"() {
    "use strict";
    init_getActivity();
    init_auth2();
    init_require_role();
    router5 = Router5();
    router5.get("/api/activity", async (req, res) => {
      try {
        const role = requireJWT(req).role;
        if (!role || typeof role !== "string") {
          return res.status(400).json({ message: "User role is required" });
        }
        requireRole({ username: "system", role }, ["admin"]);
        const activities = await getActivity();
        return res.json({ success: true, data: activities });
      } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
          return res.status(403).json({ message: "Forbidden" });
        }
        console.error("GET Activity Error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    activity_default = router5;
  }
});

// lib/services/document/getDocuments.ts
async function getDocuments() {
  const docs = await prisma.documents.findMany({
    include: {
      employees: true,
      users: {
        include: {
          employees: true
        }
      }
    }
  });
  return docs.map((d) => ({
    ...d,
    employee_name: d.employees?.nama ?? null,
    verified_by: d.users?.id ?? d.verified_by ?? null,
    verified_by_name: d.users?.username ?? d.users?.employees?.nama ?? null
  }));
}
var init_getDocuments = __esm({
  "lib/services/document/getDocuments.ts"() {
    "use strict";
    init_prisma();
  }
});

// lib/services/document/createDocument.ts
async function createDocument(data) {
  return prisma.documents.create({
    data
  });
}
var init_createDocument = __esm({
  "lib/services/document/createDocument.ts"() {
    "use strict";
    init_prisma();
  }
});

// lib/services/document/getDocumentById.ts
async function getDocumentById(id) {
  return prisma.documents.findUnique({
    where: {
      id
    }
  });
}
var init_getDocumentById = __esm({
  "lib/services/document/getDocumentById.ts"() {
    "use strict";
    init_prisma();
  }
});

// lib/services/document/updateDocument.ts
async function updateDocument(id, data) {
  return prisma.documents.update({
    where: {
      id
    },
    data
  });
}
var init_updateDocument = __esm({
  "lib/services/document/updateDocument.ts"() {
    "use strict";
    init_prisma();
  }
});

// lib/services/document/deleteDocument.ts
async function deleteDocument(documentId) {
  return prisma.documents.delete({
    where: {
      id: documentId
    }
  });
}
var init_deleteDocument = __esm({
  "lib/services/document/deleteDocument.ts"() {
    "use strict";
    init_prisma();
  }
});

// lib/services/roles/getRoleById.ts
async function getRoleById(id) {
  return prisma.roles.findUnique({
    where: {
      id
    }
  });
}
var init_getRoleById = __esm({
  "lib/services/roles/getRoleById.ts"() {
    "use strict";
    init_prisma();
  }
});

// lib/validations/documentValidations.ts
import { z as z4 } from "zod";
var documentCreateSchema, documentUpdateSchema;
var init_documentValidations = __esm({
  "lib/validations/documentValidations.ts"() {
    "use strict";
    documentCreateSchema = z4.object({
      // employee IDs are UUID strings in the DB
      employee_id: z4.string({
        error: "Employee ID harus diisi sebagai string"
      }).min(1).optional(),
      document_type: z4.string({
        error: "Tipe dokumen wajib diisi"
      }).min(1, "Tipe dokumen tidak boleh kosong").max(50, "Tipe dokumen maksimal 50 karakter"),
      file_path: z4.string({
        error: "File path wajib diisi"
      }).min(1, "File path tidak boleh kosong"),
      uploaded_at: z4.coerce.date().optional(),
      verified_by: z4.string({
        error: "Verified by harus berupa string"
      }).min(1).optional(),
      verified_at: z4.coerce.date().optional()
    });
    documentUpdateSchema = z4.object({
      employee_id: z4.string().min(1).optional(),
      document_type: z4.string().min(1, "Tipe dokumen tidak boleh kosong").max(50).optional(),
      file_path: z4.string().min(1, "File path tidak boleh kosong").optional(),
      uploaded_at: z4.coerce.date().optional(),
      verified_by: z4.string().min(1).optional(),
      verified_at: z4.coerce.date().optional()
    });
  }
});

// backend/routes/documents.ts
import { Router as Router6 } from "express";
import { unlink } from "fs/promises";
import path2 from "path";
import z5 from "zod";
var router6, documents_default;
var init_documents = __esm({
  "backend/routes/documents.ts"() {
    "use strict";
    init_getDocuments();
    init_createDocument();
    init_getDocumentById();
    init_updateDocument();
    init_deleteDocument();
    init_getRoleById();
    init_documentValidations();
    init_logActivity();
    init_auth2();
    router6 = Router6();
    router6.get("/api/documents", async (req, res) => {
      try {
        const { role } = requireJWT(req);
        if (role !== "admin" && role !== "hr") {
          return res.status(403).json({ message: "Forbidden" });
        }
        const documents = await getDocuments();
        return res.json(documents);
      } catch (error) {
        console.error("GET documents error:", error);
        return res.status(500).json({ message: "Failed to fetch documents" });
      }
    });
    router6.post("/api/documents", async (req, res) => {
      try {
        const { role, userId } = requireJWT(req);
        if (role !== "admin" && role !== "hr") {
          return res.status(403).json({ message: "Forbidden" });
        }
        const process2 = documentCreateSchema.safeParse(req.body);
        if (!process2.success) {
          return res.status(400).json({ message: process2.error.issues });
        }
        const document = await createDocument({
          ...process2.data,
          file_name: req.body.file_name,
          file_size: req.body.file_size,
          mime_type: req.body.mime_type
        });
        await createActivity({
          userId: userId === null || userId === void 0 ? null : String(userId),
          action: "create_document",
          description: {
            documentId: document.id,
            fileName: document.file_name,
            message: "created"
          }
        });
        return res.status(201).json({
          message: "Document created successfully",
          data: document
        });
      } catch (error) {
        console.error("ERROR:", error);
        if (error instanceof z5.ZodError) {
          return res.status(400).json({ message: error.issues });
        }
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    router6.get("/api/documents/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const documentGet = await getDocumentById(id);
        const getRole = await getRoleById(
          documentGet?.verified_by?.toString() || "0"
        );
        if (!documentGet) {
          return res.status(404).json({ message: "Document not found" });
        }
        const result = {
          id: documentGet.id,
          employee_id: documentGet.employee_id,
          file_name: documentGet.file_path.split("/").pop(),
          file_path: documentGet.file_path,
          verified_by_id: documentGet.verified_by,
          verified_by_role: getRole ? getRole.name : null,
          uploaded_at: documentGet.uploaded_at,
          verified_at: documentGet.verified_at
        };
        return res.json(result);
      } catch (error) {
        console.error("GET Document Error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    router6.put("/api/documents/:id", async (req, res) => {
      try {
        const { role, userId } = requireJWT(req);
        if (role !== "admin" && role !== "hr") {
          return res.status(403).json({ message: "Forbidden" });
        }
        const { id } = req.params;
        const getDocument = await getDocumentById(id);
        if (!getDocument) {
          return res.status(404).json({ message: "Document not found" });
        }
        const documentUpdate = await updateDocument(id, req.body);
        await createActivity({
          userId: userId === null || userId === void 0 ? null : String(userId),
          action: `update_document ${getDocument.file_name}`,
          description: {
            documentId: id,
            documentName: getDocument?.file_name ?? null,
            message: "updated"
          }
        });
        return res.json(documentUpdate);
      } catch (error) {
        if (error?.code === "P2025") {
          return res.status(404).json({ message: "Document not found" });
        }
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    router6.delete("/api/documents/:id", async (req, res) => {
      try {
        const { role, userId } = requireJWT(req);
        if (role !== "admin") {
          return res.status(403).json({ message: "Forbidden" });
        }
        const { id: documentId } = req.params;
        if (!documentId || typeof documentId !== "string") {
          return res.status(400).json({ message: "Document ID tidak valid" });
        }
        const document = await getDocumentById(documentId);
        if (!document) {
          return res.status(404).json({ message: "Document tidak ditemukan" });
        }
        const filePath = path2.join(process.cwd(), "public", document.file_path);
        await unlink(filePath).catch(() => {
        });
        await deleteDocument(documentId);
        await createActivity({
          userId: userId === null || userId === void 0 ? null : String(userId),
          action: `delete_document ${document.file_name}`,
          description: {
            documentId,
            documentName: document?.file_name ?? null,
            message: "deleted"
          }
        });
        return res.json({
          success: true,
          message: "Document berhasil dihapus"
        });
      } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ success: false, message });
      }
    });
    router6.get("/api/documents/:id/details", async (req, res) => {
      try {
        const { id } = req.params;
        const document = await getDocumentById(id);
        if (!document) {
          return res.status(404).json({ message: "Document not found" });
        }
        return res.json(document);
      } catch (error) {
        console.error("GET Document details error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    documents_default = router6;
  }
});

// lib/validations/document.schema.ts
import { z as z6 } from "zod";
var uploadDocumentSchema;
var init_document_schema = __esm({
  "lib/validations/document.schema.ts"() {
    "use strict";
    uploadDocumentSchema = z6.object({
      // employees.id is a UUID string in the database, accept non-empty string
      employee_id: z6.string().min(1),
      employeeName: z6.string().min(2).max(100).optional(),
      document_type: z6.string().min(2).max(100)
    });
  }
});

// utils/fileUpload.ts
function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} tidak diizinkan`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Ukuran file maksimal 5MB`);
  }
}
var MAX_FILE_SIZE, ALLOWED_TYPES;
var init_fileUpload = __esm({
  "utils/fileUpload.ts"() {
    "use strict";
    MAX_FILE_SIZE = 5 * 1024 * 1024;
    ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
  }
});

// backend/routes/documentsUpload.ts
import { Router as Router7 } from "express";
import multer from "multer";
import { mkdir, writeFile } from "fs/promises";
import path3 from "path";
import { v4 as uuidv4 } from "uuid";
function sanitizeSegment(value) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").replace(/_{2,}/g, "_");
}
var router7, upload, uploadFields, uploadsRoot, documentsUpload_default;
var init_documentsUpload = __esm({
  "backend/routes/documentsUpload.ts"() {
    "use strict";
    init_prisma();
    init_document_schema();
    init_logActivity();
    init_auth2();
    init_fileUpload();
    router7 = Router7();
    upload = multer({ storage: multer.memoryStorage() });
    uploadFields = upload.array("files");
    uploadsRoot = path3.join(process.cwd(), "public", "uploads", "documents");
    router7.post("/api/documents/upload", (req, res) => {
      uploadFields(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }
        try {
          const auth = requireJWT(req);
          const form = req.body;
          const files = req.files ?? [];
          const employee_id = form.employee_id;
          const document_type = form.document_type;
          const other_document_type = form.other_document_type;
          const employeeNameField = form.employeeName;
          if (!files.length) {
            return res.status(400).json({ message: "File tidak ditemukan" });
          }
          const parsed = uploadDocumentSchema.safeParse({
            employee_id,
            employeeName: employeeNameField,
            document_type
          });
          if (!parsed.success) {
            return res.status(400).json({ message: parsed.error.flatten() });
          }
          const isOtherType = parsed.data.document_type === "LAINNYA";
          const otherTypeLabel = typeof other_document_type === "string" ? other_document_type.trim() : "";
          if (isOtherType && !otherTypeLabel) {
            return res.status(400).json({
              message: "Nama tipe dokumen wajib diisi saat memilih opsi LAINNYA"
            });
          }
          const employee = await prisma.employees.findUnique({
            where: { id: String(parsed.data.employee_id) },
            select: { nama: true }
          });
          const employeeNameFolder = parsed.data.employeeName ?? employee?.nama ?? String(parsed.data.employee_id);
          const employeeFolder = sanitizeSegment(employeeNameFolder) || String(parsed.data.employee_id);
          const employeeSegment = sanitizeSegment(
            employee?.nama || String(parsed.data.employee_id)
          );
          const docTypeSegment = sanitizeSegment(parsed.data.document_type);
          const otherTypeSegment = sanitizeSegment(otherTypeLabel);
          const baseDisplayName = isOtherType ? `${employeeSegment}_${docTypeSegment}_${otherTypeSegment}` : `${employeeSegment}_${docTypeSegment}`;
          const uploadPath = path3.join(uploadsRoot, employeeFolder);
          await mkdir(uploadPath, { recursive: true });
          const documentsData = [];
          for (let index = 0; index < files.length; index++) {
            const file = files[index];
            validateFile({ type: file.mimetype, size: file.size });
            const ext = path3.extname(file.originalname);
            const fileName = `${uuidv4()}${ext}`;
            const sequenceSuffix = files.length > 1 ? `_${index + 1}` : "";
            const displayFileName = `${baseDisplayName}${sequenceSuffix}${ext}`;
            const filePath = path3.join(uploadPath, fileName);
            await writeFile(filePath, file.buffer);
            documentsData.push({
              employee_id: String(parsed.data.employee_id),
              document_type: parsed.data.document_type,
              file_path: `/uploads/documents/${employeeFolder}/${fileName}`,
              uploaded_at: /* @__PURE__ */ new Date(),
              file_name: displayFileName,
              file_size: file.size,
              mime_type: file.mimetype
            });
          }
          const result = await prisma.documents.createMany({ data: documentsData });
          await createActivity({
            userId: auth.userId === null || auth.userId === void 0 ? null : String(auth.userId),
            action: "upload_document",
            description: {
              employeeId: String(parsed.data.employee_id),
              files: documentsData.map((d) => d.file_name),
              message: "uploaded"
            }
          });
          return res.json({
            message: "Upload berhasil",
            count: result.count,
            files: documentsData
          });
        } catch (error) {
          console.error("Upload error:", error);
          if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
          }
          return res.status(500).json({ message: "Internal server error" });
        }
      });
    });
    documentsUpload_default = router7;
  }
});

// lib/services/document/verifyDocument.ts
async function verifyDocument(documentId, verifiedBy) {
  const doc = await prisma.documents.update({
    where: { id: documentId },
    data: {
      verified_by: verifiedBy,
      verified_at: /* @__PURE__ */ new Date(),
      status: "verified"
    },
    include: {
      users: {
        include: {
          employees: true
        }
      }
    }
  });
  return {
    id: doc.id,
    status: doc.status,
    verified_at: doc.verified_at,
    verified_by: doc.verified_by,
    // prefer users.username since verifier is a user (admin), fallback to employee name
    verified_by_name: doc.users?.username ?? doc.users?.employees?.nama ?? null,
    file_path: doc.file_path
  };
}
var init_verifyDocument = __esm({
  "lib/services/document/verifyDocument.ts"() {
    "use strict";
    init_prisma();
  }
});

// lib/services/document/rejectDocument.ts
async function rejectDocument(documentId, verifiedBy) {
  const doc = await prisma.documents.update({
    where: { id: documentId },
    data: {
      verified_by: verifiedBy,
      verified_at: /* @__PURE__ */ new Date(),
      status: "rejected"
    },
    include: {
      users: {
        include: {
          employees: true
        }
      }
    }
  });
  return {
    id: doc.id,
    status: doc.status,
    verified_at: doc.verified_at,
    verified_by: doc.verified_by,
    // prefer users.username since verifier is a user (admin), fallback to employee name
    verified_by_name: doc.users?.username ?? doc.users?.employees?.nama ?? null,
    file_path: doc.file_path
  };
}
var init_rejectDocument = __esm({
  "lib/services/document/rejectDocument.ts"() {
    "use strict";
    init_prisma();
  }
});

// backend/routes/documentsVerifyReject.ts
import { Router as Router8 } from "express";
async function handleDecision(req, res, decision) {
  try {
    const { role, userId } = requireJWT(req);
    if (role !== "admin" && role !== "hr") {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const verifiedByStr = String(userId);
    const userToVerify = await getUserById(verifiedByStr);
    if (!userToVerify) {
      return res.status(404).json({ message: "User yang memverifikasi tidak ditemukan" });
    }
    const documentId = String(req.params.id);
    const getDocument = await getDocumentById(documentId);
    if (!getDocument) {
      return res.status(404).json({
        message: decision === "verified" ? "Document yang akan diverifikasi tidak ditemukan" : "Document yang akan ditolak tidak ditemukan"
      });
    }
    const document = decision === "verified" ? await verifyDocument(documentId, verifiedByStr) : await rejectDocument(documentId, verifiedByStr);
    await createActivity({
      userId: verifiedByStr,
      action: `${decision === "verified" ? "verify" : "reject"}_document ${getDocument?.file_name ?? ""}`,
      description: {
        documentId,
        documentName: getDocument?.file_name ?? null,
        [decision === "verified" ? "verifiedBy" : "rejectedBy"]: verifiedByStr,
        message: decision
      }
    });
    return res.json({
      success: true,
      message: decision === "verified" ? "Document berhasil diverifikasi" : "Document berhasil ditolak",
      data: document
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ success: false, message });
  }
}
var router8, documentsVerifyReject_default;
var init_documentsVerifyReject = __esm({
  "backend/routes/documentsVerifyReject.ts"() {
    "use strict";
    init_verifyDocument();
    init_rejectDocument();
    init_getUserById();
    init_getDocumentById();
    init_logActivity();
    init_auth2();
    router8 = Router8();
    router8.patch("/api/documents/verify/:id", async (req, res) => {
      return handleDecision(req, res, "verified");
    });
    router8.patch("/api/documents/reject/:id", async (req, res) => {
      return handleDecision(req, res, "rejected");
    });
    documentsVerifyReject_default = router8;
  }
});

// lib/services/roles/deleteRole.ts
async function deleteRole(id) {
  return prisma.roles.delete({
    where: {
      id
    }
  });
}
var init_deleteRole = __esm({
  "lib/services/roles/deleteRole.ts"() {
    "use strict";
    init_prisma();
  }
});

// lib/services/roles/updateRole.ts
async function updateRole(id, data) {
  return prisma.roles.update({
    where: {
      id
    },
    data
  });
}
var init_updateRole = __esm({
  "lib/services/roles/updateRole.ts"() {
    "use strict";
    init_prisma();
  }
});

// backend/routes/rolesId.ts
import { Router as Router9 } from "express";
var router9, rolesId_default;
var init_rolesId = __esm({
  "backend/routes/rolesId.ts"() {
    "use strict";
    init_prisma();
    init_getRoleById();
    init_deleteRole();
    init_updateRole();
    init_logActivity();
    init_auth2();
    init_require_role();
    router9 = Router9();
    router9.get("/api/roles/:id", async (req, res) => {
      try {
        const user = requireJWT(req);
        if (!user.role || typeof user.role !== "string") {
          return res.status(400).json({ message: "User role is required" });
        }
        requireRole({ ...user, role: user.role }, ["admin"]);
        const role = await getRoleById(req.params.id);
        if (!role) {
          return res.status(404).json({ message: "Role not found" });
        }
        return res.json(role);
      } catch (error) {
        console.error("GET Role Error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    router9.put("/api/roles/:id", async (req, res) => {
      try {
        const user = requireJWT(req);
        if (!user.role || typeof user.role !== "string") {
          return res.status(400).json({ message: "User role is required" });
        }
        requireRole({ ...user, role: user.role }, ["admin"]);
        const role = await updateRole(req.params.id, req.body);
        await createActivity({
          userId: user.userId === null || user.userId === void 0 ? null : String(user.userId),
          action: "update_role",
          description: { roleId: req.params.id, message: "updated" }
        });
        return res.json(role);
      } catch (error) {
        if (error?.code === "P2025") {
          return res.status(404).json({ message: "Role not found" });
        }
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    router9.delete("/api/roles/:id", async (req, res) => {
      try {
        const user = requireJWT(req);
        if (!user.role || typeof user.role !== "string") {
          return res.status(400).json({ message: "User role is required" });
        }
        requireRole({ ...user, role: user.role }, ["admin"]);
        await prisma.$transaction(async (tx) => {
          await tx.users.updateMany({
            where: { role_id: req.params.id },
            data: { role_id: null }
          });
          await deleteRole(req.params.id);
        });
        await createActivity({
          userId: user.userId === null || user.userId === void 0 ? null : String(user.userId),
          action: "delete_role",
          description: { roleId: req.params.id, message: "deleted" }
        });
        return res.json({ message: "Role deleted successfully" });
      } catch (error) {
        if (error?.code === "P2025") {
          return res.status(404).json({ message: "Role not found" });
        }
        console.error("DELETE role error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    rolesId_default = router9;
  }
});

// backend/server.ts
var server_exports = {};
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
var port, upstream, corsOrigin, proxyEnabled, app;
var init_server = __esm({
  "backend/server.ts"() {
    "use strict";
    init_auth();
    init_users();
    init_roles();
    init_employees();
    init_activity();
    init_documents();
    init_documentsUpload();
    init_documentsVerifyReject();
    init_rolesId();
    port = Number.parseInt(process.env.BACKEND_PORT ?? "4000", 10);
    upstream = (process.env.BACKEND_UPSTREAM_URL ?? "http://localhost:3000").replace(/\/$/, "");
    corsOrigin = process.env.CORS_ORIGIN ?? upstream;
    proxyEnabled = process.env.BACKEND_PROXY_TO_UPSTREAM === "true";
    app = express();
    app.set("trust proxy", true);
    app.use(morgan("dev"));
    app.use(
      cors({
        origin: corsOrigin === "*" ? true : corsOrigin,
        credentials: true
      })
    );
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use(auth_default);
    app.use(users_default);
    app.use(roles_default);
    app.use(employees_default);
    app.use(activity_default);
    app.use(documents_default);
    app.use(documentsUpload_default);
    app.use(documentsVerifyReject_default);
    app.use(rolesId_default);
    app.get("/health", (_req, res) => {
      res.json({
        ok: true,
        service: "backend",
        framework: "express",
        upstream,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    });
    app.get("/api/health", (_req, res) => {
      res.json({
        ok: true,
        service: "backend-api",
        framework: "express",
        upstream,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    });
    if (proxyEnabled) {
      const proxyToFrontend = createProxyMiddleware({
        target: upstream,
        changeOrigin: true,
        ws: true
      });
      app.use((req, res, next) => {
        if (req.path === "/health" || req.path === "/api/health") {
          return next();
        }
        return proxyToFrontend(req, res, next);
      });
    }
    app.use((_req, res) => {
      res.status(404).json({ message: "Not Found" });
    });
    app.listen(port, () => {
      console.log(`Express backend listening on http://localhost:${port}`);
      if (proxyEnabled) {
        console.log(`Proxying unknown routes to ${upstream}`);
      } else {
        console.log(`Frontend proxy is disabled`);
      }
    });
  }
});

// backend/bootstrap.ts
var import_env = __toESM(require_dist());
import { existsSync, readFileSync } from "fs";
import { join as join2 } from "path";
(0, import_env.loadEnvConfig)(process.cwd());
function loadLocalEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const contents = readFileSync(filePath, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;
    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();
    if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}
if (process.env.NODE_ENV !== "production") {
  loadLocalEnvFile(join2(process.cwd(), ".env"));
}
async function main() {
  await Promise.resolve().then(() => (init_server(), server_exports));
}
main().catch((error) => {
  console.error("Failed to start backend:", error);
  process.exit(1);
});
//# sourceMappingURL=bootstrap.mjs.map
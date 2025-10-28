import { g as getDefaultExportFromCjs, t as tokenError } from './mastra.mjs';
import path$1 from 'path';
import fs$1 from 'fs';
import os from 'os';
import 'stream/web';
import 'crypto';
import 'module';
import 'events';
import 'pino';
import 'pino-pretty';
import '@libsql/client';

function _mergeNamespaces(n, m) {
  m.forEach(function (e) {
    e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
      if (k !== 'default' && !(k in n)) {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  });
  return Object.freeze(n);
}

var __create$1 = Object.create;
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames$1 = Object.getOwnPropertyNames;
var __getProtoOf$1 = Object.getPrototypeOf;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __export$1 = (target, all) => {
  for (var name in all)
    __defProp$1(target, name, { get: all[name], enumerable: true });
};
var __copyProps$1 = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames$1(from))
      if (!__hasOwnProp$1.call(to, key) && key !== except)
        __defProp$1(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc$1(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM$1 = (mod, isNodeMode, target) => (target = mod != null ? __create$1(__getProtoOf$1(mod)) : {}, __copyProps$1(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  !mod || !mod.__esModule ? __defProp$1(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS$1 = (mod) => __copyProps$1(__defProp$1({}, "__esModule", { value: true }), mod);
var token_io_exports = {};
__export$1(token_io_exports, {
  findRootDir: () => findRootDir,
  getUserDataDir: () => getUserDataDir
});
var tokenIo = __toCommonJS$1(token_io_exports);
var import_path = __toESM$1(path$1);
var import_fs = __toESM$1(fs$1);
var import_os = __toESM$1(os);
var import_token_error$1 = tokenError;
function findRootDir() {
  try {
    let dir = process.cwd();
    while (dir !== import_path.default.dirname(dir)) {
      const pkgPath = import_path.default.join(dir, ".vercel");
      if (import_fs.default.existsSync(pkgPath)) {
        return dir;
      }
      dir = import_path.default.dirname(dir);
    }
  } catch (e) {
    throw new import_token_error$1.VercelOidcTokenError(
      "Token refresh only supported in node server environments"
    );
  }
  throw new import_token_error$1.VercelOidcTokenError("Unable to find root directory");
}
function getUserDataDir() {
  if (process.env.XDG_DATA_HOME) {
    return process.env.XDG_DATA_HOME;
  }
  switch (import_os.default.platform()) {
    case "darwin":
      return import_path.default.join(import_os.default.homedir(), "Library/Application Support");
    case "linux":
      return import_path.default.join(import_os.default.homedir(), ".local/share");
    case "win32":
      if (process.env.LOCALAPPDATA) {
        return process.env.LOCALAPPDATA;
      }
      return null;
    default:
      return null;
  }
}

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
  !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var token_util_exports = {};
__export(token_util_exports, {
  assertVercelOidcTokenResponse: () => assertVercelOidcTokenResponse,
  findProjectInfo: () => findProjectInfo,
  getTokenPayload: () => getTokenPayload,
  getVercelCliToken: () => getVercelCliToken,
  getVercelDataDir: () => getVercelDataDir,
  getVercelOidcToken: () => getVercelOidcToken,
  isExpired: () => isExpired,
  loadToken: () => loadToken,
  saveToken: () => saveToken
});
var tokenUtil = __toCommonJS(token_util_exports);
var path = __toESM(path$1);
var fs = __toESM(fs$1);
var import_token_error = tokenError;
var import_token_io = tokenIo;
function getVercelDataDir() {
  const vercelFolder = "com.vercel.cli";
  const dataDir = (0, import_token_io.getUserDataDir)();
  if (!dataDir) {
    return null;
  }
  return path.join(dataDir, vercelFolder);
}
function getVercelCliToken() {
  const dataDir = getVercelDataDir();
  if (!dataDir) {
    return null;
  }
  const tokenPath = path.join(dataDir, "auth.json");
  if (!fs.existsSync(tokenPath)) {
    return null;
  }
  const token = fs.readFileSync(tokenPath, "utf8");
  if (!token) {
    return null;
  }
  return JSON.parse(token).token;
}
async function getVercelOidcToken(authToken, projectId, teamId) {
  try {
    const url = `https://api.vercel.com/v1/projects/${projectId}/token?source=vercel-oidc-refresh${teamId ? `&teamId=${teamId}` : ""}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    if (!res.ok) {
      throw new import_token_error.VercelOidcTokenError(
        `Failed to refresh OIDC token: ${res.statusText}`
      );
    }
    const tokenRes = await res.json();
    assertVercelOidcTokenResponse(tokenRes);
    return tokenRes;
  } catch (e) {
    throw new import_token_error.VercelOidcTokenError(`Failed to refresh OIDC token`, e);
  }
}
function assertVercelOidcTokenResponse(res) {
  if (!res || typeof res !== "object") {
    throw new TypeError("Expected an object");
  }
  if (!("token" in res) || typeof res.token !== "string") {
    throw new TypeError("Expected a string-valued token property");
  }
}
function findProjectInfo() {
  const dir = (0, import_token_io.findRootDir)();
  if (!dir) {
    throw new import_token_error.VercelOidcTokenError("Unable to find root directory");
  }
  try {
    const prjPath = path.join(dir, ".vercel", "project.json");
    if (!fs.existsSync(prjPath)) {
      throw new import_token_error.VercelOidcTokenError("project.json not found");
    }
    const prj = JSON.parse(fs.readFileSync(prjPath, "utf8"));
    if (typeof prj.projectId !== "string" && typeof prj.orgId !== "string") {
      throw new TypeError("Expected a string-valued projectId property");
    }
    return { projectId: prj.projectId, teamId: prj.orgId };
  } catch (e) {
    throw new import_token_error.VercelOidcTokenError(`Unable to find project ID`, e);
  }
}
function saveToken(token, projectId) {
  try {
    const dir = (0, import_token_io.getUserDataDir)();
    if (!dir) {
      throw new import_token_error.VercelOidcTokenError("Unable to find user data directory");
    }
    const tokenPath = path.join(dir, "com.vercel.token", `${projectId}.json`);
    const tokenJson = JSON.stringify(token);
    fs.mkdirSync(path.dirname(tokenPath), { mode: 432, recursive: true });
    fs.writeFileSync(tokenPath, tokenJson);
    fs.chmodSync(tokenPath, 432);
    return;
  } catch (e) {
    throw new import_token_error.VercelOidcTokenError(`Failed to save token`, e);
  }
}
function loadToken(projectId) {
  try {
    const dir = (0, import_token_io.getUserDataDir)();
    if (!dir) {
      return null;
    }
    const tokenPath = path.join(dir, "com.vercel.token", `${projectId}.json`);
    if (!fs.existsSync(tokenPath)) {
      return null;
    }
    const token = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
    assertVercelOidcTokenResponse(token);
    return token;
  } catch (e) {
    throw new import_token_error.VercelOidcTokenError(`Failed to load token`, e);
  }
}
function getTokenPayload(token) {
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    throw new import_token_error.VercelOidcTokenError("Invalid token");
  }
  const base64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + (4 - base64.length % 4) % 4,
    "="
  );
  return JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
}
const TIME_15_MINUTES_IN_MS = 15 * 60 * 1e3;
function isExpired(token) {
  return token.exp * 1e3 < Date.now() + TIME_15_MINUTES_IN_MS;
}

var tokenUtil$1 = /*@__PURE__*/getDefaultExportFromCjs(tokenUtil);

var tokenUtil$2 = /*#__PURE__*/_mergeNamespaces({
  __proto__: null,
  default: tokenUtil$1
}, [tokenUtil]);

export { tokenUtil as a, tokenUtil$2 as t };

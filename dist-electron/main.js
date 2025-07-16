var jd = Object.defineProperty;
var Bd = (e, t, r) => t in e ? jd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var W = (e, t, r) => Bd(e, typeof t != "symbol" ? t + "" : t, r);
import pt, { dialog as Pn, app as Ln, BrowserWindow as In, ipcMain as yr, Menu as qd } from "electron";
import { fileURLToPath as Hd } from "node:url";
import Xe from "node:path";
import Gd from "node:fs";
import xe from "fs";
import Wd from "constants";
import Wr from "stream";
import Xn from "util";
import Ec from "assert";
import Q from "path";
import Vr from "child_process";
import Jn from "events";
import zr from "crypto";
import vc from "tty";
import wt from "os";
import ar from "url";
import Vd from "string_decoder";
import wc from "zlib";
import _c from "http";
import zd from "https";
var Te = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Yd(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Be = {}, Ut = {}, Oe = {};
Oe.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((r, n) => {
        t.push((i, o) => i != null ? n(i) : r(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
Oe.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const r = t[t.length - 1];
    if (typeof r != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((n) => r(null, n), r);
  }, "name", { value: e.name });
};
var lt = Wd, Xd = process.cwd, Rn = null, Jd = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Rn || (Rn = Xd.call(process)), Rn;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var Vs = process.chdir;
  process.chdir = function(e) {
    Rn = null, Vs.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, Vs);
}
var Kd = Qd;
function Qd(e) {
  lt.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = s(e.chownSync), e.fchownSync = s(e.fchownSync), e.lchownSync = s(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = a(e.stat), e.fstat = a(e.fstat), e.lstat = a(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(u, f, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(u, f, h, m) {
    m && process.nextTick(m);
  }, e.lchownSync = function() {
  }), Jd === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(u) {
    function f(h, m, y) {
      var S = Date.now(), v = 0;
      u(h, m, function A(b) {
        if (b && (b.code === "EACCES" || b.code === "EPERM" || b.code === "EBUSY") && Date.now() - S < 6e4) {
          setTimeout(function() {
            e.stat(m, function(D, x) {
              D && D.code === "ENOENT" ? u(h, m, A) : y(b);
            });
          }, v), v < 100 && (v += 10);
          return;
        }
        y && y(b);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, u), f;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(u) {
    function f(h, m, y, S, v, A) {
      var b;
      if (A && typeof A == "function") {
        var D = 0;
        b = function(x, B, q) {
          if (x && x.code === "EAGAIN" && D < 10)
            return D++, u.call(e, h, m, y, S, v, b);
          A.apply(this, arguments);
        };
      }
      return u.call(e, h, m, y, S, v, b);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, u), f;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(u) {
    return function(f, h, m, y, S) {
      for (var v = 0; ; )
        try {
          return u.call(e, f, h, m, y, S);
        } catch (A) {
          if (A.code === "EAGAIN" && v < 10) {
            v++;
            continue;
          }
          throw A;
        }
    };
  }(e.readSync);
  function t(u) {
    u.lchmod = function(f, h, m) {
      u.open(
        f,
        lt.O_WRONLY | lt.O_SYMLINK,
        h,
        function(y, S) {
          if (y) {
            m && m(y);
            return;
          }
          u.fchmod(S, h, function(v) {
            u.close(S, function(A) {
              m && m(v || A);
            });
          });
        }
      );
    }, u.lchmodSync = function(f, h) {
      var m = u.openSync(f, lt.O_WRONLY | lt.O_SYMLINK, h), y = !0, S;
      try {
        S = u.fchmodSync(m, h), y = !1;
      } finally {
        if (y)
          try {
            u.closeSync(m);
          } catch {
          }
        else
          u.closeSync(m);
      }
      return S;
    };
  }
  function r(u) {
    lt.hasOwnProperty("O_SYMLINK") && u.futimes ? (u.lutimes = function(f, h, m, y) {
      u.open(f, lt.O_SYMLINK, function(S, v) {
        if (S) {
          y && y(S);
          return;
        }
        u.futimes(v, h, m, function(A) {
          u.close(v, function(b) {
            y && y(A || b);
          });
        });
      });
    }, u.lutimesSync = function(f, h, m) {
      var y = u.openSync(f, lt.O_SYMLINK), S, v = !0;
      try {
        S = u.futimesSync(y, h, m), v = !1;
      } finally {
        if (v)
          try {
            u.closeSync(y);
          } catch {
          }
        else
          u.closeSync(y);
      }
      return S;
    }) : u.futimes && (u.lutimes = function(f, h, m, y) {
      y && process.nextTick(y);
    }, u.lutimesSync = function() {
    });
  }
  function n(u) {
    return u && function(f, h, m) {
      return u.call(e, f, h, function(y) {
        c(y) && (y = null), m && m.apply(this, arguments);
      });
    };
  }
  function i(u) {
    return u && function(f, h) {
      try {
        return u.call(e, f, h);
      } catch (m) {
        if (!c(m)) throw m;
      }
    };
  }
  function o(u) {
    return u && function(f, h, m, y) {
      return u.call(e, f, h, m, function(S) {
        c(S) && (S = null), y && y.apply(this, arguments);
      });
    };
  }
  function s(u) {
    return u && function(f, h, m) {
      try {
        return u.call(e, f, h, m);
      } catch (y) {
        if (!c(y)) throw y;
      }
    };
  }
  function a(u) {
    return u && function(f, h, m) {
      typeof h == "function" && (m = h, h = null);
      function y(S, v) {
        v && (v.uid < 0 && (v.uid += 4294967296), v.gid < 0 && (v.gid += 4294967296)), m && m.apply(this, arguments);
      }
      return h ? u.call(e, f, h, y) : u.call(e, f, y);
    };
  }
  function l(u) {
    return u && function(f, h) {
      var m = h ? u.call(e, f, h) : u.call(e, f);
      return m && (m.uid < 0 && (m.uid += 4294967296), m.gid < 0 && (m.gid += 4294967296)), m;
    };
  }
  function c(u) {
    if (!u || u.code === "ENOSYS")
      return !0;
    var f = !process.getuid || process.getuid() !== 0;
    return !!(f && (u.code === "EINVAL" || u.code === "EPERM"));
  }
}
var zs = Wr.Stream, Zd = eh;
function eh(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    zs.call(this);
    var o = this;
    this.path = n, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var s = Object.keys(i), a = 0, l = s.length; a < l; a++) {
      var c = s[a];
      this[c] = i[c];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        o._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(u, f) {
      if (u) {
        o.emit("error", u), o.readable = !1;
        return;
      }
      o.fd = f, o.emit("open", f), o._read();
    });
  }
  function r(n, i) {
    if (!(this instanceof r)) return new r(n, i);
    zs.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var o = Object.keys(i), s = 0, a = o.length; s < a; s++) {
      var l = o[s];
      this[l] = i[l];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var th = nh, rh = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function nh(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: rh(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var oe = xe, ih = Kd, oh = Zd, sh = th, mn = Xn, Ee, Un;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (Ee = Symbol.for("graceful-fs.queue"), Un = Symbol.for("graceful-fs.previous")) : (Ee = "___graceful-fs.queue", Un = "___graceful-fs.previous");
function ah() {
}
function Sc(e, t) {
  Object.defineProperty(e, Ee, {
    get: function() {
      return t;
    }
  });
}
var Ft = ah;
mn.debuglog ? Ft = mn.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Ft = function() {
  var e = mn.format.apply(mn, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!oe[Ee]) {
  var lh = Te[Ee] || [];
  Sc(oe, lh), oe.close = function(e) {
    function t(r, n) {
      return e.call(oe, r, function(i) {
        i || Ys(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Un, {
      value: e
    }), t;
  }(oe.close), oe.closeSync = function(e) {
    function t(r) {
      e.apply(oe, arguments), Ys();
    }
    return Object.defineProperty(t, Un, {
      value: e
    }), t;
  }(oe.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Ft(oe[Ee]), Ec.equal(oe[Ee].length, 0);
  });
}
Te[Ee] || Sc(Te, oe[Ee]);
var Pe = Ko(sh(oe));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !oe.__patched && (Pe = Ko(oe), oe.__patched = !0);
function Ko(e) {
  ih(e), e.gracefulify = Ko, e.createReadStream = B, e.createWriteStream = q;
  var t = e.readFile;
  e.readFile = r;
  function r(E, z, H) {
    return typeof z == "function" && (H = z, z = null), M(E, z, H);
    function M(Z, P, $, R) {
      return t(Z, P, function(C) {
        C && (C.code === "EMFILE" || C.code === "ENFILE") ? qt([M, [Z, P, $], C, R || Date.now(), Date.now()]) : typeof $ == "function" && $.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(E, z, H, M) {
    return typeof H == "function" && (M = H, H = null), Z(E, z, H, M);
    function Z(P, $, R, C, N) {
      return n(P, $, R, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? qt([Z, [P, $, R, C], I, N || Date.now(), Date.now()]) : typeof C == "function" && C.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = s);
  function s(E, z, H, M) {
    return typeof H == "function" && (M = H, H = null), Z(E, z, H, M);
    function Z(P, $, R, C, N) {
      return o(P, $, R, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? qt([Z, [P, $, R, C], I, N || Date.now(), Date.now()]) : typeof C == "function" && C.apply(this, arguments);
      });
    }
  }
  var a = e.copyFile;
  a && (e.copyFile = l);
  function l(E, z, H, M) {
    return typeof H == "function" && (M = H, H = 0), Z(E, z, H, M);
    function Z(P, $, R, C, N) {
      return a(P, $, R, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? qt([Z, [P, $, R, C], I, N || Date.now(), Date.now()]) : typeof C == "function" && C.apply(this, arguments);
      });
    }
  }
  var c = e.readdir;
  e.readdir = f;
  var u = /^v[0-5]\./;
  function f(E, z, H) {
    typeof z == "function" && (H = z, z = null);
    var M = u.test(process.version) ? function($, R, C, N) {
      return c($, Z(
        $,
        R,
        C,
        N
      ));
    } : function($, R, C, N) {
      return c($, R, Z(
        $,
        R,
        C,
        N
      ));
    };
    return M(E, z, H);
    function Z(P, $, R, C) {
      return function(N, I) {
        N && (N.code === "EMFILE" || N.code === "ENFILE") ? qt([
          M,
          [P, $, R],
          N,
          C || Date.now(),
          Date.now()
        ]) : (I && I.sort && I.sort(), typeof R == "function" && R.call(this, N, I));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var h = oh(e);
    A = h.ReadStream, D = h.WriteStream;
  }
  var m = e.ReadStream;
  m && (A.prototype = Object.create(m.prototype), A.prototype.open = b);
  var y = e.WriteStream;
  y && (D.prototype = Object.create(y.prototype), D.prototype.open = x), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return A;
    },
    set: function(E) {
      A = E;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return D;
    },
    set: function(E) {
      D = E;
    },
    enumerable: !0,
    configurable: !0
  });
  var S = A;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return S;
    },
    set: function(E) {
      S = E;
    },
    enumerable: !0,
    configurable: !0
  });
  var v = D;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return v;
    },
    set: function(E) {
      v = E;
    },
    enumerable: !0,
    configurable: !0
  });
  function A(E, z) {
    return this instanceof A ? (m.apply(this, arguments), this) : A.apply(Object.create(A.prototype), arguments);
  }
  function b() {
    var E = this;
    le(E.path, E.flags, E.mode, function(z, H) {
      z ? (E.autoClose && E.destroy(), E.emit("error", z)) : (E.fd = H, E.emit("open", H), E.read());
    });
  }
  function D(E, z) {
    return this instanceof D ? (y.apply(this, arguments), this) : D.apply(Object.create(D.prototype), arguments);
  }
  function x() {
    var E = this;
    le(E.path, E.flags, E.mode, function(z, H) {
      z ? (E.destroy(), E.emit("error", z)) : (E.fd = H, E.emit("open", H));
    });
  }
  function B(E, z) {
    return new e.ReadStream(E, z);
  }
  function q(E, z) {
    return new e.WriteStream(E, z);
  }
  var j = e.open;
  e.open = le;
  function le(E, z, H, M) {
    return typeof H == "function" && (M = H, H = null), Z(E, z, H, M);
    function Z(P, $, R, C, N) {
      return j(P, $, R, function(I, k) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? qt([Z, [P, $, R, C], I, N || Date.now(), Date.now()]) : typeof C == "function" && C.apply(this, arguments);
      });
    }
  }
  return e;
}
function qt(e) {
  Ft("ENQUEUE", e[0].name, e[1]), oe[Ee].push(e), Qo();
}
var gn;
function Ys() {
  for (var e = Date.now(), t = 0; t < oe[Ee].length; ++t)
    oe[Ee][t].length > 2 && (oe[Ee][t][3] = e, oe[Ee][t][4] = e);
  Qo();
}
function Qo() {
  if (clearTimeout(gn), gn = void 0, oe[Ee].length !== 0) {
    var e = oe[Ee].shift(), t = e[0], r = e[1], n = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Ft("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      Ft("TIMEOUT", t.name, r);
      var s = r.pop();
      typeof s == "function" && s.call(null, n);
    } else {
      var a = Date.now() - o, l = Math.max(o - i, 1), c = Math.min(l * 1.2, 100);
      a >= c ? (Ft("RETRY", t.name, r), t.apply(null, r.concat([i]))) : oe[Ee].push(e);
    }
    gn === void 0 && (gn = setTimeout(Qo, 0));
  }
}
(function(e) {
  const t = Oe.fromCallback, r = Pe, n = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof r[i] == "function");
  Object.assign(e, r), n.forEach((i) => {
    e[i] = t(r[i]);
  }), e.exists = function(i, o) {
    return typeof o == "function" ? r.exists(i, o) : new Promise((s) => r.exists(i, s));
  }, e.read = function(i, o, s, a, l, c) {
    return typeof c == "function" ? r.read(i, o, s, a, l, c) : new Promise((u, f) => {
      r.read(i, o, s, a, l, (h, m, y) => {
        if (h) return f(h);
        u({ bytesRead: m, buffer: y });
      });
    });
  }, e.write = function(i, o, ...s) {
    return typeof s[s.length - 1] == "function" ? r.write(i, o, ...s) : new Promise((a, l) => {
      r.write(i, o, ...s, (c, u, f) => {
        if (c) return l(c);
        a({ bytesWritten: u, buffer: f });
      });
    });
  }, typeof r.writev == "function" && (e.writev = function(i, o, ...s) {
    return typeof s[s.length - 1] == "function" ? r.writev(i, o, ...s) : new Promise((a, l) => {
      r.writev(i, o, ...s, (c, u, f) => {
        if (c) return l(c);
        a({ bytesWritten: u, buffers: f });
      });
    });
  }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(Ut);
var Zo = {}, Ac = {};
const ch = Q;
Ac.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(ch.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const bc = Ut, { checkPath: Tc } = Ac, Cc = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
Zo.makeDir = async (e, t) => (Tc(e), bc.mkdir(e, {
  mode: Cc(t),
  recursive: !0
}));
Zo.makeDirSync = (e, t) => (Tc(e), bc.mkdirSync(e, {
  mode: Cc(t),
  recursive: !0
}));
const uh = Oe.fromPromise, { makeDir: fh, makeDirSync: Oi } = Zo, Pi = uh(fh);
var Ke = {
  mkdirs: Pi,
  mkdirsSync: Oi,
  // alias
  mkdirp: Pi,
  mkdirpSync: Oi,
  ensureDir: Pi,
  ensureDirSync: Oi
};
const dh = Oe.fromPromise, $c = Ut;
function hh(e) {
  return $c.access(e).then(() => !0).catch(() => !1);
}
var kt = {
  pathExists: dh(hh),
  pathExistsSync: $c.existsSync
};
const tr = Pe;
function ph(e, t, r, n) {
  tr.open(e, "r+", (i, o) => {
    if (i) return n(i);
    tr.futimes(o, t, r, (s) => {
      tr.close(o, (a) => {
        n && n(s || a);
      });
    });
  });
}
function mh(e, t, r) {
  const n = tr.openSync(e, "r+");
  return tr.futimesSync(n, t, r), tr.closeSync(n);
}
var Oc = {
  utimesMillis: ph,
  utimesMillisSync: mh
};
const nr = Ut, pe = Q, gh = Xn;
function yh(e, t, r) {
  const n = r.dereference ? (i) => nr.stat(i, { bigint: !0 }) : (i) => nr.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function Eh(e, t, r) {
  let n;
  const i = r.dereference ? (s) => nr.statSync(s, { bigint: !0 }) : (s) => nr.lstatSync(s, { bigint: !0 }), o = i(e);
  try {
    n = i(t);
  } catch (s) {
    if (s.code === "ENOENT") return { srcStat: o, destStat: null };
    throw s;
  }
  return { srcStat: o, destStat: n };
}
function vh(e, t, r, n, i) {
  gh.callbackify(yh)(e, t, n, (o, s) => {
    if (o) return i(o);
    const { srcStat: a, destStat: l } = s;
    if (l) {
      if (Yr(a, l)) {
        const c = pe.basename(e), u = pe.basename(t);
        return r === "move" && c !== u && c.toLowerCase() === u.toLowerCase() ? i(null, { srcStat: a, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (a.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!a.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return a.isDirectory() && es(e, t) ? i(new Error(Kn(e, t, r))) : i(null, { srcStat: a, destStat: l });
  });
}
function wh(e, t, r, n) {
  const { srcStat: i, destStat: o } = Eh(e, t, n);
  if (o) {
    if (Yr(i, o)) {
      const s = pe.basename(e), a = pe.basename(t);
      if (r === "move" && s !== a && s.toLowerCase() === a.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && es(e, t))
    throw new Error(Kn(e, t, r));
  return { srcStat: i, destStat: o };
}
function Pc(e, t, r, n, i) {
  const o = pe.resolve(pe.dirname(e)), s = pe.resolve(pe.dirname(r));
  if (s === o || s === pe.parse(s).root) return i();
  nr.stat(s, { bigint: !0 }, (a, l) => a ? a.code === "ENOENT" ? i() : i(a) : Yr(t, l) ? i(new Error(Kn(e, r, n))) : Pc(e, t, s, n, i));
}
function Ic(e, t, r, n) {
  const i = pe.resolve(pe.dirname(e)), o = pe.resolve(pe.dirname(r));
  if (o === i || o === pe.parse(o).root) return;
  let s;
  try {
    s = nr.statSync(o, { bigint: !0 });
  } catch (a) {
    if (a.code === "ENOENT") return;
    throw a;
  }
  if (Yr(t, s))
    throw new Error(Kn(e, r, n));
  return Ic(e, t, o, n);
}
function Yr(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function es(e, t) {
  const r = pe.resolve(e).split(pe.sep).filter((i) => i), n = pe.resolve(t).split(pe.sep).filter((i) => i);
  return r.reduce((i, o, s) => i && n[s] === o, !0);
}
function Kn(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var lr = {
  checkPaths: vh,
  checkPathsSync: wh,
  checkParentPaths: Pc,
  checkParentPathsSync: Ic,
  isSrcSubdir: es,
  areIdentical: Yr
};
const De = Pe, Ir = Q, _h = Ke.mkdirs, Sh = kt.pathExists, Ah = Oc.utimesMillis, Rr = lr;
function bh(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Rr.checkPaths(e, t, "copy", r, (i, o) => {
    if (i) return n(i);
    const { srcStat: s, destStat: a } = o;
    Rr.checkParentPaths(e, s, t, "copy", (l) => l ? n(l) : r.filter ? Rc(Xs, a, e, t, r, n) : Xs(a, e, t, r, n));
  });
}
function Xs(e, t, r, n, i) {
  const o = Ir.dirname(r);
  Sh(o, (s, a) => {
    if (s) return i(s);
    if (a) return kn(e, t, r, n, i);
    _h(o, (l) => l ? i(l) : kn(e, t, r, n, i));
  });
}
function Rc(e, t, r, n, i, o) {
  Promise.resolve(i.filter(r, n)).then((s) => s ? e(t, r, n, i, o) : o(), (s) => o(s));
}
function Th(e, t, r, n, i) {
  return n.filter ? Rc(kn, e, t, r, n, i) : kn(e, t, r, n, i);
}
function kn(e, t, r, n, i) {
  (n.dereference ? De.stat : De.lstat)(t, (s, a) => s ? i(s) : a.isDirectory() ? Dh(a, e, t, r, n, i) : a.isFile() || a.isCharacterDevice() || a.isBlockDevice() ? Ch(a, e, t, r, n, i) : a.isSymbolicLink() ? xh(e, t, r, n, i) : a.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : a.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function Ch(e, t, r, n, i, o) {
  return t ? $h(e, r, n, i, o) : Dc(e, r, n, i, o);
}
function $h(e, t, r, n, i) {
  if (n.overwrite)
    De.unlink(r, (o) => o ? i(o) : Dc(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function Dc(e, t, r, n, i) {
  De.copyFile(t, r, (o) => o ? i(o) : n.preserveTimestamps ? Oh(e.mode, t, r, i) : Qn(r, e.mode, i));
}
function Oh(e, t, r, n) {
  return Ph(e) ? Ih(r, e, (i) => i ? n(i) : Js(e, t, r, n)) : Js(e, t, r, n);
}
function Ph(e) {
  return (e & 128) === 0;
}
function Ih(e, t, r) {
  return Qn(e, t | 128, r);
}
function Js(e, t, r, n) {
  Rh(t, r, (i) => i ? n(i) : Qn(r, e, n));
}
function Qn(e, t, r) {
  return De.chmod(e, t, r);
}
function Rh(e, t, r) {
  De.stat(e, (n, i) => n ? r(n) : Ah(t, i.atime, i.mtime, r));
}
function Dh(e, t, r, n, i, o) {
  return t ? Nc(r, n, i, o) : Nh(e.mode, r, n, i, o);
}
function Nh(e, t, r, n, i) {
  De.mkdir(r, (o) => {
    if (o) return i(o);
    Nc(t, r, n, (s) => s ? i(s) : Qn(r, e, i));
  });
}
function Nc(e, t, r, n) {
  De.readdir(e, (i, o) => i ? n(i) : Fc(o, e, t, r, n));
}
function Fc(e, t, r, n, i) {
  const o = e.pop();
  return o ? Fh(e, o, t, r, n, i) : i();
}
function Fh(e, t, r, n, i, o) {
  const s = Ir.join(r, t), a = Ir.join(n, t);
  Rr.checkPaths(s, a, "copy", i, (l, c) => {
    if (l) return o(l);
    const { destStat: u } = c;
    Th(u, s, a, i, (f) => f ? o(f) : Fc(e, r, n, i, o));
  });
}
function xh(e, t, r, n, i) {
  De.readlink(t, (o, s) => {
    if (o) return i(o);
    if (n.dereference && (s = Ir.resolve(process.cwd(), s)), e)
      De.readlink(r, (a, l) => a ? a.code === "EINVAL" || a.code === "UNKNOWN" ? De.symlink(s, r, i) : i(a) : (n.dereference && (l = Ir.resolve(process.cwd(), l)), Rr.isSrcSubdir(s, l) ? i(new Error(`Cannot copy '${s}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && Rr.isSrcSubdir(l, s) ? i(new Error(`Cannot overwrite '${l}' with '${s}'.`)) : Lh(s, r, i)));
    else
      return De.symlink(s, r, i);
  });
}
function Lh(e, t, r) {
  De.unlink(t, (n) => n ? r(n) : De.symlink(e, t, r));
}
var Uh = bh;
const Se = Pe, Dr = Q, kh = Ke.mkdirsSync, Mh = Oc.utimesMillisSync, Nr = lr;
function jh(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = Nr.checkPathsSync(e, t, "copy", r);
  return Nr.checkParentPathsSync(e, n, t, "copy"), Bh(i, e, t, r);
}
function Bh(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = Dr.dirname(r);
  return Se.existsSync(i) || kh(i), xc(e, t, r, n);
}
function qh(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return xc(e, t, r, n);
}
function xc(e, t, r, n) {
  const o = (n.dereference ? Se.statSync : Se.lstatSync)(t);
  if (o.isDirectory()) return Xh(o, e, t, r, n);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return Hh(o, e, t, r, n);
  if (o.isSymbolicLink()) return Qh(e, t, r, n);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function Hh(e, t, r, n, i) {
  return t ? Gh(e, r, n, i) : Lc(e, r, n, i);
}
function Gh(e, t, r, n) {
  if (n.overwrite)
    return Se.unlinkSync(r), Lc(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function Lc(e, t, r, n) {
  return Se.copyFileSync(t, r), n.preserveTimestamps && Wh(e.mode, t, r), ts(r, e.mode);
}
function Wh(e, t, r) {
  return Vh(e) && zh(r, e), Yh(t, r);
}
function Vh(e) {
  return (e & 128) === 0;
}
function zh(e, t) {
  return ts(e, t | 128);
}
function ts(e, t) {
  return Se.chmodSync(e, t);
}
function Yh(e, t) {
  const r = Se.statSync(e);
  return Mh(t, r.atime, r.mtime);
}
function Xh(e, t, r, n, i) {
  return t ? Uc(r, n, i) : Jh(e.mode, r, n, i);
}
function Jh(e, t, r, n) {
  return Se.mkdirSync(r), Uc(t, r, n), ts(r, e);
}
function Uc(e, t, r) {
  Se.readdirSync(e).forEach((n) => Kh(n, e, t, r));
}
function Kh(e, t, r, n) {
  const i = Dr.join(t, e), o = Dr.join(r, e), { destStat: s } = Nr.checkPathsSync(i, o, "copy", n);
  return qh(s, i, o, n);
}
function Qh(e, t, r, n) {
  let i = Se.readlinkSync(t);
  if (n.dereference && (i = Dr.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = Se.readlinkSync(r);
    } catch (s) {
      if (s.code === "EINVAL" || s.code === "UNKNOWN") return Se.symlinkSync(i, r);
      throw s;
    }
    if (n.dereference && (o = Dr.resolve(process.cwd(), o)), Nr.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (Se.statSync(r).isDirectory() && Nr.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return Zh(i, r);
  } else
    return Se.symlinkSync(i, r);
}
function Zh(e, t) {
  return Se.unlinkSync(t), Se.symlinkSync(e, t);
}
var ep = jh;
const tp = Oe.fromCallback;
var rs = {
  copy: tp(Uh),
  copySync: ep
};
const Ks = Pe, kc = Q, te = Ec, Fr = process.platform === "win32";
function Mc(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || Ks[r], r = r + "Sync", e[r] = e[r] || Ks[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function ns(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), te(e, "rimraf: missing path"), te.strictEqual(typeof e, "string", "rimraf: path should be a string"), te.strictEqual(typeof r, "function", "rimraf: callback function required"), te(t, "rimraf: invalid options argument provided"), te.strictEqual(typeof t, "object", "rimraf: options should be object"), Mc(t), Qs(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const s = n * 100;
        return setTimeout(() => Qs(e, t, i), s);
      }
      o.code === "ENOENT" && (o = null);
    }
    r(o);
  });
}
function Qs(e, t, r) {
  te(e), te(t), te(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && Fr)
      return Zs(e, t, n, r);
    if (i && i.isDirectory())
      return Dn(e, t, n, r);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return r(null);
        if (o.code === "EPERM")
          return Fr ? Zs(e, t, o, r) : Dn(e, t, o, r);
        if (o.code === "EISDIR")
          return Dn(e, t, o, r);
      }
      return r(o);
    });
  });
}
function Zs(e, t, r, n) {
  te(e), te(t), te(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (o, s) => {
      o ? n(o.code === "ENOENT" ? null : r) : s.isDirectory() ? Dn(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function ea(e, t, r) {
  let n;
  te(e), te(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  try {
    n = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  n.isDirectory() ? Nn(e, t, r) : t.unlinkSync(e);
}
function Dn(e, t, r, n) {
  te(e), te(t), te(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? rp(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function rp(e, t, r) {
  te(e), te(t), te(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let o = i.length, s;
    if (o === 0) return t.rmdir(e, r);
    i.forEach((a) => {
      ns(kc.join(e, a), t, (l) => {
        if (!s) {
          if (l) return r(s = l);
          --o === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function jc(e, t) {
  let r;
  t = t || {}, Mc(t), te(e, "rimraf: missing path"), te.strictEqual(typeof e, "string", "rimraf: path should be a string"), te(t, "rimraf: missing options"), te.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && Fr && ea(e, t, n);
  }
  try {
    r && r.isDirectory() ? Nn(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return Fr ? ea(e, t, n) : Nn(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    Nn(e, t, n);
  }
}
function Nn(e, t, r) {
  te(e), te(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      np(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function np(e, t) {
  if (te(e), te(t), t.readdirSync(e).forEach((r) => jc(kc.join(e, r), t)), Fr) {
    const r = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - r < 500);
  } else
    return t.rmdirSync(e, t);
}
var ip = ns;
ns.sync = jc;
const Mn = Pe, op = Oe.fromCallback, Bc = ip;
function sp(e, t) {
  if (Mn.rm) return Mn.rm(e, { recursive: !0, force: !0 }, t);
  Bc(e, t);
}
function ap(e) {
  if (Mn.rmSync) return Mn.rmSync(e, { recursive: !0, force: !0 });
  Bc.sync(e);
}
var Zn = {
  remove: op(sp),
  removeSync: ap
};
const lp = Oe.fromPromise, qc = Ut, Hc = Q, Gc = Ke, Wc = Zn, ta = lp(async function(t) {
  let r;
  try {
    r = await qc.readdir(t);
  } catch {
    return Gc.mkdirs(t);
  }
  return Promise.all(r.map((n) => Wc.remove(Hc.join(t, n))));
});
function ra(e) {
  let t;
  try {
    t = qc.readdirSync(e);
  } catch {
    return Gc.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = Hc.join(e, r), Wc.removeSync(r);
  });
}
var cp = {
  emptyDirSync: ra,
  emptydirSync: ra,
  emptyDir: ta,
  emptydir: ta
};
const up = Oe.fromCallback, Vc = Q, ft = Pe, zc = Ke;
function fp(e, t) {
  function r() {
    ft.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  ft.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const o = Vc.dirname(e);
    ft.stat(o, (s, a) => {
      if (s)
        return s.code === "ENOENT" ? zc.mkdirs(o, (l) => {
          if (l) return t(l);
          r();
        }) : t(s);
      a.isDirectory() ? r() : ft.readdir(o, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function dp(e) {
  let t;
  try {
    t = ft.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = Vc.dirname(e);
  try {
    ft.statSync(r).isDirectory() || ft.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") zc.mkdirsSync(r);
    else throw n;
  }
  ft.writeFileSync(e, "");
}
var hp = {
  createFile: up(fp),
  createFileSync: dp
};
const pp = Oe.fromCallback, Yc = Q, ut = Pe, Xc = Ke, mp = kt.pathExists, { areIdentical: Jc } = lr;
function gp(e, t, r) {
  function n(i, o) {
    ut.link(i, o, (s) => {
      if (s) return r(s);
      r(null);
    });
  }
  ut.lstat(t, (i, o) => {
    ut.lstat(e, (s, a) => {
      if (s)
        return s.message = s.message.replace("lstat", "ensureLink"), r(s);
      if (o && Jc(a, o)) return r(null);
      const l = Yc.dirname(t);
      mp(l, (c, u) => {
        if (c) return r(c);
        if (u) return n(e, t);
        Xc.mkdirs(l, (f) => {
          if (f) return r(f);
          n(e, t);
        });
      });
    });
  });
}
function yp(e, t) {
  let r;
  try {
    r = ut.lstatSync(t);
  } catch {
  }
  try {
    const o = ut.lstatSync(e);
    if (r && Jc(o, r)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const n = Yc.dirname(t);
  return ut.existsSync(n) || Xc.mkdirsSync(n), ut.linkSync(e, t);
}
var Ep = {
  createLink: pp(gp),
  createLinkSync: yp
};
const dt = Q, Cr = Pe, vp = kt.pathExists;
function wp(e, t, r) {
  if (dt.isAbsolute(e))
    return Cr.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = dt.dirname(t), i = dt.join(n, e);
    return vp(i, (o, s) => o ? r(o) : s ? r(null, {
      toCwd: i,
      toDst: e
    }) : Cr.lstat(e, (a) => a ? (a.message = a.message.replace("lstat", "ensureSymlink"), r(a)) : r(null, {
      toCwd: e,
      toDst: dt.relative(n, e)
    })));
  }
}
function _p(e, t) {
  let r;
  if (dt.isAbsolute(e)) {
    if (r = Cr.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = dt.dirname(t), i = dt.join(n, e);
    if (r = Cr.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = Cr.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: dt.relative(n, e)
    };
  }
}
var Sp = {
  symlinkPaths: wp,
  symlinkPathsSync: _p
};
const Kc = Pe;
function Ap(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  Kc.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function bp(e, t) {
  let r;
  if (t) return t;
  try {
    r = Kc.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var Tp = {
  symlinkType: Ap,
  symlinkTypeSync: bp
};
const Cp = Oe.fromCallback, Qc = Q, qe = Ut, Zc = Ke, $p = Zc.mkdirs, Op = Zc.mkdirsSync, eu = Sp, Pp = eu.symlinkPaths, Ip = eu.symlinkPathsSync, tu = Tp, Rp = tu.symlinkType, Dp = tu.symlinkTypeSync, Np = kt.pathExists, { areIdentical: ru } = lr;
function Fp(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, qe.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      qe.stat(e),
      qe.stat(t)
    ]).then(([s, a]) => {
      if (ru(s, a)) return n(null);
      na(e, t, r, n);
    }) : na(e, t, r, n);
  });
}
function na(e, t, r, n) {
  Pp(e, t, (i, o) => {
    if (i) return n(i);
    e = o.toDst, Rp(o.toCwd, r, (s, a) => {
      if (s) return n(s);
      const l = Qc.dirname(t);
      Np(l, (c, u) => {
        if (c) return n(c);
        if (u) return qe.symlink(e, t, a, n);
        $p(l, (f) => {
          if (f) return n(f);
          qe.symlink(e, t, a, n);
        });
      });
    });
  });
}
function xp(e, t, r) {
  let n;
  try {
    n = qe.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const a = qe.statSync(e), l = qe.statSync(t);
    if (ru(a, l)) return;
  }
  const i = Ip(e, t);
  e = i.toDst, r = Dp(i.toCwd, r);
  const o = Qc.dirname(t);
  return qe.existsSync(o) || Op(o), qe.symlinkSync(e, t, r);
}
var Lp = {
  createSymlink: Cp(Fp),
  createSymlinkSync: xp
};
const { createFile: ia, createFileSync: oa } = hp, { createLink: sa, createLinkSync: aa } = Ep, { createSymlink: la, createSymlinkSync: ca } = Lp;
var Up = {
  // file
  createFile: ia,
  createFileSync: oa,
  ensureFile: ia,
  ensureFileSync: oa,
  // link
  createLink: sa,
  createLinkSync: aa,
  ensureLink: sa,
  ensureLinkSync: aa,
  // symlink
  createSymlink: la,
  createSymlinkSync: ca,
  ensureSymlink: la,
  ensureSymlinkSync: ca
};
function kp(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const o = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + o;
}
function Mp(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var is = { stringify: kp, stripBom: Mp };
let ir;
try {
  ir = Pe;
} catch {
  ir = xe;
}
const ei = Oe, { stringify: nu, stripBom: iu } = is;
async function jp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || ir, n = "throws" in t ? t.throws : !0;
  let i = await ei.fromCallback(r.readFile)(e, t);
  i = iu(i);
  let o;
  try {
    o = JSON.parse(i, t ? t.reviver : null);
  } catch (s) {
    if (n)
      throw s.message = `${e}: ${s.message}`, s;
    return null;
  }
  return o;
}
const Bp = ei.fromPromise(jp);
function qp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || ir, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = iu(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function Hp(e, t, r = {}) {
  const n = r.fs || ir, i = nu(t, r);
  await ei.fromCallback(n.writeFile)(e, i, r);
}
const Gp = ei.fromPromise(Hp);
function Wp(e, t, r = {}) {
  const n = r.fs || ir, i = nu(t, r);
  return n.writeFileSync(e, i, r);
}
const Vp = {
  readFile: Bp,
  readFileSync: qp,
  writeFile: Gp,
  writeFileSync: Wp
};
var zp = Vp;
const yn = zp;
var Yp = {
  // jsonfile exports
  readJson: yn.readFile,
  readJsonSync: yn.readFileSync,
  writeJson: yn.writeFile,
  writeJsonSync: yn.writeFileSync
};
const Xp = Oe.fromCallback, $r = Pe, ou = Q, su = Ke, Jp = kt.pathExists;
function Kp(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = ou.dirname(e);
  Jp(i, (o, s) => {
    if (o) return n(o);
    if (s) return $r.writeFile(e, t, r, n);
    su.mkdirs(i, (a) => {
      if (a) return n(a);
      $r.writeFile(e, t, r, n);
    });
  });
}
function Qp(e, ...t) {
  const r = ou.dirname(e);
  if ($r.existsSync(r))
    return $r.writeFileSync(e, ...t);
  su.mkdirsSync(r), $r.writeFileSync(e, ...t);
}
var os = {
  outputFile: Xp(Kp),
  outputFileSync: Qp
};
const { stringify: Zp } = is, { outputFile: em } = os;
async function tm(e, t, r = {}) {
  const n = Zp(t, r);
  await em(e, n, r);
}
var rm = tm;
const { stringify: nm } = is, { outputFileSync: im } = os;
function om(e, t, r) {
  const n = nm(t, r);
  im(e, n, r);
}
var sm = om;
const am = Oe.fromPromise, $e = Yp;
$e.outputJson = am(rm);
$e.outputJsonSync = sm;
$e.outputJSON = $e.outputJson;
$e.outputJSONSync = $e.outputJsonSync;
$e.writeJSON = $e.writeJson;
$e.writeJSONSync = $e.writeJsonSync;
$e.readJSON = $e.readJson;
$e.readJSONSync = $e.readJsonSync;
var lm = $e;
const cm = Pe, No = Q, um = rs.copy, au = Zn.remove, fm = Ke.mkdirp, dm = kt.pathExists, ua = lr;
function hm(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  ua.checkPaths(e, t, "move", r, (o, s) => {
    if (o) return n(o);
    const { srcStat: a, isChangingCase: l = !1 } = s;
    ua.checkParentPaths(e, a, t, "move", (c) => {
      if (c) return n(c);
      if (pm(t)) return fa(e, t, i, l, n);
      fm(No.dirname(t), (u) => u ? n(u) : fa(e, t, i, l, n));
    });
  });
}
function pm(e) {
  const t = No.dirname(e);
  return No.parse(t).root === t;
}
function fa(e, t, r, n, i) {
  if (n) return Ii(e, t, r, i);
  if (r)
    return au(t, (o) => o ? i(o) : Ii(e, t, r, i));
  dm(t, (o, s) => o ? i(o) : s ? i(new Error("dest already exists.")) : Ii(e, t, r, i));
}
function Ii(e, t, r, n) {
  cm.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : mm(e, t, r, n) : n());
}
function mm(e, t, r, n) {
  um(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (o) => o ? n(o) : au(e, n));
}
var gm = hm;
const lu = Pe, Fo = Q, ym = rs.copySync, cu = Zn.removeSync, Em = Ke.mkdirpSync, da = lr;
function vm(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = da.checkPathsSync(e, t, "move", r);
  return da.checkParentPathsSync(e, i, t, "move"), wm(t) || Em(Fo.dirname(t)), _m(e, t, n, o);
}
function wm(e) {
  const t = Fo.dirname(e);
  return Fo.parse(t).root === t;
}
function _m(e, t, r, n) {
  if (n) return Ri(e, t, r);
  if (r)
    return cu(t), Ri(e, t, r);
  if (lu.existsSync(t)) throw new Error("dest already exists.");
  return Ri(e, t, r);
}
function Ri(e, t, r) {
  try {
    lu.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return Sm(e, t, r);
  }
}
function Sm(e, t, r) {
  return ym(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), cu(e);
}
var Am = vm;
const bm = Oe.fromCallback;
var Tm = {
  move: bm(gm),
  moveSync: Am
}, _t = {
  // Export promiseified graceful-fs:
  ...Ut,
  // Export extra methods:
  ...rs,
  ...cp,
  ...Up,
  ...lm,
  ...Ke,
  ...Tm,
  ...os,
  ...kt,
  ...Zn
}, nt = {}, mt = {}, me = {}, gt = {};
Object.defineProperty(gt, "__esModule", { value: !0 });
gt.CancellationError = gt.CancellationToken = void 0;
const Cm = Jn;
class $m extends Cm.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(t) {
    this.removeParentCancelHandler(), this._parent = t, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(t) {
    super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, t != null && (this.parent = t);
  }
  cancel() {
    this._cancelled = !0, this.emit("cancel");
  }
  onCancel(t) {
    this.cancelled ? t() : this.once("cancel", t);
  }
  createPromise(t) {
    if (this.cancelled)
      return Promise.reject(new xo());
    const r = () => {
      if (n != null)
        try {
          this.removeListener("cancel", n), n = null;
        } catch {
        }
    };
    let n = null;
    return new Promise((i, o) => {
      let s = null;
      if (n = () => {
        try {
          s != null && (s(), s = null);
        } finally {
          o(new xo());
        }
      }, this.cancelled) {
        n();
        return;
      }
      this.onCancel(n), t(i, o, (a) => {
        s = a;
      });
    }).then((i) => (r(), i)).catch((i) => {
      throw r(), i;
    });
  }
  removeParentCancelHandler() {
    const t = this._parent;
    t != null && this.parentCancelHandler != null && (t.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners(), this._parent = null;
    }
  }
}
gt.CancellationToken = $m;
class xo extends Error {
  constructor() {
    super("cancelled");
  }
}
gt.CancellationError = xo;
var cr = {};
Object.defineProperty(cr, "__esModule", { value: !0 });
cr.newError = Om;
function Om(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var Ce = {}, Lo = { exports: {} }, En = { exports: {} }, Di, ha;
function Pm() {
  if (ha) return Di;
  ha = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, o = n * 365.25;
  Di = function(u, f) {
    f = f || {};
    var h = typeof u;
    if (h === "string" && u.length > 0)
      return s(u);
    if (h === "number" && isFinite(u))
      return f.long ? l(u) : a(u);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(u)
    );
  };
  function s(u) {
    if (u = String(u), !(u.length > 100)) {
      var f = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        u
      );
      if (f) {
        var h = parseFloat(f[1]), m = (f[2] || "ms").toLowerCase();
        switch (m) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return h * o;
          case "weeks":
          case "week":
          case "w":
            return h * i;
          case "days":
          case "day":
          case "d":
            return h * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return h * r;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return h * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return h * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return h;
          default:
            return;
        }
      }
    }
  }
  function a(u) {
    var f = Math.abs(u);
    return f >= n ? Math.round(u / n) + "d" : f >= r ? Math.round(u / r) + "h" : f >= t ? Math.round(u / t) + "m" : f >= e ? Math.round(u / e) + "s" : u + "ms";
  }
  function l(u) {
    var f = Math.abs(u);
    return f >= n ? c(u, f, n, "day") : f >= r ? c(u, f, r, "hour") : f >= t ? c(u, f, t, "minute") : f >= e ? c(u, f, e, "second") : u + " ms";
  }
  function c(u, f, h, m) {
    var y = f >= h * 1.5;
    return Math.round(u / h) + " " + m + (y ? "s" : "");
  }
  return Di;
}
var Ni, pa;
function uu() {
  if (pa) return Ni;
  pa = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = c, n.disable = a, n.enable = o, n.enabled = l, n.humanize = Pm(), n.destroy = u, Object.keys(t).forEach((f) => {
      n[f] = t[f];
    }), n.names = [], n.skips = [], n.formatters = {};
    function r(f) {
      let h = 0;
      for (let m = 0; m < f.length; m++)
        h = (h << 5) - h + f.charCodeAt(m), h |= 0;
      return n.colors[Math.abs(h) % n.colors.length];
    }
    n.selectColor = r;
    function n(f) {
      let h, m = null, y, S;
      function v(...A) {
        if (!v.enabled)
          return;
        const b = v, D = Number(/* @__PURE__ */ new Date()), x = D - (h || D);
        b.diff = x, b.prev = h, b.curr = D, h = D, A[0] = n.coerce(A[0]), typeof A[0] != "string" && A.unshift("%O");
        let B = 0;
        A[0] = A[0].replace(/%([a-zA-Z%])/g, (j, le) => {
          if (j === "%%")
            return "%";
          B++;
          const E = n.formatters[le];
          if (typeof E == "function") {
            const z = A[B];
            j = E.call(b, z), A.splice(B, 1), B--;
          }
          return j;
        }), n.formatArgs.call(b, A), (b.log || n.log).apply(b, A);
      }
      return v.namespace = f, v.useColors = n.useColors(), v.color = n.selectColor(f), v.extend = i, v.destroy = n.destroy, Object.defineProperty(v, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => m !== null ? m : (y !== n.namespaces && (y = n.namespaces, S = n.enabled(f)), S),
        set: (A) => {
          m = A;
        }
      }), typeof n.init == "function" && n.init(v), v;
    }
    function i(f, h) {
      const m = n(this.namespace + (typeof h > "u" ? ":" : h) + f);
      return m.log = this.log, m;
    }
    function o(f) {
      n.save(f), n.namespaces = f, n.names = [], n.skips = [];
      const h = (typeof f == "string" ? f : "").trim().replace(" ", ",").split(",").filter(Boolean);
      for (const m of h)
        m[0] === "-" ? n.skips.push(m.slice(1)) : n.names.push(m);
    }
    function s(f, h) {
      let m = 0, y = 0, S = -1, v = 0;
      for (; m < f.length; )
        if (y < h.length && (h[y] === f[m] || h[y] === "*"))
          h[y] === "*" ? (S = y, v = m, y++) : (m++, y++);
        else if (S !== -1)
          y = S + 1, v++, m = v;
        else
          return !1;
      for (; y < h.length && h[y] === "*"; )
        y++;
      return y === h.length;
    }
    function a() {
      const f = [
        ...n.names,
        ...n.skips.map((h) => "-" + h)
      ].join(",");
      return n.enable(""), f;
    }
    function l(f) {
      for (const h of n.skips)
        if (s(f, h))
          return !1;
      for (const h of n.names)
        if (s(f, h))
          return !0;
      return !1;
    }
    function c(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    function u() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return Ni = e, Ni;
}
var ma;
function Im() {
  return ma || (ma = 1, function(e, t) {
    t.formatArgs = n, t.save = i, t.load = o, t.useColors = r, t.storage = s(), t.destroy = /* @__PURE__ */ (() => {
      let l = !1;
      return () => {
        l || (l = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function r() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let l;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (l = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(l[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function n(l) {
      if (l[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + l[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const c = "color: " + this.color;
      l.splice(1, 0, c, "color: inherit");
      let u = 0, f = 0;
      l[0].replace(/%[a-zA-Z%]/g, (h) => {
        h !== "%%" && (u++, h === "%c" && (f = u));
      }), l.splice(f, 0, c);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(l) {
      try {
        l ? t.storage.setItem("debug", l) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function o() {
      let l;
      try {
        l = t.storage.getItem("debug");
      } catch {
      }
      return !l && typeof process < "u" && "env" in process && (l = process.env.DEBUG), l;
    }
    function s() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = uu()(t);
    const { formatters: a } = e.exports;
    a.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (c) {
        return "[UnexpectedJSONParseError]: " + c.message;
      }
    };
  }(En, En.exports)), En.exports;
}
var vn = { exports: {} }, Fi, ga;
function Rm() {
  return ga || (ga = 1, Fi = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), Fi;
}
var xi, ya;
function Dm() {
  if (ya) return xi;
  ya = 1;
  const e = wt, t = vc, r = Rm(), { env: n } = process;
  let i;
  r("no-color") || r("no-colors") || r("color=false") || r("color=never") ? i = 0 : (r("color") || r("colors") || r("color=true") || r("color=always")) && (i = 1), "FORCE_COLOR" in n && (n.FORCE_COLOR === "true" ? i = 1 : n.FORCE_COLOR === "false" ? i = 0 : i = n.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(n.FORCE_COLOR, 10), 3));
  function o(l) {
    return l === 0 ? !1 : {
      level: l,
      hasBasic: !0,
      has256: l >= 2,
      has16m: l >= 3
    };
  }
  function s(l, c) {
    if (i === 0)
      return 0;
    if (r("color=16m") || r("color=full") || r("color=truecolor"))
      return 3;
    if (r("color=256"))
      return 2;
    if (l && !c && i === void 0)
      return 0;
    const u = i || 0;
    if (n.TERM === "dumb")
      return u;
    if (process.platform === "win32") {
      const f = e.release().split(".");
      return Number(f[0]) >= 10 && Number(f[2]) >= 10586 ? Number(f[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in n)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((f) => f in n) || n.CI_NAME === "codeship" ? 1 : u;
    if ("TEAMCITY_VERSION" in n)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(n.TEAMCITY_VERSION) ? 1 : 0;
    if (n.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in n) {
      const f = parseInt((n.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (n.TERM_PROGRAM) {
        case "iTerm.app":
          return f >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : u;
  }
  function a(l) {
    const c = s(l, l && l.isTTY);
    return o(c);
  }
  return xi = {
    supportsColor: a,
    stdout: o(s(!0, t.isatty(1))),
    stderr: o(s(!0, t.isatty(2)))
  }, xi;
}
var Ea;
function Nm() {
  return Ea || (Ea = 1, function(e, t) {
    const r = vc, n = Xn;
    t.init = u, t.log = a, t.formatArgs = o, t.save = l, t.load = c, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = Dm();
      h && (h.stderr || h).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((h) => /^debug_/i.test(h)).reduce((h, m) => {
      const y = m.substring(6).toLowerCase().replace(/_([a-z])/g, (v, A) => A.toUpperCase());
      let S = process.env[m];
      return /^(yes|on|true|enabled)$/i.test(S) ? S = !0 : /^(no|off|false|disabled)$/i.test(S) ? S = !1 : S === "null" ? S = null : S = Number(S), h[y] = S, h;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function o(h) {
      const { namespace: m, useColors: y } = this;
      if (y) {
        const S = this.color, v = "\x1B[3" + (S < 8 ? S : "8;5;" + S), A = `  ${v};1m${m} \x1B[0m`;
        h[0] = A + h[0].split(`
`).join(`
` + A), h.push(v + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        h[0] = s() + m + " " + h[0];
    }
    function s() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function a(...h) {
      return process.stderr.write(n.formatWithOptions(t.inspectOpts, ...h) + `
`);
    }
    function l(h) {
      h ? process.env.DEBUG = h : delete process.env.DEBUG;
    }
    function c() {
      return process.env.DEBUG;
    }
    function u(h) {
      h.inspectOpts = {};
      const m = Object.keys(t.inspectOpts);
      for (let y = 0; y < m.length; y++)
        h.inspectOpts[m[y]] = t.inspectOpts[m[y]];
    }
    e.exports = uu()(t);
    const { formatters: f } = e.exports;
    f.o = function(h) {
      return this.inspectOpts.colors = this.useColors, n.inspect(h, this.inspectOpts).split(`
`).map((m) => m.trim()).join(" ");
    }, f.O = function(h) {
      return this.inspectOpts.colors = this.useColors, n.inspect(h, this.inspectOpts);
    };
  }(vn, vn.exports)), vn.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Lo.exports = Im() : Lo.exports = Nm();
var Fm = Lo.exports, Xr = {};
Object.defineProperty(Xr, "__esModule", { value: !0 });
Xr.ProgressCallbackTransform = void 0;
const xm = Wr;
class Lm extends xm.Transform {
  constructor(t, r, n) {
    super(), this.total = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.total * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, t(null);
  }
}
Xr.ProgressCallbackTransform = Lm;
Object.defineProperty(Ce, "__esModule", { value: !0 });
Ce.DigestTransform = Ce.HttpExecutor = Ce.HttpError = void 0;
Ce.createHttpError = Uo;
Ce.parseJson = Gm;
Ce.configureRequestOptionsFromUrl = du;
Ce.configureRequestUrl = as;
Ce.safeGetHeader = rr;
Ce.configureRequestOptions = Bn;
Ce.safeStringifyJson = qn;
const Um = zr, km = Fm, Mm = xe, jm = Wr, fu = ar, Bm = gt, va = cr, qm = Xr, Er = (0, km.default)("electron-builder");
function Uo(e, t = null) {
  return new ss(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + qn(e.headers), t);
}
const Hm = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class ss extends Error {
  constructor(t, r = `HTTP error: ${Hm.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Ce.HttpError = ss;
function Gm(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class jn {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new Bm.CancellationToken(), n) {
    Bn(t);
    const i = n == null ? void 0 : JSON.stringify(n), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      Er(i);
      const { headers: s, ...a } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": o.length,
          ...s
        },
        ...a
      };
    }
    return this.doApiRequest(t, r, (s) => s.end(o));
  }
  doApiRequest(t, r, n, i = 0) {
    return Er.enabled && Er(`Request: ${qn(t)}`), r.createPromise((o, s, a) => {
      const l = this.createRequest(t, (c) => {
        try {
          this.handleResponse(c, t, r, o, s, i, n);
        } catch (u) {
          s(u);
        }
      });
      this.addErrorAndTimeoutHandlers(l, s, t.timeout), this.addRedirectHandlers(l, t, s, i, (c) => {
        this.doApiRequest(c, r, n, i).then(o).catch(s);
      }), n(l, s), a(() => l.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, r, n, i, o) {
  }
  addErrorAndTimeoutHandlers(t, r, n = 60 * 1e3) {
    this.addTimeOutHandler(t, r, n), t.on("error", r), t.on("aborted", () => {
      r(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, r, n, i, o, s, a) {
    var l;
    if (Er.enabled && Er(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${qn(r)}`), t.statusCode === 404) {
      o(Uo(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const c = (l = t.statusCode) !== null && l !== void 0 ? l : 0, u = c >= 300 && c < 400, f = rr(t, "location");
    if (u && f != null) {
      if (s > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(jn.prepareRedirectUrlOptions(f, r), n, a, s).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let h = "";
    t.on("error", o), t.on("data", (m) => h += m), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const m = rr(t, "content-type"), y = m != null && (Array.isArray(m) ? m.find((S) => S.includes("json")) != null : m.includes("json"));
          o(Uo(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

          Data:
          ${y ? JSON.stringify(JSON.parse(h)) : h}
          `));
        } else
          i(h.length === 0 ? null : h);
      } catch (m) {
        o(m);
      }
    });
  }
  async downloadToBuffer(t, r) {
    return await r.cancellationToken.createPromise((n, i, o) => {
      const s = [], a = {
        headers: r.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      as(t, a), Bn(a), this.doDownload(a, {
        destination: null,
        options: r,
        onCancel: o,
        callback: (l) => {
          l == null ? n(Buffer.concat(s)) : i(l);
        },
        responseHandler: (l, c) => {
          let u = 0;
          l.on("data", (f) => {
            if (u += f.length, u > 524288e3) {
              c(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            s.push(f);
          }), l.on("end", () => {
            c(null);
          });
        }
      }, 0);
    });
  }
  doDownload(t, r, n) {
    const i = this.createRequest(t, (o) => {
      if (o.statusCode >= 400) {
        r.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${o.statusCode}: ${o.statusMessage}`));
        return;
      }
      o.on("error", r.callback);
      const s = rr(o, "location");
      if (s != null) {
        n < this.maxRedirects ? this.doDownload(jn.prepareRedirectUrlOptions(s, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? Vm(r, o) : r.responseHandler(o, r.callback);
    });
    this.addErrorAndTimeoutHandlers(i, r.callback, t.timeout), this.addRedirectHandlers(i, t, r.callback, n, (o) => {
      this.doDownload(o, r, n++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, r, n) {
    t.on("socket", (i) => {
      i.setTimeout(n, () => {
        t.abort(), r(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, r) {
    const n = du(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const o = new fu.URL(t);
      (o.hostname.endsWith(".amazonaws.com") || o.searchParams.has("X-Amz-Credential")) && delete i.authorization;
    }
    return n;
  }
  static retryOnServerError(t, r = 3) {
    for (let n = 0; ; n++)
      try {
        return t();
      } catch (i) {
        if (n < r && (i instanceof ss && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Ce.HttpExecutor = jn;
function du(e, t) {
  const r = Bn(t);
  return as(new fu.URL(e), r), r;
}
function as(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class ko extends jm.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, Um.createHash)(r);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, r, n) {
    this.digester.update(t), n(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (r) {
        t(r);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, va.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, va.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Ce.DigestTransform = ko;
function Wm(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function rr(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function Vm(e, t) {
  if (!Wm(rr(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const s = rr(t, "content-length");
    s != null && r.push(new qm.ProgressCallbackTransform(parseInt(s, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new ko(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new ko(e.options.sha2, "sha256", "hex"));
  const i = (0, Mm.createWriteStream)(e.destination);
  r.push(i);
  let o = t;
  for (const s of r)
    s.on("error", (a) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(a);
    }), o = o.pipe(s);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function Bn(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function qn(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
ti.MemoLazy = void 0;
class zm {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && hu(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
ti.MemoLazy = zm;
function hu(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((s) => hu(e[s], t[s]));
  }
  return e === t;
}
var ri = {};
Object.defineProperty(ri, "__esModule", { value: !0 });
ri.githubUrl = Ym;
ri.getS3LikeProviderBaseUrl = Xm;
function Ym(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function Xm(e) {
  const t = e.provider;
  if (t === "s3")
    return Jm(e);
  if (t === "spaces")
    return Km(e);
  throw new Error(`Not supported provider: ${t}`);
}
function Jm(e) {
  let t;
  if (e.accelerate == !0)
    t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
  else if (e.endpoint != null)
    t = `${e.endpoint}/${e.bucket}`;
  else if (e.bucket.includes(".")) {
    if (e.region == null)
      throw new Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
    e.region === "us-east-1" ? t = `https://s3.amazonaws.com/${e.bucket}` : t = `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
  } else e.region === "cn-north-1" ? t = `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : t = `https://${e.bucket}.s3.amazonaws.com`;
  return pu(t, e.path);
}
function pu(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function Km(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return pu(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var ls = {};
Object.defineProperty(ls, "__esModule", { value: !0 });
ls.retry = mu;
const Qm = gt;
async function mu(e, t, r, n = 0, i = 0, o) {
  var s;
  const a = new Qm.CancellationToken();
  try {
    return await e();
  } catch (l) {
    if ((!((s = o == null ? void 0 : o(l)) !== null && s !== void 0) || s) && t > 0 && !a.cancelled)
      return await new Promise((c) => setTimeout(c, r + n * i)), await mu(e, t - 1, r, n, i + 1, o);
    throw l;
  }
}
var cs = {};
Object.defineProperty(cs, "__esModule", { value: !0 });
cs.parseDn = Zm;
function Zm(e) {
  let t = !1, r = null, n = "", i = 0;
  e = e.trim();
  const o = /* @__PURE__ */ new Map();
  for (let s = 0; s <= e.length; s++) {
    if (s === e.length) {
      r !== null && o.set(r, n);
      break;
    }
    const a = e[s];
    if (t) {
      if (a === '"') {
        t = !1;
        continue;
      }
    } else {
      if (a === '"') {
        t = !0;
        continue;
      }
      if (a === "\\") {
        s++;
        const l = parseInt(e.slice(s, s + 2), 16);
        Number.isNaN(l) ? n += e[s] : (s++, n += String.fromCharCode(l));
        continue;
      }
      if (r === null && a === "=") {
        r = n, n = "";
        continue;
      }
      if (a === "," || a === ";" || a === "+") {
        r !== null && o.set(r, n), r = null, n = "";
        continue;
      }
    }
    if (a === " " && !t) {
      if (n.length === 0)
        continue;
      if (s > i) {
        let l = s;
        for (; e[l] === " "; )
          l++;
        i = l;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || r === null && e[i] === "=" || r !== null && e[i] === "+") {
        s = i - 1;
        continue;
      }
    }
    n += a;
  }
  return o;
}
var or = {};
Object.defineProperty(or, "__esModule", { value: !0 });
or.nil = or.UUID = void 0;
const gu = zr, yu = cr, eg = "options.name must be either a string or a Buffer", wa = (0, gu.randomBytes)(16);
wa[0] = wa[0] | 1;
const Fn = {}, J = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  Fn[t] = e, J[e] = t;
}
class Lt {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const r = Lt.check(t);
    if (!r)
      throw new Error("not a UUID");
    this.version = r.version, r.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, r) {
    return tg(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = rg(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (Fn[t[14] + t[15]] & 240) >> 4,
        variant: _a((Fn[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < r + 16)
        return !1;
      let n = 0;
      for (; n < 16 && t[r + n] === 0; n++)
        ;
      return n === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[r + 6] & 240) >> 4,
        variant: _a((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, yu.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = Fn[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
or.UUID = Lt;
Lt.OID = Lt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function _a(e) {
  switch (e) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var Or;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Or || (Or = {}));
function tg(e, t, r, n, i = Or.ASCII) {
  const o = (0, gu.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, yu.newError)(eg, "ERR_INVALID_UUID_NAME");
  o.update(n), o.update(e);
  const a = o.digest();
  let l;
  switch (i) {
    case Or.BINARY:
      a[6] = a[6] & 15 | r, a[8] = a[8] & 63 | 128, l = a;
      break;
    case Or.OBJECT:
      a[6] = a[6] & 15 | r, a[8] = a[8] & 63 | 128, l = new Lt(a);
      break;
    default:
      l = J[a[0]] + J[a[1]] + J[a[2]] + J[a[3]] + "-" + J[a[4]] + J[a[5]] + "-" + J[a[6] & 15 | r] + J[a[7]] + "-" + J[a[8] & 63 | 128] + J[a[9]] + "-" + J[a[10]] + J[a[11]] + J[a[12]] + J[a[13]] + J[a[14]] + J[a[15]];
      break;
  }
  return l;
}
function rg(e) {
  return J[e[0]] + J[e[1]] + J[e[2]] + J[e[3]] + "-" + J[e[4]] + J[e[5]] + "-" + J[e[6]] + J[e[7]] + "-" + J[e[8]] + J[e[9]] + "-" + J[e[10]] + J[e[11]] + J[e[12]] + J[e[13]] + J[e[14]] + J[e[15]];
}
or.nil = new Lt("00000000-0000-0000-0000-000000000000");
var Jr = {}, Eu = {};
(function(e) {
  (function(t) {
    t.parser = function(p, d) {
      return new n(p, d);
    }, t.SAXParser = n, t.SAXStream = u, t.createStream = c, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var r = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    t.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function n(p, d) {
      if (!(this instanceof n))
        return new n(p, d);
      var T = this;
      o(T), T.q = T.c = "", T.bufferCheckPosition = t.MAX_BUFFER_LENGTH, T.opt = d || {}, T.opt.lowercase = T.opt.lowercase || T.opt.lowercasetags, T.looseCase = T.opt.lowercase ? "toLowerCase" : "toUpperCase", T.tags = [], T.closed = T.closedRoot = T.sawRoot = !1, T.tag = T.error = null, T.strict = !!p, T.noscript = !!(p || T.opt.noscript), T.state = E.BEGIN, T.strictEntities = T.opt.strictEntities, T.ENTITIES = T.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), T.attribList = [], T.opt.xmlns && (T.ns = Object.create(S)), T.opt.unquotedAttributeValues === void 0 && (T.opt.unquotedAttributeValues = !p), T.trackPosition = T.opt.position !== !1, T.trackPosition && (T.position = T.line = T.column = 0), H(T, "onready");
    }
    Object.create || (Object.create = function(p) {
      function d() {
      }
      d.prototype = p;
      var T = new d();
      return T;
    }), Object.keys || (Object.keys = function(p) {
      var d = [];
      for (var T in p) p.hasOwnProperty(T) && d.push(T);
      return d;
    });
    function i(p) {
      for (var d = Math.max(t.MAX_BUFFER_LENGTH, 10), T = 0, _ = 0, K = r.length; _ < K; _++) {
        var ne = p[r[_]].length;
        if (ne > d)
          switch (r[_]) {
            case "textNode":
              Z(p);
              break;
            case "cdata":
              M(p, "oncdata", p.cdata), p.cdata = "";
              break;
            case "script":
              M(p, "onscript", p.script), p.script = "";
              break;
            default:
              $(p, "Max buffer length exceeded: " + r[_]);
          }
        T = Math.max(T, ne);
      }
      var se = t.MAX_BUFFER_LENGTH - T;
      p.bufferCheckPosition = se + p.position;
    }
    function o(p) {
      for (var d = 0, T = r.length; d < T; d++)
        p[r[d]] = "";
    }
    function s(p) {
      Z(p), p.cdata !== "" && (M(p, "oncdata", p.cdata), p.cdata = ""), p.script !== "" && (M(p, "onscript", p.script), p.script = "");
    }
    n.prototype = {
      end: function() {
        R(this);
      },
      write: Ve,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        s(this);
      }
    };
    var a;
    try {
      a = require("stream").Stream;
    } catch {
      a = function() {
      };
    }
    a || (a = function() {
    });
    var l = t.EVENTS.filter(function(p) {
      return p !== "error" && p !== "end";
    });
    function c(p, d) {
      return new u(p, d);
    }
    function u(p, d) {
      if (!(this instanceof u))
        return new u(p, d);
      a.apply(this), this._parser = new n(p, d), this.writable = !0, this.readable = !0;
      var T = this;
      this._parser.onend = function() {
        T.emit("end");
      }, this._parser.onerror = function(_) {
        T.emit("error", _), T._parser.error = null;
      }, this._decoder = null, l.forEach(function(_) {
        Object.defineProperty(T, "on" + _, {
          get: function() {
            return T._parser["on" + _];
          },
          set: function(K) {
            if (!K)
              return T.removeAllListeners(_), T._parser["on" + _] = K, K;
            T.on(_, K);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    u.prototype = Object.create(a.prototype, {
      constructor: {
        value: u
      }
    }), u.prototype.write = function(p) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(p)) {
        if (!this._decoder) {
          var d = Vd.StringDecoder;
          this._decoder = new d("utf8");
        }
        p = this._decoder.write(p);
      }
      return this._parser.write(p.toString()), this.emit("data", p), !0;
    }, u.prototype.end = function(p) {
      return p && p.length && this.write(p), this._parser.end(), !0;
    }, u.prototype.on = function(p, d) {
      var T = this;
      return !T._parser["on" + p] && l.indexOf(p) !== -1 && (T._parser["on" + p] = function() {
        var _ = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        _.splice(0, 0, p), T.emit.apply(T, _);
      }), a.prototype.on.call(T, p, d);
    };
    var f = "[CDATA[", h = "DOCTYPE", m = "http://www.w3.org/XML/1998/namespace", y = "http://www.w3.org/2000/xmlns/", S = { xml: m, xmlns: y }, v = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, A = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, b = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, D = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function x(p) {
      return p === " " || p === `
` || p === "\r" || p === "	";
    }
    function B(p) {
      return p === '"' || p === "'";
    }
    function q(p) {
      return p === ">" || x(p);
    }
    function j(p, d) {
      return p.test(d);
    }
    function le(p, d) {
      return !j(p, d);
    }
    var E = 0;
    t.STATE = {
      BEGIN: E++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: E++,
      // leading whitespace
      TEXT: E++,
      // general stuff
      TEXT_ENTITY: E++,
      // &amp and such.
      OPEN_WAKA: E++,
      // <
      SGML_DECL: E++,
      // <!BLARG
      SGML_DECL_QUOTED: E++,
      // <!BLARG foo "bar
      DOCTYPE: E++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: E++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: E++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: E++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: E++,
      // <!-
      COMMENT: E++,
      // <!--
      COMMENT_ENDING: E++,
      // <!-- blah -
      COMMENT_ENDED: E++,
      // <!-- blah --
      CDATA: E++,
      // <![CDATA[ something
      CDATA_ENDING: E++,
      // ]
      CDATA_ENDING_2: E++,
      // ]]
      PROC_INST: E++,
      // <?hi
      PROC_INST_BODY: E++,
      // <?hi there
      PROC_INST_ENDING: E++,
      // <?hi "there" ?
      OPEN_TAG: E++,
      // <strong
      OPEN_TAG_SLASH: E++,
      // <strong /
      ATTRIB: E++,
      // <a
      ATTRIB_NAME: E++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: E++,
      // <a foo _
      ATTRIB_VALUE: E++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: E++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: E++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: E++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: E++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: E++,
      // <foo bar=&quot
      CLOSE_TAG: E++,
      // </a
      CLOSE_TAG_SAW_WHITE: E++,
      // </a   >
      SCRIPT: E++,
      // <script> ...
      SCRIPT_ENDING: E++
      // <script> ... <
    }, t.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, t.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(t.ENTITIES).forEach(function(p) {
      var d = t.ENTITIES[p], T = typeof d == "number" ? String.fromCharCode(d) : d;
      t.ENTITIES[p] = T;
    });
    for (var z in t.STATE)
      t.STATE[t.STATE[z]] = z;
    E = t.STATE;
    function H(p, d, T) {
      p[d] && p[d](T);
    }
    function M(p, d, T) {
      p.textNode && Z(p), H(p, d, T);
    }
    function Z(p) {
      p.textNode = P(p.opt, p.textNode), p.textNode && H(p, "ontext", p.textNode), p.textNode = "";
    }
    function P(p, d) {
      return p.trim && (d = d.trim()), p.normalize && (d = d.replace(/\s+/g, " ")), d;
    }
    function $(p, d) {
      return Z(p), p.trackPosition && (d += `
Line: ` + p.line + `
Column: ` + p.column + `
Char: ` + p.c), d = new Error(d), p.error = d, H(p, "onerror", d), p;
    }
    function R(p) {
      return p.sawRoot && !p.closedRoot && C(p, "Unclosed root tag"), p.state !== E.BEGIN && p.state !== E.BEGIN_WHITESPACE && p.state !== E.TEXT && $(p, "Unexpected end"), Z(p), p.c = "", p.closed = !0, H(p, "onend"), n.call(p, p.strict, p.opt), p;
    }
    function C(p, d) {
      if (typeof p != "object" || !(p instanceof n))
        throw new Error("bad call to strictFail");
      p.strict && $(p, d);
    }
    function N(p) {
      p.strict || (p.tagName = p.tagName[p.looseCase]());
      var d = p.tags[p.tags.length - 1] || p, T = p.tag = { name: p.tagName, attributes: {} };
      p.opt.xmlns && (T.ns = d.ns), p.attribList.length = 0, M(p, "onopentagstart", T);
    }
    function I(p, d) {
      var T = p.indexOf(":"), _ = T < 0 ? ["", p] : p.split(":"), K = _[0], ne = _[1];
      return d && p === "xmlns" && (K = "xmlns", ne = ""), { prefix: K, local: ne };
    }
    function k(p) {
      if (p.strict || (p.attribName = p.attribName[p.looseCase]()), p.attribList.indexOf(p.attribName) !== -1 || p.tag.attributes.hasOwnProperty(p.attribName)) {
        p.attribName = p.attribValue = "";
        return;
      }
      if (p.opt.xmlns) {
        var d = I(p.attribName, !0), T = d.prefix, _ = d.local;
        if (T === "xmlns")
          if (_ === "xml" && p.attribValue !== m)
            C(
              p,
              "xml: prefix must be bound to " + m + `
Actual: ` + p.attribValue
            );
          else if (_ === "xmlns" && p.attribValue !== y)
            C(
              p,
              "xmlns: prefix must be bound to " + y + `
Actual: ` + p.attribValue
            );
          else {
            var K = p.tag, ne = p.tags[p.tags.length - 1] || p;
            K.ns === ne.ns && (K.ns = Object.create(ne.ns)), K.ns[_] = p.attribValue;
          }
        p.attribList.push([p.attribName, p.attribValue]);
      } else
        p.tag.attributes[p.attribName] = p.attribValue, M(p, "onattribute", {
          name: p.attribName,
          value: p.attribValue
        });
      p.attribName = p.attribValue = "";
    }
    function X(p, d) {
      if (p.opt.xmlns) {
        var T = p.tag, _ = I(p.tagName);
        T.prefix = _.prefix, T.local = _.local, T.uri = T.ns[_.prefix] || "", T.prefix && !T.uri && (C(p, "Unbound namespace prefix: " + JSON.stringify(p.tagName)), T.uri = _.prefix);
        var K = p.tags[p.tags.length - 1] || p;
        T.ns && K.ns !== T.ns && Object.keys(T.ns).forEach(function(sn) {
          M(p, "onopennamespace", {
            prefix: sn,
            uri: T.ns[sn]
          });
        });
        for (var ne = 0, se = p.attribList.length; ne < se; ne++) {
          var ge = p.attribList[ne], we = ge[0], it = ge[1], ue = I(we, !0), Me = ue.prefix, wi = ue.local, on = Me === "" ? "" : T.ns[Me] || "", dr = {
            name: we,
            value: it,
            prefix: Me,
            local: wi,
            uri: on
          };
          Me && Me !== "xmlns" && !on && (C(p, "Unbound namespace prefix: " + JSON.stringify(Me)), dr.uri = Me), p.tag.attributes[we] = dr, M(p, "onattribute", dr);
        }
        p.attribList.length = 0;
      }
      p.tag.isSelfClosing = !!d, p.sawRoot = !0, p.tags.push(p.tag), M(p, "onopentag", p.tag), d || (!p.noscript && p.tagName.toLowerCase() === "script" ? p.state = E.SCRIPT : p.state = E.TEXT, p.tag = null, p.tagName = ""), p.attribName = p.attribValue = "", p.attribList.length = 0;
    }
    function G(p) {
      if (!p.tagName) {
        C(p, "Weird empty close tag."), p.textNode += "</>", p.state = E.TEXT;
        return;
      }
      if (p.script) {
        if (p.tagName !== "script") {
          p.script += "</" + p.tagName + ">", p.tagName = "", p.state = E.SCRIPT;
          return;
        }
        M(p, "onscript", p.script), p.script = "";
      }
      var d = p.tags.length, T = p.tagName;
      p.strict || (T = T[p.looseCase]());
      for (var _ = T; d--; ) {
        var K = p.tags[d];
        if (K.name !== _)
          C(p, "Unexpected close tag");
        else
          break;
      }
      if (d < 0) {
        C(p, "Unmatched closing tag: " + p.tagName), p.textNode += "</" + p.tagName + ">", p.state = E.TEXT;
        return;
      }
      p.tagName = T;
      for (var ne = p.tags.length; ne-- > d; ) {
        var se = p.tag = p.tags.pop();
        p.tagName = p.tag.name, M(p, "onclosetag", p.tagName);
        var ge = {};
        for (var we in se.ns)
          ge[we] = se.ns[we];
        var it = p.tags[p.tags.length - 1] || p;
        p.opt.xmlns && se.ns !== it.ns && Object.keys(se.ns).forEach(function(ue) {
          var Me = se.ns[ue];
          M(p, "onclosenamespace", { prefix: ue, uri: Me });
        });
      }
      d === 0 && (p.closedRoot = !0), p.tagName = p.attribValue = p.attribName = "", p.attribList.length = 0, p.state = E.TEXT;
    }
    function ee(p) {
      var d = p.entity, T = d.toLowerCase(), _, K = "";
      return p.ENTITIES[d] ? p.ENTITIES[d] : p.ENTITIES[T] ? p.ENTITIES[T] : (d = T, d.charAt(0) === "#" && (d.charAt(1) === "x" ? (d = d.slice(2), _ = parseInt(d, 16), K = _.toString(16)) : (d = d.slice(1), _ = parseInt(d, 10), K = _.toString(10))), d = d.replace(/^0+/, ""), isNaN(_) || K.toLowerCase() !== d ? (C(p, "Invalid character entity"), "&" + p.entity + ";") : String.fromCodePoint(_));
    }
    function de(p, d) {
      d === "<" ? (p.state = E.OPEN_WAKA, p.startTagPosition = p.position) : x(d) || (C(p, "Non-whitespace before first tag."), p.textNode = d, p.state = E.TEXT);
    }
    function U(p, d) {
      var T = "";
      return d < p.length && (T = p.charAt(d)), T;
    }
    function Ve(p) {
      var d = this;
      if (this.error)
        throw this.error;
      if (d.closed)
        return $(
          d,
          "Cannot write after close. Assign an onready handler."
        );
      if (p === null)
        return R(d);
      typeof p == "object" && (p = p.toString());
      for (var T = 0, _ = ""; _ = U(p, T++), d.c = _, !!_; )
        switch (d.trackPosition && (d.position++, _ === `
` ? (d.line++, d.column = 0) : d.column++), d.state) {
          case E.BEGIN:
            if (d.state = E.BEGIN_WHITESPACE, _ === "\uFEFF")
              continue;
            de(d, _);
            continue;
          case E.BEGIN_WHITESPACE:
            de(d, _);
            continue;
          case E.TEXT:
            if (d.sawRoot && !d.closedRoot) {
              for (var K = T - 1; _ && _ !== "<" && _ !== "&"; )
                _ = U(p, T++), _ && d.trackPosition && (d.position++, _ === `
` ? (d.line++, d.column = 0) : d.column++);
              d.textNode += p.substring(K, T - 1);
            }
            _ === "<" && !(d.sawRoot && d.closedRoot && !d.strict) ? (d.state = E.OPEN_WAKA, d.startTagPosition = d.position) : (!x(_) && (!d.sawRoot || d.closedRoot) && C(d, "Text data outside of root node."), _ === "&" ? d.state = E.TEXT_ENTITY : d.textNode += _);
            continue;
          case E.SCRIPT:
            _ === "<" ? d.state = E.SCRIPT_ENDING : d.script += _;
            continue;
          case E.SCRIPT_ENDING:
            _ === "/" ? d.state = E.CLOSE_TAG : (d.script += "<" + _, d.state = E.SCRIPT);
            continue;
          case E.OPEN_WAKA:
            if (_ === "!")
              d.state = E.SGML_DECL, d.sgmlDecl = "";
            else if (!x(_)) if (j(v, _))
              d.state = E.OPEN_TAG, d.tagName = _;
            else if (_ === "/")
              d.state = E.CLOSE_TAG, d.tagName = "";
            else if (_ === "?")
              d.state = E.PROC_INST, d.procInstName = d.procInstBody = "";
            else {
              if (C(d, "Unencoded <"), d.startTagPosition + 1 < d.position) {
                var ne = d.position - d.startTagPosition;
                _ = new Array(ne).join(" ") + _;
              }
              d.textNode += "<" + _, d.state = E.TEXT;
            }
            continue;
          case E.SGML_DECL:
            if (d.sgmlDecl + _ === "--") {
              d.state = E.COMMENT, d.comment = "", d.sgmlDecl = "";
              continue;
            }
            d.doctype && d.doctype !== !0 && d.sgmlDecl ? (d.state = E.DOCTYPE_DTD, d.doctype += "<!" + d.sgmlDecl + _, d.sgmlDecl = "") : (d.sgmlDecl + _).toUpperCase() === f ? (M(d, "onopencdata"), d.state = E.CDATA, d.sgmlDecl = "", d.cdata = "") : (d.sgmlDecl + _).toUpperCase() === h ? (d.state = E.DOCTYPE, (d.doctype || d.sawRoot) && C(
              d,
              "Inappropriately located doctype declaration"
            ), d.doctype = "", d.sgmlDecl = "") : _ === ">" ? (M(d, "onsgmldeclaration", d.sgmlDecl), d.sgmlDecl = "", d.state = E.TEXT) : (B(_) && (d.state = E.SGML_DECL_QUOTED), d.sgmlDecl += _);
            continue;
          case E.SGML_DECL_QUOTED:
            _ === d.q && (d.state = E.SGML_DECL, d.q = ""), d.sgmlDecl += _;
            continue;
          case E.DOCTYPE:
            _ === ">" ? (d.state = E.TEXT, M(d, "ondoctype", d.doctype), d.doctype = !0) : (d.doctype += _, _ === "[" ? d.state = E.DOCTYPE_DTD : B(_) && (d.state = E.DOCTYPE_QUOTED, d.q = _));
            continue;
          case E.DOCTYPE_QUOTED:
            d.doctype += _, _ === d.q && (d.q = "", d.state = E.DOCTYPE);
            continue;
          case E.DOCTYPE_DTD:
            _ === "]" ? (d.doctype += _, d.state = E.DOCTYPE) : _ === "<" ? (d.state = E.OPEN_WAKA, d.startTagPosition = d.position) : B(_) ? (d.doctype += _, d.state = E.DOCTYPE_DTD_QUOTED, d.q = _) : d.doctype += _;
            continue;
          case E.DOCTYPE_DTD_QUOTED:
            d.doctype += _, _ === d.q && (d.state = E.DOCTYPE_DTD, d.q = "");
            continue;
          case E.COMMENT:
            _ === "-" ? d.state = E.COMMENT_ENDING : d.comment += _;
            continue;
          case E.COMMENT_ENDING:
            _ === "-" ? (d.state = E.COMMENT_ENDED, d.comment = P(d.opt, d.comment), d.comment && M(d, "oncomment", d.comment), d.comment = "") : (d.comment += "-" + _, d.state = E.COMMENT);
            continue;
          case E.COMMENT_ENDED:
            _ !== ">" ? (C(d, "Malformed comment"), d.comment += "--" + _, d.state = E.COMMENT) : d.doctype && d.doctype !== !0 ? d.state = E.DOCTYPE_DTD : d.state = E.TEXT;
            continue;
          case E.CDATA:
            _ === "]" ? d.state = E.CDATA_ENDING : d.cdata += _;
            continue;
          case E.CDATA_ENDING:
            _ === "]" ? d.state = E.CDATA_ENDING_2 : (d.cdata += "]" + _, d.state = E.CDATA);
            continue;
          case E.CDATA_ENDING_2:
            _ === ">" ? (d.cdata && M(d, "oncdata", d.cdata), M(d, "onclosecdata"), d.cdata = "", d.state = E.TEXT) : _ === "]" ? d.cdata += "]" : (d.cdata += "]]" + _, d.state = E.CDATA);
            continue;
          case E.PROC_INST:
            _ === "?" ? d.state = E.PROC_INST_ENDING : x(_) ? d.state = E.PROC_INST_BODY : d.procInstName += _;
            continue;
          case E.PROC_INST_BODY:
            if (!d.procInstBody && x(_))
              continue;
            _ === "?" ? d.state = E.PROC_INST_ENDING : d.procInstBody += _;
            continue;
          case E.PROC_INST_ENDING:
            _ === ">" ? (M(d, "onprocessinginstruction", {
              name: d.procInstName,
              body: d.procInstBody
            }), d.procInstName = d.procInstBody = "", d.state = E.TEXT) : (d.procInstBody += "?" + _, d.state = E.PROC_INST_BODY);
            continue;
          case E.OPEN_TAG:
            j(A, _) ? d.tagName += _ : (N(d), _ === ">" ? X(d) : _ === "/" ? d.state = E.OPEN_TAG_SLASH : (x(_) || C(d, "Invalid character in tag name"), d.state = E.ATTRIB));
            continue;
          case E.OPEN_TAG_SLASH:
            _ === ">" ? (X(d, !0), G(d)) : (C(d, "Forward-slash in opening tag not followed by >"), d.state = E.ATTRIB);
            continue;
          case E.ATTRIB:
            if (x(_))
              continue;
            _ === ">" ? X(d) : _ === "/" ? d.state = E.OPEN_TAG_SLASH : j(v, _) ? (d.attribName = _, d.attribValue = "", d.state = E.ATTRIB_NAME) : C(d, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME:
            _ === "=" ? d.state = E.ATTRIB_VALUE : _ === ">" ? (C(d, "Attribute without value"), d.attribValue = d.attribName, k(d), X(d)) : x(_) ? d.state = E.ATTRIB_NAME_SAW_WHITE : j(A, _) ? d.attribName += _ : C(d, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME_SAW_WHITE:
            if (_ === "=")
              d.state = E.ATTRIB_VALUE;
            else {
              if (x(_))
                continue;
              C(d, "Attribute without value"), d.tag.attributes[d.attribName] = "", d.attribValue = "", M(d, "onattribute", {
                name: d.attribName,
                value: ""
              }), d.attribName = "", _ === ">" ? X(d) : j(v, _) ? (d.attribName = _, d.state = E.ATTRIB_NAME) : (C(d, "Invalid attribute name"), d.state = E.ATTRIB);
            }
            continue;
          case E.ATTRIB_VALUE:
            if (x(_))
              continue;
            B(_) ? (d.q = _, d.state = E.ATTRIB_VALUE_QUOTED) : (d.opt.unquotedAttributeValues || $(d, "Unquoted attribute value"), d.state = E.ATTRIB_VALUE_UNQUOTED, d.attribValue = _);
            continue;
          case E.ATTRIB_VALUE_QUOTED:
            if (_ !== d.q) {
              _ === "&" ? d.state = E.ATTRIB_VALUE_ENTITY_Q : d.attribValue += _;
              continue;
            }
            k(d), d.q = "", d.state = E.ATTRIB_VALUE_CLOSED;
            continue;
          case E.ATTRIB_VALUE_CLOSED:
            x(_) ? d.state = E.ATTRIB : _ === ">" ? X(d) : _ === "/" ? d.state = E.OPEN_TAG_SLASH : j(v, _) ? (C(d, "No whitespace between attributes"), d.attribName = _, d.attribValue = "", d.state = E.ATTRIB_NAME) : C(d, "Invalid attribute name");
            continue;
          case E.ATTRIB_VALUE_UNQUOTED:
            if (!q(_)) {
              _ === "&" ? d.state = E.ATTRIB_VALUE_ENTITY_U : d.attribValue += _;
              continue;
            }
            k(d), _ === ">" ? X(d) : d.state = E.ATTRIB;
            continue;
          case E.CLOSE_TAG:
            if (d.tagName)
              _ === ">" ? G(d) : j(A, _) ? d.tagName += _ : d.script ? (d.script += "</" + d.tagName, d.tagName = "", d.state = E.SCRIPT) : (x(_) || C(d, "Invalid tagname in closing tag"), d.state = E.CLOSE_TAG_SAW_WHITE);
            else {
              if (x(_))
                continue;
              le(v, _) ? d.script ? (d.script += "</" + _, d.state = E.SCRIPT) : C(d, "Invalid tagname in closing tag.") : d.tagName = _;
            }
            continue;
          case E.CLOSE_TAG_SAW_WHITE:
            if (x(_))
              continue;
            _ === ">" ? G(d) : C(d, "Invalid characters in closing tag");
            continue;
          case E.TEXT_ENTITY:
          case E.ATTRIB_VALUE_ENTITY_Q:
          case E.ATTRIB_VALUE_ENTITY_U:
            var se, ge;
            switch (d.state) {
              case E.TEXT_ENTITY:
                se = E.TEXT, ge = "textNode";
                break;
              case E.ATTRIB_VALUE_ENTITY_Q:
                se = E.ATTRIB_VALUE_QUOTED, ge = "attribValue";
                break;
              case E.ATTRIB_VALUE_ENTITY_U:
                se = E.ATTRIB_VALUE_UNQUOTED, ge = "attribValue";
                break;
            }
            if (_ === ";") {
              var we = ee(d);
              d.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(we) ? (d.entity = "", d.state = se, d.write(we)) : (d[ge] += we, d.entity = "", d.state = se);
            } else j(d.entity.length ? D : b, _) ? d.entity += _ : (C(d, "Invalid character in entity name"), d[ge] += "&" + d.entity + _, d.entity = "", d.state = se);
            continue;
          default:
            throw new Error(d, "Unknown state: " + d.state);
        }
      return d.position >= d.bufferCheckPosition && i(d), d;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var p = String.fromCharCode, d = Math.floor, T = function() {
        var _ = 16384, K = [], ne, se, ge = -1, we = arguments.length;
        if (!we)
          return "";
        for (var it = ""; ++ge < we; ) {
          var ue = Number(arguments[ge]);
          if (!isFinite(ue) || // `NaN`, `+Infinity`, or `-Infinity`
          ue < 0 || // not a valid Unicode code point
          ue > 1114111 || // not a valid Unicode code point
          d(ue) !== ue)
            throw RangeError("Invalid code point: " + ue);
          ue <= 65535 ? K.push(ue) : (ue -= 65536, ne = (ue >> 10) + 55296, se = ue % 1024 + 56320, K.push(ne, se)), (ge + 1 === we || K.length > _) && (it += p.apply(null, K), K.length = 0);
        }
        return it;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: T,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = T;
    }();
  })(e);
})(Eu);
Object.defineProperty(Jr, "__esModule", { value: !0 });
Jr.XElement = void 0;
Jr.parseXml = sg;
const ng = Eu, wn = cr;
class vu {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, wn.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!og(t))
      throw (0, wn.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, wn.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, wn.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (Sa(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => Sa(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
Jr.XElement = vu;
const ig = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function og(e) {
  return ig.test(e);
}
function Sa(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function sg(e) {
  let t = null;
  const r = ng.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const o = new vu(i.name);
    if (o.attributes = i.attributes, t === null)
      t = o;
    else {
      const s = n[n.length - 1];
      s.elements == null && (s.elements = []), s.elements.push(o);
    }
    n.push(o);
  }, r.onclosetag = () => {
    n.pop();
  }, r.ontext = (i) => {
    n.length > 0 && (n[n.length - 1].value = i);
  }, r.oncdata = (i) => {
    const o = n[n.length - 1];
    o.value = i, o.isCData = !0;
  }, r.onerror = (i) => {
    throw i;
  }, r.write(e), t;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = f;
  var t = gt;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var r = cr;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return r.newError;
  } });
  var n = Ce;
  Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return n.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return n.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return n.configureRequestUrl;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return n.createHttpError;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return n.DigestTransform;
  } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return n.HttpError;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return n.HttpExecutor;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return n.parseJson;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return n.safeGetHeader;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return n.safeStringifyJson;
  } });
  var i = ti;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = Xr;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var s = ri;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return s.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return s.githubUrl;
  } });
  var a = ls;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return a.retry;
  } });
  var l = cs;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var c = or;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return c.UUID;
  } });
  var u = Jr;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return u.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return u.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function f(h) {
    return h == null ? [] : Array.isArray(h) ? h : [h];
  }
})(me);
var ve = {}, us = {}, He = {};
function wu(e) {
  return typeof e > "u" || e === null;
}
function ag(e) {
  return typeof e == "object" && e !== null;
}
function lg(e) {
  return Array.isArray(e) ? e : wu(e) ? [] : [e];
}
function cg(e, t) {
  var r, n, i, o;
  if (t)
    for (o = Object.keys(t), r = 0, n = o.length; r < n; r += 1)
      i = o[r], e[i] = t[i];
  return e;
}
function ug(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function fg(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
He.isNothing = wu;
He.isObject = ag;
He.toArray = lg;
He.repeat = ug;
He.isNegativeZero = fg;
He.extend = cg;
function _u(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function xr(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = _u(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
xr.prototype = Object.create(Error.prototype);
xr.prototype.constructor = xr;
xr.prototype.toString = function(t) {
  return this.name + ": " + _u(this, t);
};
var Kr = xr, Ar = He;
function Li(e, t, r, n, i) {
  var o = "", s = "", a = Math.floor(i / 2) - 1;
  return n - t > a && (o = " ... ", t = n - a + o.length), r - n > a && (s = " ...", r = n + a - s.length), {
    str: o + e.slice(t, r).replace(/\t/g, "→") + s,
    pos: n - t + o.length
    // relative position
  };
}
function Ui(e, t) {
  return Ar.repeat(" ", t - e.length) + e;
}
function dg(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], o, s = -1; o = r.exec(e.buffer); )
    i.push(o.index), n.push(o.index + o[0].length), e.position <= o.index && s < 0 && (s = n.length - 2);
  s < 0 && (s = n.length - 1);
  var a = "", l, c, u = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + u + 3);
  for (l = 1; l <= t.linesBefore && !(s - l < 0); l++)
    c = Li(
      e.buffer,
      n[s - l],
      i[s - l],
      e.position - (n[s] - n[s - l]),
      f
    ), a = Ar.repeat(" ", t.indent) + Ui((e.line - l + 1).toString(), u) + " | " + c.str + `
` + a;
  for (c = Li(e.buffer, n[s], i[s], e.position, f), a += Ar.repeat(" ", t.indent) + Ui((e.line + 1).toString(), u) + " | " + c.str + `
`, a += Ar.repeat("-", t.indent + u + 3 + c.pos) + `^
`, l = 1; l <= t.linesAfter && !(s + l >= i.length); l++)
    c = Li(
      e.buffer,
      n[s + l],
      i[s + l],
      e.position - (n[s] - n[s + l]),
      f
    ), a += Ar.repeat(" ", t.indent) + Ui((e.line + l + 1).toString(), u) + " | " + c.str + `
`;
  return a.replace(/\n$/, "");
}
var hg = dg, Aa = Kr, pg = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], mg = [
  "scalar",
  "sequence",
  "mapping"
];
function gg(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function yg(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (pg.indexOf(r) === -1)
      throw new Aa('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = gg(t.styleAliases || null), mg.indexOf(this.kind) === -1)
    throw new Aa('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Ie = yg, vr = Kr, ki = Ie;
function ba(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(o, s) {
      o.tag === n.tag && o.kind === n.kind && o.multi === n.multi && (i = s);
    }), r[i] = n;
  }), r;
}
function Eg() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, t, r;
  function n(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (t = 0, r = arguments.length; t < r; t += 1)
    arguments[t].forEach(n);
  return e;
}
function Mo(e) {
  return this.extend(e);
}
Mo.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof ki)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new vr("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(o) {
    if (!(o instanceof ki))
      throw new vr("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new vr("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new vr("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(o) {
    if (!(o instanceof ki))
      throw new vr("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(Mo.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = ba(i, "implicit"), i.compiledExplicit = ba(i, "explicit"), i.compiledTypeMap = Eg(i.compiledImplicit, i.compiledExplicit), i;
};
var Su = Mo, vg = Ie, Au = new vg("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), wg = Ie, bu = new wg("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), _g = Ie, Tu = new _g("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), Sg = Su, Cu = new Sg({
  explicit: [
    Au,
    bu,
    Tu
  ]
}), Ag = Ie;
function bg(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function Tg() {
  return null;
}
function Cg(e) {
  return e === null;
}
var $u = new Ag("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: bg,
  construct: Tg,
  predicate: Cg,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
}), $g = Ie;
function Og(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function Pg(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function Ig(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Ou = new $g("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: Og,
  construct: Pg,
  predicate: Ig,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
}), Rg = He, Dg = Ie;
function Ng(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function Fg(e) {
  return 48 <= e && e <= 55;
}
function xg(e) {
  return 48 <= e && e <= 57;
}
function Lg(e) {
  if (e === null) return !1;
  var t = e.length, r = 0, n = !1, i;
  if (!t) return !1;
  if (i = e[r], (i === "-" || i === "+") && (i = e[++r]), i === "0") {
    if (r + 1 === t) return !0;
    if (i = e[++r], i === "b") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "x") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!Ng(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!Fg(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!xg(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function Ug(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function kg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !Rg.isNegativeZero(e);
}
var Pu = new Dg("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: Lg,
  construct: Ug,
  predicate: kg,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), Iu = He, Mg = Ie, jg = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function Bg(e) {
  return !(e === null || !jg.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function qg(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var Hg = /^[-+]?[0-9]+e/;
function Gg(e, t) {
  var r;
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (Iu.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), Hg.test(r) ? r.replace("e", ".e") : r;
}
function Wg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Iu.isNegativeZero(e));
}
var Ru = new Mg("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: Bg,
  construct: qg,
  predicate: Wg,
  represent: Gg,
  defaultStyle: "lowercase"
}), Du = Cu.extend({
  implicit: [
    $u,
    Ou,
    Pu,
    Ru
  ]
}), Nu = Du, Vg = Ie, Fu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), xu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function zg(e) {
  return e === null ? !1 : Fu.exec(e) !== null || xu.exec(e) !== null;
}
function Yg(e) {
  var t, r, n, i, o, s, a, l = 0, c = null, u, f, h;
  if (t = Fu.exec(e), t === null && (t = xu.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (o = +t[4], s = +t[5], a = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (u = +t[10], f = +(t[11] || 0), c = (u * 60 + f) * 6e4, t[9] === "-" && (c = -c)), h = new Date(Date.UTC(r, n, i, o, s, a, l)), c && h.setTime(h.getTime() - c), h;
}
function Xg(e) {
  return e.toISOString();
}
var Lu = new Vg("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: zg,
  construct: Yg,
  instanceOf: Date,
  represent: Xg
}), Jg = Ie;
function Kg(e) {
  return e === "<<" || e === null;
}
var Uu = new Jg("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: Kg
}), Qg = Ie, fs = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Zg(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, o = fs;
  for (r = 0; r < i; r++)
    if (t = o.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function e0(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, o = fs, s = 0, a = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)), s = s << 6 | o.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)) : r === 18 ? (a.push(s >> 10 & 255), a.push(s >> 2 & 255)) : r === 12 && a.push(s >> 4 & 255), new Uint8Array(a);
}
function t0(e) {
  var t = "", r = 0, n, i, o = e.length, s = fs;
  for (n = 0; n < o; n++)
    n % 3 === 0 && n && (t += s[r >> 18 & 63], t += s[r >> 12 & 63], t += s[r >> 6 & 63], t += s[r & 63]), r = (r << 8) + e[n];
  return i = o % 3, i === 0 ? (t += s[r >> 18 & 63], t += s[r >> 12 & 63], t += s[r >> 6 & 63], t += s[r & 63]) : i === 2 ? (t += s[r >> 10 & 63], t += s[r >> 4 & 63], t += s[r << 2 & 63], t += s[64]) : i === 1 && (t += s[r >> 2 & 63], t += s[r << 4 & 63], t += s[64], t += s[64]), t;
}
function r0(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var ku = new Qg("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Zg,
  construct: e0,
  predicate: r0,
  represent: t0
}), n0 = Ie, i0 = Object.prototype.hasOwnProperty, o0 = Object.prototype.toString;
function s0(e) {
  if (e === null) return !0;
  var t = [], r, n, i, o, s, a = e;
  for (r = 0, n = a.length; r < n; r += 1) {
    if (i = a[r], s = !1, o0.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (i0.call(i, o))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function a0(e) {
  return e !== null ? e : [];
}
var Mu = new n0("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: s0,
  construct: a0
}), l0 = Ie, c0 = Object.prototype.toString;
function u0(e) {
  if (e === null) return !0;
  var t, r, n, i, o, s = e;
  for (o = new Array(s.length), t = 0, r = s.length; t < r; t += 1) {
    if (n = s[t], c0.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    o[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function f0(e) {
  if (e === null) return [];
  var t, r, n, i, o, s = e;
  for (o = new Array(s.length), t = 0, r = s.length; t < r; t += 1)
    n = s[t], i = Object.keys(n), o[t] = [i[0], n[i[0]]];
  return o;
}
var ju = new l0("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: u0,
  construct: f0
}), d0 = Ie, h0 = Object.prototype.hasOwnProperty;
function p0(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (h0.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function m0(e) {
  return e !== null ? e : {};
}
var Bu = new d0("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: p0,
  construct: m0
}), ds = Nu.extend({
  implicit: [
    Lu,
    Uu
  ],
  explicit: [
    ku,
    Mu,
    ju,
    Bu
  ]
}), Dt = He, qu = Kr, g0 = hg, y0 = ds, yt = Object.prototype.hasOwnProperty, Hn = 1, Hu = 2, Gu = 3, Gn = 4, Mi = 1, E0 = 2, Ta = 3, v0 = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, w0 = /[\x85\u2028\u2029]/, _0 = /[,\[\]\{\}]/, Wu = /^(?:!|!!|![a-z\-]+!)$/i, Vu = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Ca(e) {
  return Object.prototype.toString.call(e);
}
function Je(e) {
  return e === 10 || e === 13;
}
function xt(e) {
  return e === 9 || e === 32;
}
function Ne(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function Jt(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function S0(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function A0(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function b0(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function $a(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function T0(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
var zu = new Array(256), Yu = new Array(256);
for (var Ht = 0; Ht < 256; Ht++)
  zu[Ht] = $a(Ht) ? 1 : 0, Yu[Ht] = $a(Ht);
function C0(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || y0, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Xu(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = g0(r), new qu(t, r);
}
function L(e, t) {
  throw Xu(e, t);
}
function Wn(e, t) {
  e.onWarning && e.onWarning.call(null, Xu(e, t));
}
var Oa = {
  YAML: function(t, r, n) {
    var i, o, s;
    t.version !== null && L(t, "duplication of %YAML directive"), n.length !== 1 && L(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && L(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), s = parseInt(i[2], 10), o !== 1 && L(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = s < 2, s !== 1 && s !== 2 && Wn(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, o;
    n.length !== 2 && L(t, "TAG directive accepts exactly two arguments"), i = n[0], o = n[1], Wu.test(i) || L(t, "ill-formed tag handle (first argument) of the TAG directive"), yt.call(t.tagMap, i) && L(t, 'there is a previously declared suffix for "' + i + '" tag handle'), Vu.test(o) || L(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      L(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function ht(e, t, r, n) {
  var i, o, s, a;
  if (t < r) {
    if (a = e.input.slice(t, r), n)
      for (i = 0, o = a.length; i < o; i += 1)
        s = a.charCodeAt(i), s === 9 || 32 <= s && s <= 1114111 || L(e, "expected valid JSON character");
    else v0.test(a) && L(e, "the stream contains non-printable characters");
    e.result += a;
  }
}
function Pa(e, t, r, n) {
  var i, o, s, a;
  for (Dt.isObject(r) || L(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), s = 0, a = i.length; s < a; s += 1)
    o = i[s], yt.call(t, o) || (t[o] = r[o], n[o] = !0);
}
function Kt(e, t, r, n, i, o, s, a, l) {
  var c, u;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), c = 0, u = i.length; c < u; c += 1)
      Array.isArray(i[c]) && L(e, "nested arrays are not supported inside keys"), typeof i == "object" && Ca(i[c]) === "[object Object]" && (i[c] = "[object Object]");
  if (typeof i == "object" && Ca(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (c = 0, u = o.length; c < u; c += 1)
        Pa(e, t, o[c], r);
    else
      Pa(e, t, o, r);
  else
    !e.json && !yt.call(r, i) && yt.call(t, i) && (e.line = s || e.line, e.lineStart = a || e.lineStart, e.position = l || e.position, L(e, "duplicated mapping key")), i === "__proto__" ? Object.defineProperty(t, i, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: o
    }) : t[i] = o, delete r[i];
  return t;
}
function hs(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : L(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function ce(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; xt(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (Je(i))
      for (hs(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && Wn(e, "deficient indentation"), n;
}
function ni(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || Ne(r)));
}
function ps(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Dt.repeat(`
`, t - 1));
}
function $0(e, t, r) {
  var n, i, o, s, a, l, c, u, f = e.kind, h = e.result, m;
  if (m = e.input.charCodeAt(e.position), Ne(m) || Jt(m) || m === 35 || m === 38 || m === 42 || m === 33 || m === 124 || m === 62 || m === 39 || m === 34 || m === 37 || m === 64 || m === 96 || (m === 63 || m === 45) && (i = e.input.charCodeAt(e.position + 1), Ne(i) || r && Jt(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = s = e.position, a = !1; m !== 0; ) {
    if (m === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Ne(i) || r && Jt(i))
        break;
    } else if (m === 35) {
      if (n = e.input.charCodeAt(e.position - 1), Ne(n))
        break;
    } else {
      if (e.position === e.lineStart && ni(e) || r && Jt(m))
        break;
      if (Je(m))
        if (l = e.line, c = e.lineStart, u = e.lineIndent, ce(e, !1, -1), e.lineIndent >= t) {
          a = !0, m = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = s, e.line = l, e.lineStart = c, e.lineIndent = u;
          break;
        }
    }
    a && (ht(e, o, s, !1), ps(e, e.line - l), o = s = e.position, a = !1), xt(m) || (s = e.position + 1), m = e.input.charCodeAt(++e.position);
  }
  return ht(e, o, s, !1), e.result ? !0 : (e.kind = f, e.result = h, !1);
}
function O0(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (ht(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else Je(r) ? (ht(e, n, i, !0), ps(e, ce(e, !1, t)), n = i = e.position) : e.position === e.lineStart && ni(e) ? L(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  L(e, "unexpected end of the stream within a single quoted scalar");
}
function P0(e, t) {
  var r, n, i, o, s, a;
  if (a = e.input.charCodeAt(e.position), a !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (a = e.input.charCodeAt(e.position)) !== 0; ) {
    if (a === 34)
      return ht(e, r, e.position, !0), e.position++, !0;
    if (a === 92) {
      if (ht(e, r, e.position, !0), a = e.input.charCodeAt(++e.position), Je(a))
        ce(e, !1, t);
      else if (a < 256 && zu[a])
        e.result += Yu[a], e.position++;
      else if ((s = A0(a)) > 0) {
        for (i = s, o = 0; i > 0; i--)
          a = e.input.charCodeAt(++e.position), (s = S0(a)) >= 0 ? o = (o << 4) + s : L(e, "expected hexadecimal character");
        e.result += T0(o), e.position++;
      } else
        L(e, "unknown escape sequence");
      r = n = e.position;
    } else Je(a) ? (ht(e, r, n, !0), ps(e, ce(e, !1, t)), r = n = e.position) : e.position === e.lineStart && ni(e) ? L(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  L(e, "unexpected end of the stream within a double quoted scalar");
}
function I0(e, t) {
  var r = !0, n, i, o, s = e.tag, a, l = e.anchor, c, u, f, h, m, y = /* @__PURE__ */ Object.create(null), S, v, A, b;
  if (b = e.input.charCodeAt(e.position), b === 91)
    u = 93, m = !1, a = [];
  else if (b === 123)
    u = 125, m = !0, a = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), b = e.input.charCodeAt(++e.position); b !== 0; ) {
    if (ce(e, !0, t), b = e.input.charCodeAt(e.position), b === u)
      return e.position++, e.tag = s, e.anchor = l, e.kind = m ? "mapping" : "sequence", e.result = a, !0;
    r ? b === 44 && L(e, "expected the node content, but found ','") : L(e, "missed comma between flow collection entries"), v = S = A = null, f = h = !1, b === 63 && (c = e.input.charCodeAt(e.position + 1), Ne(c) && (f = h = !0, e.position++, ce(e, !0, t))), n = e.line, i = e.lineStart, o = e.position, sr(e, t, Hn, !1, !0), v = e.tag, S = e.result, ce(e, !0, t), b = e.input.charCodeAt(e.position), (h || e.line === n) && b === 58 && (f = !0, b = e.input.charCodeAt(++e.position), ce(e, !0, t), sr(e, t, Hn, !1, !0), A = e.result), m ? Kt(e, a, y, v, S, A, n, i, o) : f ? a.push(Kt(e, null, y, v, S, A, n, i, o)) : a.push(S), ce(e, !0, t), b = e.input.charCodeAt(e.position), b === 44 ? (r = !0, b = e.input.charCodeAt(++e.position)) : r = !1;
  }
  L(e, "unexpected end of the stream within a flow collection");
}
function R0(e, t) {
  var r, n, i = Mi, o = !1, s = !1, a = t, l = 0, c = !1, u, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    n = !1;
  else if (f === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      Mi === i ? i = f === 43 ? Ta : E0 : L(e, "repeat of a chomping mode identifier");
    else if ((u = b0(f)) >= 0)
      u === 0 ? L(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? L(e, "repeat of an indentation width identifier") : (a = t + u - 1, s = !0);
    else
      break;
  if (xt(f)) {
    do
      f = e.input.charCodeAt(++e.position);
    while (xt(f));
    if (f === 35)
      do
        f = e.input.charCodeAt(++e.position);
      while (!Je(f) && f !== 0);
  }
  for (; f !== 0; ) {
    for (hs(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!s || e.lineIndent < a) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!s && e.lineIndent > a && (a = e.lineIndent), Je(f)) {
      l++;
      continue;
    }
    if (e.lineIndent < a) {
      i === Ta ? e.result += Dt.repeat(`
`, o ? 1 + l : l) : i === Mi && o && (e.result += `
`);
      break;
    }
    for (n ? xt(f) ? (c = !0, e.result += Dt.repeat(`
`, o ? 1 + l : l)) : c ? (c = !1, e.result += Dt.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += Dt.repeat(`
`, l) : e.result += Dt.repeat(`
`, o ? 1 + l : l), o = !0, s = !0, l = 0, r = e.position; !Je(f) && f !== 0; )
      f = e.input.charCodeAt(++e.position);
    ht(e, r, e.position, !1);
  }
  return !0;
}
function Ia(e, t) {
  var r, n = e.tag, i = e.anchor, o = [], s, a = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), !(l !== 45 || (s = e.input.charCodeAt(e.position + 1), !Ne(s)))); ) {
    if (a = !0, e.position++, ce(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, sr(e, t, Gu, !1, !0), o.push(e.result), ce(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && l !== 0)
      L(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return a ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function D0(e, t, r) {
  var n, i, o, s, a, l, c = e.tag, u = e.anchor, f = {}, h = /* @__PURE__ */ Object.create(null), m = null, y = null, S = null, v = !1, A = !1, b;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), b = e.input.charCodeAt(e.position); b !== 0; ) {
    if (!v && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), o = e.line, (b === 63 || b === 58) && Ne(n))
      b === 63 ? (v && (Kt(e, f, h, m, y, null, s, a, l), m = y = S = null), A = !0, v = !0, i = !0) : v ? (v = !1, i = !0) : L(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, b = n;
    else {
      if (s = e.line, a = e.lineStart, l = e.position, !sr(e, r, Hu, !1, !0))
        break;
      if (e.line === o) {
        for (b = e.input.charCodeAt(e.position); xt(b); )
          b = e.input.charCodeAt(++e.position);
        if (b === 58)
          b = e.input.charCodeAt(++e.position), Ne(b) || L(e, "a whitespace character is expected after the key-value separator within a block mapping"), v && (Kt(e, f, h, m, y, null, s, a, l), m = y = S = null), A = !0, v = !1, i = !1, m = e.tag, y = e.result;
        else if (A)
          L(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = c, e.anchor = u, !0;
      } else if (A)
        L(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = c, e.anchor = u, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (v && (s = e.line, a = e.lineStart, l = e.position), sr(e, t, Gn, !0, i) && (v ? y = e.result : S = e.result), v || (Kt(e, f, h, m, y, S, s, a, l), m = y = S = null), ce(e, !0, -1), b = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && b !== 0)
      L(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return v && Kt(e, f, h, m, y, null, s, a, l), A && (e.tag = c, e.anchor = u, e.kind = "mapping", e.result = f), A;
}
function N0(e) {
  var t, r = !1, n = !1, i, o, s;
  if (s = e.input.charCodeAt(e.position), s !== 33) return !1;
  if (e.tag !== null && L(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (r = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (n = !0, i = "!!", s = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), s = e.input.charCodeAt(++e.position)) : L(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !Ne(s); )
      s === 33 && (n ? L(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), Wu.test(i) || L(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), s = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), _0.test(o) && L(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !Vu.test(o) && L(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    L(e, "tag name is malformed: " + o);
  }
  return r ? e.tag = o : yt.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : L(e, 'undeclared tag handle "' + i + '"'), !0;
}
function F0(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && L(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Ne(r) && !Jt(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function x0(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Ne(n) && !Jt(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), yt.call(e.anchorMap, r) || L(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], ce(e, !0, -1), !0;
}
function sr(e, t, r, n, i) {
  var o, s, a, l = 1, c = !1, u = !1, f, h, m, y, S, v;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = s = a = Gn === r || Gu === r, n && ce(e, !0, -1) && (c = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; N0(e) || F0(e); )
      ce(e, !0, -1) ? (c = !0, a = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : a = !1;
  if (a && (a = c || i), (l === 1 || Gn === r) && (Hn === r || Hu === r ? S = t : S = t + 1, v = e.position - e.lineStart, l === 1 ? a && (Ia(e, v) || D0(e, v, S)) || I0(e, S) ? u = !0 : (s && R0(e, S) || O0(e, S) || P0(e, S) ? u = !0 : x0(e) ? (u = !0, (e.tag !== null || e.anchor !== null) && L(e, "alias node should not have any properties")) : $0(e, S, Hn === r) && (u = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (u = a && Ia(e, v))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && L(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), f = 0, h = e.implicitTypes.length; f < h; f += 1)
      if (y = e.implicitTypes[f], y.resolve(e.result)) {
        e.result = y.construct(e.result), e.tag = y.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (yt.call(e.typeMap[e.kind || "fallback"], e.tag))
      y = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (y = null, m = e.typeMap.multi[e.kind || "fallback"], f = 0, h = m.length; f < h; f += 1)
        if (e.tag.slice(0, m[f].tag.length) === m[f].tag) {
          y = m[f];
          break;
        }
    y || L(e, "unknown tag !<" + e.tag + ">"), e.result !== null && y.kind !== e.kind && L(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + y.kind + '", not "' + e.kind + '"'), y.resolve(e.result, e.tag) ? (e.result = y.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : L(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || u;
}
function L0(e) {
  var t = e.position, r, n, i, o = !1, s;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (s = e.input.charCodeAt(e.position)) !== 0 && (ce(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || s !== 37)); ) {
    for (o = !0, s = e.input.charCodeAt(++e.position), r = e.position; s !== 0 && !Ne(s); )
      s = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && L(e, "directive name must not be less than one character in length"); s !== 0; ) {
      for (; xt(s); )
        s = e.input.charCodeAt(++e.position);
      if (s === 35) {
        do
          s = e.input.charCodeAt(++e.position);
        while (s !== 0 && !Je(s));
        break;
      }
      if (Je(s)) break;
      for (r = e.position; s !== 0 && !Ne(s); )
        s = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    s !== 0 && hs(e), yt.call(Oa, n) ? Oa[n](e, n, i) : Wn(e, 'unknown document directive "' + n + '"');
  }
  if (ce(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, ce(e, !0, -1)) : o && L(e, "directives end mark is expected"), sr(e, e.lineIndent - 1, Gn, !1, !0), ce(e, !0, -1), e.checkLineBreaks && w0.test(e.input.slice(t, e.position)) && Wn(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && ni(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, ce(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    L(e, "end of the stream or a document separator is expected");
  else
    return;
}
function Ju(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new C0(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, L(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    L0(r);
  return r.documents;
}
function U0(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = Ju(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, o = n.length; i < o; i += 1)
    t(n[i]);
}
function k0(e, t) {
  var r = Ju(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new qu("expected a single document in the stream, but found more");
  }
}
us.loadAll = U0;
us.load = k0;
var Ku = {}, ii = He, Qr = Kr, M0 = ds, Qu = Object.prototype.toString, Zu = Object.prototype.hasOwnProperty, ms = 65279, j0 = 9, Lr = 10, B0 = 13, q0 = 32, H0 = 33, G0 = 34, jo = 35, W0 = 37, V0 = 38, z0 = 39, Y0 = 42, ef = 44, X0 = 45, Vn = 58, J0 = 61, K0 = 62, Q0 = 63, Z0 = 64, tf = 91, rf = 93, ey = 96, nf = 123, ty = 124, of = 125, Ae = {};
Ae[0] = "\\0";
Ae[7] = "\\a";
Ae[8] = "\\b";
Ae[9] = "\\t";
Ae[10] = "\\n";
Ae[11] = "\\v";
Ae[12] = "\\f";
Ae[13] = "\\r";
Ae[27] = "\\e";
Ae[34] = '\\"';
Ae[92] = "\\\\";
Ae[133] = "\\N";
Ae[160] = "\\_";
Ae[8232] = "\\L";
Ae[8233] = "\\P";
var ry = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], ny = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function iy(e, t) {
  var r, n, i, o, s, a, l;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, o = n.length; i < o; i += 1)
    s = n[i], a = String(t[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), l = e.compiledTypeMap.fallback[s], l && Zu.call(l.styleAliases, a) && (a = l.styleAliases[a]), r[s] = a;
  return r;
}
function oy(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new Qr("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + ii.repeat("0", n - t.length) + t;
}
var sy = 1, Ur = 2;
function ay(e) {
  this.schema = e.schema || M0, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = ii.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = iy(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Ur : sy, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Ra(e, t) {
  for (var r = ii.repeat(" ", t), n = 0, i = -1, o = "", s, a = e.length; n < a; )
    i = e.indexOf(`
`, n), i === -1 ? (s = e.slice(n), n = a) : (s = e.slice(n, i + 1), n = i + 1), s.length && s !== `
` && (o += r), o += s;
  return o;
}
function Bo(e, t) {
  return `
` + ii.repeat(" ", e.indent * t);
}
function ly(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function zn(e) {
  return e === q0 || e === j0;
}
function kr(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== ms || 65536 <= e && e <= 1114111;
}
function Da(e) {
  return kr(e) && e !== ms && e !== B0 && e !== Lr;
}
function Na(e, t, r) {
  var n = Da(e), i = n && !zn(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== ef && e !== tf && e !== rf && e !== nf && e !== of) && e !== jo && !(t === Vn && !i) || Da(t) && !zn(t) && e === jo || t === Vn && i
  );
}
function cy(e) {
  return kr(e) && e !== ms && !zn(e) && e !== X0 && e !== Q0 && e !== Vn && e !== ef && e !== tf && e !== rf && e !== nf && e !== of && e !== jo && e !== V0 && e !== Y0 && e !== H0 && e !== ty && e !== J0 && e !== K0 && e !== z0 && e !== G0 && e !== W0 && e !== Z0 && e !== ey;
}
function uy(e) {
  return !zn(e) && e !== Vn;
}
function br(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function sf(e) {
  var t = /^\n* /;
  return t.test(e);
}
var af = 1, qo = 2, lf = 3, cf = 4, Xt = 5;
function fy(e, t, r, n, i, o, s, a) {
  var l, c = 0, u = null, f = !1, h = !1, m = n !== -1, y = -1, S = cy(br(e, 0)) && uy(br(e, e.length - 1));
  if (t || s)
    for (l = 0; l < e.length; c >= 65536 ? l += 2 : l++) {
      if (c = br(e, l), !kr(c))
        return Xt;
      S = S && Na(c, u, a), u = c;
    }
  else {
    for (l = 0; l < e.length; c >= 65536 ? l += 2 : l++) {
      if (c = br(e, l), c === Lr)
        f = !0, m && (h = h || // Foldable line = too long, and not more-indented.
        l - y - 1 > n && e[y + 1] !== " ", y = l);
      else if (!kr(c))
        return Xt;
      S = S && Na(c, u, a), u = c;
    }
    h = h || m && l - y - 1 > n && e[y + 1] !== " ";
  }
  return !f && !h ? S && !s && !i(e) ? af : o === Ur ? Xt : qo : r > 9 && sf(e) ? Xt : s ? o === Ur ? Xt : qo : h ? cf : lf;
}
function dy(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Ur ? '""' : "''";
    if (!e.noCompatMode && (ry.indexOf(t) !== -1 || ny.test(t)))
      return e.quotingType === Ur ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, r), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), a = n || e.flowLevel > -1 && r >= e.flowLevel;
    function l(c) {
      return ly(e, c);
    }
    switch (fy(
      t,
      a,
      e.indent,
      s,
      l,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case af:
        return t;
      case qo:
        return "'" + t.replace(/'/g, "''") + "'";
      case lf:
        return "|" + Fa(t, e.indent) + xa(Ra(t, o));
      case cf:
        return ">" + Fa(t, e.indent) + xa(Ra(hy(t, s), o));
      case Xt:
        return '"' + py(t) + '"';
      default:
        throw new Qr("impossible error: invalid scalar style");
    }
  }();
}
function Fa(e, t) {
  var r = sf(e) ? String(t) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : n ? "" : "-";
  return r + o + `
`;
}
function xa(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function hy(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var c = e.indexOf(`
`);
    return c = c !== -1 ? c : e.length, r.lastIndex = c, La(e.slice(0, c), t);
  }(), i = e[0] === `
` || e[0] === " ", o, s; s = r.exec(e); ) {
    var a = s[1], l = s[2];
    o = l[0] === " ", n += a + (!i && !o && l !== "" ? `
` : "") + La(l, t), i = o;
  }
  return n;
}
function La(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, o, s = 0, a = 0, l = ""; n = r.exec(e); )
    a = n.index, a - i > t && (o = s > i ? s : a, l += `
` + e.slice(i, o), i = o + 1), s = a;
  return l += `
`, e.length - i > t && s > i ? l += e.slice(i, s) + `
` + e.slice(s + 1) : l += e.slice(i), l.slice(1);
}
function py(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = br(e, i), n = Ae[r], !n && kr(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || oy(r);
  return t;
}
function my(e, t, r) {
  var n = "", i = e.tag, o, s, a;
  for (o = 0, s = r.length; o < s; o += 1)
    a = r[o], e.replacer && (a = e.replacer.call(r, String(o), a)), (rt(e, t, a, !1, !1) || typeof a > "u" && rt(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function Ua(e, t, r, n) {
  var i = "", o = e.tag, s, a, l;
  for (s = 0, a = r.length; s < a; s += 1)
    l = r[s], e.replacer && (l = e.replacer.call(r, String(s), l)), (rt(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && rt(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += Bo(e, t)), e.dump && Lr === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function gy(e, t, r) {
  var n = "", i = e.tag, o = Object.keys(r), s, a, l, c, u;
  for (s = 0, a = o.length; s < a; s += 1)
    u = "", n !== "" && (u += ", "), e.condenseFlow && (u += '"'), l = o[s], c = r[l], e.replacer && (c = e.replacer.call(r, l, c)), rt(e, t, l, !1, !1) && (e.dump.length > 1024 && (u += "? "), u += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), rt(e, t, c, !1, !1) && (u += e.dump, n += u));
  e.tag = i, e.dump = "{" + n + "}";
}
function yy(e, t, r, n) {
  var i = "", o = e.tag, s = Object.keys(r), a, l, c, u, f, h;
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new Qr("sortKeys must be a boolean or a function");
  for (a = 0, l = s.length; a < l; a += 1)
    h = "", (!n || i !== "") && (h += Bo(e, t)), c = s[a], u = r[c], e.replacer && (u = e.replacer.call(r, c, u)), rt(e, t + 1, c, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && Lr === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, f && (h += Bo(e, t)), rt(e, t + 1, u, !0, f) && (e.dump && Lr === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = o, e.dump = i || "{}";
}
function ka(e, t, r) {
  var n, i, o, s, a, l;
  for (i = r ? e.explicitTypes : e.implicitTypes, o = 0, s = i.length; o < s; o += 1)
    if (a = i[o], (a.instanceOf || a.predicate) && (!a.instanceOf || typeof t == "object" && t instanceof a.instanceOf) && (!a.predicate || a.predicate(t))) {
      if (r ? a.multi && a.representName ? e.tag = a.representName(t) : e.tag = a.tag : e.tag = "?", a.represent) {
        if (l = e.styleMap[a.tag] || a.defaultStyle, Qu.call(a.represent) === "[object Function]")
          n = a.represent(t, l);
        else if (Zu.call(a.represent, l))
          n = a.represent[l](t, l);
        else
          throw new Qr("!<" + a.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function rt(e, t, r, n, i, o, s) {
  e.tag = null, e.dump = r, ka(e, r, !1) || ka(e, r, !0);
  var a = Qu.call(e.dump), l = n, c;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var u = a === "[object Object]" || a === "[object Array]", f, h;
  if (u && (f = e.duplicates.indexOf(r), h = f !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (u && h && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), a === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (yy(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (gy(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (a === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !s && t > 0 ? Ua(e, t - 1, e.dump, i) : Ua(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (my(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (a === "[object String]")
      e.tag !== "?" && dy(e, e.dump, t, o, l);
    else {
      if (a === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new Qr("unacceptable kind of an object to dump " + a);
    }
    e.tag !== null && e.tag !== "?" && (c = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? c = "!" + c : c.slice(0, 18) === "tag:yaml.org,2002:" ? c = "!!" + c.slice(18) : c = "!<" + c + ">", e.dump = c + " " + e.dump);
  }
  return !0;
}
function Ey(e, t) {
  var r = [], n = [], i, o;
  for (Ho(e, r, n), i = 0, o = n.length; i < o; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(o);
}
function Ho(e, t, r) {
  var n, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        Ho(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, o = n.length; i < o; i += 1)
        Ho(e[n[i]], t, r);
}
function vy(e, t) {
  t = t || {};
  var r = new ay(t);
  r.noRefs || Ey(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), rt(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
Ku.dump = vy;
var uf = us, wy = Ku;
function gs(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
ve.Type = Ie;
ve.Schema = Su;
ve.FAILSAFE_SCHEMA = Cu;
ve.JSON_SCHEMA = Du;
ve.CORE_SCHEMA = Nu;
ve.DEFAULT_SCHEMA = ds;
ve.load = uf.load;
ve.loadAll = uf.loadAll;
ve.dump = wy.dump;
ve.YAMLException = Kr;
ve.types = {
  binary: ku,
  float: Ru,
  map: Tu,
  null: $u,
  pairs: ju,
  set: Bu,
  timestamp: Lu,
  bool: Ou,
  int: Pu,
  merge: Uu,
  omap: Mu,
  seq: bu,
  str: Au
};
ve.safeLoad = gs("safeLoad", "load");
ve.safeLoadAll = gs("safeLoadAll", "loadAll");
ve.safeDump = gs("safeDump", "dump");
var oi = {};
Object.defineProperty(oi, "__esModule", { value: !0 });
oi.Lazy = void 0;
class _y {
  constructor(t) {
    this._value = null, this.creator = t;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null)
      return this._value;
    const t = this.creator();
    return this.value = t, t;
  }
  set value(t) {
    this._value = t, this.creator = null;
  }
}
oi.Lazy = _y;
var Go = { exports: {} };
const Sy = "2.0.0", ff = 256, Ay = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, by = 16, Ty = ff - 6, Cy = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var si = {
  MAX_LENGTH: ff,
  MAX_SAFE_COMPONENT_LENGTH: by,
  MAX_SAFE_BUILD_LENGTH: Ty,
  MAX_SAFE_INTEGER: Ay,
  RELEASE_TYPES: Cy,
  SEMVER_SPEC_VERSION: Sy,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const $y = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var ai = $y;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = si, o = ai;
  t = e.exports = {};
  const s = t.re = [], a = t.safeRe = [], l = t.src = [], c = t.t = {};
  let u = 0;
  const f = "[a-zA-Z0-9-]", h = [
    ["\\s", 1],
    ["\\d", i],
    [f, n]
  ], m = (S) => {
    for (const [v, A] of h)
      S = S.split(`${v}*`).join(`${v}{0,${A}}`).split(`${v}+`).join(`${v}{1,${A}}`);
    return S;
  }, y = (S, v, A) => {
    const b = m(v), D = u++;
    o(S, D, v), c[S] = D, l[D] = v, s[D] = new RegExp(v, A ? "g" : void 0), a[D] = new RegExp(b, A ? "g" : void 0);
  };
  y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${f}*`), y("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${l[c.NUMERICIDENTIFIER]}|${l[c.NONNUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NUMERICIDENTIFIERLOOSE]}|${l[c.NONNUMERICIDENTIFIER]})`), y("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${f}+`), y("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), y("FULL", `^${l[c.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), y("LOOSE", `^${l[c.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), y("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), y("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", l[c.COERCE], !0), y("COERCERTLFULL", l[c.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", y("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", y("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Go, Go.exports);
var Zr = Go.exports;
const Oy = Object.freeze({ loose: !0 }), Py = Object.freeze({}), Iy = (e) => e ? typeof e != "object" ? Oy : e : Py;
var ys = Iy;
const Ma = /^[0-9]+$/, df = (e, t) => {
  const r = Ma.test(e), n = Ma.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, Ry = (e, t) => df(t, e);
var hf = {
  compareIdentifiers: df,
  rcompareIdentifiers: Ry
};
const _n = ai, { MAX_LENGTH: ja, MAX_SAFE_INTEGER: Sn } = si, { safeRe: Ba, t: qa } = Zr, Dy = ys, { compareIdentifiers: Gt } = hf;
let Ny = class Ye {
  constructor(t, r) {
    if (r = Dy(r), t instanceof Ye) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > ja)
      throw new TypeError(
        `version is longer than ${ja} characters`
      );
    _n("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Ba[qa.LOOSE] : Ba[qa.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Sn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Sn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Sn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < Sn)
          return o;
      }
      return i;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (_n("SemVer.compare", this.version, this.options, t), !(t instanceof Ye)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new Ye(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof Ye || (t = new Ye(t, this.options)), Gt(this.major, t.major) || Gt(this.minor, t.minor) || Gt(this.patch, t.patch);
  }
  comparePre(t) {
    if (t instanceof Ye || (t = new Ye(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], i = t.prerelease[r];
      if (_n("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return Gt(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof Ye || (t = new Ye(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (_n("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return Gt(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(n) ? 1 : 0;
        if (!r && n === !1)
          throw new Error("invalid increment argument: identifier is empty");
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let o = this.prerelease.length;
          for (; --o >= 0; )
            typeof this.prerelease[o] == "number" && (this.prerelease[o]++, o = -2);
          if (o === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (r) {
          let o = [r, i];
          n === !1 && (o = [r]), Gt(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Re = Ny;
const Ha = Re, Fy = (e, t, r = !1) => {
  if (e instanceof Ha)
    return e;
  try {
    return new Ha(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var ur = Fy;
const xy = ur, Ly = (e, t) => {
  const r = xy(e, t);
  return r ? r.version : null;
};
var Uy = Ly;
const ky = ur, My = (e, t) => {
  const r = ky(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var jy = My;
const Ga = Re, By = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new Ga(
      e instanceof Ga ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var qy = By;
const Wa = ur, Hy = (e, t) => {
  const r = Wa(e, null, !0), n = Wa(t, null, !0), i = r.compare(n);
  if (i === 0)
    return null;
  const o = i > 0, s = o ? r : n, a = o ? n : r, l = !!s.prerelease.length;
  if (!!a.prerelease.length && !l)
    return !a.patch && !a.minor ? "major" : s.patch ? "patch" : s.minor ? "minor" : "major";
  const u = l ? "pre" : "";
  return r.major !== n.major ? u + "major" : r.minor !== n.minor ? u + "minor" : r.patch !== n.patch ? u + "patch" : "prerelease";
};
var Gy = Hy;
const Wy = Re, Vy = (e, t) => new Wy(e, t).major;
var zy = Vy;
const Yy = Re, Xy = (e, t) => new Yy(e, t).minor;
var Jy = Xy;
const Ky = Re, Qy = (e, t) => new Ky(e, t).patch;
var Zy = Qy;
const eE = ur, tE = (e, t) => {
  const r = eE(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var rE = tE;
const Va = Re, nE = (e, t, r) => new Va(e, r).compare(new Va(t, r));
var Ge = nE;
const iE = Ge, oE = (e, t, r) => iE(t, e, r);
var sE = oE;
const aE = Ge, lE = (e, t) => aE(e, t, !0);
var cE = lE;
const za = Re, uE = (e, t, r) => {
  const n = new za(e, r), i = new za(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var Es = uE;
const fE = Es, dE = (e, t) => e.sort((r, n) => fE(r, n, t));
var hE = dE;
const pE = Es, mE = (e, t) => e.sort((r, n) => pE(n, r, t));
var gE = mE;
const yE = Ge, EE = (e, t, r) => yE(e, t, r) > 0;
var li = EE;
const vE = Ge, wE = (e, t, r) => vE(e, t, r) < 0;
var vs = wE;
const _E = Ge, SE = (e, t, r) => _E(e, t, r) === 0;
var pf = SE;
const AE = Ge, bE = (e, t, r) => AE(e, t, r) !== 0;
var mf = bE;
const TE = Ge, CE = (e, t, r) => TE(e, t, r) >= 0;
var ws = CE;
const $E = Ge, OE = (e, t, r) => $E(e, t, r) <= 0;
var _s = OE;
const PE = pf, IE = mf, RE = li, DE = ws, NE = vs, FE = _s, xE = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return PE(e, r, n);
    case "!=":
      return IE(e, r, n);
    case ">":
      return RE(e, r, n);
    case ">=":
      return DE(e, r, n);
    case "<":
      return NE(e, r, n);
    case "<=":
      return FE(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var gf = xE;
const LE = Re, UE = ur, { safeRe: An, t: bn } = Zr, kE = (e, t) => {
  if (e instanceof LE)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? An[bn.COERCEFULL] : An[bn.COERCE]);
  else {
    const l = t.includePrerelease ? An[bn.COERCERTLFULL] : An[bn.COERCERTL];
    let c;
    for (; (c = l.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || c.index + c[0].length !== r.index + r[0].length) && (r = c), l.lastIndex = c.index + c[1].length + c[2].length;
    l.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", o = r[4] || "0", s = t.includePrerelease && r[5] ? `-${r[5]}` : "", a = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return UE(`${n}.${i}.${o}${s}${a}`, t);
};
var ME = kE;
class jE {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var BE = jE, ji, Ya;
function We() {
  if (Ya) return ji;
  Ya = 1;
  const e = /\s+/g;
  class t {
    constructor($, R) {
      if (R = i(R), $ instanceof t)
        return $.loose === !!R.loose && $.includePrerelease === !!R.includePrerelease ? $ : new t($.raw, R);
      if ($ instanceof o)
        return this.raw = $.value, this.set = [[$]], this.formatted = void 0, this;
      if (this.options = R, this.loose = !!R.loose, this.includePrerelease = !!R.includePrerelease, this.raw = $.trim().replace(e, " "), this.set = this.raw.split("||").map((C) => this.parseRange(C.trim())).filter((C) => C.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const C = this.set[0];
        if (this.set = this.set.filter((N) => !S(N[0])), this.set.length === 0)
          this.set = [C];
        else if (this.set.length > 1) {
          for (const N of this.set)
            if (N.length === 1 && v(N[0])) {
              this.set = [N];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let $ = 0; $ < this.set.length; $++) {
          $ > 0 && (this.formatted += "||");
          const R = this.set[$];
          for (let C = 0; C < R.length; C++)
            C > 0 && (this.formatted += " "), this.formatted += R[C].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange($) {
      const C = ((this.options.includePrerelease && m) | (this.options.loose && y)) + ":" + $, N = n.get(C);
      if (N)
        return N;
      const I = this.options.loose, k = I ? l[c.HYPHENRANGELOOSE] : l[c.HYPHENRANGE];
      $ = $.replace(k, M(this.options.includePrerelease)), s("hyphen replace", $), $ = $.replace(l[c.COMPARATORTRIM], u), s("comparator trim", $), $ = $.replace(l[c.TILDETRIM], f), s("tilde trim", $), $ = $.replace(l[c.CARETTRIM], h), s("caret trim", $);
      let X = $.split(" ").map((U) => b(U, this.options)).join(" ").split(/\s+/).map((U) => H(U, this.options));
      I && (X = X.filter((U) => (s("loose invalid filter", U, this.options), !!U.match(l[c.COMPARATORLOOSE])))), s("range list", X);
      const G = /* @__PURE__ */ new Map(), ee = X.map((U) => new o(U, this.options));
      for (const U of ee) {
        if (S(U))
          return [U];
        G.set(U.value, U);
      }
      G.size > 1 && G.has("") && G.delete("");
      const de = [...G.values()];
      return n.set(C, de), de;
    }
    intersects($, R) {
      if (!($ instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((C) => A(C, R) && $.set.some((N) => A(N, R) && C.every((I) => N.every((k) => I.intersects(k, R)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test($) {
      if (!$)
        return !1;
      if (typeof $ == "string")
        try {
          $ = new a($, this.options);
        } catch {
          return !1;
        }
      for (let R = 0; R < this.set.length; R++)
        if (Z(this.set[R], $, this.options))
          return !0;
      return !1;
    }
  }
  ji = t;
  const r = BE, n = new r(), i = ys, o = ci(), s = ai, a = Re, {
    safeRe: l,
    t: c,
    comparatorTrimReplace: u,
    tildeTrimReplace: f,
    caretTrimReplace: h
  } = Zr, { FLAG_INCLUDE_PRERELEASE: m, FLAG_LOOSE: y } = si, S = (P) => P.value === "<0.0.0-0", v = (P) => P.value === "", A = (P, $) => {
    let R = !0;
    const C = P.slice();
    let N = C.pop();
    for (; R && C.length; )
      R = C.every((I) => N.intersects(I, $)), N = C.pop();
    return R;
  }, b = (P, $) => (s("comp", P, $), P = q(P, $), s("caret", P), P = x(P, $), s("tildes", P), P = le(P, $), s("xrange", P), P = z(P, $), s("stars", P), P), D = (P) => !P || P.toLowerCase() === "x" || P === "*", x = (P, $) => P.trim().split(/\s+/).map((R) => B(R, $)).join(" "), B = (P, $) => {
    const R = $.loose ? l[c.TILDELOOSE] : l[c.TILDE];
    return P.replace(R, (C, N, I, k, X) => {
      s("tilde", P, C, N, I, k, X);
      let G;
      return D(N) ? G = "" : D(I) ? G = `>=${N}.0.0 <${+N + 1}.0.0-0` : D(k) ? G = `>=${N}.${I}.0 <${N}.${+I + 1}.0-0` : X ? (s("replaceTilde pr", X), G = `>=${N}.${I}.${k}-${X} <${N}.${+I + 1}.0-0`) : G = `>=${N}.${I}.${k} <${N}.${+I + 1}.0-0`, s("tilde return", G), G;
    });
  }, q = (P, $) => P.trim().split(/\s+/).map((R) => j(R, $)).join(" "), j = (P, $) => {
    s("caret", P, $);
    const R = $.loose ? l[c.CARETLOOSE] : l[c.CARET], C = $.includePrerelease ? "-0" : "";
    return P.replace(R, (N, I, k, X, G) => {
      s("caret", P, N, I, k, X, G);
      let ee;
      return D(I) ? ee = "" : D(k) ? ee = `>=${I}.0.0${C} <${+I + 1}.0.0-0` : D(X) ? I === "0" ? ee = `>=${I}.${k}.0${C} <${I}.${+k + 1}.0-0` : ee = `>=${I}.${k}.0${C} <${+I + 1}.0.0-0` : G ? (s("replaceCaret pr", G), I === "0" ? k === "0" ? ee = `>=${I}.${k}.${X}-${G} <${I}.${k}.${+X + 1}-0` : ee = `>=${I}.${k}.${X}-${G} <${I}.${+k + 1}.0-0` : ee = `>=${I}.${k}.${X}-${G} <${+I + 1}.0.0-0`) : (s("no pr"), I === "0" ? k === "0" ? ee = `>=${I}.${k}.${X}${C} <${I}.${k}.${+X + 1}-0` : ee = `>=${I}.${k}.${X}${C} <${I}.${+k + 1}.0-0` : ee = `>=${I}.${k}.${X} <${+I + 1}.0.0-0`), s("caret return", ee), ee;
    });
  }, le = (P, $) => (s("replaceXRanges", P, $), P.split(/\s+/).map((R) => E(R, $)).join(" ")), E = (P, $) => {
    P = P.trim();
    const R = $.loose ? l[c.XRANGELOOSE] : l[c.XRANGE];
    return P.replace(R, (C, N, I, k, X, G) => {
      s("xRange", P, C, N, I, k, X, G);
      const ee = D(I), de = ee || D(k), U = de || D(X), Ve = U;
      return N === "=" && Ve && (N = ""), G = $.includePrerelease ? "-0" : "", ee ? N === ">" || N === "<" ? C = "<0.0.0-0" : C = "*" : N && Ve ? (de && (k = 0), X = 0, N === ">" ? (N = ">=", de ? (I = +I + 1, k = 0, X = 0) : (k = +k + 1, X = 0)) : N === "<=" && (N = "<", de ? I = +I + 1 : k = +k + 1), N === "<" && (G = "-0"), C = `${N + I}.${k}.${X}${G}`) : de ? C = `>=${I}.0.0${G} <${+I + 1}.0.0-0` : U && (C = `>=${I}.${k}.0${G} <${I}.${+k + 1}.0-0`), s("xRange return", C), C;
    });
  }, z = (P, $) => (s("replaceStars", P, $), P.trim().replace(l[c.STAR], "")), H = (P, $) => (s("replaceGTE0", P, $), P.trim().replace(l[$.includePrerelease ? c.GTE0PRE : c.GTE0], "")), M = (P) => ($, R, C, N, I, k, X, G, ee, de, U, Ve) => (D(C) ? R = "" : D(N) ? R = `>=${C}.0.0${P ? "-0" : ""}` : D(I) ? R = `>=${C}.${N}.0${P ? "-0" : ""}` : k ? R = `>=${R}` : R = `>=${R}${P ? "-0" : ""}`, D(ee) ? G = "" : D(de) ? G = `<${+ee + 1}.0.0-0` : D(U) ? G = `<${ee}.${+de + 1}.0-0` : Ve ? G = `<=${ee}.${de}.${U}-${Ve}` : P ? G = `<${ee}.${de}.${+U + 1}-0` : G = `<=${G}`, `${R} ${G}`.trim()), Z = (P, $, R) => {
    for (let C = 0; C < P.length; C++)
      if (!P[C].test($))
        return !1;
    if ($.prerelease.length && !R.includePrerelease) {
      for (let C = 0; C < P.length; C++)
        if (s(P[C].semver), P[C].semver !== o.ANY && P[C].semver.prerelease.length > 0) {
          const N = P[C].semver;
          if (N.major === $.major && N.minor === $.minor && N.patch === $.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return ji;
}
var Bi, Xa;
function ci() {
  if (Xa) return Bi;
  Xa = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(u, f) {
      if (f = r(f), u instanceof t) {
        if (u.loose === !!f.loose)
          return u;
        u = u.value;
      }
      u = u.trim().split(/\s+/).join(" "), s("comparator", u, f), this.options = f, this.loose = !!f.loose, this.parse(u), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, s("comp", this);
    }
    parse(u) {
      const f = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], h = u.match(f);
      if (!h)
        throw new TypeError(`Invalid comparator: ${u}`);
      this.operator = h[1] !== void 0 ? h[1] : "", this.operator === "=" && (this.operator = ""), h[2] ? this.semver = new a(h[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(u) {
      if (s("Comparator.test", u, this.options.loose), this.semver === e || u === e)
        return !0;
      if (typeof u == "string")
        try {
          u = new a(u, this.options);
        } catch {
          return !1;
        }
      return o(u, this.operator, this.semver, this.options);
    }
    intersects(u, f) {
      if (!(u instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new l(u.value, f).test(this.value) : u.operator === "" ? u.value === "" ? !0 : new l(this.value, f).test(u.semver) : (f = r(f), f.includePrerelease && (this.value === "<0.0.0-0" || u.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || u.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && u.operator.startsWith(">") || this.operator.startsWith("<") && u.operator.startsWith("<") || this.semver.version === u.semver.version && this.operator.includes("=") && u.operator.includes("=") || o(this.semver, "<", u.semver, f) && this.operator.startsWith(">") && u.operator.startsWith("<") || o(this.semver, ">", u.semver, f) && this.operator.startsWith("<") && u.operator.startsWith(">")));
    }
  }
  Bi = t;
  const r = ys, { safeRe: n, t: i } = Zr, o = gf, s = ai, a = Re, l = We();
  return Bi;
}
const qE = We(), HE = (e, t, r) => {
  try {
    t = new qE(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var ui = HE;
const GE = We(), WE = (e, t) => new GE(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var VE = WE;
const zE = Re, YE = We(), XE = (e, t, r) => {
  let n = null, i = null, o = null;
  try {
    o = new YE(t, r);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    o.test(s) && (!n || i.compare(s) === -1) && (n = s, i = new zE(n, r));
  }), n;
};
var JE = XE;
const KE = Re, QE = We(), ZE = (e, t, r) => {
  let n = null, i = null, o = null;
  try {
    o = new QE(t, r);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    o.test(s) && (!n || i.compare(s) === 1) && (n = s, i = new KE(n, r));
  }), n;
};
var ev = ZE;
const qi = Re, tv = We(), Ja = li, rv = (e, t) => {
  e = new tv(e, t);
  let r = new qi("0.0.0");
  if (e.test(r) || (r = new qi("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let o = null;
    i.forEach((s) => {
      const a = new qi(s.semver.version);
      switch (s.operator) {
        case ">":
          a.prerelease.length === 0 ? a.patch++ : a.prerelease.push(0), a.raw = a.format();
        case "":
        case ">=":
          (!o || Ja(a, o)) && (o = a);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${s.operator}`);
      }
    }), o && (!r || Ja(r, o)) && (r = o);
  }
  return r && e.test(r) ? r : null;
};
var nv = rv;
const iv = We(), ov = (e, t) => {
  try {
    return new iv(e, t).range || "*";
  } catch {
    return null;
  }
};
var sv = ov;
const av = Re, yf = ci(), { ANY: lv } = yf, cv = We(), uv = ui, Ka = li, Qa = vs, fv = _s, dv = ws, hv = (e, t, r, n) => {
  e = new av(e, n), t = new cv(t, n);
  let i, o, s, a, l;
  switch (r) {
    case ">":
      i = Ka, o = fv, s = Qa, a = ">", l = ">=";
      break;
    case "<":
      i = Qa, o = dv, s = Ka, a = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (uv(e, t, n))
    return !1;
  for (let c = 0; c < t.set.length; ++c) {
    const u = t.set[c];
    let f = null, h = null;
    if (u.forEach((m) => {
      m.semver === lv && (m = new yf(">=0.0.0")), f = f || m, h = h || m, i(m.semver, f.semver, n) ? f = m : s(m.semver, h.semver, n) && (h = m);
    }), f.operator === a || f.operator === l || (!h.operator || h.operator === a) && o(e, h.semver))
      return !1;
    if (h.operator === l && s(e, h.semver))
      return !1;
  }
  return !0;
};
var Ss = hv;
const pv = Ss, mv = (e, t, r) => pv(e, t, ">", r);
var gv = mv;
const yv = Ss, Ev = (e, t, r) => yv(e, t, "<", r);
var vv = Ev;
const Za = We(), wv = (e, t, r) => (e = new Za(e, r), t = new Za(t, r), e.intersects(t, r));
var _v = wv;
const Sv = ui, Av = Ge;
var bv = (e, t, r) => {
  const n = [];
  let i = null, o = null;
  const s = e.sort((u, f) => Av(u, f, r));
  for (const u of s)
    Sv(u, t, r) ? (o = u, i || (i = u)) : (o && n.push([i, o]), o = null, i = null);
  i && n.push([i, null]);
  const a = [];
  for (const [u, f] of n)
    u === f ? a.push(u) : !f && u === s[0] ? a.push("*") : f ? u === s[0] ? a.push(`<=${f}`) : a.push(`${u} - ${f}`) : a.push(`>=${u}`);
  const l = a.join(" || "), c = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < c.length ? l : t;
};
const el = We(), As = ci(), { ANY: Hi } = As, wr = ui, bs = Ge, Tv = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new el(e, r), t = new el(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const s = $v(i, o, r);
      if (n = n || s !== null, s)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, Cv = [new As(">=0.0.0-0")], tl = [new As(">=0.0.0")], $v = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Hi) {
    if (t.length === 1 && t[0].semver === Hi)
      return !0;
    r.includePrerelease ? e = Cv : e = tl;
  }
  if (t.length === 1 && t[0].semver === Hi) {
    if (r.includePrerelease)
      return !0;
    t = tl;
  }
  const n = /* @__PURE__ */ new Set();
  let i, o;
  for (const m of e)
    m.operator === ">" || m.operator === ">=" ? i = rl(i, m, r) : m.operator === "<" || m.operator === "<=" ? o = nl(o, m, r) : n.add(m.semver);
  if (n.size > 1)
    return null;
  let s;
  if (i && o) {
    if (s = bs(i.semver, o.semver, r), s > 0)
      return null;
    if (s === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const m of n) {
    if (i && !wr(m, String(i), r) || o && !wr(m, String(o), r))
      return null;
    for (const y of t)
      if (!wr(m, String(y), r))
        return !1;
    return !0;
  }
  let a, l, c, u, f = o && !r.includePrerelease && o.semver.prerelease.length ? o.semver : !1, h = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && o.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const m of t) {
    if (u = u || m.operator === ">" || m.operator === ">=", c = c || m.operator === "<" || m.operator === "<=", i) {
      if (h && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === h.major && m.semver.minor === h.minor && m.semver.patch === h.patch && (h = !1), m.operator === ">" || m.operator === ">=") {
        if (a = rl(i, m, r), a === m && a !== i)
          return !1;
      } else if (i.operator === ">=" && !wr(i.semver, String(m), r))
        return !1;
    }
    if (o) {
      if (f && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === f.major && m.semver.minor === f.minor && m.semver.patch === f.patch && (f = !1), m.operator === "<" || m.operator === "<=") {
        if (l = nl(o, m, r), l === m && l !== o)
          return !1;
      } else if (o.operator === "<=" && !wr(o.semver, String(m), r))
        return !1;
    }
    if (!m.operator && (o || i) && s !== 0)
      return !1;
  }
  return !(i && c && !o && s !== 0 || o && u && !i && s !== 0 || h || f);
}, rl = (e, t, r) => {
  if (!e)
    return t;
  const n = bs(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, nl = (e, t, r) => {
  if (!e)
    return t;
  const n = bs(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var Ov = Tv;
const Gi = Zr, il = si, Pv = Re, ol = hf, Iv = ur, Rv = Uy, Dv = jy, Nv = qy, Fv = Gy, xv = zy, Lv = Jy, Uv = Zy, kv = rE, Mv = Ge, jv = sE, Bv = cE, qv = Es, Hv = hE, Gv = gE, Wv = li, Vv = vs, zv = pf, Yv = mf, Xv = ws, Jv = _s, Kv = gf, Qv = ME, Zv = ci(), ew = We(), tw = ui, rw = VE, nw = JE, iw = ev, ow = nv, sw = sv, aw = Ss, lw = gv, cw = vv, uw = _v, fw = bv, dw = Ov;
var Ef = {
  parse: Iv,
  valid: Rv,
  clean: Dv,
  inc: Nv,
  diff: Fv,
  major: xv,
  minor: Lv,
  patch: Uv,
  prerelease: kv,
  compare: Mv,
  rcompare: jv,
  compareLoose: Bv,
  compareBuild: qv,
  sort: Hv,
  rsort: Gv,
  gt: Wv,
  lt: Vv,
  eq: zv,
  neq: Yv,
  gte: Xv,
  lte: Jv,
  cmp: Kv,
  coerce: Qv,
  Comparator: Zv,
  Range: ew,
  satisfies: tw,
  toComparators: rw,
  maxSatisfying: nw,
  minSatisfying: iw,
  minVersion: ow,
  validRange: sw,
  outside: aw,
  gtr: lw,
  ltr: cw,
  intersects: uw,
  simplifyRange: fw,
  subset: dw,
  SemVer: Pv,
  re: Gi.re,
  src: Gi.src,
  tokens: Gi.t,
  SEMVER_SPEC_VERSION: il.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: il.RELEASE_TYPES,
  compareIdentifiers: ol.compareIdentifiers,
  rcompareIdentifiers: ol.rcompareIdentifiers
}, en = {}, Yn = { exports: {} };
Yn.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, o = 2, s = 9007199254740991, a = "[object Arguments]", l = "[object Array]", c = "[object AsyncFunction]", u = "[object Boolean]", f = "[object Date]", h = "[object Error]", m = "[object Function]", y = "[object GeneratorFunction]", S = "[object Map]", v = "[object Number]", A = "[object Null]", b = "[object Object]", D = "[object Promise]", x = "[object Proxy]", B = "[object RegExp]", q = "[object Set]", j = "[object String]", le = "[object Symbol]", E = "[object Undefined]", z = "[object WeakMap]", H = "[object ArrayBuffer]", M = "[object DataView]", Z = "[object Float32Array]", P = "[object Float64Array]", $ = "[object Int8Array]", R = "[object Int16Array]", C = "[object Int32Array]", N = "[object Uint8Array]", I = "[object Uint8ClampedArray]", k = "[object Uint16Array]", X = "[object Uint32Array]", G = /[\\^$.*+?()[\]{}|]/g, ee = /^\[object .+?Constructor\]$/, de = /^(?:0|[1-9]\d*)$/, U = {};
  U[Z] = U[P] = U[$] = U[R] = U[C] = U[N] = U[I] = U[k] = U[X] = !0, U[a] = U[l] = U[H] = U[u] = U[M] = U[f] = U[h] = U[m] = U[S] = U[v] = U[b] = U[B] = U[q] = U[j] = U[z] = !1;
  var Ve = typeof Te == "object" && Te && Te.Object === Object && Te, p = typeof self == "object" && self && self.Object === Object && self, d = Ve || p || Function("return this")(), T = t && !t.nodeType && t, _ = T && !0 && e && !e.nodeType && e, K = _ && _.exports === T, ne = K && Ve.process, se = function() {
    try {
      return ne && ne.binding && ne.binding("util");
    } catch {
    }
  }(), ge = se && se.isTypedArray;
  function we(g, w) {
    for (var O = -1, F = g == null ? 0 : g.length, re = 0, V = []; ++O < F; ) {
      var ae = g[O];
      w(ae, O, g) && (V[re++] = ae);
    }
    return V;
  }
  function it(g, w) {
    for (var O = -1, F = w.length, re = g.length; ++O < F; )
      g[re + O] = w[O];
    return g;
  }
  function ue(g, w) {
    for (var O = -1, F = g == null ? 0 : g.length; ++O < F; )
      if (w(g[O], O, g))
        return !0;
    return !1;
  }
  function Me(g, w) {
    for (var O = -1, F = Array(g); ++O < g; )
      F[O] = w(O);
    return F;
  }
  function wi(g) {
    return function(w) {
      return g(w);
    };
  }
  function on(g, w) {
    return g.has(w);
  }
  function dr(g, w) {
    return g == null ? void 0 : g[w];
  }
  function sn(g) {
    var w = -1, O = Array(g.size);
    return g.forEach(function(F, re) {
      O[++w] = [re, F];
    }), O;
  }
  function kf(g, w) {
    return function(O) {
      return g(w(O));
    };
  }
  function Mf(g) {
    var w = -1, O = Array(g.size);
    return g.forEach(function(F) {
      O[++w] = F;
    }), O;
  }
  var jf = Array.prototype, Bf = Function.prototype, an = Object.prototype, _i = d["__core-js_shared__"], Os = Bf.toString, ze = an.hasOwnProperty, Ps = function() {
    var g = /[^.]+$/.exec(_i && _i.keys && _i.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), Is = an.toString, qf = RegExp(
    "^" + Os.call(ze).replace(G, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Rs = K ? d.Buffer : void 0, ln = d.Symbol, Ds = d.Uint8Array, Ns = an.propertyIsEnumerable, Hf = jf.splice, At = ln ? ln.toStringTag : void 0, Fs = Object.getOwnPropertySymbols, Gf = Rs ? Rs.isBuffer : void 0, Wf = kf(Object.keys, Object), Si = Bt(d, "DataView"), hr = Bt(d, "Map"), Ai = Bt(d, "Promise"), bi = Bt(d, "Set"), Ti = Bt(d, "WeakMap"), pr = Bt(Object, "create"), Vf = Ct(Si), zf = Ct(hr), Yf = Ct(Ai), Xf = Ct(bi), Jf = Ct(Ti), xs = ln ? ln.prototype : void 0, Ci = xs ? xs.valueOf : void 0;
  function bt(g) {
    var w = -1, O = g == null ? 0 : g.length;
    for (this.clear(); ++w < O; ) {
      var F = g[w];
      this.set(F[0], F[1]);
    }
  }
  function Kf() {
    this.__data__ = pr ? pr(null) : {}, this.size = 0;
  }
  function Qf(g) {
    var w = this.has(g) && delete this.__data__[g];
    return this.size -= w ? 1 : 0, w;
  }
  function Zf(g) {
    var w = this.__data__;
    if (pr) {
      var O = w[g];
      return O === n ? void 0 : O;
    }
    return ze.call(w, g) ? w[g] : void 0;
  }
  function ed(g) {
    var w = this.__data__;
    return pr ? w[g] !== void 0 : ze.call(w, g);
  }
  function td(g, w) {
    var O = this.__data__;
    return this.size += this.has(g) ? 0 : 1, O[g] = pr && w === void 0 ? n : w, this;
  }
  bt.prototype.clear = Kf, bt.prototype.delete = Qf, bt.prototype.get = Zf, bt.prototype.has = ed, bt.prototype.set = td;
  function Qe(g) {
    var w = -1, O = g == null ? 0 : g.length;
    for (this.clear(); ++w < O; ) {
      var F = g[w];
      this.set(F[0], F[1]);
    }
  }
  function rd() {
    this.__data__ = [], this.size = 0;
  }
  function nd(g) {
    var w = this.__data__, O = un(w, g);
    if (O < 0)
      return !1;
    var F = w.length - 1;
    return O == F ? w.pop() : Hf.call(w, O, 1), --this.size, !0;
  }
  function id(g) {
    var w = this.__data__, O = un(w, g);
    return O < 0 ? void 0 : w[O][1];
  }
  function od(g) {
    return un(this.__data__, g) > -1;
  }
  function sd(g, w) {
    var O = this.__data__, F = un(O, g);
    return F < 0 ? (++this.size, O.push([g, w])) : O[F][1] = w, this;
  }
  Qe.prototype.clear = rd, Qe.prototype.delete = nd, Qe.prototype.get = id, Qe.prototype.has = od, Qe.prototype.set = sd;
  function Tt(g) {
    var w = -1, O = g == null ? 0 : g.length;
    for (this.clear(); ++w < O; ) {
      var F = g[w];
      this.set(F[0], F[1]);
    }
  }
  function ad() {
    this.size = 0, this.__data__ = {
      hash: new bt(),
      map: new (hr || Qe)(),
      string: new bt()
    };
  }
  function ld(g) {
    var w = fn(this, g).delete(g);
    return this.size -= w ? 1 : 0, w;
  }
  function cd(g) {
    return fn(this, g).get(g);
  }
  function ud(g) {
    return fn(this, g).has(g);
  }
  function fd(g, w) {
    var O = fn(this, g), F = O.size;
    return O.set(g, w), this.size += O.size == F ? 0 : 1, this;
  }
  Tt.prototype.clear = ad, Tt.prototype.delete = ld, Tt.prototype.get = cd, Tt.prototype.has = ud, Tt.prototype.set = fd;
  function cn(g) {
    var w = -1, O = g == null ? 0 : g.length;
    for (this.__data__ = new Tt(); ++w < O; )
      this.add(g[w]);
  }
  function dd(g) {
    return this.__data__.set(g, n), this;
  }
  function hd(g) {
    return this.__data__.has(g);
  }
  cn.prototype.add = cn.prototype.push = dd, cn.prototype.has = hd;
  function ot(g) {
    var w = this.__data__ = new Qe(g);
    this.size = w.size;
  }
  function pd() {
    this.__data__ = new Qe(), this.size = 0;
  }
  function md(g) {
    var w = this.__data__, O = w.delete(g);
    return this.size = w.size, O;
  }
  function gd(g) {
    return this.__data__.get(g);
  }
  function yd(g) {
    return this.__data__.has(g);
  }
  function Ed(g, w) {
    var O = this.__data__;
    if (O instanceof Qe) {
      var F = O.__data__;
      if (!hr || F.length < r - 1)
        return F.push([g, w]), this.size = ++O.size, this;
      O = this.__data__ = new Tt(F);
    }
    return O.set(g, w), this.size = O.size, this;
  }
  ot.prototype.clear = pd, ot.prototype.delete = md, ot.prototype.get = gd, ot.prototype.has = yd, ot.prototype.set = Ed;
  function vd(g, w) {
    var O = dn(g), F = !O && Fd(g), re = !O && !F && $i(g), V = !O && !F && !re && Gs(g), ae = O || F || re || V, he = ae ? Me(g.length, String) : [], ye = he.length;
    for (var ie in g)
      ze.call(g, ie) && !(ae && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ie == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      re && (ie == "offset" || ie == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      V && (ie == "buffer" || ie == "byteLength" || ie == "byteOffset") || // Skip index properties.
      Pd(ie, ye))) && he.push(ie);
    return he;
  }
  function un(g, w) {
    for (var O = g.length; O--; )
      if (js(g[O][0], w))
        return O;
    return -1;
  }
  function wd(g, w, O) {
    var F = w(g);
    return dn(g) ? F : it(F, O(g));
  }
  function mr(g) {
    return g == null ? g === void 0 ? E : A : At && At in Object(g) ? $d(g) : Nd(g);
  }
  function Ls(g) {
    return gr(g) && mr(g) == a;
  }
  function Us(g, w, O, F, re) {
    return g === w ? !0 : g == null || w == null || !gr(g) && !gr(w) ? g !== g && w !== w : _d(g, w, O, F, Us, re);
  }
  function _d(g, w, O, F, re, V) {
    var ae = dn(g), he = dn(w), ye = ae ? l : st(g), ie = he ? l : st(w);
    ye = ye == a ? b : ye, ie = ie == a ? b : ie;
    var Fe = ye == b, je = ie == b, _e = ye == ie;
    if (_e && $i(g)) {
      if (!$i(w))
        return !1;
      ae = !0, Fe = !1;
    }
    if (_e && !Fe)
      return V || (V = new ot()), ae || Gs(g) ? ks(g, w, O, F, re, V) : Td(g, w, ye, O, F, re, V);
    if (!(O & i)) {
      var Le = Fe && ze.call(g, "__wrapped__"), Ue = je && ze.call(w, "__wrapped__");
      if (Le || Ue) {
        var at = Le ? g.value() : g, Ze = Ue ? w.value() : w;
        return V || (V = new ot()), re(at, Ze, O, F, V);
      }
    }
    return _e ? (V || (V = new ot()), Cd(g, w, O, F, re, V)) : !1;
  }
  function Sd(g) {
    if (!Hs(g) || Rd(g))
      return !1;
    var w = Bs(g) ? qf : ee;
    return w.test(Ct(g));
  }
  function Ad(g) {
    return gr(g) && qs(g.length) && !!U[mr(g)];
  }
  function bd(g) {
    if (!Dd(g))
      return Wf(g);
    var w = [];
    for (var O in Object(g))
      ze.call(g, O) && O != "constructor" && w.push(O);
    return w;
  }
  function ks(g, w, O, F, re, V) {
    var ae = O & i, he = g.length, ye = w.length;
    if (he != ye && !(ae && ye > he))
      return !1;
    var ie = V.get(g);
    if (ie && V.get(w))
      return ie == w;
    var Fe = -1, je = !0, _e = O & o ? new cn() : void 0;
    for (V.set(g, w), V.set(w, g); ++Fe < he; ) {
      var Le = g[Fe], Ue = w[Fe];
      if (F)
        var at = ae ? F(Ue, Le, Fe, w, g, V) : F(Le, Ue, Fe, g, w, V);
      if (at !== void 0) {
        if (at)
          continue;
        je = !1;
        break;
      }
      if (_e) {
        if (!ue(w, function(Ze, $t) {
          if (!on(_e, $t) && (Le === Ze || re(Le, Ze, O, F, V)))
            return _e.push($t);
        })) {
          je = !1;
          break;
        }
      } else if (!(Le === Ue || re(Le, Ue, O, F, V))) {
        je = !1;
        break;
      }
    }
    return V.delete(g), V.delete(w), je;
  }
  function Td(g, w, O, F, re, V, ae) {
    switch (O) {
      case M:
        if (g.byteLength != w.byteLength || g.byteOffset != w.byteOffset)
          return !1;
        g = g.buffer, w = w.buffer;
      case H:
        return !(g.byteLength != w.byteLength || !V(new Ds(g), new Ds(w)));
      case u:
      case f:
      case v:
        return js(+g, +w);
      case h:
        return g.name == w.name && g.message == w.message;
      case B:
      case j:
        return g == w + "";
      case S:
        var he = sn;
      case q:
        var ye = F & i;
        if (he || (he = Mf), g.size != w.size && !ye)
          return !1;
        var ie = ae.get(g);
        if (ie)
          return ie == w;
        F |= o, ae.set(g, w);
        var Fe = ks(he(g), he(w), F, re, V, ae);
        return ae.delete(g), Fe;
      case le:
        if (Ci)
          return Ci.call(g) == Ci.call(w);
    }
    return !1;
  }
  function Cd(g, w, O, F, re, V) {
    var ae = O & i, he = Ms(g), ye = he.length, ie = Ms(w), Fe = ie.length;
    if (ye != Fe && !ae)
      return !1;
    for (var je = ye; je--; ) {
      var _e = he[je];
      if (!(ae ? _e in w : ze.call(w, _e)))
        return !1;
    }
    var Le = V.get(g);
    if (Le && V.get(w))
      return Le == w;
    var Ue = !0;
    V.set(g, w), V.set(w, g);
    for (var at = ae; ++je < ye; ) {
      _e = he[je];
      var Ze = g[_e], $t = w[_e];
      if (F)
        var Ws = ae ? F($t, Ze, _e, w, g, V) : F(Ze, $t, _e, g, w, V);
      if (!(Ws === void 0 ? Ze === $t || re(Ze, $t, O, F, V) : Ws)) {
        Ue = !1;
        break;
      }
      at || (at = _e == "constructor");
    }
    if (Ue && !at) {
      var hn = g.constructor, pn = w.constructor;
      hn != pn && "constructor" in g && "constructor" in w && !(typeof hn == "function" && hn instanceof hn && typeof pn == "function" && pn instanceof pn) && (Ue = !1);
    }
    return V.delete(g), V.delete(w), Ue;
  }
  function Ms(g) {
    return wd(g, Ud, Od);
  }
  function fn(g, w) {
    var O = g.__data__;
    return Id(w) ? O[typeof w == "string" ? "string" : "hash"] : O.map;
  }
  function Bt(g, w) {
    var O = dr(g, w);
    return Sd(O) ? O : void 0;
  }
  function $d(g) {
    var w = ze.call(g, At), O = g[At];
    try {
      g[At] = void 0;
      var F = !0;
    } catch {
    }
    var re = Is.call(g);
    return F && (w ? g[At] = O : delete g[At]), re;
  }
  var Od = Fs ? function(g) {
    return g == null ? [] : (g = Object(g), we(Fs(g), function(w) {
      return Ns.call(g, w);
    }));
  } : kd, st = mr;
  (Si && st(new Si(new ArrayBuffer(1))) != M || hr && st(new hr()) != S || Ai && st(Ai.resolve()) != D || bi && st(new bi()) != q || Ti && st(new Ti()) != z) && (st = function(g) {
    var w = mr(g), O = w == b ? g.constructor : void 0, F = O ? Ct(O) : "";
    if (F)
      switch (F) {
        case Vf:
          return M;
        case zf:
          return S;
        case Yf:
          return D;
        case Xf:
          return q;
        case Jf:
          return z;
      }
    return w;
  });
  function Pd(g, w) {
    return w = w ?? s, !!w && (typeof g == "number" || de.test(g)) && g > -1 && g % 1 == 0 && g < w;
  }
  function Id(g) {
    var w = typeof g;
    return w == "string" || w == "number" || w == "symbol" || w == "boolean" ? g !== "__proto__" : g === null;
  }
  function Rd(g) {
    return !!Ps && Ps in g;
  }
  function Dd(g) {
    var w = g && g.constructor, O = typeof w == "function" && w.prototype || an;
    return g === O;
  }
  function Nd(g) {
    return Is.call(g);
  }
  function Ct(g) {
    if (g != null) {
      try {
        return Os.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function js(g, w) {
    return g === w || g !== g && w !== w;
  }
  var Fd = Ls(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Ls : function(g) {
    return gr(g) && ze.call(g, "callee") && !Ns.call(g, "callee");
  }, dn = Array.isArray;
  function xd(g) {
    return g != null && qs(g.length) && !Bs(g);
  }
  var $i = Gf || Md;
  function Ld(g, w) {
    return Us(g, w);
  }
  function Bs(g) {
    if (!Hs(g))
      return !1;
    var w = mr(g);
    return w == m || w == y || w == c || w == x;
  }
  function qs(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= s;
  }
  function Hs(g) {
    var w = typeof g;
    return g != null && (w == "object" || w == "function");
  }
  function gr(g) {
    return g != null && typeof g == "object";
  }
  var Gs = ge ? wi(ge) : Ad;
  function Ud(g) {
    return xd(g) ? vd(g) : bd(g);
  }
  function kd() {
    return [];
  }
  function Md() {
    return !1;
  }
  e.exports = Ld;
})(Yn, Yn.exports);
var hw = Yn.exports;
Object.defineProperty(en, "__esModule", { value: !0 });
en.DownloadedUpdateHelper = void 0;
en.createTempUpdateFile = Ew;
const pw = zr, mw = xe, sl = hw, It = _t, Pr = Q;
class gw {
  constructor(t) {
    this.cacheDir = t, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return Pr.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return sl(this.versionInfo, r) && sl(this.fileInfo.info, n.info) && await (0, It.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(n, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, r, n, i, o, s) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, s && await (0, It.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, It.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, r) {
    const n = this.getUpdateInfoFile();
    if (!await (0, It.pathExists)(n))
      return null;
    let o;
    try {
      o = await (0, It.readJson)(n);
    } catch (c) {
      let u = "No cached update info available";
      return c.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), u += ` (error on read: ${c.message})`), r.info(u), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const a = Pr.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, It.pathExists)(a))
      return r.info("Cached update file doesn't exist"), null;
    const l = await yw(a);
    return t.info.sha512 !== l ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, a);
  }
  getUpdateInfoFile() {
    return Pr.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
en.DownloadedUpdateHelper = gw;
function yw(e, t = "sha512", r = "base64", n) {
  return new Promise((i, o) => {
    const s = (0, pw.createHash)(t);
    s.on("error", o).setEncoding(r), (0, mw.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      s.end(), i(s.read());
    }).pipe(s, { end: !1 });
  });
}
async function Ew(e, t, r) {
  let n = 0, i = Pr.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, It.unlink)(i), i;
    } catch (s) {
      if (s.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${s}`), i = Pr.join(t, `${n++}-${e}`);
    }
  return i;
}
var fi = {}, Ts = {};
Object.defineProperty(Ts, "__esModule", { value: !0 });
Ts.getAppCacheDir = ww;
const Wi = Q, vw = wt;
function ww() {
  const e = (0, vw.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || Wi.join(e, "AppData", "Local") : process.platform === "darwin" ? t = Wi.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || Wi.join(e, ".cache"), t;
}
Object.defineProperty(fi, "__esModule", { value: !0 });
fi.ElectronAppAdapter = void 0;
const al = Q, _w = Ts;
class Sw {
  constructor(t = pt.app) {
    this.app = t;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === !0;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? al.join(process.resourcesPath, "app-update.yml") : al.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, _w.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (r, n) => t(n));
  }
}
fi.ElectronAppAdapter = Sw;
var vf = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = me;
  e.NET_SESSION_NAME = "electron-updater";
  function r() {
    return pt.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class n extends t.HttpExecutor {
    constructor(o) {
      super(), this.proxyLoginCallback = o, this.cachedSession = null;
    }
    async download(o, s, a) {
      return await a.cancellationToken.createPromise((l, c, u) => {
        const f = {
          headers: a.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(o, f), (0, t.configureRequestOptions)(f), this.doDownload(f, {
          destination: s,
          options: a,
          onCancel: u,
          callback: (h) => {
            h == null ? l(s) : c(h);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(o, s) {
      o.headers && o.headers.Host && (o.host = o.headers.Host, delete o.headers.Host), this.cachedSession == null && (this.cachedSession = r());
      const a = pt.net.request({
        ...o,
        session: this.cachedSession
      });
      return a.on("response", s), this.proxyLoginCallback != null && a.on("login", this.proxyLoginCallback), a;
    }
    addRedirectHandlers(o, s, a, l, c) {
      o.on("redirect", (u, f, h) => {
        o.abort(), l > this.maxRedirects ? a(this.createMaxRedirectError()) : c(t.HttpExecutor.prepareRedirectUrlOptions(h, s));
      });
    }
  }
  e.ElectronHttpExecutor = n;
})(vf);
var tn = {}, ke = {}, Aw = 1 / 0, bw = "[object Symbol]", wf = /[\\^$.*+?()[\]{}|]/g, Tw = RegExp(wf.source), Cw = typeof Te == "object" && Te && Te.Object === Object && Te, $w = typeof self == "object" && self && self.Object === Object && self, Ow = Cw || $w || Function("return this")(), Pw = Object.prototype, Iw = Pw.toString, ll = Ow.Symbol, cl = ll ? ll.prototype : void 0, ul = cl ? cl.toString : void 0;
function Rw(e) {
  if (typeof e == "string")
    return e;
  if (Nw(e))
    return ul ? ul.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -Aw ? "-0" : t;
}
function Dw(e) {
  return !!e && typeof e == "object";
}
function Nw(e) {
  return typeof e == "symbol" || Dw(e) && Iw.call(e) == bw;
}
function Fw(e) {
  return e == null ? "" : Rw(e);
}
function xw(e) {
  return e = Fw(e), e && Tw.test(e) ? e.replace(wf, "\\$&") : e;
}
var Lw = xw;
Object.defineProperty(ke, "__esModule", { value: !0 });
ke.newBaseUrl = kw;
ke.newUrlFromBase = Wo;
ke.getChannelFilename = Mw;
ke.blockmapFiles = jw;
const _f = ar, Uw = Lw;
function kw(e) {
  const t = new _f.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function Wo(e, t, r = !1) {
  const n = new _f.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function Mw(e) {
  return `${e}.yml`;
}
function jw(e, t, r) {
  const n = Wo(`${e.pathname}.blockmap`, e);
  return [Wo(`${e.pathname.replace(new RegExp(Uw(r), "g"), t)}.blockmap`, e), n];
}
var fe = {};
Object.defineProperty(fe, "__esModule", { value: !0 });
fe.Provider = void 0;
fe.findFile = Hw;
fe.parseUpdateInfo = Gw;
fe.getFileList = Sf;
fe.resolveFiles = Ww;
const Et = me, Bw = ve, fl = ke;
class qw {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const t = process.env.TEST_UPDATER_ARCH || process.arch;
      return "-linux" + (t === "x64" ? "" : `-${t}`);
    } else
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(t) {
    return `${t}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(t) {
    this.requestHeaders = t;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(t, r, n) {
    return this.executor.request(this.createRequestOptions(t, r), n);
  }
  createRequestOptions(t, r) {
    const n = {};
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, Et.configureRequestUrl)(t, n), n;
  }
}
fe.Provider = qw;
function Hw(e, t, r) {
  if (e.length === 0)
    throw (0, Et.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const n = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return n ?? (r == null ? e[0] : e.find((i) => !r.some((o) => i.url.pathname.toLowerCase().endsWith(`.${o}`))));
}
function Gw(e, t, r) {
  if (e == null)
    throw (0, Et.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, Bw.load)(e);
  } catch (i) {
    throw (0, Et.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function Sf(e) {
  const t = e.files;
  if (t != null && t.length > 0)
    return t;
  if (e.path != null)
    return [
      {
        url: e.path,
        sha2: e.sha2,
        sha512: e.sha512
      }
    ];
  throw (0, Et.newError)(`No files provided: ${(0, Et.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function Ww(e, t, r = (n) => n) {
  const i = Sf(e).map((a) => {
    if (a.sha2 == null && a.sha512 == null)
      throw (0, Et.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Et.safeStringifyJson)(a)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, fl.newUrlFromBase)(r(a.url), t),
      info: a
    };
  }), o = e.packages, s = o == null ? null : o[process.arch] || o.ia32;
  return s != null && (i[0].packageInfo = {
    ...s,
    path: (0, fl.newUrlFromBase)(r(s.path), t).href
  }), i;
}
Object.defineProperty(tn, "__esModule", { value: !0 });
tn.GenericProvider = void 0;
const dl = me, Vi = ke, zi = fe;
class Vw extends zi.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, Vi.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, Vi.getChannelFilename)(this.channel), r = (0, Vi.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, zi.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof dl.HttpError && i.statusCode === 404)
          throw (0, dl.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && n < 3) {
          await new Promise((o, s) => {
            try {
              setTimeout(o, 1e3 * n);
            } catch (a) {
              s(a);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, zi.resolveFiles)(t, this.baseUrl);
  }
}
tn.GenericProvider = Vw;
var di = {}, hi = {};
Object.defineProperty(hi, "__esModule", { value: !0 });
hi.BitbucketProvider = void 0;
const hl = me, Yi = ke, Xi = fe;
class zw extends Xi.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, Yi.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new hl.CancellationToken(), r = (0, Yi.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Yi.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, Xi.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, hl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Xi.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
hi.BitbucketProvider = zw;
var vt = {};
Object.defineProperty(vt, "__esModule", { value: !0 });
vt.GitHubProvider = vt.BaseGitHubProvider = void 0;
vt.computeReleaseNotes = bf;
const et = me, Qt = Ef, Yw = ar, Zt = ke, Vo = fe, Ji = /\/tag\/([^/]+)$/;
class Af extends Vo.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, Zt.newBaseUrl)((0, et.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, Zt.newBaseUrl)((0, et.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
vt.BaseGitHubProvider = Af;
class Xw extends Af {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, o;
    const s = new et.CancellationToken(), a = await this.httpRequest((0, Zt.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, s), l = (0, et.parseXml)(a);
    let c = l.element("entry", !1, "No published versions on GitHub"), u = null;
    try {
      if (this.updater.allowPrerelease) {
        const v = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = Qt.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (v === null)
          u = Ji.exec(c.element("link").attribute("href"))[1];
        else
          for (const A of l.getElements("entry")) {
            const b = Ji.exec(A.element("link").attribute("href"));
            if (b === null)
              continue;
            const D = b[1], x = ((n = Qt.prerelease(D)) === null || n === void 0 ? void 0 : n[0]) || null, B = !v || ["alpha", "beta"].includes(v), q = x !== null && !["alpha", "beta"].includes(String(x));
            if (B && !q && !(v === "beta" && x === "alpha")) {
              u = D;
              break;
            }
            if (x && x === v) {
              u = D;
              break;
            }
          }
      } else {
        u = await this.getLatestTagName(s);
        for (const v of l.getElements("entry"))
          if (Ji.exec(v.element("link").attribute("href"))[1] === u) {
            c = v;
            break;
          }
      }
    } catch (v) {
      throw (0, et.newError)(`Cannot parse releases feed: ${v.stack || v.message},
XML:
${a}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (u == null)
      throw (0, et.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let f, h = "", m = "";
    const y = async (v) => {
      h = (0, Zt.getChannelFilename)(v), m = (0, Zt.newUrlFromBase)(this.getBaseDownloadPath(String(u), h), this.baseUrl);
      const A = this.createRequestOptions(m);
      try {
        return await this.executor.request(A, s);
      } catch (b) {
        throw b instanceof et.HttpError && b.statusCode === 404 ? (0, et.newError)(`Cannot find ${h} in the latest release artifacts (${m}): ${b.stack || b.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : b;
      }
    };
    try {
      let v = this.channel;
      this.updater.allowPrerelease && (!((i = Qt.prerelease(u)) === null || i === void 0) && i[0]) && (v = this.getCustomChannelName(String((o = Qt.prerelease(u)) === null || o === void 0 ? void 0 : o[0]))), f = await y(v);
    } catch (v) {
      if (this.updater.allowPrerelease)
        f = await y(this.getDefaultChannelName());
      else
        throw v;
    }
    const S = (0, Vo.parseUpdateInfo)(f, h, m);
    return S.releaseName == null && (S.releaseName = c.elementValueOrEmpty("title")), S.releaseNotes == null && (S.releaseNotes = bf(this.updater.currentVersion, this.updater.fullChangelog, l, c)), {
      tag: u,
      ...S
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, Zt.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new Yw.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, et.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, Vo.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
vt.GitHubProvider = Xw;
function pl(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function bf(e, t, r, n) {
  if (!t)
    return pl(n);
  const i = [];
  for (const o of r.getElements("entry")) {
    const s = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    Qt.lt(e, s) && i.push({
      version: s,
      note: pl(o)
    });
  }
  return i.sort((o, s) => Qt.rcompare(o.version, s.version));
}
var pi = {};
Object.defineProperty(pi, "__esModule", { value: !0 });
pi.KeygenProvider = void 0;
const ml = me, Ki = ke, Qi = fe;
class Jw extends Qi.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, Ki.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new ml.CancellationToken(), r = (0, Ki.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Ki.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, Qi.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, ml.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Qi.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
pi.KeygenProvider = Jw;
var mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
mi.PrivateGitHubProvider = void 0;
const Wt = me, Kw = ve, Qw = Q, gl = ar, yl = ke, Zw = vt, e_ = fe;
class t_ extends Zw.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new Wt.CancellationToken(), r = (0, yl.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((a) => a.name === r);
    if (i == null)
      throw (0, Wt.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new gl.URL(i.url);
    let s;
    try {
      s = (0, Kw.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (a) {
      throw a instanceof Wt.HttpError && a.statusCode === 404 ? (0, Wt.newError)(`Cannot find ${r} in the latest release artifacts (${o}): ${a.stack || a.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : a;
    }
    return s.assets = n.assets, s;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(t) {
    return {
      accept: t,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(t) {
    const r = this.updater.allowPrerelease;
    let n = this.basePath;
    r || (n = `${n}/latest`);
    const i = (0, yl.newUrlFromBase)(n, this.baseUrl);
    try {
      const o = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return r ? o.find((s) => s.prerelease) || o[0] : o;
    } catch (o) {
      throw (0, Wt.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, e_.getFileList)(t).map((r) => {
      const n = Qw.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === n);
      if (i == null)
        throw (0, Wt.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new gl.URL(i.url),
        info: r
      };
    });
  }
}
mi.PrivateGitHubProvider = t_;
Object.defineProperty(di, "__esModule", { value: !0 });
di.isUrlProbablySupportMultiRangeRequests = Tf;
di.createClient = s_;
const Tn = me, r_ = hi, El = tn, n_ = vt, i_ = pi, o_ = mi;
function Tf(e) {
  return !e.includes("s3.amazonaws.com");
}
function s_(e, t, r) {
  if (typeof e == "string")
    throw (0, Tn.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new n_.GitHubProvider(i, t, r) : new o_.PrivateGitHubProvider(i, t, o, r);
    }
    case "bitbucket":
      return new r_.BitbucketProvider(e, t, r);
    case "keygen":
      return new i_.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new El.GenericProvider({
        provider: "generic",
        url: (0, Tn.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new El.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && Tf(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, Tn.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, r);
    }
    default:
      throw (0, Tn.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var gi = {}, rn = {}, fr = {}, Mt = {};
Object.defineProperty(Mt, "__esModule", { value: !0 });
Mt.OperationKind = void 0;
Mt.computeOperations = a_;
var Nt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Nt || (Mt.OperationKind = Nt = {}));
function a_(e, t, r) {
  const n = wl(e.files), i = wl(t.files);
  let o = null;
  const s = t.files[0], a = [], l = s.name, c = n.get(l);
  if (c == null)
    throw new Error(`no file ${l} in old blockmap`);
  const u = i.get(l);
  let f = 0;
  const { checksumToOffset: h, checksumToOldSize: m } = c_(n.get(l), c.offset, r);
  let y = s.offset;
  for (let S = 0; S < u.checksums.length; y += u.sizes[S], S++) {
    const v = u.sizes[S], A = u.checksums[S];
    let b = h.get(A);
    b != null && m.get(A) !== v && (r.warn(`Checksum ("${A}") matches, but size differs (old: ${m.get(A)}, new: ${v})`), b = void 0), b === void 0 ? (f++, o != null && o.kind === Nt.DOWNLOAD && o.end === y ? o.end += v : (o = {
      kind: Nt.DOWNLOAD,
      start: y,
      end: y + v
      // oldBlocks: null,
    }, vl(o, a, A, S))) : o != null && o.kind === Nt.COPY && o.end === b ? o.end += v : (o = {
      kind: Nt.COPY,
      start: b,
      end: b + v
      // oldBlocks: [checksum]
    }, vl(o, a, A, S));
  }
  return f > 0 && r.info(`File${s.name === "file" ? "" : " " + s.name} has ${f} changed blocks`), a;
}
const l_ = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function vl(e, t, r, n) {
  if (l_ && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((s, a) => s < a ? s : a);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${Nt[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function c_(e, t, r) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let o = t;
  for (let s = 0; s < e.checksums.length; s++) {
    const a = e.checksums[s], l = e.sizes[s], c = i.get(a);
    if (c === void 0)
      n.set(a, o), i.set(a, l);
    else if (r.debug != null) {
      const u = c === l ? "(same size)" : `(size: ${c}, this size: ${l})`;
      r.debug(`${a} duplicated in blockmap ${u}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    o += l;
  }
  return { checksumToOffset: n, checksumToOldSize: i };
}
function wl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(fr, "__esModule", { value: !0 });
fr.DataSplitter = void 0;
fr.copyData = Cf;
const Cn = me, u_ = xe, f_ = Wr, d_ = Mt, _l = Buffer.from(`\r
\r
`);
var ct;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(ct || (ct = {}));
function Cf(e, t, r, n, i) {
  const o = (0, u_.createReadStream)("", {
    fd: r,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  o.on("error", n), o.once("end", i), o.pipe(t, {
    end: !1
  });
}
class h_ extends f_.Writable {
  constructor(t, r, n, i, o, s) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = o, this.finishHandler = s, this.partIndex = -1, this.headerListBuffer = null, this.readState = ct.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, r, n) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(n).catch(n);
  }
  async handleData(t) {
    let r = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, Cn.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const n = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= n, r = n;
    } else if (this.remainingPartDataCount > 0) {
      const n = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= n, await this.processPartData(t, 0, n), r = n;
    }
    if (r !== t.length) {
      if (this.readState === ct.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = ct.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === ct.BODY)
          this.readState = ct.INIT;
        else {
          this.partIndex++;
          let s = this.partIndexToTaskIndex.get(this.partIndex);
          if (s == null)
            if (this.isFinished)
              s = this.options.end;
            else
              throw (0, Cn.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const a = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (a < s)
            await this.copyExistingData(a, s);
          else if (a > s)
            throw (0, Cn.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (r = this.searchHeaderListEnd(t, r), r === -1) {
            this.readState = ct.HEADER;
            return;
          }
        }
        const n = this.partIndexToLength[this.partIndex], i = r + n, o = Math.min(i, t.length);
        if (await this.processPartStarted(t, r, o), this.remainingPartDataCount = n - (o - r), this.remainingPartDataCount > 0)
          return;
        if (r = i + this.boundaryLength, r >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, r) {
    return new Promise((n, i) => {
      const o = () => {
        if (t === r) {
          n();
          return;
        }
        const s = this.options.tasks[t];
        if (s.kind !== d_.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Cf(s, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(_l, r);
    if (n !== -1)
      return n + _l.length;
    const i = r === 0 ? t : t.slice(r);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Cn.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, r, n) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, r, n);
  }
  processPartData(t, r, n) {
    this.actualPartLength += n - r;
    const i = this.out;
    return i.write(r === 0 && t.length === n ? t : t.slice(r, n)) ? Promise.resolve() : new Promise((o, s) => {
      i.on("error", s), i.once("drain", () => {
        i.removeListener("error", s), o();
      });
    });
  }
}
fr.DataSplitter = h_;
var yi = {};
Object.defineProperty(yi, "__esModule", { value: !0 });
yi.executeTasksUsingMultipleRangeRequests = p_;
yi.checkIsRangesSupported = Yo;
const zo = me, Sl = fr, Al = Mt;
function p_(e, t, r, n, i) {
  const o = (s) => {
    if (s >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const a = s + 1e3;
    m_(e, {
      tasks: t,
      start: s,
      end: Math.min(t.length, a),
      oldFileFd: n
    }, r, () => o(a), i);
  };
  return o;
}
function m_(e, t, r, n, i) {
  let o = "bytes=", s = 0;
  const a = /* @__PURE__ */ new Map(), l = [];
  for (let f = t.start; f < t.end; f++) {
    const h = t.tasks[f];
    h.kind === Al.OperationKind.DOWNLOAD && (o += `${h.start}-${h.end - 1}, `, a.set(s, f), s++, l.push(h.end - h.start));
  }
  if (s <= 1) {
    const f = (h) => {
      if (h >= t.end) {
        n();
        return;
      }
      const m = t.tasks[h++];
      if (m.kind === Al.OperationKind.COPY)
        (0, Sl.copyData)(m, r, t.oldFileFd, i, () => f(h));
      else {
        const y = e.createRequestOptions();
        y.headers.Range = `bytes=${m.start}-${m.end - 1}`;
        const S = e.httpExecutor.createRequest(y, (v) => {
          Yo(v, i) && (v.pipe(r, {
            end: !1
          }), v.once("end", () => f(h)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(S, i), S.end();
      }
    };
    f(t.start);
    return;
  }
  const c = e.createRequestOptions();
  c.headers.Range = o.substring(0, o.length - 2);
  const u = e.httpExecutor.createRequest(c, (f) => {
    if (!Yo(f, i))
      return;
    const h = (0, zo.safeGetHeader)(f, "content-type"), m = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(h);
    if (m == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${h}"`));
      return;
    }
    const y = new Sl.DataSplitter(r, t, a, m[1] || m[2], l, n);
    y.on("error", i), f.pipe(y), f.on("end", () => {
      setTimeout(() => {
        u.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(u, i), u.end();
}
function Yo(e, t) {
  if (e.statusCode >= 400)
    return t((0, zo.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, zo.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
Ei.ProgressDifferentialDownloadCallbackTransform = void 0;
const g_ = Wr;
var er;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(er || (er = {}));
class y_ extends g_.Transform {
  constructor(t, r, n) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = er.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == er.COPY) {
      n(null, t);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  beginFileCopy() {
    this.operationType = er.COPY;
  }
  beginRangeDownload() {
    this.operationType = er.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
  }
  // Called when we are 100% done with the connection/download
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, this.transferred = 0, t(null);
  }
}
Ei.ProgressDifferentialDownloadCallbackTransform = y_;
Object.defineProperty(rn, "__esModule", { value: !0 });
rn.DifferentialDownloader = void 0;
const _r = me, Zi = _t, E_ = xe, v_ = fr, w_ = ar, $n = Mt, bl = yi, __ = Ei;
class S_ {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, r, n) {
    this.blockAwareFileInfo = t, this.httpExecutor = r, this.options = n, this.fileMetadataBuffer = null, this.logger = n.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, _r.configureRequestUrl)(this.options.newUrl, t), (0, _r.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, $n.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let o = 0, s = 0;
    for (const l of i) {
      const c = l.end - l.start;
      l.kind === $n.OperationKind.DOWNLOAD ? o += c : s += c;
    }
    const a = this.blockAwareFileInfo.size;
    if (o + s + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== a)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${s}, newSize: ${a}`);
    return n.info(`Full: ${Tl(a)}, To download: ${Tl(o)} (${Math.round(o / (a / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, Zi.close)(i.descriptor).catch((o) => {
      this.logger.error(`cannot close file "${i.path}": ${o}`);
    })));
    return this.doDownloadFile(t, r).then(n).catch((i) => n().catch((o) => {
      try {
        this.logger.error(`cannot close files: ${o}`);
      } catch (s) {
        try {
          console.error(s);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, r) {
    const n = await (0, Zi.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, Zi.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const o = (0, E_.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((s, a) => {
      const l = [];
      let c;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const A = [];
        let b = 0;
        for (const x of t)
          x.kind === $n.OperationKind.DOWNLOAD && (A.push(x.end - x.start), b += x.end - x.start);
        const D = {
          expectedByteCounts: A,
          grandTotal: b
        };
        c = new __.ProgressDifferentialDownloadCallbackTransform(D, this.options.cancellationToken, this.options.onProgress), l.push(c);
      }
      const u = new _r.DigestTransform(this.blockAwareFileInfo.sha512);
      u.isValidateOnEnd = !1, l.push(u), o.on("finish", () => {
        o.close(() => {
          r.splice(1, 1);
          try {
            u.validate();
          } catch (A) {
            a(A);
            return;
          }
          s(void 0);
        });
      }), l.push(o);
      let f = null;
      for (const A of l)
        A.on("error", a), f == null ? f = A : f = f.pipe(A);
      const h = l[0];
      let m;
      if (this.options.isUseMultipleRangeRequest) {
        m = (0, bl.executeTasksUsingMultipleRangeRequests)(this, t, h, n, a), m(0);
        return;
      }
      let y = 0, S = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const v = this.createRequestOptions();
      v.redirect = "manual", m = (A) => {
        var b, D;
        if (A >= t.length) {
          this.fileMetadataBuffer != null && h.write(this.fileMetadataBuffer), h.end();
          return;
        }
        const x = t[A++];
        if (x.kind === $n.OperationKind.COPY) {
          c && c.beginFileCopy(), (0, v_.copyData)(x, h, n, a, () => m(A));
          return;
        }
        const B = `bytes=${x.start}-${x.end - 1}`;
        v.headers.range = B, (D = (b = this.logger) === null || b === void 0 ? void 0 : b.debug) === null || D === void 0 || D.call(b, `download range: ${B}`), c && c.beginRangeDownload();
        const q = this.httpExecutor.createRequest(v, (j) => {
          j.on("error", a), j.on("aborted", () => {
            a(new Error("response has been aborted by the server"));
          }), j.statusCode >= 400 && a((0, _r.createHttpError)(j)), j.pipe(h, {
            end: !1
          }), j.once("end", () => {
            c && c.endRangeDownload(), ++y === 100 ? (y = 0, setTimeout(() => m(A), 1e3)) : m(A);
          });
        });
        q.on("redirect", (j, le, E) => {
          this.logger.info(`Redirect to ${A_(E)}`), S = E, (0, _r.configureRequestUrl)(new w_.URL(S), v), q.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(q, a), q.end();
      }, m(0);
    });
  }
  async readRemoteBytes(t, r) {
    const n = Buffer.allocUnsafe(r + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${r}`;
    let o = 0;
    if (await this.request(i, (s) => {
      s.copy(n, o), o += s.length;
    }), o !== n.length)
      throw new Error(`Received data length ${o} is not equal to expected ${n.length}`);
    return n;
  }
  request(t, r) {
    return new Promise((n, i) => {
      const o = this.httpExecutor.createRequest(t, (s) => {
        (0, bl.checkIsRangesSupported)(s, i) && (s.on("error", i), s.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), s.on("data", r), s.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
rn.DifferentialDownloader = S_;
function Tl(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function A_(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(gi, "__esModule", { value: !0 });
gi.GenericDifferentialDownloader = void 0;
const b_ = rn;
class T_ extends b_.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
gi.GenericDifferentialDownloader = T_;
var St = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = me;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
  class r {
    constructor(o) {
      this.emitter = o;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(o) {
      n(this.emitter, "login", o);
    }
    progress(o) {
      n(this.emitter, e.DOWNLOAD_PROGRESS, o);
    }
    updateDownloaded(o) {
      n(this.emitter, e.UPDATE_DOWNLOADED, o);
    }
    updateCancelled(o) {
      n(this.emitter, "update-cancelled", o);
    }
  }
  e.UpdaterSignal = r;
  function n(i, o, s) {
    i.on(o, s);
  }
})(St);
Object.defineProperty(mt, "__esModule", { value: !0 });
mt.NoOpLogger = mt.AppUpdater = void 0;
const be = me, C_ = zr, $_ = wt, O_ = Jn, Vt = _t, P_ = ve, eo = oi, Ot = Q, Rt = Ef, Cl = en, I_ = fi, $l = vf, R_ = tn, to = di, D_ = wc, N_ = ke, F_ = gi, zt = St;
let x_ = class $f extends O_.EventEmitter {
  /**
   * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
   */
  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */
  set channel(t) {
    if (this._channel != null) {
      if (typeof t != "string")
        throw (0, be.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, be.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
    }
    this._channel = t, this.allowDowngrade = !0;
  }
  /**
   *  Shortcut for explicitly adding auth tokens to request headers
   */
  addAuthHeader(t) {
    this.requestHeaders = Object.assign({}, this.requestHeaders, {
      authorization: t
    });
  }
  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get netSession() {
    return (0, $l.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Of();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new eo.Lazy(() => this.loadUpdateConfig());
  }
  /**
   * Allows developer to override default logic for determining if an update is supported.
   * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
   */
  get isUpdateSupported() {
    return this._isUpdateSupported;
  }
  set isUpdateSupported(t) {
    t && (this._isUpdateSupported = t);
  }
  constructor(t, r) {
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new zt.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this.clientPromise = null, this.stagingUserIdPromise = new eo.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new eo.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), r == null ? (this.app = new I_.ElectronAppAdapter(), this.httpExecutor = new $l.ElectronHttpExecutor((o, s) => this.emit("login", o, s))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, Rt.parse)(n);
    if (i == null)
      throw (0, be.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = L_(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
  }
  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */
  setFeedURL(t) {
    const r = this.createProviderRuntimeOptions();
    let n;
    typeof t == "string" ? n = new R_.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, to.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, to.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
  }
  /**
   * Asks the server whether there is an update.
   * @returns null if the updater is disabled, otherwise info about the latest version
   */
  checkForUpdates() {
    if (!this.isUpdaterActive())
      return Promise.resolve(null);
    let t = this.checkForUpdatesPromise;
    if (t != null)
      return this._logger.info("Checking for update (already in progress)"), t;
    const r = () => this.checkForUpdatesPromise = null;
    return this._logger.info("Checking for update"), t = this.doCheckForUpdates().then((n) => (r(), n)).catch((n) => {
      throw r(), this.emit("error", n, `Cannot check for updates: ${(n.stack || n).toString()}`), n;
    }), this.checkForUpdatesPromise = t, t;
  }
  isUpdaterActive() {
    return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(t) {
    return this.checkForUpdates().then((r) => r != null && r.downloadPromise ? (r.downloadPromise.then(() => {
      const n = $f.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
      new pt.Notification(n).show();
    }), r) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), r));
  }
  static formatDownloadNotification(t, r, n) {
    return n == null && (n = {
      title: "A new update is ready to install",
      body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
    }), n = {
      title: n.title.replace("{appName}", r).replace("{version}", t),
      body: n.body.replace("{appName}", r).replace("{version}", t)
    }, n;
  }
  async isStagingMatch(t) {
    const r = t.stagingPercentage;
    let n = r;
    if (n == null)
      return !0;
    if (n = parseInt(n, 10), isNaN(n))
      return this._logger.warn(`Staging percentage is NaN: ${r}`), !0;
    n = n / 100;
    const i = await this.stagingUserIdPromise.value, s = be.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${s}, user id: ${i}`), s < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, Rt.parse)(t.version);
    if (r == null)
      throw (0, be.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, Rt.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await this.isStagingMatch(t))
      return !1;
    const o = (0, Rt.gt)(r, n), s = (0, Rt.lt)(r, n);
    return o ? !0 : this.allowDowngrade && s;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, $_.release)();
    if (r)
      try {
        if ((0, Rt.lt)(n, r))
          return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${r} for version ${n}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${r}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, to.createClient)(n, this, this.createProviderRuntimeOptions())));
    const t = await this.clientPromise, r = await this.stagingUserIdPromise.value;
    return t.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": r })), {
      info: await t.getLatestVersion(),
      provider: t
    };
  }
  createProviderRuntimeOptions() {
    return {
      isUseMultipleRangeRequest: !0,
      platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
      executor: this.httpExecutor
    };
  }
  async doCheckForUpdates() {
    this.emit("checking-for-update");
    const t = await this.getUpdateInfoAndProvider(), r = t.info;
    if (!await this.isUpdateAvailable(r))
      return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${r.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", r), {
        isUpdateAvailable: !1,
        versionInfo: r,
        updateInfo: r
      };
    this.updateInfoAndProvider = t, this.onUpdateAvailable(r);
    const n = new be.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, be.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new be.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, be.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof be.CancellationError))
        try {
          this.dispatchError(i);
        } catch (o) {
          this._logger.warn(`Cannot dispatch error event: ${o.stack || o}`);
        }
      return i;
    };
    return this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider: r,
      requestHeaders: this.computeRequestHeaders(r.provider),
      cancellationToken: t,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((i) => {
      throw n(i);
    }).finally(() => {
      this.downloadPromise = null;
    }), this.downloadPromise;
  }
  dispatchError(t) {
    this.emit("error", t, (t.stack || t).toString());
  }
  dispatchUpdateDownloaded(t) {
    this.emit(zt.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, P_.load)(await (0, Vt.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(t) {
    const r = t.fileExtraDownloadHeaders;
    if (r != null) {
      const n = this.requestHeaders;
      return n == null ? r : {
        ...r,
        ...n
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const t = Ot.join(this.app.userDataPath, ".updaterId");
    try {
      const n = await (0, Vt.readFile)(t, "utf-8");
      if (be.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = be.UUID.v5((0, C_.randomBytes)(4096), be.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, Vt.outputFile)(t, r);
    } catch (n) {
      this._logger.warn(`Couldn't write out staging user ID: ${n}`);
    }
    return r;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const t = this.requestHeaders;
    if (t == null)
      return !0;
    for (const r of Object.keys(t)) {
      const n = r.toLowerCase();
      if (n === "authorization" || n === "private-token")
        return !1;
    }
    return !0;
  }
  async getOrCreateDownloadHelper() {
    let t = this.downloadedUpdateHelper;
    if (t == null) {
      const r = (await this.configOnDisk.value).updaterCacheDirName, n = this._logger;
      r == null && n.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      const i = Ot.join(this.app.baseCachePath, r || this.app.name);
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new Cl.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
    }
    return t;
  }
  async executeDownload(t) {
    const r = t.fileInfo, n = {
      headers: t.downloadUpdateOptions.requestHeaders,
      cancellationToken: t.downloadUpdateOptions.cancellationToken,
      sha2: r.info.sha2,
      sha512: r.info.sha512
    };
    this.listenerCount(zt.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (b) => this.emit(zt.DOWNLOAD_PROGRESS, b));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, s = r.packageInfo;
    function a() {
      const b = decodeURIComponent(t.fileInfo.url.pathname);
      return b.endsWith(`.${t.fileExtension}`) ? Ot.basename(b) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), c = l.cacheDirForPendingUpdate;
    await (0, Vt.mkdir)(c, { recursive: !0 });
    const u = a();
    let f = Ot.join(c, u);
    const h = s == null ? null : Ot.join(c, `package-${o}${Ot.extname(s.path) || ".7z"}`), m = async (b) => (await l.setDownloadedFile(f, h, i, r, u, b), await t.done({
      ...i,
      downloadedFile: f
    }), h == null ? [f] : [f, h]), y = this._logger, S = await l.validateDownloadedPath(f, i, r, y);
    if (S != null)
      return f = S, await m(!1);
    const v = async () => (await l.clear().catch(() => {
    }), await (0, Vt.unlink)(f).catch(() => {
    })), A = await (0, Cl.createTempUpdateFile)(`temp-${u}`, c, y);
    try {
      await t.task(A, n, h, v), await (0, be.retry)(() => (0, Vt.rename)(A, f), 60, 500, 0, 0, (b) => b instanceof Error && /^EBUSY:/.test(b.message));
    } catch (b) {
      throw await v(), b instanceof be.CancellationError && (y.info("cancelled"), this.emit("update-cancelled", i)), b;
    }
    return y.info(`New version ${o} has been downloaded to ${f}`), await m(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, o) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const s = (0, N_.blockmapFiles)(t.url, this.app.version, r.updateInfoAndProvider.info.version);
      this._logger.info(`Download block maps (old: "${s[0]}", new: ${s[1]})`);
      const a = async (u) => {
        const f = await this.httpExecutor.downloadToBuffer(u, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (f == null || f.length === 0)
          throw new Error(`Blockmap "${u.href}" is empty`);
        try {
          return JSON.parse((0, D_.gunzipSync)(f).toString());
        } catch (h) {
          throw new Error(`Cannot parse blockmap "${u.href}", error: ${h}`);
        }
      }, l = {
        newUrl: t.url,
        oldFile: Ot.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(zt.DOWNLOAD_PROGRESS) > 0 && (l.onProgress = (u) => this.emit(zt.DOWNLOAD_PROGRESS, u));
      const c = await Promise.all(s.map((u) => a(u)));
      return await new F_.GenericDifferentialDownloader(t.info, this.httpExecutor, l).download(c[0], c[1]), !1;
    } catch (s) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), this._testOnlyOptions != null)
        throw s;
      return !0;
    }
  }
};
mt.AppUpdater = x_;
function L_(e) {
  const t = (0, Rt.prerelease)(e);
  return t != null && t.length > 0;
}
class Of {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(t) {
  }
}
mt.NoOpLogger = Of;
Object.defineProperty(nt, "__esModule", { value: !0 });
nt.BaseUpdater = void 0;
const Ol = Vr, U_ = mt;
class k_ extends U_.AppUpdater {
  constructor(t, r) {
    super(t, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, r = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
      pt.autoUpdater.emit("before-quit-for-update"), this.app.quit();
    }) : this.quitAndInstallCalled = !1;
  }
  executeDownload(t) {
    return super.executeDownload({
      ...t,
      done: (r) => (this.dispatchUpdateDownloaded(r), this.addQuitHandler(), Promise.resolve())
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(t = !1, r = !1) {
    if (this.quitAndInstallCalled)
      return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
    const n = this.downloadedUpdateHelper, i = this.installerPath, o = n == null ? null : n.downloadedFileInfo;
    if (i == null || o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    this.quitAndInstallCalled = !0;
    try {
      return this._logger.info(`Install: isSilent: ${t}, isForceRunAfter: ${r}`), this.doInstall({
        isSilent: t,
        isForceRunAfter: r,
        isAdminRightsRequired: o.isAdminRightsRequired
      });
    } catch (s) {
      return this.dispatchError(s), !1;
    }
  }
  addQuitHandler() {
    this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((t) => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");
        return;
      }
      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
        return;
      }
      if (t !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${t}`);
        return;
      }
      this._logger.info("Auto install update on quit"), this.install(!0, !1);
    }));
  }
  wrapSudo() {
    const { name: t } = this.app, r = `"${t} would like to update"`, n = this.spawnSyncLog("which gksudo || which kdesudo || which pkexec || which beesu"), i = [n];
    return /kdesudo/i.test(n) ? (i.push("--comment", r), i.push("-c")) : /gksudo/i.test(n) ? i.push("--message", r) : /pkexec/i.test(n) && i.push("--disable-internal-agent"), i.join(" ");
  }
  spawnSyncLog(t, r = [], n = {}) {
    this._logger.info(`Executing: ${t} with args: ${r}`);
    const i = (0, Ol.spawnSync)(t, r, {
      env: { ...process.env, ...n },
      encoding: "utf-8",
      shell: !0
    }), { error: o, status: s, stdout: a, stderr: l } = i;
    if (o != null)
      throw this._logger.error(l), o;
    if (s != null && s !== 0)
      throw this._logger.error(l), new Error(`Command ${t} exited with code ${s}`);
    return a.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, r = [], n = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${r}`), new Promise((o, s) => {
      try {
        const a = { stdio: i, env: n, detached: !0 }, l = (0, Ol.spawn)(t, r, a);
        l.on("error", (c) => {
          s(c);
        }), l.unref(), l.pid !== void 0 && o(!0);
      } catch (a) {
        s(a);
      }
    });
  }
}
nt.BaseUpdater = k_;
var Mr = {}, nn = {};
Object.defineProperty(nn, "__esModule", { value: !0 });
nn.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Yt = _t, M_ = rn, j_ = wc;
class B_ extends M_.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = Pf(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await q_(this.options.oldFile), i);
  }
}
nn.FileWithEmbeddedBlockMapDifferentialDownloader = B_;
function Pf(e) {
  return JSON.parse((0, j_.inflateRawSync)(e).toString());
}
async function q_(e) {
  const t = await (0, Yt.open)(e, "r");
  try {
    const r = (await (0, Yt.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, Yt.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, Yt.read)(t, i, 0, i.length, r - n.length - i.length), await (0, Yt.close)(t), Pf(i);
  } catch (r) {
    throw await (0, Yt.close)(t), r;
  }
}
Object.defineProperty(Mr, "__esModule", { value: !0 });
Mr.AppImageUpdater = void 0;
const Pl = me, Il = Vr, H_ = _t, G_ = xe, Sr = Q, W_ = nt, V_ = nn, z_ = fe, Rl = St;
class Y_ extends W_.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, z_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const s = process.env.APPIMAGE;
        if (s == null)
          throw (0, Pl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, s, i, r, t)) && await this.httpExecutor.download(n.url, i, o), await (0, H_.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, r, n, i, o) {
    try {
      const s = {
        newUrl: t.url,
        oldFile: r,
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: o.requestHeaders,
        cancellationToken: o.cancellationToken
      };
      return this.listenerCount(Rl.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(Rl.DOWNLOAD_PROGRESS, a)), await new V_.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, s).download(), !1;
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, Pl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, G_.unlinkSync)(r);
    let n;
    const i = Sr.basename(r), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    Sr.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = Sr.join(Sr.dirname(r), Sr.basename(o)), (0, Il.execFileSync)("mv", ["-f", o, n]), n !== r && this.emit("appimage-filename-updated", n);
    const s = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], s) : (s.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, Il.execFileSync)(n, [], { env: s })), !0;
  }
}
Mr.AppImageUpdater = Y_;
var jr = {};
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.DebUpdater = void 0;
const X_ = nt, J_ = fe, Dl = St;
class K_ extends X_.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, J_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Dl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(Dl.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  doInstall(t) {
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.installerPath;
    if (i == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const o = ["dpkg", "-i", i, "||", "apt-get", "install", "-f", "-y"];
    return this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${o.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
jr.DebUpdater = K_;
var Br = {};
Object.defineProperty(Br, "__esModule", { value: !0 });
Br.PacmanUpdater = void 0;
const Q_ = nt, Nl = St, Z_ = fe;
class eS extends Q_.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, Z_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Nl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(Nl.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  doInstall(t) {
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.installerPath;
    if (i == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const o = ["pacman", "-U", "--noconfirm", i];
    return this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${o.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
Br.PacmanUpdater = eS;
var qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.RpmUpdater = void 0;
const tS = nt, Fl = St, rS = fe;
class nS extends tS.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, rS.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Fl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(Fl.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  doInstall(t) {
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.spawnSyncLog("which zypper"), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    let s;
    return i ? s = [i, "--no-refresh", "install", "--allow-unsigned-rpm", "-y", "-f", o] : s = [this.spawnSyncLog("which dnf || which yum"), "-y", "install", o], this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${s.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
qr.RpmUpdater = nS;
var Hr = {};
Object.defineProperty(Hr, "__esModule", { value: !0 });
Hr.MacUpdater = void 0;
const xl = me, ro = _t, iS = xe, Ll = Q, oS = _c, sS = mt, aS = fe, Ul = Vr, kl = zr;
class lS extends sS.AppUpdater {
  constructor(t, r) {
    super(t, r), this.nativeUpdater = pt.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (n) => {
      this._logger.warn(n), this.emit("error", n);
    }), this.nativeUpdater.on("update-downloaded", () => {
      this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
    });
  }
  debug(t) {
    this._logger.debug != null && this._logger.debug(t);
  }
  closeServerIfExists() {
    this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
      t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
    }));
  }
  async doDownloadUpdate(t) {
    let r = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
    const n = this._logger, i = "sysctl.proc_translated";
    let o = !1;
    try {
      this.debug("Checking for macOS Rosetta environment"), o = (0, Ul.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (f) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let s = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const h = (0, Ul.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      n.info(`Checked 'uname -a': arm64=${h}`), s = s || h;
    } catch (f) {
      n.warn(`uname shell command to check for arm64 failed: ${f}`);
    }
    s = s || process.arch === "arm64" || o;
    const a = (f) => {
      var h;
      return f.url.pathname.includes("arm64") || ((h = f.info.url) === null || h === void 0 ? void 0 : h.includes("arm64"));
    };
    s && r.some(a) ? r = r.filter((f) => s === a(f)) : r = r.filter((f) => !a(f));
    const l = (0, aS.findFile)(r, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, xl.newError)(`ZIP file not provided: ${(0, xl.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const c = t.updateInfoAndProvider.provider, u = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (f, h) => {
        const m = Ll.join(this.downloadedUpdateHelper.cacheDir, u), y = () => (0, ro.pathExistsSync)(m) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let S = !0;
        y() && (S = await this.differentialDownloadInstaller(l, t, f, c, u)), S && await this.httpExecutor.download(l.url, f, h);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const h = Ll.join(this.downloadedUpdateHelper.cacheDir, u);
            await (0, ro.copyFile)(f.downloadedFile, h);
          } catch (h) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${h.message}`);
          }
        return this.updateDownloaded(l, f);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, o = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, ro.stat)(i)).size, s = this._logger, a = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${a})`), this.server = (0, oS.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${a})`), this.server.on("close", () => {
      s.info(`Proxy server for native Squirrel.Mac is closed (${a})`);
    });
    const l = (c) => {
      const u = c.address();
      return typeof u == "string" ? u : `http://127.0.0.1:${u == null ? void 0 : u.port}`;
    };
    return await new Promise((c, u) => {
      const f = (0, kl.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${f}`, "ascii"), m = `/${(0, kl.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (y, S) => {
        const v = y.url;
        if (s.info(`${v} requested`), v === "/") {
          if (!y.headers.authorization || y.headers.authorization.indexOf("Basic ") === -1) {
            S.statusCode = 401, S.statusMessage = "Invalid Authentication Credentials", S.end(), s.warn("No authenthication info");
            return;
          }
          const D = y.headers.authorization.split(" ")[1], x = Buffer.from(D, "base64").toString("ascii"), [B, q] = x.split(":");
          if (B !== "autoupdater" || q !== f) {
            S.statusCode = 401, S.statusMessage = "Invalid Authentication Credentials", S.end(), s.warn("Invalid authenthication credentials");
            return;
          }
          const j = Buffer.from(`{ "url": "${l(this.server)}${m}" }`);
          S.writeHead(200, { "Content-Type": "application/json", "Content-Length": j.length }), S.end(j);
          return;
        }
        if (!v.startsWith(m)) {
          s.warn(`${v} requested, but not supported`), S.writeHead(404), S.end();
          return;
        }
        s.info(`${m} requested by Squirrel.Mac, pipe ${i}`);
        let A = !1;
        S.on("finish", () => {
          A || (this.nativeUpdater.removeListener("error", u), c([]));
        });
        const b = (0, iS.createReadStream)(i);
        b.on("error", (D) => {
          try {
            S.end();
          } catch (x) {
            s.warn(`cannot end response: ${x}`);
          }
          A = !0, this.nativeUpdater.removeListener("error", u), u(new Error(`Cannot pipe "${i}": ${D}`));
        }), S.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": o
        }), b.pipe(S);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${a})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${l(this.server)}, ${a})`), this.nativeUpdater.setFeedURL({
          url: l(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${h.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(r), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", u), this.nativeUpdater.checkForUpdates()) : c([]);
      });
    });
  }
  handleUpdateDownloaded() {
    this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
  }
  quitAndInstall() {
    this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
  }
}
Hr.MacUpdater = lS;
var Gr = {}, Cs = {};
Object.defineProperty(Cs, "__esModule", { value: !0 });
Cs.verifySignature = uS;
const Ml = me, If = Vr, cS = wt, jl = Q;
function uS(e, t, r) {
  return new Promise((n, i) => {
    const o = t.replace(/'/g, "''");
    r.info(`Verifying signature ${o}`), (0, If.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (s, a, l) => {
      var c;
      try {
        if (s != null || l) {
          no(r, s, l, i), n(null);
          return;
        }
        const u = fS(a);
        if (u.Status === 0) {
          try {
            const y = jl.normalize(u.Path), S = jl.normalize(t);
            if (r.info(`LiteralPath: ${y}. Update Path: ${S}`), y !== S) {
              no(r, new Error(`LiteralPath of ${y} is different than ${S}`), l, i), n(null);
              return;
            }
          } catch (y) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(c = y.message) !== null && c !== void 0 ? c : y.stack}`);
          }
          const h = (0, Ml.parseDn)(u.SignerCertificate.Subject);
          let m = !1;
          for (const y of e) {
            const S = (0, Ml.parseDn)(y);
            if (S.size ? m = Array.from(S.keys()).every((A) => S.get(A) === h.get(A)) : y === h.get("CN") && (r.warn(`Signature validated using only CN ${y}. Please add your full Distinguished Name (DN) to publisherNames configuration`), m = !0), m) {
              n(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(u, (h, m) => h === "RawData" ? void 0 : m, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), n(f);
      } catch (u) {
        no(r, u, null, i), n(null);
        return;
      }
    });
  });
}
function fS(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function no(e, t, r, n) {
  if (dS()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, If.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function dS() {
  const e = cS.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(Gr, "__esModule", { value: !0 });
Gr.NsisUpdater = void 0;
const On = me, Bl = Q, hS = nt, pS = nn, ql = St, mS = fe, gS = _t, yS = Cs, Hl = ar;
class ES extends hS.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, yS.verifySignature)(n, i, this._logger);
  }
  /**
   * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
   * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
   */
  get verifyUpdateCodeSignature() {
    return this._verifyUpdateCodeSignature;
  }
  set verifyUpdateCodeSignature(t) {
    t && (this._verifyUpdateCodeSignature = t);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, mS.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, o, s, a) => {
        const l = n.packageInfo, c = l != null && s != null;
        if (c && t.disableWebInstaller)
          throw (0, On.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !c && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (c || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, On.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, o);
        const u = await this.verifySignature(i);
        if (u != null)
          throw await a(), (0, On.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${u}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (c && await this.differentialDownloadWebPackage(t, l, s, r))
          try {
            await this.httpExecutor.download(new Hl.URL(l.path), s, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (f) {
            try {
              await (0, gS.unlink)(s);
            } catch {
            }
            throw f;
          }
      }
    });
  }
  // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
  async verifySignature(t) {
    let r;
    try {
      if (r = (await this.configOnDisk.value).publisherName, r == null)
        return null;
    } catch (n) {
      if (n.code === "ENOENT")
        return null;
      throw n;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(r) ? r : [r], t);
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const n = ["--updated"];
    t.isSilent && n.push("/S"), t.isForceRunAfter && n.push("--force-run"), this.installDirectory && n.push(`/D=${this.installDirectory}`);
    const i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    i != null && n.push(`--package-file=${i}`);
    const o = () => {
      this.spawnLog(Bl.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((s) => this.dispatchError(s));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), o(), !0) : (this.spawnLog(r, n).catch((s) => {
      const a = s.code;
      this._logger.info(`Cannot run installer: error code: ${a}, error message: "${s.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), a === "UNKNOWN" || a === "EACCES" ? o() : a === "ENOENT" ? pt.shell.openPath(r).catch((l) => this.dispatchError(l)) : this.dispatchError(s);
    }), !0);
  }
  async differentialDownloadWebPackage(t, r, n, i) {
    if (r.blockMapSize == null)
      return !0;
    try {
      const o = {
        newUrl: new Hl.URL(r.path),
        oldFile: Bl.join(this.downloadedUpdateHelper.cacheDir, On.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(ql.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(ql.DOWNLOAD_PROGRESS, s)), await new pS.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
Gr.NsisUpdater = ES;
(function(e) {
  var t = Te && Te.__createBinding || (Object.create ? function(v, A, b, D) {
    D === void 0 && (D = b);
    var x = Object.getOwnPropertyDescriptor(A, b);
    (!x || ("get" in x ? !A.__esModule : x.writable || x.configurable)) && (x = { enumerable: !0, get: function() {
      return A[b];
    } }), Object.defineProperty(v, D, x);
  } : function(v, A, b, D) {
    D === void 0 && (D = b), v[D] = A[b];
  }), r = Te && Te.__exportStar || function(v, A) {
    for (var b in v) b !== "default" && !Object.prototype.hasOwnProperty.call(A, b) && t(A, v, b);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = _t, i = Q;
  var o = nt;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return o.BaseUpdater;
  } });
  var s = mt;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return s.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return s.NoOpLogger;
  } });
  var a = fe;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return a.Provider;
  } });
  var l = Mr;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return l.AppImageUpdater;
  } });
  var c = jr;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return c.DebUpdater;
  } });
  var u = Br;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return u.PacmanUpdater;
  } });
  var f = qr;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return f.RpmUpdater;
  } });
  var h = Hr;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return h.MacUpdater;
  } });
  var m = Gr;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return m.NsisUpdater;
  } }), r(St, e);
  let y;
  function S() {
    if (process.platform === "win32")
      y = new Gr.NsisUpdater();
    else if (process.platform === "darwin")
      y = new Hr.MacUpdater();
    else {
      y = new Mr.AppImageUpdater();
      try {
        const v = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(v))
          return y;
        console.info("Checking for beta autoupdate feature for deb/rpm distributions");
        const A = (0, n.readFileSync)(v).toString().trim();
        switch (console.info("Found package-type:", A), A) {
          case "deb":
            y = new jr.DebUpdater();
            break;
          case "rpm":
            y = new qr.RpmUpdater();
            break;
          case "pacman":
            y = new Br.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (v) {
        console.warn("Unable to detect 'package-type' for autoUpdater (beta rpm/deb support). If you'd like to expand support, please consider contributing to electron-builder", v.message);
      }
    }
    return y;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => y || S()
  });
})(Be);
var xn = { exports: {} }, io = { exports: {} }, Gl;
function Rf() {
  return Gl || (Gl = 1, function(e) {
    let t = {};
    try {
      t = require("electron");
    } catch {
    }
    t.ipcRenderer && r(t), e.exports = r;
    function r({ contextBridge: n, ipcRenderer: i }) {
      if (!i)
        return;
      i.on("__ELECTRON_LOG_IPC__", (s, a) => {
        window.postMessage({ cmd: "message", ...a });
      }), i.invoke("__ELECTRON_LOG__", { cmd: "getOptions" }).catch((s) => console.error(new Error(
        `electron-log isn't initialized in the main process. Please call log.initialize() before. ${s.message}`
      )));
      const o = {
        sendToMain(s) {
          try {
            i.send("__ELECTRON_LOG__", s);
          } catch (a) {
            console.error("electronLog.sendToMain ", a, "data:", s), i.send("__ELECTRON_LOG__", {
              cmd: "errorHandler",
              error: { message: a == null ? void 0 : a.message, stack: a == null ? void 0 : a.stack },
              errorName: "sendToMain"
            });
          }
        },
        log(...s) {
          o.sendToMain({ data: s, level: "info" });
        }
      };
      for (const s of ["error", "warn", "info", "verbose", "debug", "silly"])
        o[s] = (...a) => o.sendToMain({
          data: a,
          level: s
        });
      if (n && process.contextIsolated)
        try {
          n.exposeInMainWorld("__electronLog", o);
        } catch {
        }
      typeof window == "object" ? window.__electronLog = o : __electronLog = o;
    }
  }(io)), io.exports;
}
var oo = { exports: {} }, so, Wl;
function vS() {
  if (Wl) return so;
  Wl = 1, so = e;
  function e(t) {
    return Object.defineProperties(r, {
      defaultLabel: { value: "", writable: !0 },
      labelPadding: { value: !0, writable: !0 },
      maxLabelLength: { value: 0, writable: !0 },
      labelLength: {
        get() {
          switch (typeof r.labelPadding) {
            case "boolean":
              return r.labelPadding ? r.maxLabelLength : 0;
            case "number":
              return r.labelPadding;
            default:
              return 0;
          }
        }
      }
    });
    function r(n) {
      r.maxLabelLength = Math.max(r.maxLabelLength, n.length);
      const i = {};
      for (const o of t.levels)
        i[o] = (...s) => t.logData(s, { level: o, scope: n });
      return i.log = i.info, i;
    }
  }
  return so;
}
var ao, Vl;
function wS() {
  if (Vl) return ao;
  Vl = 1;
  class e {
    constructor({ processMessage: r }) {
      this.processMessage = r, this.buffer = [], this.enabled = !1, this.begin = this.begin.bind(this), this.commit = this.commit.bind(this), this.reject = this.reject.bind(this);
    }
    addMessage(r) {
      this.buffer.push(r);
    }
    begin() {
      this.enabled = [];
    }
    commit() {
      this.enabled = !1, this.buffer.forEach((r) => this.processMessage(r)), this.buffer = [];
    }
    reject() {
      this.enabled = !1, this.buffer = [];
    }
  }
  return ao = e, ao;
}
var lo, zl;
function Df() {
  if (zl) return lo;
  zl = 1;
  const e = vS(), t = wS(), n = class n {
    constructor({
      allowUnknownLevel: o = !1,
      dependencies: s = {},
      errorHandler: a,
      eventLogger: l,
      initializeFn: c,
      isDev: u = !1,
      levels: f = ["error", "warn", "info", "verbose", "debug", "silly"],
      logId: h,
      transportFactories: m = {},
      variables: y
    } = {}) {
      W(this, "dependencies", {});
      W(this, "errorHandler", null);
      W(this, "eventLogger", null);
      W(this, "functions", {});
      W(this, "hooks", []);
      W(this, "isDev", !1);
      W(this, "levels", null);
      W(this, "logId", null);
      W(this, "scope", null);
      W(this, "transports", {});
      W(this, "variables", {});
      this.addLevel = this.addLevel.bind(this), this.create = this.create.bind(this), this.initialize = this.initialize.bind(this), this.logData = this.logData.bind(this), this.processMessage = this.processMessage.bind(this), this.allowUnknownLevel = o, this.buffering = new t(this), this.dependencies = s, this.initializeFn = c, this.isDev = u, this.levels = f, this.logId = h, this.scope = e(this), this.transportFactories = m, this.variables = y || {};
      for (const S of this.levels)
        this.addLevel(S, !1);
      this.log = this.info, this.functions.log = this.log, this.errorHandler = a, a == null || a.setOptions({ ...s, logFn: this.error }), this.eventLogger = l, l == null || l.setOptions({ ...s, logger: this });
      for (const [S, v] of Object.entries(m))
        this.transports[S] = v(this, s);
      n.instances[h] = this;
    }
    static getInstance({ logId: o }) {
      return this.instances[o] || this.instances.default;
    }
    addLevel(o, s = this.levels.length) {
      s !== !1 && this.levels.splice(s, 0, o), this[o] = (...a) => this.logData(a, { level: o }), this.functions[o] = this[o];
    }
    catchErrors(o) {
      return this.processMessage(
        {
          data: ["log.catchErrors is deprecated. Use log.errorHandler instead"],
          level: "warn"
        },
        { transports: ["console"] }
      ), this.errorHandler.startCatching(o);
    }
    create(o) {
      return typeof o == "string" && (o = { logId: o }), new n({
        dependencies: this.dependencies,
        errorHandler: this.errorHandler,
        initializeFn: this.initializeFn,
        isDev: this.isDev,
        transportFactories: this.transportFactories,
        variables: { ...this.variables },
        ...o
      });
    }
    compareLevels(o, s, a = this.levels) {
      const l = a.indexOf(o), c = a.indexOf(s);
      return c === -1 || l === -1 ? !0 : c <= l;
    }
    initialize(o = {}) {
      this.initializeFn({ logger: this, ...this.dependencies, ...o });
    }
    logData(o, s = {}) {
      this.buffering.enabled ? this.buffering.addMessage({ data: o, date: /* @__PURE__ */ new Date(), ...s }) : this.processMessage({ data: o, ...s });
    }
    processMessage(o, { transports: s = this.transports } = {}) {
      if (o.cmd === "errorHandler") {
        this.errorHandler.handle(o.error, {
          errorName: o.errorName,
          processType: "renderer",
          showDialog: !!o.showDialog
        });
        return;
      }
      let a = o.level;
      this.allowUnknownLevel || (a = this.levels.includes(o.level) ? o.level : "info");
      const l = {
        date: /* @__PURE__ */ new Date(),
        logId: this.logId,
        ...o,
        level: a,
        variables: {
          ...this.variables,
          ...o.variables
        }
      };
      for (const [c, u] of this.transportEntries(s))
        if (!(typeof u != "function" || u.level === !1) && this.compareLevels(u.level, o.level))
          try {
            const f = this.hooks.reduce((h, m) => h && m(h, u, c), l);
            f && u({ ...f, data: [...f.data] });
          } catch (f) {
            this.processInternalErrorFn(f);
          }
    }
    processInternalErrorFn(o) {
    }
    transportEntries(o = this.transports) {
      return (Array.isArray(o) ? o : Object.entries(o)).map((a) => {
        switch (typeof a) {
          case "string":
            return this.transports[a] ? [a, this.transports[a]] : null;
          case "function":
            return [a.name, a];
          default:
            return Array.isArray(a) ? a : null;
        }
      }).filter(Boolean);
    }
  };
  W(n, "instances", {});
  let r = n;
  return lo = r, lo;
}
var co, Yl;
function _S() {
  if (Yl) return co;
  Yl = 1;
  const e = console.error;
  class t {
    constructor({ logFn: n = null } = {}) {
      W(this, "logFn", null);
      W(this, "onError", null);
      W(this, "showDialog", !1);
      W(this, "preventDefault", !0);
      this.handleError = this.handleError.bind(this), this.handleRejection = this.handleRejection.bind(this), this.startCatching = this.startCatching.bind(this), this.logFn = n;
    }
    handle(n, {
      logFn: i = this.logFn,
      errorName: o = "",
      onError: s = this.onError,
      showDialog: a = this.showDialog
    } = {}) {
      try {
        (s == null ? void 0 : s({ error: n, errorName: o, processType: "renderer" })) !== !1 && i({ error: n, errorName: o, showDialog: a });
      } catch {
        e(n);
      }
    }
    setOptions({ logFn: n, onError: i, preventDefault: o, showDialog: s }) {
      typeof n == "function" && (this.logFn = n), typeof i == "function" && (this.onError = i), typeof o == "boolean" && (this.preventDefault = o), typeof s == "boolean" && (this.showDialog = s);
    }
    startCatching({ onError: n, showDialog: i } = {}) {
      this.isActive || (this.isActive = !0, this.setOptions({ onError: n, showDialog: i }), window.addEventListener("error", (o) => {
        var s;
        this.preventDefault && ((s = o.preventDefault) == null || s.call(o)), this.handleError(o.error || o);
      }), window.addEventListener("unhandledrejection", (o) => {
        var s;
        this.preventDefault && ((s = o.preventDefault) == null || s.call(o)), this.handleRejection(o.reason || o);
      }));
    }
    handleError(n) {
      this.handle(n, { errorName: "Unhandled" });
    }
    handleRejection(n) {
      const i = n instanceof Error ? n : new Error(JSON.stringify(n));
      this.handle(i, { errorName: "Unhandled rejection" });
    }
  }
  return co = t, co;
}
var uo, Xl;
function jt() {
  if (Xl) return uo;
  Xl = 1, uo = { transform: e };
  function e({
    logger: t,
    message: r,
    transport: n,
    initialData: i = (r == null ? void 0 : r.data) || [],
    transforms: o = n == null ? void 0 : n.transforms
  }) {
    return o.reduce((s, a) => typeof a == "function" ? a({ data: s, logger: t, message: r, transport: n }) : s, i);
  }
  return uo;
}
var fo, Jl;
function SS() {
  if (Jl) return fo;
  Jl = 1;
  const { transform: e } = jt();
  fo = r;
  const t = {
    error: console.error,
    warn: console.warn,
    info: console.info,
    verbose: console.info,
    debug: console.debug,
    silly: console.debug,
    log: console.log
  };
  function r(i) {
    return Object.assign(o, {
      format: "{h}:{i}:{s}.{ms}{scope} › {text}",
      transforms: [n],
      writeFn({ message: { level: s, data: a } }) {
        const l = t[s] || t.info;
        setTimeout(() => l(...a));
      }
    });
    function o(s) {
      o.writeFn({
        message: { ...s, data: e({ logger: i, message: s, transport: o }) }
      });
    }
  }
  function n({
    data: i = [],
    logger: o = {},
    message: s = {},
    transport: a = {}
  }) {
    if (typeof a.format == "function")
      return a.format({
        data: i,
        level: (s == null ? void 0 : s.level) || "info",
        logger: o,
        message: s,
        transport: a
      });
    if (typeof a.format != "string")
      return i;
    i.unshift(a.format), typeof i[1] == "string" && i[1].match(/%[1cdfiOos]/) && (i = [`${i[0]}${i[1]}`, ...i.slice(2)]);
    const l = s.date || /* @__PURE__ */ new Date();
    return i[0] = i[0].replace(/\{(\w+)}/g, (c, u) => {
      var f, h;
      switch (u) {
        case "level":
          return s.level;
        case "logId":
          return s.logId;
        case "scope": {
          const m = s.scope || ((f = o.scope) == null ? void 0 : f.defaultLabel);
          return m ? ` (${m})` : "";
        }
        case "text":
          return "";
        case "y":
          return l.getFullYear().toString(10);
        case "m":
          return (l.getMonth() + 1).toString(10).padStart(2, "0");
        case "d":
          return l.getDate().toString(10).padStart(2, "0");
        case "h":
          return l.getHours().toString(10).padStart(2, "0");
        case "i":
          return l.getMinutes().toString(10).padStart(2, "0");
        case "s":
          return l.getSeconds().toString(10).padStart(2, "0");
        case "ms":
          return l.getMilliseconds().toString(10).padStart(3, "0");
        case "iso":
          return l.toISOString();
        default:
          return ((h = s.variables) == null ? void 0 : h[u]) || c;
      }
    }).trim(), i;
  }
  return fo;
}
var ho, Kl;
function AS() {
  if (Kl) return ho;
  Kl = 1;
  const { transform: e } = jt();
  ho = r;
  const t = /* @__PURE__ */ new Set([Promise, WeakMap, WeakSet]);
  function r(o) {
    return Object.assign(s, {
      depth: 5,
      transforms: [i]
    });
    function s(a) {
      if (!window.__electronLog) {
        o.processMessage(
          {
            data: ["electron-log: logger isn't initialized in the main process"],
            level: "error"
          },
          { transports: ["console"] }
        );
        return;
      }
      try {
        const l = e({
          initialData: a,
          logger: o,
          message: a,
          transport: s
        });
        __electronLog.sendToMain(l);
      } catch (l) {
        o.transports.console({
          data: ["electronLog.transports.ipc", l, "data:", a.data],
          level: "error"
        });
      }
    }
  }
  function n(o) {
    return Object(o) !== o;
  }
  function i({
    data: o,
    depth: s,
    seen: a = /* @__PURE__ */ new WeakSet(),
    transport: l = {}
  } = {}) {
    const c = s || l.depth || 5;
    return a.has(o) ? "[Circular]" : c < 1 ? n(o) ? o : Array.isArray(o) ? "[Array]" : `[${typeof o}]` : ["function", "symbol"].includes(typeof o) ? o.toString() : n(o) ? o : t.has(o.constructor) ? `[${o.constructor.name}]` : Array.isArray(o) ? o.map((u) => i({
      data: u,
      depth: c - 1,
      seen: a
    })) : o instanceof Date ? o.toISOString() : o instanceof Error ? o.stack : o instanceof Map ? new Map(
      Array.from(o).map(([u, f]) => [
        i({ data: u, depth: c - 1, seen: a }),
        i({ data: f, depth: c - 1, seen: a })
      ])
    ) : o instanceof Set ? new Set(
      Array.from(o).map(
        (u) => i({ data: u, depth: c - 1, seen: a })
      )
    ) : (a.add(o), Object.fromEntries(
      Object.entries(o).map(
        ([u, f]) => [
          u,
          i({ data: f, depth: c - 1, seen: a })
        ]
      )
    ));
  }
  return ho;
}
var Ql;
function bS() {
  return Ql || (Ql = 1, function(e) {
    const t = Df(), r = _S(), n = SS(), i = AS();
    typeof process == "object" && process.type === "browser" && console.warn(
      "electron-log/renderer is loaded in the main process. It could cause unexpected behaviour."
    ), e.exports = o(), e.exports.Logger = t, e.exports.default = e.exports;
    function o() {
      const s = new t({
        allowUnknownLevel: !0,
        errorHandler: new r(),
        initializeFn: () => {
        },
        logId: "default",
        transportFactories: {
          console: n,
          ipc: i
        },
        variables: {
          processType: "renderer"
        }
      });
      return s.errorHandler.setOptions({
        logFn({ error: a, errorName: l, showDialog: c }) {
          s.transports.console({
            data: [l, a].filter(Boolean),
            level: "error"
          }), s.transports.ipc({
            cmd: "errorHandler",
            error: {
              cause: a == null ? void 0 : a.cause,
              code: a == null ? void 0 : a.code,
              name: a == null ? void 0 : a.name,
              message: a == null ? void 0 : a.message,
              stack: a == null ? void 0 : a.stack
            },
            errorName: l,
            logId: s.logId,
            showDialog: c
          });
        }
      }), typeof window == "object" && window.addEventListener("message", (a) => {
        const { cmd: l, logId: c, ...u } = a.data || {}, f = t.getInstance({ logId: c });
        l === "message" && f.processMessage(u, { transports: ["console"] });
      }), new Proxy(s, {
        get(a, l) {
          return typeof a[l] < "u" ? a[l] : (...c) => s.logData(c, { level: l });
        }
      });
    }
  }(oo)), oo.exports;
}
var po, Zl;
function TS() {
  if (Zl) return po;
  Zl = 1;
  const e = xe, t = Q;
  po = {
    findAndReadPackageJson: r,
    tryReadJsonAt: n
  };
  function r() {
    return n(s()) || n(o()) || n(process.resourcesPath, "app.asar") || n(process.resourcesPath, "app") || n(process.cwd()) || { name: void 0, version: void 0 };
  }
  function n(...a) {
    if (a[0])
      try {
        const l = t.join(...a), c = i("package.json", l);
        if (!c)
          return;
        const u = JSON.parse(e.readFileSync(c, "utf8")), f = (u == null ? void 0 : u.productName) || (u == null ? void 0 : u.name);
        return !f || f.toLowerCase() === "electron" ? void 0 : f ? { name: f, version: u == null ? void 0 : u.version } : void 0;
      } catch {
        return;
      }
  }
  function i(a, l) {
    let c = l;
    for (; ; ) {
      const u = t.parse(c), f = u.root, h = u.dir;
      if (e.existsSync(t.join(c, a)))
        return t.resolve(t.join(c, a));
      if (c === f)
        return null;
      c = h;
    }
  }
  function o() {
    const a = process.argv.filter((c) => c.indexOf("--user-data-dir=") === 0);
    return a.length === 0 || typeof a[0] != "string" ? null : a[0].replace("--user-data-dir=", "");
  }
  function s() {
    var a;
    try {
      return (a = require.main) == null ? void 0 : a.filename;
    } catch {
      return;
    }
  }
  return po;
}
var mo, ec;
function Nf() {
  if (ec) return mo;
  ec = 1;
  const e = Vr, t = wt, r = Q, n = TS();
  class i {
    constructor() {
      W(this, "appName");
      W(this, "appPackageJson");
      W(this, "platform", process.platform);
    }
    getAppLogPath(s = this.getAppName()) {
      return this.platform === "darwin" ? r.join(this.getSystemPathHome(), "Library/Logs", s) : r.join(this.getAppUserDataPath(s), "logs");
    }
    getAppName() {
      var a;
      const s = this.appName || ((a = this.getAppPackageJson()) == null ? void 0 : a.name);
      if (!s)
        throw new Error(
          "electron-log can't determine the app name. It tried these methods:\n1. Use `electron.app.name`\n2. Use productName or name from the nearest package.json`\nYou can also set it through log.transports.file.setAppName()"
        );
      return s;
    }
    /**
     * @private
     * @returns {undefined}
     */
    getAppPackageJson() {
      return typeof this.appPackageJson != "object" && (this.appPackageJson = n.findAndReadPackageJson()), this.appPackageJson;
    }
    getAppUserDataPath(s = this.getAppName()) {
      return s ? r.join(this.getSystemPathAppData(), s) : void 0;
    }
    getAppVersion() {
      var s;
      return (s = this.getAppPackageJson()) == null ? void 0 : s.version;
    }
    getElectronLogPath() {
      return this.getAppLogPath();
    }
    getMacOsVersion() {
      const s = Number(t.release().split(".")[0]);
      return s <= 19 ? `10.${s - 4}` : s - 9;
    }
    /**
     * @protected
     * @returns {string}
     */
    getOsVersion() {
      let s = t.type().replace("_", " "), a = t.release();
      return s === "Darwin" && (s = "macOS", a = this.getMacOsVersion()), `${s} ${a}`;
    }
    /**
     * @return {PathVariables}
     */
    getPathVariables() {
      const s = this.getAppName(), a = this.getAppVersion(), l = this;
      return {
        appData: this.getSystemPathAppData(),
        appName: s,
        appVersion: a,
        get electronDefaultDir() {
          return l.getElectronLogPath();
        },
        home: this.getSystemPathHome(),
        libraryDefaultDir: this.getAppLogPath(s),
        libraryTemplate: this.getAppLogPath("{appName}"),
        temp: this.getSystemPathTemp(),
        userData: this.getAppUserDataPath(s)
      };
    }
    getSystemPathAppData() {
      const s = this.getSystemPathHome();
      switch (this.platform) {
        case "darwin":
          return r.join(s, "Library/Application Support");
        case "win32":
          return process.env.APPDATA || r.join(s, "AppData/Roaming");
        default:
          return process.env.XDG_CONFIG_HOME || r.join(s, ".config");
      }
    }
    getSystemPathHome() {
      var s;
      return ((s = t.homedir) == null ? void 0 : s.call(t)) || process.env.HOME;
    }
    getSystemPathTemp() {
      return t.tmpdir();
    }
    getVersions() {
      return {
        app: `${this.getAppName()} ${this.getAppVersion()}`,
        electron: void 0,
        os: this.getOsVersion()
      };
    }
    isDev() {
      return process.env.NODE_ENV === "development" || process.env.ELECTRON_IS_DEV === "1";
    }
    isElectron() {
      return !!process.versions.electron;
    }
    onAppEvent(s, a) {
    }
    onAppReady(s) {
      s();
    }
    onEveryWebContentsEvent(s, a) {
    }
    /**
     * Listen to async messages sent from opposite process
     * @param {string} channel
     * @param {function} listener
     */
    onIpc(s, a) {
    }
    onIpcInvoke(s, a) {
    }
    /**
     * @param {string} url
     * @param {Function} [logFunction]
     */
    openUrl(s, a = console.error) {
      const c = { darwin: "open", win32: "start", linux: "xdg-open" }[process.platform] || "xdg-open";
      e.exec(`${c} ${s}`, {}, (u) => {
        u && a(u);
      });
    }
    setAppName(s) {
      this.appName = s;
    }
    setPlatform(s) {
      this.platform = s;
    }
    setPreloadFileForSessions({
      filePath: s,
      // eslint-disable-line no-unused-vars
      includeFutureSession: a = !0,
      // eslint-disable-line no-unused-vars
      getSessions: l = () => []
      // eslint-disable-line no-unused-vars
    }) {
    }
    /**
     * Sent a message to opposite process
     * @param {string} channel
     * @param {any} message
     */
    sendIpc(s, a) {
    }
    showErrorBox(s, a) {
    }
  }
  return mo = i, mo;
}
var go, tc;
function CS() {
  if (tc) return go;
  tc = 1;
  const e = Q, t = Nf();
  class r extends t {
    /**
     * @param {object} options
     * @param {typeof Electron} [options.electron]
     */
    constructor({ electron: o } = {}) {
      super();
      /**
       * @type {typeof Electron}
       */
      W(this, "electron");
      this.electron = o;
    }
    getAppName() {
      var s, a;
      let o;
      try {
        o = this.appName || ((s = this.electron.app) == null ? void 0 : s.name) || ((a = this.electron.app) == null ? void 0 : a.getName());
      } catch {
      }
      return o || super.getAppName();
    }
    getAppUserDataPath(o) {
      return this.getPath("userData") || super.getAppUserDataPath(o);
    }
    getAppVersion() {
      var s;
      let o;
      try {
        o = (s = this.electron.app) == null ? void 0 : s.getVersion();
      } catch {
      }
      return o || super.getAppVersion();
    }
    getElectronLogPath() {
      return this.getPath("logs") || super.getElectronLogPath();
    }
    /**
     * @private
     * @param {any} name
     * @returns {string|undefined}
     */
    getPath(o) {
      var s;
      try {
        return (s = this.electron.app) == null ? void 0 : s.getPath(o);
      } catch {
        return;
      }
    }
    getVersions() {
      return {
        app: `${this.getAppName()} ${this.getAppVersion()}`,
        electron: `Electron ${process.versions.electron}`,
        os: this.getOsVersion()
      };
    }
    getSystemPathAppData() {
      return this.getPath("appData") || super.getSystemPathAppData();
    }
    isDev() {
      var o;
      return ((o = this.electron.app) == null ? void 0 : o.isPackaged) !== void 0 ? !this.electron.app.isPackaged : typeof process.execPath == "string" ? e.basename(process.execPath).toLowerCase().startsWith("electron") : super.isDev();
    }
    onAppEvent(o, s) {
      var a;
      return (a = this.electron.app) == null || a.on(o, s), () => {
        var l;
        (l = this.electron.app) == null || l.off(o, s);
      };
    }
    onAppReady(o) {
      var s, a, l;
      (s = this.electron.app) != null && s.isReady() ? o() : (a = this.electron.app) != null && a.once ? (l = this.electron.app) == null || l.once("ready", o) : o();
    }
    onEveryWebContentsEvent(o, s) {
      var l, c, u;
      return (c = (l = this.electron.webContents) == null ? void 0 : l.getAllWebContents()) == null || c.forEach((f) => {
        f.on(o, s);
      }), (u = this.electron.app) == null || u.on("web-contents-created", a), () => {
        var f, h;
        (f = this.electron.webContents) == null || f.getAllWebContents().forEach((m) => {
          m.off(o, s);
        }), (h = this.electron.app) == null || h.off("web-contents-created", a);
      };
      function a(f, h) {
        h.on(o, s);
      }
    }
    /**
     * Listen to async messages sent from opposite process
     * @param {string} channel
     * @param {function} listener
     */
    onIpc(o, s) {
      var a;
      (a = this.electron.ipcMain) == null || a.on(o, s);
    }
    onIpcInvoke(o, s) {
      var a, l;
      (l = (a = this.electron.ipcMain) == null ? void 0 : a.handle) == null || l.call(a, o, s);
    }
    /**
     * @param {string} url
     * @param {Function} [logFunction]
     */
    openUrl(o, s = console.error) {
      var a;
      (a = this.electron.shell) == null || a.openExternal(o).catch(s);
    }
    setPreloadFileForSessions({
      filePath: o,
      includeFutureSession: s = !0,
      getSessions: a = () => {
        var l;
        return [(l = this.electron.session) == null ? void 0 : l.defaultSession];
      }
    }) {
      for (const c of a().filter(Boolean))
        l(c);
      s && this.onAppEvent("session-created", (c) => {
        l(c);
      });
      function l(c) {
        typeof c.registerPreloadScript == "function" ? c.registerPreloadScript({
          filePath: o,
          id: "electron-log-preload",
          type: "frame"
        }) : c.setPreloads([...c.getPreloads(), o]);
      }
    }
    /**
     * Sent a message to opposite process
     * @param {string} channel
     * @param {any} message
     */
    sendIpc(o, s) {
      var a, l;
      (l = (a = this.electron.BrowserWindow) == null ? void 0 : a.getAllWindows()) == null || l.forEach((c) => {
        var u, f;
        ((u = c.webContents) == null ? void 0 : u.isDestroyed()) === !1 && ((f = c.webContents) == null ? void 0 : f.isCrashed()) === !1 && c.webContents.send(o, s);
      });
    }
    showErrorBox(o, s) {
      var a;
      (a = this.electron.dialog) == null || a.showErrorBox(o, s);
    }
  }
  return go = r, go;
}
var yo, rc;
function $S() {
  if (rc) return yo;
  rc = 1;
  const e = xe, t = wt, r = Q, n = Rf();
  yo = {
    initialize({
      externalApi: s,
      getSessions: a,
      includeFutureSession: l,
      logger: c,
      preload: u = !0,
      spyRendererConsole: f = !1
    }) {
      s.onAppReady(() => {
        try {
          u && i({
            externalApi: s,
            getSessions: a,
            includeFutureSession: l,
            preloadOption: u
          }), f && o({ externalApi: s, logger: c });
        } catch (h) {
          c.warn(h);
        }
      });
    }
  };
  function i({
    externalApi: s,
    getSessions: a,
    includeFutureSession: l,
    preloadOption: c
  }) {
    let u = typeof c == "string" ? c : void 0;
    try {
      u = r.resolve(
        __dirname,
        "../renderer/electron-log-preload.js"
      );
    } catch {
    }
    if (!u || !e.existsSync(u)) {
      u = r.join(
        s.getAppUserDataPath() || t.tmpdir(),
        "electron-log-preload.js"
      );
      const f = `
      try {
        (${n.toString()})(require('electron'));
      } catch(e) {
        console.error(e);
      }
    `;
      e.writeFileSync(u, f, "utf8");
    }
    s.setPreloadFileForSessions({
      filePath: u,
      includeFutureSession: l,
      getSessions: a
    });
  }
  function o({ externalApi: s, logger: a }) {
    const l = ["debug", "info", "warn", "error"];
    s.onEveryWebContentsEvent(
      "console-message",
      (c, u, f) => {
        a.processMessage({
          data: [f],
          level: l[u],
          variables: { processType: "renderer" }
        });
      }
    );
  }
  return yo;
}
var Eo, nc;
function OS() {
  if (nc) return Eo;
  nc = 1;
  class e {
    constructor({
      externalApi: n,
      logFn: i = void 0,
      onError: o = void 0,
      showDialog: s = void 0
    } = {}) {
      W(this, "externalApi");
      W(this, "isActive", !1);
      W(this, "logFn");
      W(this, "onError");
      W(this, "showDialog", !0);
      this.createIssue = this.createIssue.bind(this), this.handleError = this.handleError.bind(this), this.handleRejection = this.handleRejection.bind(this), this.setOptions({ externalApi: n, logFn: i, onError: o, showDialog: s }), this.startCatching = this.startCatching.bind(this), this.stopCatching = this.stopCatching.bind(this);
    }
    handle(n, {
      logFn: i = this.logFn,
      onError: o = this.onError,
      processType: s = "browser",
      showDialog: a = this.showDialog,
      errorName: l = ""
    } = {}) {
      var c;
      n = t(n);
      try {
        if (typeof o == "function") {
          const u = ((c = this.externalApi) == null ? void 0 : c.getVersions()) || {}, f = this.createIssue;
          if (o({
            createIssue: f,
            error: n,
            errorName: l,
            processType: s,
            versions: u
          }) === !1)
            return;
        }
        l ? i(l, n) : i(n), a && !l.includes("rejection") && this.externalApi && this.externalApi.showErrorBox(
          `A JavaScript error occurred in the ${s} process`,
          n.stack
        );
      } catch {
        console.error(n);
      }
    }
    setOptions({ externalApi: n, logFn: i, onError: o, showDialog: s }) {
      typeof n == "object" && (this.externalApi = n), typeof i == "function" && (this.logFn = i), typeof o == "function" && (this.onError = o), typeof s == "boolean" && (this.showDialog = s);
    }
    startCatching({ onError: n, showDialog: i } = {}) {
      this.isActive || (this.isActive = !0, this.setOptions({ onError: n, showDialog: i }), process.on("uncaughtException", this.handleError), process.on("unhandledRejection", this.handleRejection));
    }
    stopCatching() {
      this.isActive = !1, process.removeListener("uncaughtException", this.handleError), process.removeListener("unhandledRejection", this.handleRejection);
    }
    createIssue(n, i) {
      var o;
      (o = this.externalApi) == null || o.openUrl(
        `${n}?${new URLSearchParams(i).toString()}`
      );
    }
    handleError(n) {
      this.handle(n, { errorName: "Unhandled" });
    }
    handleRejection(n) {
      const i = n instanceof Error ? n : new Error(JSON.stringify(n));
      this.handle(i, { errorName: "Unhandled rejection" });
    }
  }
  function t(r) {
    if (r instanceof Error)
      return r;
    if (r && typeof r == "object") {
      if (r.message)
        return Object.assign(new Error(r.message), r);
      try {
        return new Error(JSON.stringify(r));
      } catch (n) {
        return new Error(`Couldn't normalize error ${String(r)}: ${n}`);
      }
    }
    return new Error(`Can't normalize error ${String(r)}`);
  }
  return Eo = e, Eo;
}
var vo, ic;
function PS() {
  if (ic) return vo;
  ic = 1;
  class e {
    constructor(r = {}) {
      W(this, "disposers", []);
      W(this, "format", "{eventSource}#{eventName}:");
      W(this, "formatters", {
        app: {
          "certificate-error": ({ args: r }) => this.arrayToObject(r.slice(1, 4), [
            "url",
            "error",
            "certificate"
          ]),
          "child-process-gone": ({ args: r }) => r.length === 1 ? r[0] : r,
          "render-process-gone": ({ args: [r, n] }) => n && typeof n == "object" ? { ...n, ...this.getWebContentsDetails(r) } : []
        },
        webContents: {
          "console-message": ({ args: [r, n, i, o] }) => {
            if (!(r < 3))
              return { message: n, source: `${o}:${i}` };
          },
          "did-fail-load": ({ args: r }) => this.arrayToObject(r, [
            "errorCode",
            "errorDescription",
            "validatedURL",
            "isMainFrame",
            "frameProcessId",
            "frameRoutingId"
          ]),
          "did-fail-provisional-load": ({ args: r }) => this.arrayToObject(r, [
            "errorCode",
            "errorDescription",
            "validatedURL",
            "isMainFrame",
            "frameProcessId",
            "frameRoutingId"
          ]),
          "plugin-crashed": ({ args: r }) => this.arrayToObject(r, ["name", "version"]),
          "preload-error": ({ args: r }) => this.arrayToObject(r, ["preloadPath", "error"])
        }
      });
      W(this, "events", {
        app: {
          "certificate-error": !0,
          "child-process-gone": !0,
          "render-process-gone": !0
        },
        webContents: {
          // 'console-message': true,
          "did-fail-load": !0,
          "did-fail-provisional-load": !0,
          "plugin-crashed": !0,
          "preload-error": !0,
          unresponsive: !0
        }
      });
      W(this, "externalApi");
      W(this, "level", "error");
      W(this, "scope", "");
      this.setOptions(r);
    }
    setOptions({
      events: r,
      externalApi: n,
      level: i,
      logger: o,
      format: s,
      formatters: a,
      scope: l
    }) {
      typeof r == "object" && (this.events = r), typeof n == "object" && (this.externalApi = n), typeof i == "string" && (this.level = i), typeof o == "object" && (this.logger = o), (typeof s == "string" || typeof s == "function") && (this.format = s), typeof a == "object" && (this.formatters = a), typeof l == "string" && (this.scope = l);
    }
    startLogging(r = {}) {
      this.setOptions(r), this.disposeListeners();
      for (const n of this.getEventNames(this.events.app))
        this.disposers.push(
          this.externalApi.onAppEvent(n, (...i) => {
            this.handleEvent({ eventSource: "app", eventName: n, handlerArgs: i });
          })
        );
      for (const n of this.getEventNames(this.events.webContents))
        this.disposers.push(
          this.externalApi.onEveryWebContentsEvent(
            n,
            (...i) => {
              this.handleEvent(
                { eventSource: "webContents", eventName: n, handlerArgs: i }
              );
            }
          )
        );
    }
    stopLogging() {
      this.disposeListeners();
    }
    arrayToObject(r, n) {
      const i = {};
      return n.forEach((o, s) => {
        i[o] = r[s];
      }), r.length > n.length && (i.unknownArgs = r.slice(n.length)), i;
    }
    disposeListeners() {
      this.disposers.forEach((r) => r()), this.disposers = [];
    }
    formatEventLog({ eventName: r, eventSource: n, handlerArgs: i }) {
      var f;
      const [o, ...s] = i;
      if (typeof this.format == "function")
        return this.format({ args: s, event: o, eventName: r, eventSource: n });
      const a = (f = this.formatters[n]) == null ? void 0 : f[r];
      let l = s;
      if (typeof a == "function" && (l = a({ args: s, event: o, eventName: r, eventSource: n })), !l)
        return;
      const c = {};
      return Array.isArray(l) ? c.args = l : typeof l == "object" && Object.assign(c, l), n === "webContents" && Object.assign(c, this.getWebContentsDetails(o == null ? void 0 : o.sender)), [this.format.replace("{eventSource}", n === "app" ? "App" : "WebContents").replace("{eventName}", r), c];
    }
    getEventNames(r) {
      return !r || typeof r != "object" ? [] : Object.entries(r).filter(([n, i]) => i).map(([n]) => n);
    }
    getWebContentsDetails(r) {
      if (!(r != null && r.loadURL))
        return {};
      try {
        return {
          webContents: {
            id: r.id,
            url: r.getURL()
          }
        };
      } catch {
        return {};
      }
    }
    handleEvent({ eventName: r, eventSource: n, handlerArgs: i }) {
      var s;
      const o = this.formatEventLog({ eventName: r, eventSource: n, handlerArgs: i });
      if (o) {
        const a = this.scope ? this.logger.scope(this.scope) : this.logger;
        (s = a == null ? void 0 : a[this.level]) == null || s.call(a, ...o);
      }
    }
  }
  return vo = e, vo;
}
var wo, oc;
function Ff() {
  if (oc) return wo;
  oc = 1;
  const { transform: e } = jt();
  wo = {
    concatFirstStringElements: t,
    formatScope: n,
    formatText: o,
    formatVariables: i,
    timeZoneFromOffset: r,
    format({ message: s, logger: a, transport: l, data: c = s == null ? void 0 : s.data }) {
      switch (typeof l.format) {
        case "string":
          return e({
            message: s,
            logger: a,
            transforms: [i, n, o],
            transport: l,
            initialData: [l.format, ...c]
          });
        case "function":
          return l.format({
            data: c,
            level: (s == null ? void 0 : s.level) || "info",
            logger: a,
            message: s,
            transport: l
          });
        default:
          return c;
      }
    }
  };
  function t({ data: s }) {
    return typeof s[0] != "string" || typeof s[1] != "string" || s[0].match(/%[1cdfiOos]/) ? s : [`${s[0]} ${s[1]}`, ...s.slice(2)];
  }
  function r(s) {
    const a = Math.abs(s), l = s > 0 ? "-" : "+", c = Math.floor(a / 60).toString().padStart(2, "0"), u = (a % 60).toString().padStart(2, "0");
    return `${l}${c}:${u}`;
  }
  function n({ data: s, logger: a, message: l }) {
    const { defaultLabel: c, labelLength: u } = (a == null ? void 0 : a.scope) || {}, f = s[0];
    let h = l.scope;
    h || (h = c);
    let m;
    return h === "" ? m = u > 0 ? "".padEnd(u + 3) : "" : typeof h == "string" ? m = ` (${h})`.padEnd(u + 3) : m = "", s[0] = f.replace("{scope}", m), s;
  }
  function i({ data: s, message: a }) {
    let l = s[0];
    if (typeof l != "string")
      return s;
    l = l.replace("{level}]", `${a.level}]`.padEnd(6, " "));
    const c = a.date || /* @__PURE__ */ new Date();
    return s[0] = l.replace(/\{(\w+)}/g, (u, f) => {
      var h;
      switch (f) {
        case "level":
          return a.level || "info";
        case "logId":
          return a.logId;
        case "y":
          return c.getFullYear().toString(10);
        case "m":
          return (c.getMonth() + 1).toString(10).padStart(2, "0");
        case "d":
          return c.getDate().toString(10).padStart(2, "0");
        case "h":
          return c.getHours().toString(10).padStart(2, "0");
        case "i":
          return c.getMinutes().toString(10).padStart(2, "0");
        case "s":
          return c.getSeconds().toString(10).padStart(2, "0");
        case "ms":
          return c.getMilliseconds().toString(10).padStart(3, "0");
        case "z":
          return r(c.getTimezoneOffset());
        case "iso":
          return c.toISOString();
        default:
          return ((h = a.variables) == null ? void 0 : h[f]) || u;
      }
    }).trim(), s;
  }
  function o({ data: s }) {
    const a = s[0];
    if (typeof a != "string")
      return s;
    if (a.lastIndexOf("{text}") === a.length - 6)
      return s[0] = a.replace(/\s?{text}/, ""), s[0] === "" && s.shift(), s;
    const c = a.split("{text}");
    let u = [];
    return c[0] !== "" && u.push(c[0]), u = u.concat(s.slice(1)), c[1] !== "" && u.push(c[1]), u;
  }
  return wo;
}
var _o = { exports: {} }, sc;
function vi() {
  return sc || (sc = 1, function(e) {
    const t = Xn;
    e.exports = {
      serialize: n,
      maxDepth({ data: i, transport: o, depth: s = (o == null ? void 0 : o.depth) ?? 6 }) {
        if (!i)
          return i;
        if (s < 1)
          return Array.isArray(i) ? "[array]" : typeof i == "object" && i ? "[object]" : i;
        if (Array.isArray(i))
          return i.map((l) => e.exports.maxDepth({
            data: l,
            depth: s - 1
          }));
        if (typeof i != "object" || i && typeof i.toISOString == "function")
          return i;
        if (i === null)
          return null;
        if (i instanceof Error)
          return i;
        const a = {};
        for (const l in i)
          Object.prototype.hasOwnProperty.call(i, l) && (a[l] = e.exports.maxDepth({
            data: i[l],
            depth: s - 1
          }));
        return a;
      },
      toJSON({ data: i }) {
        return JSON.parse(JSON.stringify(i, r()));
      },
      toString({ data: i, transport: o }) {
        const s = (o == null ? void 0 : o.inspectOptions) || {}, a = i.map((l) => {
          if (l !== void 0)
            try {
              const c = JSON.stringify(l, r(), "  ");
              return c === void 0 ? void 0 : JSON.parse(c);
            } catch {
              return l;
            }
        });
        return t.formatWithOptions(s, ...a);
      }
    };
    function r(i = {}) {
      const o = /* @__PURE__ */ new WeakSet();
      return function(s, a) {
        if (typeof a == "object" && a !== null) {
          if (o.has(a))
            return;
          o.add(a);
        }
        return n(s, a, i);
      };
    }
    function n(i, o, s = {}) {
      const a = (s == null ? void 0 : s.serializeMapAndSet) !== !1;
      return o instanceof Error ? o.stack : o && (typeof o == "function" ? `[function] ${o.toString()}` : o instanceof Date ? o.toISOString() : a && o instanceof Map && Object.fromEntries ? Object.fromEntries(o) : a && o instanceof Set && Array.from ? Array.from(o) : o);
    }
  }(_o)), _o.exports;
}
var So, ac;
function $s() {
  if (ac) return So;
  ac = 1, So = {
    transformStyles: n,
    applyAnsiStyles({ data: i }) {
      return n(i, t, r);
    },
    removeStyles({ data: i }) {
      return n(i, () => "");
    }
  };
  const e = {
    unset: "\x1B[0m",
    black: "\x1B[30m",
    red: "\x1B[31m",
    green: "\x1B[32m",
    yellow: "\x1B[33m",
    blue: "\x1B[34m",
    magenta: "\x1B[35m",
    cyan: "\x1B[36m",
    white: "\x1B[37m"
  };
  function t(i) {
    const o = i.replace(/color:\s*(\w+).*/, "$1").toLowerCase();
    return e[o] || "";
  }
  function r(i) {
    return i + e.unset;
  }
  function n(i, o, s) {
    const a = {};
    return i.reduce((l, c, u, f) => {
      if (a[u])
        return l;
      if (typeof c == "string") {
        let h = u, m = !1;
        c = c.replace(/%[1cdfiOos]/g, (y) => {
          if (h += 1, y !== "%c")
            return y;
          const S = f[h];
          return typeof S == "string" ? (a[h] = !0, m = !0, o(S, c)) : y;
        }), m && s && (c = s(c));
      }
      return l.push(c), l;
    }, []);
  }
  return So;
}
var Ao, lc;
function IS() {
  if (lc) return Ao;
  lc = 1;
  const {
    concatFirstStringElements: e,
    format: t
  } = Ff(), { maxDepth: r, toJSON: n } = vi(), {
    applyAnsiStyles: i,
    removeStyles: o
  } = $s(), { transform: s } = jt(), a = {
    error: console.error,
    warn: console.warn,
    info: console.info,
    verbose: console.info,
    debug: console.debug,
    silly: console.debug,
    log: console.log
  };
  Ao = u;
  const c = `%c{h}:{i}:{s}.{ms}{scope}%c ${process.platform === "win32" ? ">" : "›"} {text}`;
  Object.assign(u, {
    DEFAULT_FORMAT: c
  });
  function u(S) {
    return Object.assign(v, {
      format: c,
      level: "silly",
      transforms: [
        f,
        t,
        m,
        e,
        r,
        n
      ],
      useStyles: process.env.FORCE_STYLES,
      writeFn({ message: A }) {
        (a[A.level] || a.info)(...A.data);
      }
    });
    function v(A) {
      const b = s({ logger: S, message: A, transport: v });
      v.writeFn({
        message: { ...A, data: b }
      });
    }
  }
  function f({ data: S, message: v, transport: A }) {
    return typeof A.format != "string" || !A.format.includes("%c") ? S : [`color:${y(v.level)}`, "color:unset", ...S];
  }
  function h(S, v) {
    if (typeof S == "boolean")
      return S;
    const b = v === "error" || v === "warn" ? process.stderr : process.stdout;
    return b && b.isTTY;
  }
  function m(S) {
    const { message: v, transport: A } = S;
    return (h(A.useStyles, v.level) ? i : o)(S);
  }
  function y(S) {
    const v = { error: "red", warn: "yellow", info: "cyan", default: "unset" };
    return v[S] || v.default;
  }
  return Ao;
}
var bo, cc;
function xf() {
  if (cc) return bo;
  cc = 1;
  const e = Jn, t = xe, r = wt;
  class n extends e {
    constructor({
      path: a,
      writeOptions: l = { encoding: "utf8", flag: "a", mode: 438 },
      writeAsync: c = !1
    }) {
      super();
      W(this, "asyncWriteQueue", []);
      W(this, "bytesWritten", 0);
      W(this, "hasActiveAsyncWriting", !1);
      W(this, "path", null);
      W(this, "initialSize");
      W(this, "writeOptions", null);
      W(this, "writeAsync", !1);
      this.path = a, this.writeOptions = l, this.writeAsync = c;
    }
    get size() {
      return this.getSize();
    }
    clear() {
      try {
        return t.writeFileSync(this.path, "", {
          mode: this.writeOptions.mode,
          flag: "w"
        }), this.reset(), !0;
      } catch (a) {
        return a.code === "ENOENT" ? !0 : (this.emit("error", a, this), !1);
      }
    }
    crop(a) {
      try {
        const l = i(this.path, a || 4096);
        this.clear(), this.writeLine(`[log cropped]${r.EOL}${l}`);
      } catch (l) {
        this.emit(
          "error",
          new Error(`Couldn't crop file ${this.path}. ${l.message}`),
          this
        );
      }
    }
    getSize() {
      if (this.initialSize === void 0)
        try {
          const a = t.statSync(this.path);
          this.initialSize = a.size;
        } catch {
          this.initialSize = 0;
        }
      return this.initialSize + this.bytesWritten;
    }
    increaseBytesWrittenCounter(a) {
      this.bytesWritten += Buffer.byteLength(a, this.writeOptions.encoding);
    }
    isNull() {
      return !1;
    }
    nextAsyncWrite() {
      const a = this;
      if (this.hasActiveAsyncWriting || this.asyncWriteQueue.length === 0)
        return;
      const l = this.asyncWriteQueue.join("");
      this.asyncWriteQueue = [], this.hasActiveAsyncWriting = !0, t.writeFile(this.path, l, this.writeOptions, (c) => {
        a.hasActiveAsyncWriting = !1, c ? a.emit(
          "error",
          new Error(`Couldn't write to ${a.path}. ${c.message}`),
          this
        ) : a.increaseBytesWrittenCounter(l), a.nextAsyncWrite();
      });
    }
    reset() {
      this.initialSize = void 0, this.bytesWritten = 0;
    }
    toString() {
      return this.path;
    }
    writeLine(a) {
      if (a += r.EOL, this.writeAsync) {
        this.asyncWriteQueue.push(a), this.nextAsyncWrite();
        return;
      }
      try {
        t.writeFileSync(this.path, a, this.writeOptions), this.increaseBytesWrittenCounter(a);
      } catch (l) {
        this.emit(
          "error",
          new Error(`Couldn't write to ${this.path}. ${l.message}`),
          this
        );
      }
    }
  }
  bo = n;
  function i(o, s) {
    const a = Buffer.alloc(s), l = t.statSync(o), c = Math.min(l.size, s), u = Math.max(0, l.size - s), f = t.openSync(o, "r"), h = t.readSync(f, a, 0, c, u);
    return t.closeSync(f), a.toString("utf8", 0, h);
  }
  return bo;
}
var To, uc;
function RS() {
  if (uc) return To;
  uc = 1;
  const e = xf();
  class t extends e {
    clear() {
    }
    crop() {
    }
    getSize() {
      return 0;
    }
    isNull() {
      return !0;
    }
    writeLine() {
    }
  }
  return To = t, To;
}
var Co, fc;
function DS() {
  if (fc) return Co;
  fc = 1;
  const e = Jn, t = xe, r = Q, n = xf(), i = RS();
  class o extends e {
    constructor() {
      super();
      W(this, "store", {});
      this.emitError = this.emitError.bind(this);
    }
    /**
     * Provide a File object corresponding to the filePath
     * @param {string} filePath
     * @param {WriteOptions} [writeOptions]
     * @param {boolean} [writeAsync]
     * @return {File}
     */
    provide({ filePath: l, writeOptions: c = {}, writeAsync: u = !1 }) {
      let f;
      try {
        if (l = r.resolve(l), this.store[l])
          return this.store[l];
        f = this.createFile({ filePath: l, writeOptions: c, writeAsync: u });
      } catch (h) {
        f = new i({ path: l }), this.emitError(h, f);
      }
      return f.on("error", this.emitError), this.store[l] = f, f;
    }
    /**
     * @param {string} filePath
     * @param {WriteOptions} writeOptions
     * @param {boolean} async
     * @return {File}
     * @private
     */
    createFile({ filePath: l, writeOptions: c, writeAsync: u }) {
      return this.testFileWriting({ filePath: l, writeOptions: c }), new n({ path: l, writeOptions: c, writeAsync: u });
    }
    /**
     * @param {Error} error
     * @param {File} file
     * @private
     */
    emitError(l, c) {
      this.emit("error", l, c);
    }
    /**
     * @param {string} filePath
     * @param {WriteOptions} writeOptions
     * @private
     */
    testFileWriting({ filePath: l, writeOptions: c }) {
      t.mkdirSync(r.dirname(l), { recursive: !0 }), t.writeFileSync(l, "", { flag: "a", mode: c.mode });
    }
  }
  return Co = o, Co;
}
var $o, dc;
function NS() {
  if (dc) return $o;
  dc = 1;
  const e = xe, t = wt, r = Q, n = DS(), { transform: i } = jt(), { removeStyles: o } = $s(), {
    format: s,
    concatFirstStringElements: a
  } = Ff(), { toString: l } = vi();
  $o = u;
  const c = new n();
  function u(h, { registry: m = c, externalApi: y } = {}) {
    let S;
    return m.listenerCount("error") < 1 && m.on("error", (B, q) => {
      b(`Can't write to ${q}`, B);
    }), Object.assign(v, {
      fileName: f(h.variables.processType),
      format: "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}",
      getFile: D,
      inspectOptions: { depth: 5 },
      level: "silly",
      maxSize: 1024 ** 2,
      readAllLogs: x,
      sync: !0,
      transforms: [o, s, a, l],
      writeOptions: { flag: "a", mode: 438, encoding: "utf8" },
      archiveLogFn(B) {
        const q = B.toString(), j = r.parse(q);
        try {
          e.renameSync(q, r.join(j.dir, `${j.name}.old${j.ext}`));
        } catch (le) {
          b("Could not rotate log", le);
          const E = Math.round(v.maxSize / 4);
          B.crop(Math.min(E, 256 * 1024));
        }
      },
      resolvePathFn(B) {
        return r.join(B.libraryDefaultDir, B.fileName);
      },
      setAppName(B) {
        h.dependencies.externalApi.setAppName(B);
      }
    });
    function v(B) {
      const q = D(B);
      v.maxSize > 0 && q.size > v.maxSize && (v.archiveLogFn(q), q.reset());
      const le = i({ logger: h, message: B, transport: v });
      q.writeLine(le);
    }
    function A() {
      S || (S = Object.create(
        Object.prototype,
        {
          ...Object.getOwnPropertyDescriptors(
            y.getPathVariables()
          ),
          fileName: {
            get() {
              return v.fileName;
            },
            enumerable: !0
          }
        }
      ), typeof v.archiveLog == "function" && (v.archiveLogFn = v.archiveLog, b("archiveLog is deprecated. Use archiveLogFn instead")), typeof v.resolvePath == "function" && (v.resolvePathFn = v.resolvePath, b("resolvePath is deprecated. Use resolvePathFn instead")));
    }
    function b(B, q = null, j = "error") {
      const le = [`electron-log.transports.file: ${B}`];
      q && le.push(q), h.transports.console({ data: le, date: /* @__PURE__ */ new Date(), level: j });
    }
    function D(B) {
      A();
      const q = v.resolvePathFn(S, B);
      return m.provide({
        filePath: q,
        writeAsync: !v.sync,
        writeOptions: v.writeOptions
      });
    }
    function x({ fileFilter: B = (q) => q.endsWith(".log") } = {}) {
      A();
      const q = r.dirname(v.resolvePathFn(S));
      return e.existsSync(q) ? e.readdirSync(q).map((j) => r.join(q, j)).filter(B).map((j) => {
        try {
          return {
            path: j,
            lines: e.readFileSync(j, "utf8").split(t.EOL)
          };
        } catch {
          return null;
        }
      }).filter(Boolean) : [];
    }
  }
  function f(h = process.type) {
    switch (h) {
      case "renderer":
        return "renderer.log";
      case "worker":
        return "worker.log";
      default:
        return "main.log";
    }
  }
  return $o;
}
var Oo, hc;
function FS() {
  if (hc) return Oo;
  hc = 1;
  const { maxDepth: e, toJSON: t } = vi(), { transform: r } = jt();
  Oo = n;
  function n(i, { externalApi: o }) {
    return Object.assign(s, {
      depth: 3,
      eventId: "__ELECTRON_LOG_IPC__",
      level: i.isDev ? "silly" : !1,
      transforms: [t, e]
    }), o != null && o.isElectron() ? s : void 0;
    function s(a) {
      var l;
      ((l = a == null ? void 0 : a.variables) == null ? void 0 : l.processType) !== "renderer" && (o == null || o.sendIpc(s.eventId, {
        ...a,
        data: r({ logger: i, message: a, transport: s })
      }));
    }
  }
  return Oo;
}
var Po, pc;
function xS() {
  if (pc) return Po;
  pc = 1;
  const e = _c, t = zd, { transform: r } = jt(), { removeStyles: n } = $s(), { toJSON: i, maxDepth: o } = vi();
  Po = s;
  function s(a) {
    return Object.assign(l, {
      client: { name: "electron-application" },
      depth: 6,
      level: !1,
      requestOptions: {},
      transforms: [n, i, o],
      makeBodyFn({ message: c }) {
        return JSON.stringify({
          client: l.client,
          data: c.data,
          date: c.date.getTime(),
          level: c.level,
          scope: c.scope,
          variables: c.variables
        });
      },
      processErrorFn({ error: c }) {
        a.processMessage(
          {
            data: [`electron-log: can't POST ${l.url}`, c],
            level: "warn"
          },
          { transports: ["console", "file"] }
        );
      },
      sendRequestFn({ serverUrl: c, requestOptions: u, body: f }) {
        const m = (c.startsWith("https:") ? t : e).request(c, {
          method: "POST",
          ...u,
          headers: {
            "Content-Type": "application/json",
            "Content-Length": f.length,
            ...u.headers
          }
        });
        return m.write(f), m.end(), m;
      }
    });
    function l(c) {
      if (!l.url)
        return;
      const u = l.makeBodyFn({
        logger: a,
        message: { ...c, data: r({ logger: a, message: c, transport: l }) },
        transport: l
      }), f = l.sendRequestFn({
        serverUrl: l.url,
        requestOptions: l.requestOptions,
        body: Buffer.from(u, "utf8")
      });
      f.on("error", (h) => l.processErrorFn({
        error: h,
        logger: a,
        message: c,
        request: f,
        transport: l
      }));
    }
  }
  return Po;
}
var Io, mc;
function Lf() {
  if (mc) return Io;
  mc = 1;
  const e = Df(), t = OS(), r = PS(), n = IS(), i = NS(), o = FS(), s = xS();
  Io = a;
  function a({ dependencies: l, initializeFn: c }) {
    var f;
    const u = new e({
      dependencies: l,
      errorHandler: new t(),
      eventLogger: new r(),
      initializeFn: c,
      isDev: (f = l.externalApi) == null ? void 0 : f.isDev(),
      logId: "default",
      transportFactories: {
        console: n,
        file: i,
        ipc: o,
        remote: s
      },
      variables: {
        processType: "main"
      }
    });
    return u.default = u, u.Logger = e, u.processInternalErrorFn = (h) => {
      u.transports.console.writeFn({
        message: {
          data: ["Unhandled electron-log error", h],
          level: "error"
        }
      });
    }, u;
  }
  return Io;
}
var Ro, gc;
function LS() {
  if (gc) return Ro;
  gc = 1;
  const e = pt, t = CS(), { initialize: r } = $S(), n = Lf(), i = new t({ electron: e }), o = n({
    dependencies: { externalApi: i },
    initializeFn: r
  });
  Ro = o, i.onIpc("__ELECTRON_LOG__", (a, l) => {
    l.scope && o.Logger.getInstance(l).scope(l.scope);
    const c = new Date(l.date);
    s({
      ...l,
      date: c.getTime() ? c : /* @__PURE__ */ new Date()
    });
  }), i.onIpcInvoke("__ELECTRON_LOG__", (a, { cmd: l = "", logId: c }) => {
    switch (l) {
      case "getOptions":
        return {
          levels: o.Logger.getInstance({ logId: c }).levels,
          logId: c
        };
      default:
        return s({ data: [`Unknown cmd '${l}'`], level: "error" }), {};
    }
  });
  function s(a) {
    var l;
    (l = o.Logger.getInstance(a)) == null || l.processMessage(a);
  }
  return Ro;
}
var Do, yc;
function US() {
  if (yc) return Do;
  yc = 1;
  const e = Nf(), t = Lf(), r = new e();
  return Do = t({
    dependencies: { externalApi: r }
  }), Do;
}
const kS = typeof process > "u" || process.type === "renderer" || process.type === "worker", MS = typeof process == "object" && process.type === "browser";
kS ? (Rf(), xn.exports = bS()) : MS ? xn.exports = LS() : xn.exports = US();
var jS = xn.exports;
const tt = /* @__PURE__ */ Yd(jS);
tt.transports.file.level = "info";
Be.autoUpdater.logger = tt;
class BS {
  constructor(t) {
    W(this, "mainWindow", null);
    this.mainWindow = t, this.setupEventHandlers(), setTimeout(() => {
      this.checkForUpdates();
    }, 1e4), setInterval(
      () => {
        this.checkForUpdates();
      },
      4 * 60 * 60 * 1e3
    );
  }
  setupEventHandlers() {
    Be.autoUpdater.on("checking-for-update", () => {
      tt.info("Checking for update..."), this.sendUpdateStatus("checking");
    }), Be.autoUpdater.on("update-available", (t) => {
      tt.info("Update available:", t), this.sendUpdateStatus("available", t.version);
    }), Be.autoUpdater.on("update-not-available", (t) => {
      tt.info("Update not available:", t), this.sendUpdateStatus("not-available");
    }), Be.autoUpdater.on("error", (t) => {
      tt.error("Error in auto-updater:", t), this.sendUpdateStatus("error", void 0, t.message);
    }), Be.autoUpdater.on("download-progress", (t) => {
      const r = Math.round(t.percent);
      tt.info(`Download progress: ${r}%`), this.sendUpdateStatus("downloading", void 0, void 0, r);
    }), Be.autoUpdater.on("update-downloaded", (t) => {
      tt.info("Update downloaded:", t), this.sendUpdateStatus("ready", t.version), this.showUpdateDialog(t.version);
    });
  }
  sendUpdateStatus(t, r, n, i) {
    this.mainWindow && !this.mainWindow.isDestroyed() && this.mainWindow.webContents.send("update-status", {
      status: t,
      version: r,
      error: n,
      progress: i
    });
  }
  showUpdateDialog(t) {
    !this.mainWindow || this.mainWindow.isDestroyed() || Pn.showMessageBox(this.mainWindow, {
      type: "info",
      title: "Update Available",
      message: `A new version (${t}) has been downloaded.`,
      detail: "Would you like to restart the application to apply the update?",
      buttons: ["Restart Now", "Later"],
      defaultId: 0,
      cancelId: 1
    }).then((r) => {
      r.response === 0 && Be.autoUpdater.quitAndInstall();
    });
  }
  checkForUpdates() {
    if (process.env.NODE_ENV === "development") {
      tt.info("Skipping update check in development mode");
      return;
    }
    Be.autoUpdater.checkForUpdatesAndNotify();
  }
  quitAndInstall() {
    Be.autoUpdater.quitAndInstall();
  }
}
const Xo = Xe.dirname(Hd(import.meta.url));
process.env.APP_ROOT = Xe.join(Xo, "..");
const Tr = process.env.VITE_DEV_SERVER_URL, cA = Xe.join(process.env.APP_ROOT, "dist-electron"), Jo = Xe.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Tr ? Xe.join(process.env.APP_ROOT, "public") : Jo;
let Y, Pt = null;
function Uf() {
  Y = new In({
    icon: Xe.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: Xe.join(Xo, "preload.mjs")
    },
    autoHideMenuBar: !0
  }), Y.maximize(), Pt = new BS(Y), Y.webContents.on("did-finish-load", () => {
    Y == null || Y.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), Tr ? Y.loadURL(Tr) : Y.loadFile(Xe.join(Jo, "index.html")), yr.handle(
    "generate-invoice-pdf",
    async (e, t) => (console.log(`${e} Received generate-invoice-pdf request:`, t), new Promise((r, n) => {
      const i = new In({
        width: 1200,
        height: 1080,
        show: !1,
        webPreferences: {
          preload: Xe.join(Xo, "preload.mjs"),
          nodeIntegration: !1,
          contextIsolation: !0
        }
      }), o = Tr ? `${Tr}#/invoice` : `file://${Xe.join(Jo, "index.html")}#/invoice`;
      i.loadURL(o), i.webContents.on("did-finish-load", () => {
        console.log("Sending invoice data to InvoicePage"), i.webContents.send("invoice-data", t);
      }), yr.once("invoice-rendered", async () => {
        console.log("Received invoice-rendered event");
        try {
          const s = await i.webContents.printToPDF({
            margins: { top: 0, right: 0, bottom: 0, left: 0 },
            scale: 1,
            preferCSSPageSize: !0,
            pageSize: "A4",
            printBackground: !0
          }), { canceled: a, filePath: l } = await Pn.showSaveDialog({
            title: "Save Fee Invoice PDF",
            defaultPath: `Fee Invoice - APS ${t.fileDetails.id}.pdf`,
            filters: [{ name: "PDF Files", extensions: ["pdf"] }]
          });
          if (a || !l) {
            n(new Error("Save dialog was canceled."));
            return;
          }
          Gd.writeFileSync(l, s), Pn.showMessageBox({
            type: "info",
            title: "PDF Generated",
            message: `Fee Invoice has been saved to ${l}`
          }), r(l);
        } catch (s) {
          console.error("Failed to generate PDF:", s), Pn.showErrorBox(
            "PDF Generation Error",
            "An error occurred while generating the PDF."
          ), n(s);
        } finally {
          i.close();
        }
      }), i.webContents.on("did-fail-load", (s, a, l) => {
        console.error(`${s}Failed to load InvoicePage: ${l} (${a})`), n(new Error(`Failed to load InvoicePage: ${l} (${a})`));
      }), setTimeout(() => {
        n(new Error("PDF generation timed out.")), i.isDestroyed() || i.close();
      }, 15e3);
    }))
  ), yr.handle("check-for-updates", () => {
    Pt == null || Pt.checkForUpdates();
  }), yr.handle("quit-and-install", () => {
    Pt == null || Pt.quitAndInstall();
  }), yr.on("show-context-menu", (e, t, r) => {
    const n = [
      //{ role: 'undo' },
      // { role: 'redo' },
      // { type: 'separator' },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      //{ role: 'delete' },
      { type: "separator" }
    ];
    switch (t) {
      case "nothing":
        break;
      case "file":
        n.push(
          {
            label: "View File Details",
            click: () => {
              Y == null || Y.webContents.send("context-menu-action", "viewFile", "file", r);
            }
          },
          {
            label: "Change Status",
            click: () => {
              Y == null || Y.webContents.send("context-menu-action", "changeStatus", "file", r);
            }
          },
          {
            label: "Edit Note",
            click: () => {
              Y == null || Y.webContents.send("context-menu-action", "editNote", "file", r);
            }
          },
          {
            label: "Edit Fee",
            click: () => {
              Y == null || Y.webContents.send("context-menu-action", "editFee", "file", r);
            }
          },
          {
            label: "Mark as Important",
            click: () => {
              Y == null || Y.webContents.send("context-menu-action", "markImportant", "file", r);
            }
          }
        );
        break;
      case "contact":
        n.push(
          {
            label: "View Contact Details",
            click: () => {
              Y == null || Y.webContents.send("context-menu-action", "viewContact", "contact", r);
            }
          },
          {
            label: "Copy Email Address",
            click: () => {
              Y == null || Y.webContents.send("context-menu-action", "copyEmail", "contact", r);
            }
          }
        );
        break;
      case "company":
        n.push({
          label: "View Company Details",
          click: () => {
            Y == null || Y.webContents.send("context-menu-action", "viewCompany", "company", r);
          }
        });
        break;
      case "fee":
        n.push(
          {
            label: "View File Details",
            click: () => {
              Y == null || Y.webContents.send("context-menu-action", "viewFile", "fee", r);
            }
          },
          {
            label: "Edit Fee",
            click: () => {
              Y == null || Y.webContents.send("context-menu-action", "editFee", "fee", r);
            }
          }
        );
        break;
    }
    qd.buildFromTemplate(n).popup({ window: In.fromWebContents(e.sender) || void 0 });
  });
}
Ln.on("window-all-closed", () => {
  process.platform !== "darwin" && (Ln.quit(), Y = null);
});
Ln.on("activate", () => {
  In.getAllWindows().length === 0 && Uf();
});
Ln.whenReady().then(Uf);
export {
  cA as MAIN_DIST,
  Jo as RENDERER_DIST,
  Tr as VITE_DEV_SERVER_URL
};

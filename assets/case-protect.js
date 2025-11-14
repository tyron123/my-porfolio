// Simple password overlay gate — v1
window.CaseProtect = (() => {
  const KEY = "case_pass_until_v1";
  const now = () => Math.floor(Date.now() / 1000);
  const ok = (until) => until && Number(until) > now();

  function ui(opts) {
    const wrap = document.createElement("div");
    wrap.style.cssText = `
		position:fixed;inset:0;
		backdrop-filter:blur(8px);
		-webkit-backdrop-filter:blur(8px);
		background:rgba(0,0,0,.8);
		display:grid;place-items:center;z-index:9999;
		font-family:Inter,system-ui,sans-serif;color:#111;`;

    wrap.innerHTML = `
      <div style="background:#fff;padding:2rem 1.5rem;border-radius:1rem;max-width:360px;width:92%;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.25)">
        <h2 style="margin:0 0 .5rem;font-weight:600">${opts.promptTitle || "Protected"}</h2>
        <p style="margin:0 0 1rem;opacity:.7">Enter password to view this case study.</p>
        <form>
          <input type="password" aria-label="Password" placeholder="Password" style="width:100%;padding:.75rem;border:1px solid #ccc;border-radius:.5rem;font-size:1rem" autofocus/>
          <button style="margin-top:.75rem;width:100%;padding:.75rem;border-radius:.5rem;background:#1E2A38;color:#fff;border:0;font-weight:500">Continue</button>
        </form>
        <p id="err" style="color:#c00;display:none;margin-top:.5rem;font-size:.9rem">Wrong password</p>
      </div>`;
    document.body.appendChild(wrap);

    const form = wrap.querySelector("form");
    const input = wrap.querySelector("input");
    const err = wrap.querySelector("#err");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (opts.validate(input.value)) {
        const until = now() + Math.max(1, (opts.rememberHours || 12)) * 3600;
        localStorage.setItem(KEY, String(until));
        wrap.remove();
      } else {
        err.style.display = "block";
        input.select();
      }
    });
  }

  function matchesScope(scope) {
    if (!scope || !scope.length) return true;
    const p = location.pathname;
    return scope.some((s) => p.endsWith(s));
  }

  function init(opts = {}) {
    if (!matchesScope(opts.pathScope)) return;
    try {
      const until = localStorage.getItem(KEY);
      if (ok(until)) return;
      ui(opts);
    } catch {
      ui(opts);
    }
  }

  return { init };
})();

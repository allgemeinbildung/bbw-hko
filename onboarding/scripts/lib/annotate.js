// In-page annotation: draw a highlight box (+ numbered badge) around a target
// element so the screenshot reads like a "click here" instruction. The overlay
// lives in its own container and is removed before the real action runs.

const CONTAINER_ID = "__ob_overlay__";

export async function highlight(page, selector, label) {
  await page.evaluate(
    ({ selector, label, containerId }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const r = el.getBoundingClientRect();
      let box = document.getElementById(containerId);
      if (box) box.remove();
      box = document.createElement("div");
      box.id = containerId;
      box.style.cssText = "position:fixed;inset:0;z-index:2147483647;pointer-events:none;";
      const pad = 6;
      const ring = document.createElement("div");
      ring.style.cssText = [
        "position:absolute",
        `left:${r.left - pad}px`,
        `top:${r.top - pad}px`,
        `width:${r.width + pad * 2}px`,
        `height:${r.height + pad * 2}px`,
        "border:3px solid #2563eb",
        "border-radius:8px",
        "box-shadow:0 0 0 9999px rgba(15,23,42,0.30)",
      ].join(";");
      box.appendChild(ring);
      if (label !== undefined && label !== null && `${label}` !== "") {
        const badge = document.createElement("div");
        badge.textContent = `${label}`;
        badge.style.cssText = [
          "position:absolute",
          `left:${r.left - pad - 14}px`,
          `top:${r.top - pad - 14}px`,
          "min-width:28px",
          "height:28px",
          "padding:0 6px",
          "border-radius:14px",
          "background:#2563eb",
          "color:#fff",
          "font:700 15px/28px system-ui,sans-serif",
          "text-align:center",
          "box-shadow:0 2px 6px rgba(0,0,0,0.4)",
        ].join(";");
        box.appendChild(badge);
      }
      document.body.appendChild(box);
    },
    { selector, label: label ?? null, containerId: CONTAINER_ID },
  );
}

export async function clearHighlight(page) {
  await page.evaluate((containerId) => {
    const n = document.getElementById(containerId);
    if (n) n.remove();
  }, CONTAINER_ID);
}

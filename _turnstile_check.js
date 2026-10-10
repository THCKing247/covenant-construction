const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

async function api() {
  const body = new FormData();
  body.set("name", "Jane Homeowner");
  body.set("phone", "(831) 555-0142");
  body.set("email", "jane@example.com");
  body.set("address", "123 Main St, Dallas, TX 75201, USA");
  body.set("projectType", "Residential Building");
  const response = await fetch("http://127.0.0.1:3460/api/contact", { method: "POST", body });
  console.log("API", response.status, JSON.stringify(await response.json()));
}

function cdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  });
  return new Promise((resolve, reject) => {
    ws.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          const msgId = ++id;
          ws.send(JSON.stringify({ id: msgId, method, params }));
          return new Promise((res) => pending.set(msgId, res));
        },
        close() {
          ws.close();
        },
      });
    });
    ws.addEventListener("error", reject);
  });
}

async function run() {
  await api();
  const profile = path.join(os.tmpdir(), `ccg-turnstile-${Date.now()}`);
  const debugPort = 9346;
  const chrome = spawn(
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    ["--headless=new", "--disable-gpu", "--window-size=1280,1000", "--no-first-run", `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, "http://127.0.0.1:3460/#contact"],
    { stdio: "ignore" }
  );
  let version;
  for (let i = 0; i < 40; i++) {
    try {
      version = await (await fetch(`http://127.0.0.1:${debugPort}/json/version`)).json();
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  const browser = await cdp(version.webSocketDebuggerUrl);
  const list = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
  const page = list.find((target) => target.type === "page");
  const session = await cdp(page.webSocketDebuggerUrl);
  await session.send("Runtime.enable");
  let widget = null;
  for (let i = 0; i < 30; i++) {
    const result = await session.send("Runtime.evaluate", {
      expression: `(() => {
        const slot = document.querySelector(".turnstile-slot");
        const iframe = document.querySelector("iframe[src*='challenges.cloudflare.com']");
        return {
          slot: Boolean(slot),
          iframe: iframe ? iframe.src : "",
          script: Boolean(document.querySelector("script[src*='challenges.cloudflare.com/turnstile']"))
        };
      })()`,
      returnByValue: true,
    });
    widget = result.result.result.value;
    if (widget?.iframe) break;
    await new Promise((r) => setTimeout(r, 400));
  }
  console.log("WIDGET", JSON.stringify(widget));
  await session.send("Runtime.evaluate", {
    expression: `document.querySelector("#contact form").scrollIntoView({block:"center"})`,
  });
  await new Promise((r) => setTimeout(r, 400));
  const image = await session.send("Page.captureScreenshot", { format: "png" });
  const file = path.join(os.tmpdir(), "ccg-turnstile.png");
  fs.writeFileSync(file, Buffer.from(image.result.data, "base64"));
  console.log(file, fs.statSync(file).size);
  session.close();
  browser.close();
  chrome.kill();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

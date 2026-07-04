const { app, BrowserWindow } = require("electron");
const { spawn } = require("node:child_process");
const http = require("node:http");
const path = require("node:path");

const port = process.env.NEXT_PORT || "3000";
const appUrl = `http://localhost:${port}`;
let nextProcess;
let nextServer;

function waitForServer(url, retries = 80) {
  return new Promise((resolve, reject) => {
    const tryRequest = (remaining) => {
      const request = http.get(url, (response) => {
        response.resume();
        resolve();
      });

      request.on("error", () => {
        if (remaining <= 0) {
          reject(new Error(`Next server did not start at ${url}`));
          return;
        }
        setTimeout(() => tryRequest(remaining - 1), 500);
      });
    };

    tryRequest(retries);
  });
}

function startNext() {
  if (app.isPackaged) {
    return startPackagedNext();
  }

  const isWindows = process.platform === "win32";
  const command = isWindows ? "cmd.exe" : "npm";
  const args = isWindows
    ? ["/d", "/s", "/c", `npm run dev -- -p ${port}`]
    : ["run", "dev", "--", "-p", port];

  nextProcess = spawn(command, args, {
    cwd: path.join(__dirname, ".."),
    env: { ...process.env, BROWSER: "none" },
    stdio: "inherit",
    shell: false,
    windowsHide: true
  });

  nextProcess.on("error", (error) => {
    console.error("Failed to start Next dev server:", error);
  });
}

async function startPackagedNext() {
  const next = require("next");
  const nextApp = next({
    dev: false,
    dir: app.getAppPath()
  });
  const handle = nextApp.getRequestHandler();

  await nextApp.prepare();

  nextServer = http.createServer((request, response) => {
    handle(request, response);
  });

  await new Promise((resolve, reject) => {
    nextServer.once("error", reject);
    nextServer.listen(Number(port), "127.0.0.1", resolve);
  });
}

async function createWindow() {
  if (app.isPackaged) {
    await startNext();
  } else {
    startNext();
    await waitForServer(appUrl);
  }

  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1180,
    minHeight: 720,
    title: "Futureys Billing POS",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  await window.loadURL(appUrl);
}

app.whenReady().then(createWindow).catch((error) => {
  console.error(error);
  app.quit();
});

app.on("window-all-closed", () => {
  if (nextProcess) {
    nextProcess.kill();
  }
  if (nextServer) {
    nextServer.close();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (nextProcess) {
    nextProcess.kill();
  }
  if (nextServer) {
    nextServer.close();
  }
});

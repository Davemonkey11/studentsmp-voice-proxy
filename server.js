const http = require("http");
const httpProxy = require("http-proxy");

const target = "http://eu2.freegamehost.xyz:24803";

const proxy = httpProxy.createProxyServer({
  target,
  ws: true,
  changeOrigin: true,
  xfwd: true
});

proxy.on("error", (err, req, res) => {
  console.error("Proxy error:", err.message);

  if (res && typeof res.writeHead === "function" && !res.headersSent) {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end("Voice server is temporarily unavailable.");
  } else if (res && typeof res.destroy === "function") {
    res.destroy();
  }
});

const server = http.createServer((req, res) => {
  proxy.web(req, res);
});

server.on("upgrade", (req, socket, head) => {
  proxy.ws(req, socket, head);
});

server.listen(process.env.PORT || 10000, "0.0.0.0", () => {
  console.log("StudentSMP HTTPS proxy is running.");
});

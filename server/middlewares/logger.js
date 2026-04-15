const RESET  = "\x1b[0m";
const GREEN  = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED    = "\x1b[31m";
const CYAN   = "\x1b[36m";
const DIM    = "\x1b[2m";

function colorStatus(status) {
  if (status >= 500) return `${RED}${status}${RESET}`;
  if (status >= 400) return `${YELLOW}${status}${RESET}`;
  return `${GREEN}${status}${RESET}`;
}

function colorTime(ms) {
  if (ms > 1000) return `${RED}${ms}ms${RESET}`;
  if (ms > 300)  return `${YELLOW}${ms}ms${RESET}`;
  return `${GREEN}${ms}ms${RESET}`;
}

export function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const ms     = Date.now() - start;
    const status = res.statusCode;
    const cache  = res.getHeader("X-Cache") ? ` ${DIM}[${res.getHeader("X-Cache")}]${RESET}` : "";
    const method = `${CYAN}${req.method.padEnd(7)}${RESET}`;
    const path   = req.originalUrl;

    console.log(`${method} ${path} ${colorStatus(status)} ${colorTime(ms)}${cache}`);

    if (status >= 400) {
      console.error(`  ${RED}↳ Error ${status}: ${req.method} ${path}${RESET}`);
    }
    if (ms > 1000) {
      console.warn(`  ${YELLOW}↳ Slow response: ${ms}ms on ${req.method} ${path}${RESET}`);
    }
  });

  next();
}

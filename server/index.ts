import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

registerObjectStorageRoutes(app);
app.use(routes);

app.use(express.static(path.join(__dirname, "../dist")));

app.get("/*splat", (req: Request, res: Response) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "Not found" });
  }
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[Server] Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const server = createServer(app);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[Server] Running on http://0.0.0.0:${PORT}`);
});

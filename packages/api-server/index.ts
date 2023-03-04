import express from "express";
import * as trpc from "@trpc/server"
import * as trpcExpress from "@trpc/server/adapters/express"
import cors from "cors"

const t = trpc.initTRPC.create()

const router = t.router;
const publicProcedure = t.procedure;

const appRouter = router({
  hello: publicProcedure
    .query((req) => {
      return "Hello world II!"
    })
});

export type AppRouter = typeof appRouter

const app = express();
app.use(cors());
const port = 8080;

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => { return {}; }
  })
)

app.get("/", (req, res) => {
  res.send("Hello from api-server");
});

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});

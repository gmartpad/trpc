import React, { useState } from "react";
import ReactDOM from "react-dom";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { AppRouter } from "api-server";

import "./index.scss";
import { trpc } from "./trpc";

const client = new QueryClient();

const AppContent = () => {
  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      <div>Name: client</div>
      <div>Framework: react</div>
      <div>Language: TypeScript</div>
      <div>CSS: Tailwind</div>
    </div>
  );
}

const App = () => {

  const [trpcClient] = useState(() => 
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:8080/trpc'
        })
      ]
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client}>
        <AppContent/>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

ReactDOM.render(<App />, document.getElementById("app"));

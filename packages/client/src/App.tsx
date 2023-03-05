import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from "@trpc/react-query";

import "./index.scss";
import { trpc } from "./trpc";

const client = new QueryClient();

interface MessageProps {
  user: string,
  message: string
}

const AppContent = () => {

  const [user, setUser] = useState<string>('')
  const [message, setMessage] = useState<string>('')  

  const hello = trpc.hello.useQuery()
  const getMessages = trpc.getMessages.useQuery()

  const addMessage = trpc.addMessage.useMutation({
    onSuccess: () => {
      getMessages.refetch()
    }
  })

  const onAdd = useCallback(async ({ user, message }: MessageProps) => {
    await addMessage.mutateAsync({ user, message })
  }, [addMessage])

  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      <div>
        {(getMessages.data ?? []).map(row => (
          <div key={row.message}>
            {JSON.stringify(row)}
          </div>  
        ))}
      </div>
      {addMessage.isError && <p>There was an error with the message submition</p>}
      <div className="mt-10">
        <input 
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="p-5 border-2 border-gray-300 rounded-lg w-full"
          placeholder="user"
        />
        <input 
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-5 border-2 border-gray-300 rounded-lg w-full"
          placeholder="message"
        />
      </div>
      <button onClick={() => onAdd({user, message})}>Add message</button>
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
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client}>
        <AppContent/>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

ReactDOM.render(<App />, document.getElementById("app"));

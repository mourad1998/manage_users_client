import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import UserList from "./pages/UserList";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <UserList />
      </div>
    </QueryClientProvider>
  );
}

export default App;

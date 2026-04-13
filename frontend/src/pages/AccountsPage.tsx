import { useQuery } from "@tanstack/react-query";
import { fetchAccounts } from "../api/accounts";

function AccountsPage() {
  const { data: accounts, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });

  return <div>Header</div>;
}

export default AccountsPage;

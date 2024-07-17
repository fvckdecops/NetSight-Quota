import { format } from "date-fns";
import { Numeral } from "react-numeral";

export const columns = [
    {
        accessorKey: "datetime",
        header: "Date Time",
        cell: prop => format(new Date(prop.getValue()), 'yyyy-MM-dd HH:mm:ss')
    },
    {
        accessorKey: "msisdn",
        header: "Phone Number"
    },
    {
        accessorKey: "name",
        header: "Package Name"
    },
    {
        accessorKey: "transactionType",
        header: "Transaction Type"
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: prop => <>Rp. <Numeral value={prop.getValue()} format="0,0" /></>
    },
    {
        accessorKey: "status",
        header: "Status"
    },
    {
        accessorKey: "usercode",
        header: "User Code"
    },
    {
        accessorKey: "username",
        header: "Username"
    }
]
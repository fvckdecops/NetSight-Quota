"use client"

import { columns } from "@/components/columns";
import { DataTable } from "@/components/customs/datatables";
import { Modal } from "@/components/customs/modal";
import QuotaForm from "@/components/forms/Quota";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { QUOTA_LIST } from "@/config/actions";
import usePagination from "@/hooks/usePagination";
import useSorting from "@/hooks/useSorting";
import { fetchGet } from "@/lib/fetchGet";
import { useQuery } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { FaPlus, FaSignOutAlt } from "react-icons/fa";

export default function DashboardPage() {
    const rowEachPage = 10
    const { offset, limit, onPaginationChange, pagination } = usePagination(rowEachPage)
    const { sortKey, sortOrder, onSortingChange, sorting } = useSorting("-datetime")

    const [open, setOpen] = useState(false)

    const { data, isLoading, error } = useQuery({
        queryKey: [QUOTA_LIST, pagination],
        queryFn: () => fetchGet({
            url: '/api/quota',
            body: { offset, limit, sort: { [sortKey]: sortOrder } }
        })
    })

    return (
        <div className="flex justify-center items-center h-full">
            <Card className="w-[40rem] md:w-[90vw]">
                <CardHeader className="p-3">
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="text-sm md:text-xl mb-0">Quota Topup History</h1>
                        <div className="flex gap-2">
                            <Modal
                                open={open}
                                trigger={<Button size="sm" className="flex items-center gap-2"><FaPlus />Add Quota Usage</Button>}
                                onOpenChange={setOpen} 
                                content={<QuotaForm closeEvent={setOpen} />} 
                                title="New Usage"
                                className="w-full md:max-xl:w-[70vw] xl:max-2xl:w-[37vw] max-w-full"
                            />
                            <Button variant="destructive" size="sm" className="flex items-center gap-2" onClick={() => signOut()}><FaSignOutAlt />Logout</Button>
                        </div>
                    </div>
                    <CardDescription>
                        History Quota top up histories
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={data}
                        isLoading={isLoading}
                        error={error}
                        sorting={sorting}
                        onSortingChange={onSortingChange}
                        pagination={pagination}
                        onPaginationChange={onPaginationChange}
                        rowEachPage={rowEachPage}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
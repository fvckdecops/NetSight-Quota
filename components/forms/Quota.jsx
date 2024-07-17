"use client"

import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import InputUI from "../customs/forms/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";

import { useForm } from '@tanstack/react-form'
import * as yup from "yup"
import * as xlsx from "xlsx"
import { yupValidator as validatorAdapter } from "@tanstack/yup-form-adapter"
import { FaPaperPlane, FaQuestionCircle } from 'react-icons/fa';
import { useSession } from 'next-auth/react'
import { CgSpinner } from 'react-icons/cg';
import { toast } from 'react-toastify'
import { DatePicker } from "rsuite";
import { format, isAfter } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPost } from "@/lib/fetchPost";
import { QUOTA_LIST } from "@/config/actions";
import { Modal } from "../customs/modal";
import { useState } from "react";

function FieldInfo({ field }) {
    return (
        <>
            {field.state.meta.touchedErrors ? (
                <p className="text-sm text-destructive mt-1">{field.state.meta.touchedErrors}</p>
            ) : null}
            {field.state.meta.isValidating ? (
                <p className="text-sm text-muted-foreground">Validating...</p>
            ) : null}
        </>
    )
}

export default function QuotaForm( closeEvent ) {
    const [open, setOpen] = useState(false)
    const { data: session } = useSession()
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: (params) => fetchPost({
            url: '/api/quota',
            body: params
        }),
        onSuccess(data) {
            if(data.code === 0) {
                toast.success("Successfully added.")
                queryClient.invalidateQueries([QUOTA_LIST])
                closeEvent((prev) => prev = !prev)
            } else {
                toast.warning(data.message)
            }
        }
    })

    const form = useForm({
        validatorAdapter,
        defaultValues: {
            name: '',
            msisdn: '',
            price: '',
            transactionType: '',
            status: '',
            datetime: new Date(),
            usercode: '',
            csvFile: null,
            username: session?.token?.username || ''
        },
        async onSubmit({ value }) {
            let results = []

            if(value?.csvFile && value?.csvFile.length) {
                results = value.csvFile
            } else {
                value.datetime = format(value.datetime, 'yyyy-MM-dd HH:mm:ss')
                value.price = parseInt(value.price)

                results.push(value)
            }

            mutate({ quota: results })
        }
    })

    return (
        <Tabs defaultValue="single">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="single">Single</TabsTrigger>
                <TabsTrigger value="multiple">Multiple</TabsTrigger>
            </TabsList>
            <TabsContent value="single">
                <Card>
                    <CardHeader>
                        <CardTitle>Quota Usage</CardTitle>
                        <CardDescription>
                        Fill out the form below to add new quota usage log.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                form.handleSubmit()
                            }}
                            id="form-single"
                        >
                            <div className="h-[50vh] overflow-y-scroll md:overflow-auto md:h-auto md:flex md:flex-wrap md:gap-4">
                                <form.Field
                                    name="name"
                                    validators={{
                                        onChange: yup.string().min(3, 'package name must be at least 3 characters'),
                                        onChangeAsyncDebounceMs: 500,
                                        onChangeAsync: async ({ value }) => {
                                            await new Promise(resolve => setTimeout(resolve, 1000))
                                        }
                                    }}
                                    children={(field) => (
                                        <div className="space-y-1">
                                            <Label htmlFor="name">Package Name</Label>
                                            <InputUI 
                                                type="text" 
                                                placeholder="Enter package name ..." 
                                                required 
                                                id={field.name} 
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                            <FieldInfo field={field} />
                                        </div>
                                    )}
                                />
                                
                                <form.Field
                                    name="msisdn"
                                    validators={{
                                        onChange: yup.string().min(9, 'phone number must be at least 9 characters'),
                                        onChangeAsyncDebounceMs: 500,
                                        onChangeAsync: async ({ value }) => {
                                            await new Promise(resolve => setTimeout(resolve, 1000))
                                        }
                                    }}
                                    children={(field) => (
                                        <div className="space-y-1">
                                            <Label htmlFor="msisdn">Phone number</Label>
                                            <InputUI 
                                                type="text" 
                                                placeholder="Enter phone number ..." 
                                                required 
                                                id={field.name} 
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                            <FieldInfo field={field} />
                                        </div>
                                    )}
                                />

                                <form.Field
                                    name="price"
                                    validators={{
                                        onChange: yup.string().min(1, 'Package price is required'),
                                        onChangeAsyncDebounceMs: 500,
                                        onChangeAsync: async ({ value }) => {
                                            await new Promise(resolve => setTimeout(resolve, 1000))
                                        }
                                    }}
                                    children={(field) => (
                                        <div className="space-y-1">
                                            <Label htmlFor="price">Price</Label>
                                            <InputUI 
                                                type="text" 
                                                placeholder="Enter package price ..." 
                                                required 
                                                id={field.name} 
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                            <FieldInfo field={field} />
                                        </div>
                                    )}
                                />

                                <form.Field
                                    name="transactionType"
                                    validators={{
                                        onChange: yup.string().min(1, 'Transaction type is required'),
                                        onChangeAsyncDebounceMs: 500,
                                        onChangeAsync: async ({ value }) => {
                                            await new Promise(resolve => setTimeout(resolve, 1000))
                                        }
                                    }}
                                    children={(field) => (
                                        <div className="space-y-1">
                                            <Label htmlFor="transactionType">Transaction Type</Label>
                                            <InputUI 
                                                type="text" 
                                                placeholder="Enter transaction type ..." 
                                                required 
                                                id={field.name} 
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                            <FieldInfo field={field} />
                                        </div>
                                    )}
                                />

                                <form.Field
                                    name="status"
                                    validators={{
                                        onChange: yup.string().min(1, 'Status package is required'),
                                        onChangeAsyncDebounceMs: 500,
                                        onChangeAsync: async ({ value }) => {
                                            await new Promise(resolve => setTimeout(resolve, 1000))
                                        }
                                    }}
                                    children={(field) => (
                                        <div className="space-y-1">
                                            <Label htmlFor="status">Package status</Label>
                                            <InputUI 
                                                type="text" 
                                                placeholder="Enter package status ..." 
                                                required 
                                                id={field.name} 
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                            <FieldInfo field={field} />
                                        </div>
                                    )}
                                />

                                <form.Field
                                    name="usercode"
                                    validators={{
                                        onChange: yup.string().min(1, 'User code is required'),
                                        onChangeAsyncDebounceMs: 500,
                                        onChangeAsync: async ({ value }) => {
                                            await new Promise(resolve => setTimeout(resolve, 1000))
                                        }
                                    }}
                                    children={(field) => (
                                        <div className="space-y-1">
                                            <Label htmlFor="status">User Code</Label>
                                            <InputUI 
                                                type="text" 
                                                placeholder="Enter user code ..." 
                                                required 
                                                id={field.name} 
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                            <FieldInfo field={field} />
                                        </div>
                                    )}
                                />

                                <form.Field
                                    name="username"
                                    validators={{
                                        onChange: yup.string().min(1, 'Username is required'),
                                        onChangeAsyncDebounceMs: 500,
                                        onChangeAsync: async ({ value }) => {
                                            await new Promise(resolve => setTimeout(resolve, 1000))
                                        }
                                    }}
                                    children={(field) => (
                                        <div className="space-y-1">
                                            <Label htmlFor="status">Username</Label>
                                            <InputUI 
                                                type="text" 
                                                placeholder="Enter user name ..." 
                                                required 
                                                id={field.name} 
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                            <FieldInfo field={field} />
                                        </div>
                                    )}
                                />

                                <form.Field
                                    name="datetime"
                                    validators={{
                                        onChange: yup.string().min(1, 'Date transaction is required'),
                                        onChangeAsyncDebounceMs: 500,
                                        onChangeAsync: async ({ value }) => {
                                            await new Promise(resolve => setTimeout(resolve, 1000))
                                        }
                                    }}
                                    children={(field) => (
                                        <div className="mt-4 md:space-y-1 md:mt-1 flex flex-col gap-1">
                                            <Label htmlFor="datetime">Date Transaction</Label>
                                            <DatePicker
                                                size="lg"
                                                block
                                                defaultValue={field.state.value}
                                                className="md:w-[203px]"
                                                limitStartYear={new Date().getFullYear()}
                                                shouldDisableDate={date => isAfter(date, new Date())}
                                                format="yyyy-MM-dd HH:mm:ss"
                                                placement="topStart"
                                                onOk={(value) => field.handleChange(value)}
                                            />
                                            <FieldInfo field={field} />
                                        </div>
                                    )}
                                />
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <form.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                            children={([canSubmit, isSubmitting]) => (
                                <Button type="submit" disabled={!canSubmit || isPending} className="w-full" form="form-single">
                                    {isSubmitting
                                        ?  (<> <CgSpinner className="mr-2 animate-spin" /> Loading... </>)
                                        : isPending ?
                                            <div className='flex gap-1 items-center'><CgSpinner className="mr-2 animate-spin" />Redirecting...</div>
                                        :
                                            (<div className="flex items-center gap-2"><FaPaperPlane /> Submit</div>)
                                    }
                                </Button>
                            )}
                        />
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="multiple">
                <Card>
                    <CardHeader>
                        <CardTitle>Multiple Input</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                            <div>
                                Upload <span className="text-red-600">.xlsx</span> file to upload multiple quota top up history.
                            </div>
                            <Modal
                                open={open}
                                trigger={<a href="#"><FaQuestionCircle /></a>}
                                onOpenChange={setOpen} 
                                content={<img src="/assets/images/sample-data.png" className="w-full" alt=""/>} 
                                title="Sample Data"
                                className="w-full md:max-xl:w-[70vw] xl:max-2xl:w-[60vw] max-w-full"
                            />
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <form
                        onSubmit={(e) => {
                            e.stopPropagation()
                            e.preventDefault()

                            form.handleSubmit()
                        }}
                        id="form-multiple">
                            <div className="mt-4 md:space-y-1 md:mt-1 flex flex-col gap-1">
                                <Label htmlFor="datetime">Upload File</Label>
                                <InputUI
                                    type="file"
                                    required 
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    id="csvFile" 
                                    name="csvFile" 
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        const reader = new FileReader()

                                        reader.onload = (event) => {
                                            const workbook = xlsx.read(event.target.result, { type: 'binary' });
                                            const sheetName = workbook.SheetNames[0];
                                            const sheet = workbook.Sheets[sheetName];
                                            const sheetData = xlsx.utils.sheet_to_json(sheet);

                                            let results = []
                                            sheetData.map(data => {
                                                results.push({
                                                    name: data["Nama Paket"],
                                                    msisdn: data["MSISDN"],
                                                    transactionType: data["Jenis Transaksi"],
                                                    price: data["Harga"],
                                                    status: data["Status"],
                                                    datetime: data["Tanggal"],
                                                    usercode: data["Usercode"],
                                                    username: data["Username"]
                                                })
                                            })

                                            form.setFieldValue('csvFile', results, { touch: true })
                                        }

                                        reader.readAsBinaryString(file);
                                    }}
                                />
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <form.Subscribe
                                selector={(state) => [state.canSubmit, state.isSubmitting]}
                                children={([canSubmit, isSubmitting]) => (
                                    <Button type="submit" disabled={!canSubmit || isPending} className="w-full" form="form-multiple">
                                        {isSubmitting
                                            ?  (<> <CgSpinner className="mr-2 animate-spin" /> Loading... </>)
                                            : isPending ?
                                                <div className='flex gap-1 items-center'><CgSpinner className="mr-2 animate-spin" />Redirecting...</div>
                                            :
                                                (<div className="flex items-center gap-2"><FaPaperPlane /> Submit</div>)
                                        }
                                    </Button>
                                )}
                        />
                    </CardFooter>
                </Card>
            </TabsContent>
            </Tabs>
    )
}
"use client";
import Image from "next/image";
import Link from "next/link";
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TopNav from "@/components/TopNav";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import serverUrl from "@/lib/serverUrl";
import useProtectedRoute from "@/components/useProtectedRoute";
import * as XLSX from 'xlsx';

function Users() {
  const router = useRouter();
  const [users, setUsers] = useState<any>([]);
  const [search, setSearch] = useState("");
  useProtectedRoute();
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "users.xlsx");
  };
  useEffect(() => {
    axios.get(`${serverUrl}/api/admin/users`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }).then((res) => {
      setUsers(res.data.users);
    });
  }, []);
  const handleDelete = (id: string) => {
    axios.delete(`${serverUrl}/api/admin/delete-user/${id}`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then(() => {
      setUsers(users.filter((item: any) => item._id !== id));
    });
  }
  useEffect(() => {
    axios.get(`${serverUrl}/api/admin/users?name=${search}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }).then((res) => {
      setUsers(res.data.users);
    });
  },[search])
  return (
    <>
      <div className="flex min-h-screen w-full flex-col">
        <TopNav search={search} setSearch={setSearch} />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all" className="mt-3">
            <div className="flex items-center">
              <div className="ml-auto flex items-center gap-2">
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Archived
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
                <Button size="sm" variant="outline" className="h-8 gap-1" onClick={exportToExcel}>
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <Button
                  size="sm"
                  className="h-8 gap-1"
                  onClick={() => router.push("/add-user")}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add User
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="ProductDashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>User</CardTitle>
                  <CardDescription>List of all users</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead> Email</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Phone Number
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Address
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Wallet
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.email}
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.phone_number}
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.address}
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.wallet}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => {
                                    router.push(`/items`);
                                    localStorage.setItem("userId", item._id);
                                  }}
                                >
                                  Add Order
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                     onClick={() => {
                                      router.push(`/edit-user/${item._id}`);
                                    }}
                                >Edit</DropdownMenuItem>
                                <DropdownMenuItem onClick={()=>handleDelete(item._id)}>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                {/* <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                    products
                  </div>
                </CardFooter> */}
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}

export default Users;

"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Phone,
  Search,
  Settings,
  ShoppingCart,
  Truck,
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TopNav from "@/components/TopNav";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import serverUrl from "@/lib/serverUrl";
import useProtectedRoute from "@/components/useProtectedRoute";
import moment from "moment";
import * as XLSX from "xlsx";

interface IData {
  totalRevenue: number;
  totalUsers: number;
  totalOrders: number;
  lastMonthRevenue: number;
  lastMonthUsers: number;
}
export function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState({} as any);
  const [orderIndex, setOrderIndex] = useState<any>(0);
  const [filter, setFilter] = useState("today");
  const [data, setData] = useState<IData>({
    totalRevenue: 0,
    totalUsers: 0,
    totalOrders: 0,
    lastMonthRevenue: 0,
    lastMonthUsers: 0,
  });
  const [search, setSearch] = useState("");
  useProtectedRoute();
  useEffect(() => {
    axios
      .get(`${serverUrl}/api/admin/users-orders?filter=${filter}`, {
        headers: {
          "x-access-token": localStorage.getItem("token") || "",
        },
      })
      .then((res) => {
        setOrders(res.data);
        console.log(res.data);
        setOrder(res.data[0]);
      });
      
  }, [filter]);
  useEffect(() => {
    axios
    .get(`${serverUrl}/api/admin/home-statitics`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
    .then((res) => {
      setData(res.data);
    });
  },[])
  useEffect(() => {
    axios
      .get(`${serverUrl}/api/admin/users-orders?search=${search}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setOrders(res.data);
        setOrder(res.data[0]);
      });
  },[search])
  const handleDelete = () => {
    axios
      .delete(
        `${serverUrl}/api/admin/delete-order/${order?.user?._id}/${order?.item?.itemDetails?._id}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        let newOrders = [...orders];
        newOrders.splice(orderIndex, 1);
        setOrders(newOrders);
        setOrder(orders[0]);
      });
  };
const exportToExcel = () => {
    const data = orders.map((order: any) => ({
        Customer: order?.user?.name,
        Phone : order?.user?.phone_number,
        Email: order?.user?.email,
        Date: order?.item?.date,
        Item: order?.item?.itemDetails?.name,
        ItemAmount: order?.item?.itemDetails?.price,
        Quantity: order?.item?.quantity,
        Cashback: order?.item?.itemDetails?.discount,
        Total: order?.item?.price,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "data.xlsx");
};
  return (
    <div className="flex min-h-screen w-full flex-col">
      <TopNav search={search} setSearch={setSearch} />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2" x-chunk="OrderDashboard-05-chunk-0">
              <CardHeader className="pb-3">
                <CardTitle>Your Orders</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  Introducing Our Dynamic Orders OrderDashboard for Seamless
                  Management and Insightful Analysis.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/items">
                  <Button>Create New Order</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card x-chunk="OrderDashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription>This Month</CardDescription>
                <CardTitle className="text-4xl">+{data.lastMonthUsers}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  +{data.lastMonthUsers/data.totalOrders*100}% from last month
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={data.lastMonthUsers/data.totalOrders*100} aria-label="25% increase" />
              </CardFooter>
            </Card>
            <Card x-chunk="OrderDashboard-05-chunk-2">
              <CardHeader className="pb-2">
                <CardDescription>This Month Revenue</CardDescription>
                <CardTitle className="text-4xl">₹{data.lastMonthRevenue}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  +{data.lastMonthRevenue/data.totalRevenue*100}% from last month
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={data.lastMonthRevenue/data.totalRevenue*100} aria-label="12% increase" />
              </CardFooter>
            </Card>
          </div>
          <Tabs defaultValue={filter}>
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="today" onClick={() => setFilter("today")}>
                  Today
                </TabsTrigger>
                <TabsTrigger value="week" onClick={() => setFilter("week")}>
                  Week
                </TabsTrigger>
                <TabsTrigger value="month" onClick={() => setFilter("month")}>
                  Month
                </TabsTrigger>
                <TabsTrigger value="year" onClick={() => setFilter("year")}>
                  Year
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 text-sm"
                    >
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only">Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Fulfilled
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Declined
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Refunded
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 text-sm"
                  onClick={exportToExcel}
                >
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Export</span>
                </Button>
              </div>
            </div>
            <TabsContent value={filter}>
              <Card x-chunk="OrderDashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>
                    Recent orders from your store.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Date
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Item Name
                        </TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order: any, index) => {
                        return (
                          <TableRow
                            className="bg-accent"
                            onClick={() => {
                              setOrder(order);
                              setOrderIndex(index);
                            }}
                          >
                            <TableCell>
                              <div className="font-medium">
                                {order?.user?.name}
                              </div>
                              <div className="hidden text-sm text-muted-foreground md:inline">
                                <p>{order?.user?.email}</p>
                                {order?.user?.phone_number}
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {order?.item?.date}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {order?.item?.itemDetails?.name}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant="default">
                                {order?.item?.price}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <Card className="overflow-hidden" x-chunk="OrderDashboard-05-chunk-4">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Order
                </CardTitle>
                <CardDescription>Date: {order?.item?.date}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
              <div className="grid gap-3">
                <div className="font-semibold">Order Details</div>
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {order?.item?.itemDetails?.name}
                      <span> {order?.item?.quantity}</span>
                    </span>
                    <span>{order?.item?.itemDetails?.price}</span>
                  </li>
                </ul>
                <Separator className="my-2" />
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cashback</span>
                    <span>{order?.item?.itemDetails?.discount}</span>
                  </li>

                  <li className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Total</span>
                    <span>{order?.item?.price}</span>
                  </li>
                </ul>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <div className="font-semibold">Action</div>
                  <address className="grid gap-0.5 not-italic text-muted-foreground">
                    <Button onClick={handleDelete}>Delete</Button>
                  </address>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Customer Information</div>
                <dl className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Customer</dt>
                    <dd>{order?.user?.name}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd>
                      <a href="mailto:">{order?.user?.email}</a>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd>
                      <a href="tel:">{order?.user?.phone_number}</a>
                    </dd>
                  </div>
                  {order?.user?.address && (
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Address</dt>
                      <dd>{order.user.address}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
              <Pagination className="ml-auto mr-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6"
                      onClick={() => {
                        if (orderIndex > 0) {
                          setOrder(orders[orderIndex - 1]);
                          setOrderIndex(orderIndex - 1);
                        }
                      }}
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span className="sr-only">Previous Order</span>
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6"
                      onClick={() => {
                        if (orderIndex < orders.length - 1) {
                          setOrder(orders[orderIndex + 1]);
                          setOrderIndex(orderIndex + 1);
                        }
                      }}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                      <span className="sr-only">Next Order</span>
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}

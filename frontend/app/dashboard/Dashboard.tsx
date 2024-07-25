import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
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
import TopNav from "@/components/TopNav";
import { useEffect, useState } from "react";
import useProtectedRoute from "@/components/useProtectedRoute";
import axios from "axios";
import serverUrl from "@/lib/serverUrl";

interface IData {
  totalRevenue: number;
  totalUsers: number;
  totalOrders: number;
  lastMonthRevenue: number;
  lastMonthUsers: number;
}
export function Dashboard() {
  const [data, setData] = useState<IData>({
    totalRevenue: 0,
    totalUsers: 0,
    totalOrders: 0,
    lastMonthRevenue: 0,
    lastMonthUsers: 0,
  });
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  useProtectedRoute();
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
    axios
      .get(`${serverUrl}/api/admin/users-orders`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        //get the first 5 orders
        setOrders(res.data.slice(0, 5));
      });
    axios
      .get(`${serverUrl}/api/admin/users`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setUsers(res.data.users.slice(0, 5));
      });
  }, []);
  return (
    <div className="flex min-h-screen w-full flex-col">
      <TopNav />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹ {data.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">
                +{(data.lastMonthRevenue / data.totalRevenue) * 100}% from last
                month
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{data.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                +{(data.lastMonthUsers / data.totalOrders) * 100}% from last
                month
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{data.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +{data.totalUsers} users in total
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Last Month Revenue
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data.lastMonthRevenue}</div>

              <p className="text-xs text-muted-foreground">
                +{(data.lastMonthRevenue / data.totalRevenue) * 100}% from last
                month
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                    Recent Orders
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/orders">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden xl:table-column">
                      Email
                    </TableHead>
                    <TableHead className="hidden xl:table-column">
                      Category
                    </TableHead>
                    <TableHead className="hidden xl:table-column">
                      Date
                    </TableHead>
                    <TableHead className="hidden xl:table-column">
                      Quantity
                    </TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders &&
                    orders.map((order: any) => {
                      return (
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">
                              {order?.user?.name}
                            </div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              {order?.user?.email}
                            </div>
                          </TableCell>
                          <TableCell className="hidden xl:table-column">
                            {order?.item?.itemDetails?.category}
                          </TableCell>
                          <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                            {order?.item?.date}
                          </TableCell>
                          <TableCell className="hidden xl:table-column">
                            <Badge className="text-xs" variant="outline">
                              {order?.item?.quantity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {order?.item?.price}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              {
                  users && users.map((user: any) => {
                      return (
                          <div className="flex items-center gap-4">
                              <Avatar className="hidden h-9 w-9 sm:flex">
                                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                  <AvatarFallback>OM</AvatarFallback>
                              </Avatar>
                              <div className="grid gap-1">
                                  <p className="text-sm font-medium leading-none">
                                      {user.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                      {user.email}
                                  </p>
                              </div>
                              <div className="ml-auto font-medium">{user.wallet}</div>
                          </div>
                      );
                  })
              }
             
           
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

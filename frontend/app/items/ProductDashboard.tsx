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
import { use, useEffect, useState } from "react";
import serverUrl from "@/lib/serverUrl";
import useProtectedRoute from "@/components/useProtectedRoute";
import * as XLSX from 'xlsx';
export function ProductDashboard() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  useProtectedRoute();
  useEffect(() => {
    axios.get(`${serverUrl}/api/admin/items`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((res) => {
      setItems(res.data);
    });
  }, []);
  const handleDelete = (id: string) => {
    axios.delete(`${serverUrl}/api/admin/delete-item/${id}`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((res) => {
      console.log(res.data);
      setItems(items.filter((item: any) => item._id !== id));
    });
  }
  useEffect(() => {

    axios.get(`${serverUrl}/api/admin/items?search=${search}`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((res) => {
      setItems(res.data);
    });
  }, [search]);
  const exportToExcel = () => {
    const data = items.map((item: any) => {
      return {
        Name: item.name,
        Price: item.price,
        Category: item.category,
        "Total Sales": item.totalSales,
        Discount: item.discount,
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "data.xlsx");
};
  return (
    <div className="flex min-h-screen w-full flex-col">
      <TopNav search={search} setSearch={setSearch} />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all" className="mt-3">
          <div className="flex items-center">
            {/* <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="archived" className="hidden sm:flex">
                Archived
              </TabsTrigger>
            </TabsList> */}
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
                  <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
              <Button size="sm" variant="outline" className="h-8 gap-1"
              onClick={exportToExcel}
              >
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
              <Button
                size="sm"
                className="h-8 gap-1"
                onClick={() => router.push("/add-item")}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Item
                </span>
              </Button>
            </div>
          </div>
          <TabsContent value="all">
            <Card x-chunk="ProductDashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Items</CardTitle>
                <CardDescription>
                  Manage your Items and Services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="sr-only">Image</span>
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead> Price</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Category
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Total Sales
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Discount
                      </TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="hidden sm:table-cell">
                          <Image
                            alt="Product image"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={item.image}
                            width="64"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell> {item.price}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.category}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.totalSales}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.discount}
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
                              <DropdownMenuItem onClick={()=>router.push(`/add-order/${item._id}`)}>Add Order</DropdownMenuItem>
                              <DropdownMenuItem  onClick={()=>router.push(`/edit-item/${item._id}`)}>Edit</DropdownMenuItem>
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
  );
}

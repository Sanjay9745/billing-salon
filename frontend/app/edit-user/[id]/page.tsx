"use client";
import React, { use, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

import TopNav from "@/components/TopNav";
import axios from "axios";
import serverUrl from "@/lib/serverUrl";
import useProtectedRoute from "@/components/useProtectedRoute";
import { useParams, useRouter } from "next/navigation";

function AddUser() {
  useProtectedRoute();
  const { id } = useParams();
  const [data, setData] = React.useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    date_of_birth: "",
  });
  const { toast } = useToast();
    const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };
  useEffect(() => {
    axios
      .get(`${serverUrl}/api/admin/user/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setData({
          name: res.data.name,
          email: res.data.email,
          phone_number: res.data.phone_number,
          address: res.data.address,
 date_of_birth: new Date(res.data.date_of_birth).toISOString().split('T')[0],
        });
      });
  }, []);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    axios
      .put(`${serverUrl}/api/admin/update-user`, {userId:id,...data}, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data);
        toast({
          title: "User Updated",
          description: "User has been Updated successfully",
        });
        setData({
          name: "",
          email: "",
          phone_number: "",
          address: "",
          date_of_birth: "",
        });
        router.push("/users");
      });
  };
  return (
    <>
      <TopNav 
      
      />
      <div className="flex min-h-screen w-full flex-col items-center">
        <Card className="w-[350px] mt-10">
          <CardHeader>
            <CardTitle>Add User</CardTitle>
            <CardDescription>Enter the details of your Item</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    onChange={handleChange}
                    placeholder="Name"
                    value={data.name}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    onChange={handleChange}
                    placeholder="Email"
                    value={data.email}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    type="number"
                    placeholder="Phone Number"
                    onChange={handleChange}
                    value={data.phone_number}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Address"
                    onChange={handleChange}
                    value={data.address}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    placeholder="Date of Birth"
                    onChange={handleChange}
                    value={data.date_of_birth}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleSubmit} className="w-full">
              Update User
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default AddUser;

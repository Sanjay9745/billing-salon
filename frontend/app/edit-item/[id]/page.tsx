"use client";
import React, { useEffect } from "react";

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
import TopNav from "@/components/TopNav";
import axios from "axios";
import serverUrl from "@/lib/serverUrl";
import useProtectedRoute from "@/components/useProtectedRoute";
import { useParams } from "next/navigation";

function EditItem() {
  const { id } = useParams();
  const [data, setData] = React.useState({
    name: "",
    price: "",
    discount: "",
    description: "",
    category: "",
    image: "",
  });
  useProtectedRoute();
  useEffect(() => {
    axios
      .get(`${serverUrl}/api/admin/item/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setData({
          name: res.data.name,
          price: res.data.price,
          discount: res.data.discount,
          description: res.data.description,
          category: res.data.category,
          image: res.data.image,
        });
      });
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    axios
      .put(
        `${serverUrl}/api/admin/update-item`,
        { itemId: id, ...data },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      });
  };
  return (
    <>
      <TopNav />
      <div className="flex min-h-screen w-full flex-col items-center">
        <Card className="w-[350px] mt-10">
          <CardHeader>
            <CardTitle>Add Item</CardTitle>
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
                    placeholder="Name of your Item"
                    value={data.name}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Price of your Item"
                    onChange={handleChange}
                    value={data.price}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="discount">Discount</Label>
                  <Input
                    id="discount"
                    type="number"
                    placeholder="Discount of your Item"
                    onChange={handleChange}
                    value={data.discount}
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    placeholder="Description of your Item"
                    id="description"
                    onChange={(e) => {
                      setData({ ...data, description: e.target.value });
                    }}
                    value={data.description}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    onValueChange={(e) => {
                      setData({ ...data, category: e });
                    }}
                   value={data.category}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="hair">Hair</SelectItem>
                      <SelectItem value="skin">Skin</SelectItem>
                      <SelectItem value="body">Body</SelectItem>
                      <SelectItem value="nails">Nails</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="file"
                    onChange={(e: any) => {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => {
                        setData({ ...data, image: reader.result as string });
                      };
                    }}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleSubmit} className="w-full">
              Add Item
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default EditItem;

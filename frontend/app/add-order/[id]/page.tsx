"use client";
import TopNav from "@/components/TopNav";
import React, { useEffect } from "react";
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
import { useState } from "react";
import Select from "react-select";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import serverUrl from "@/lib/serverUrl";
import { Button } from "@/components/ui/button";
import useProtectedRoute from "@/components/useProtectedRoute";

const options = [
  { value: "m@example.com", label: "m@example.com" },
  { value: "m@google.com", label: "m@google.com" },
  { value: "m@support.com", label: "m@support.com" },
];
function AddOrder() {
  const router = useRouter();
  const { id } = useParams();
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [item, setItem] = useState<any>({});
  const [users, setUsers] = useState<any>([]);
  const [emailList, setEmailList] = useState<any>([]);
  useProtectedRoute();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
    axios.get(`${serverUrl}/api/admin/item/${id}`,{
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    
    }).then((res) => {
      setItem(res.data);
      setPrice(res.data.price);
    });
    axios.get(`${serverUrl}/api/admin/users`,{
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    
    }).then((res) => {
      setUsers(res.data.users);
      if(localStorage.getItem("userId")){
        let user = res.data.users.find((user:any)=>user._id===localStorage.getItem("userId"))
        setSelectedOption({ value: user.email, label: user.email });
        setName(user.name);
        setPhoneNumber(user.phone_number);
      }
      setEmailList(
        res.data.users.map((user: any) => {
          return { value: user.email, label: user.email };
        })
      );
  
    });
  }, []);
 
  const handleInputChange = (newValue: any) => {
    const inputValue = newValue.replace(/\W/g, "");
    setInputValue(inputValue);
    return inputValue;
  };

  const handleChange = (selectedOption: any) => {
    setSelectedOption(selectedOption);
    let email = selectedOption.value;
let user = users.find((user:any)=>user.email===email)
    setName(user.name);
    setPhoneNumber(user.phone_number);
    localStorage.setItem("userId",user._id)
  };
  const handleBlur = () => {
    if (inputValue && !selectedOption) {
      setSelectedOption({ value: inputValue, label: inputValue });
      
    }
  };
const handleSubmit = (e:any) => {
    e.preventDefault();
    let data = {
      itemId: id,
      quantity: quantity,
      price: price,
      phone_number: phoneNumber,
      email: selectedOption.value,
      name: name,

    };
    axios.post(`${serverUrl}/api/admin/add-item-to-user`, data, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((res) => {
      console.log(res.data);
      router.push("/orders");
      
    });
}
  return (
    <>
      <div className="flex min-h-screen w-full flex-col">
        <TopNav />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card className="w-50 mt-5">
            <CardHeader>
              <CardTitle>Add Order</CardTitle>

              <CardDescription>Create Your Order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-1.5">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Select
                    options={emailList}
                    onInputChange={handleInputChange}
                    onChange={handleChange}
                    value={selectedOption}
                    onBlur={handleBlur}
                    isClearable
                    isSearchable
                    placeholder="Enter Your Email"
                    id="email"
                  />
                </div>
              </div>
              {/* <div className="flex flex-col space-y-1.5 mt-3">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="number"
                  placeholder="Phone Number"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  value={phoneNumber}
                />
              </div>
              <div className="flex flex-col space-y-1.5 mt-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name of your Item"
                  value={name}
                />
              </div> */}
              <div className="flex flex-col space-y-1.5 mt-3">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Price of your Item"
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                />
              </div>
              <div className="flex flex-col space-y-1.5 mt-3">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Quantity of your Item"
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    let price = parseInt(item.price);
                    let quantity = parseInt(e.target.value);
                    setPrice((price * quantity).toString());
                  }}
                  value={quantity}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSubmit}>Add Order</Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </>
  );
}

export default AddOrder;

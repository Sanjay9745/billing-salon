"use client";
import * as React from "react";
import { useState } from "react";
import axios from "axios";
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
import { LiaEyeSlashSolid, LiaEyeSolid } from "react-icons/lia";
import serverUrl from "@/lib/serverUrl";
import { useRouter } from "next/navigation";
export function LoginCard() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log({ email, password });
    axios
      .post(`${serverUrl}/api/admin/login`, { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        router.push("/dashboard");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter Your Credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email" />
            </div>
            <div className="flex flex-col space-y-1.5 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
              />
              <div className="absolute right-3 top-6">
                {showPassword ? (
                  <>
                    <LiaEyeSolid
                      size="20"
                      onClick={() => setShowPassword(false)}
                    />
                  </>
                ) : (
                  <>
                    <LiaEyeSlashSolid
                      size="20"
                      onClick={() => setShowPassword(true)}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button size="full" onClick={handleSubmit}>Submit</Button>
      </CardFooter>
    </Card>
  );
}

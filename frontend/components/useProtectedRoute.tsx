import serverUrl from "@/lib/serverUrl"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useLayoutEffect } from "react"

//create protected route
const useProtectedRoute = () => {
    //check if token is in local storage
    const router = useRouter()
    useLayoutEffect (() => {
        if (!localStorage.getItem("token")) {
            router.push("/login")
        }
            axios.get(`${serverUrl}/api/admin/protected`,{
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            
            }).then((res) => {
                if(res.status !== 200) {
                    router.push("/login")
                }
            }).catch(() => {
                localStorage.removeItem("token")
                router.push("/login")
            })
    }, [])
}

export default useProtectedRoute;
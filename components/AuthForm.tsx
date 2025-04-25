"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

 
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import Formfield from "./Formfield"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.action"




const authschema = (type : FormType)=>{
  return z.object({
    name: type==='sign-up'? z.string().min(3):z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3)
  })
  
}

const AuthForm = ({type} :{type : FormType}) => {
  const formSchema = authschema(type)
   // 1. Define your form.
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password : ""
    },
  })
  const router = useRouter()
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
      if(type=== 'sign-up'){
        const {name,email,password} = values;
        const userCredentials = await createUserWithEmailAndPassword(auth,email,password)
        const result = await signUp({
          uid : userCredentials.user.uid,
          name : name!,
          email,password
        })
        if(!result?.success){
          toast.error(result?.message)
          return;
        }
        toast.success('account ceeated sucessfully Please sign in');
        router.push('/sign-in')
      }
      else{
        const {email,password} = values;
        const userCredential = await signInWithEmailAndPassword(auth,email,password)
        const idToken = await userCredential.user.getIdToken();
        if(!idToken){
          toast.error('Sign in failed')
          return;
        }
        await signIn({
          email,idToken
        })

        toast.success('sign in successfully');
        router.push('/')
      }
    }catch(error){
      console.log(error)
      toast.error(`there was an error : ${error}`)
    }
  }

  const isSign = type ==='sign-in'
  return (
    <div className="card*-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
            <Image src="/logo.svg" alt="logo" height={32} width={38}/>
            <h1 className="text-xl font-bold">Welcome to the Auth Form</h1>
        </div>
        <h3>Practtice job interview with AI</h3>
      
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
        {!isSign && <Formfield control={form.control}
          name='name' 
          label="Name" placeholder="Enter your name" />  
      }
        <Formfield control={form.control}
          name='email' 
          label="Email" placeholder="Enter your email"
          type="email" />
        
        <Formfield control={form.control}
          name='password' 
          label="Password" placeholder="Enter your password"
          type="password" />

        <Button className="btn" type="submit">{isSign ? 'sign in ' : 'create account' }</Button>
      </form>
    </Form>
    <p className="text-center">
      {isSign ? 'no account yet?' : 'Have an acount already?'}
      <Link className="font-bold text-user-primaary ml-1" href={!isSign ? '/sign-in':'/sign-up'}>
      {!isSign ? "sign in" : 'sign up'}
      </Link>
    </p>
    </div>
    </div>
  )
}

export default AuthForm
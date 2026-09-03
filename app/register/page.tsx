'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const INDIAN_STATES = [
  'Uttar Pradesh', 'Delhi', 'Rajasthan', 'Punjab', 'Haryana', 'Madhya Pradesh',
  'Bihar', 'Maharashtra', 'Gujarat', 'West Bengal', 'Uttarakhand',
  'Himachal Pradesh', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Andhra Pradesh',
  'Kerala', 'Odisha', 'Jharkhand', 'Chhattisgarh', 'Assam', 'Other',
]

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Enter your full name'),
    phone: z.string().min(10, 'Enter a valid 10-digit phone number').max(10),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    shopName: z.string().min(2, 'Enter your shop name'),
    gstNumber: z.string().optional(),
    businessAddress: z.string().min(5, 'Enter your full business address'),
    city: z.string().min(2, 'Enter your city'),
    state: z.string().min(1, 'Select a state'),
    pincode: z.string().min(6, 'Enter a valid 6-digit pincode').max(6),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the wholesale terms to continue',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      shopName: '',
      gstNumber: '',
      businessAddress: '',
      city: '',
      state: '',
      pincode: '',
      agreeToTerms: false,
    },
  })

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null)
    setLoading(true)

    const supabase = createClient()

    // Step 1: create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    })

    if (authError || !authData.user) {
      setLoading(false)
      setServerError(authError?.message || 'Could not create account')
      return
    }

    const userId = authData.user.id

    // Step 2: create the profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      full_name: values.fullName,
      phone: values.phone,
      role: 'buyer',
    })

    if (profileError) {
      setLoading(false)
      setServerError(profileError.message)
      return
    }

    // Step 3: create the business (status defaults to 'pending' for admin approval)
    const { error: businessError } = await supabase.from('businesses').insert({
      profile_id: userId,
      shop_name: values.shopName,
      gst_number: values.gstNumber || null,
      business_address: values.businessAddress,
      city: values.city,
      state: values.state,
      pincode: values.pincode,
    })

    setLoading(false)

    if (businessError) {
      setServerError(businessError.message)
      return
    }

    router.push('/pending-approval')
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Register Your Business</CardTitle>
          <CardDescription>
            Create a wholesale account to access real pricing and place bulk orders.
            Your business will be reviewed and approved before you can order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Ramesh Kumar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@yourshop.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shopName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shop Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Kumar Sports Corner" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="gstNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Number (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="09ABCDE1234F1Z5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Shop 12, Main Market" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Pilibhit" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INDIAN_STATES.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input placeholder="262001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-2 space-y-0 pt-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="leading-tight">
                      <FormLabel className="font-normal">
                        I agree to the{' '}
                        <Link href="/wholesale-terms" className="text-primary hover:underline">
                          Wholesale Terms
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {serverError && (
                <p className="text-sm text-destructive">{serverError}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Register Business'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

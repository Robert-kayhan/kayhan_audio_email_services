"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
const path = () => {
  const router = useRouter()
  useEffect(()=>{
    router.push("/sign-in")
  })
  return (
    <div>path</div>
  )
}

export default path
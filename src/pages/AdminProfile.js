import React, { useEffect, useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import { Link as LinkRouter } from 'react-router-dom'
import '../styles//AdminProfile.css'
import { useDeleteCouponMutation } from '../features/couponApi'
import { toast } from 'react-toastify'
import { useGetAllProductsQuery, useGetRemoveProductMutation } from '../features/productsApi'

export default function AdminProfile({ functionCountdown, currentCouponId }) {

  let fnCountdown = functionCountdown
  let [deleteCoupon] = useDeleteCouponMutation()
  const [coupon, setCoupon] = useState()

  let { data: allProducts, refetch } = useGetAllProductsQuery()

  const [removeItem] = useGetRemoveProductMutation()

  let handlDeleteCupon = (e) => {
    e.preventDefault()
    setCoupon("")

    deleteCoupon(e.target.currentCode.value).then(
      res => {
        if (res.error) {
          toast.error(res.error.data.message)
        } else {
          toast.success(res.data.message)
        }
      }
    )
  }

  const [selected, setSelected] = useState()

  const handleSelected = (e) => {
    e.preventDefault()
    setSelected(e.target[e.target.selectedIndex].id)
  }

  const handlDeleteProduct = async (e) => {
    e.preventDefault()
    await removeItem(selected)
      .then((success) => {
        toast.success(success?.response?.message)
        refetch()
      })
  }

  useEffect(() => {
    setCoupon(currentCouponId?.response?.[0]._id)
  }, [currentCouponId])


  return (
    <div>
      <PageLayout>
        <div className="bodyContainer flex flex-col">

          <div className='flex flex-wrap justify-center items-center'>
            <div className='w-full flex justify-center p-3'>
              <h2 className='w-6/12 text-center text-3xl text-white admin-title'>Products</h2>
            </div>
            <div className="cardContainer w-64 rounded-lg">
              <figure className='h-2/4'>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzaNjirlr1dTJUz_56OU0VOWMjeXfi_-dcI_ciV4vQKSkTkocNC4vOAE2_qbwO9eRU-5A&usqp=CAU" className="rounded-xl object-cover h-full w-full" alt="Shoes" />
              </figure>
              <div className="subContainer h-2/4">
                <h2 className="card-title">Edit Products!</h2>
                <div className="">
                  <button className=""><LinkRouter className="btn btn-primary btn-home-page text-xs" to={'/products'}>Edit Now!</LinkRouter></button>
                </div>
              </div>
            </div>

            <div className="cardContainer w-64 rounded-lg">
              <figure className='h-2/4 flex justify-center items-center'>
                <img className='object-cover' src="/logo.png" alt="logo" />
              </figure>
              <div className="subContainer h-2/4">
                <h2 className="card-title">Create a Product!</h2>

                <div className="">
                  <button className=""><LinkRouter className="btn btn-primary btn-home-page text-xs" to={'/newproduct'}>Create Now!</LinkRouter></button>
                </div>
              </div>
            </div>

            <div className="cardContainer text-black w-64 rounded-lg">
              <figure className='h-2/4'>
                <img className='object-cover h-full w-full' src="/delete.png" alt="Shoes" />
              </figure>
              <div className="subContainer h-2/4">
                <form onSubmit={handlDeleteProduct} className="flex flex-col items-center justify-center text-black my-5">
                  <select className="select-form text-white bg-black w-32" onChange={handleSelected}>
                    <option disabled>Select product</option>
                    {allProducts?.response?.map(item =>
                      <option value={item?.brand} id={item?._id}>{item?.brand}</option>
                    )}
                  </select>
                  <div className="my-5">
                    <button className="btn btn-primary btn-home-page text-xs">Remove!</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className='flex flex-wrap'>
            <div className='w-full flex justify-center p-3'>
              <h2 className='w-6/12 text-center text-3xl text-white admin-title'>Coupon</h2>
            </div>
            <div className="cardContainer w-64 rounded-lg">
              <form onSubmit={fnCountdown} className="flex flex-col items-center justify-center">
                <h2>Create new coupon discount</h2>
                <label className="label">
                  <span className="label-text text-black text-base">Coupon code</span>
                </label>
                <input type="text" name="code" className="input input-bordered h-10" />

                <label className="label">
                  <span className="label-text text-black text-base">Discount amount</span>
                </label>
                <input type="text" name="discount" className="input input-bordered h-10" />
                <label className="label">
                  <span className="label-text text-black text-base text-center">Select the number of days the coupon will be available</span>
                </label>
                <input type="number" name="endTime" className="input input-bordered h-10" />
                <div className="form-control mt-6">
                </div>
                <div className='flex flex-col items-center'>
                  <button className="btn btn-primary btn-home-page text-xs" type='submit'>Create!</button>
                </div>
              </form>
            </div>

            <div className="cardContainer w-64 rounded-lg">
              <figure className='h-2/4'>
                <img className='object-cover h-full w-full' src="https://cdn-icons-png.flaticon.com/512/2331/2331729.png" alt="Shoes" />
              </figure>
              <div className="subContainer h-2/4">
                <form onSubmit={handlDeleteCupon} className="flex flex-col items-center justify-center">
                  <h2 className='mb-1'>Remove the current coupon</h2>
                  <input type="text" name="currentCode" className="input input-bordered h-10 text-xs w-full" value={coupon} />
                  <div className="my-5">
                    <button className="btn btn-primary btn-home-page text-xs">Remove!</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>

      </PageLayout>
    </div>
  )
}

import Image from 'next/image'
import React from 'react'
import { FaPhone } from 'react-icons/fa'
import { IoMdMail } from 'react-icons/io'

const PublicFooter = () => {
    return (
        <div className=" relative bg-[#ffffff] w-full shadow-lg z-50 ">
            <div className="px-[150px] py-12 grid grid-cols-7 gap-10 items-center ">
                <div className=" col-span-2">
                    <Image
                        alt="logo"
                        src={'/img/logo/main-logo.png'}
                        width={200}
                        height={100}
                    />
                    <p className="mt-4 text-black">
                        Aplikasi bank data dengan antarmuka publik untuk insight
                        terbuka dan sistem login berbasis peran untuk
                        pengelolaan data internal secara digital.
                    </p>
                </div>
                <div className=" col-span-3">
                    <h6>Jl. Poros Sp 2 - Sp 5, Timika, Kabupaten Mimika</h6>
                    <div className=" my-2">Contact Us :</div>
                    <div className=' flex-col items-center'>
                        <div className=" flex items-center gap-2 mb-2">
                            <IoMdMail className="w-4 h-4 text-[#737373]" />
                            <p>lorem@gmail.com</p>
                        </div>
                        <div className=" flex items-center gap-2">
                            <FaPhone className="w-4 h-4 text-[#737373]" />
                            <p>(0901) 3262043</p>
                        </div>
                    </div>
                </div>
                <div className=" flex justify-end col-span-2">
                    <Image
                        alt="logo"
                        src={'/img/logo/logo-mimika.png'}
                        width={100}
                        height={40}
                    />
                </div>
            </div>
        </div>
    )
}

export default PublicFooter


// F1B700 - orange
// 00923F - green